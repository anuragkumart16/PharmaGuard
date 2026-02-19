import { NextResponse } from "next/server";
import { parseVcf } from "@/lib/pgx/vcfParser";
import { analyzeVariants } from "@/lib/pgx/activityScoreEngine";
import { getRecommendations } from "@/lib/pgx/clinicalMapper";
import { explainMechanism } from "@/lib/pgx/groqClient";

export const maxDuration = 30; // 30-second processing limit

/**
 * POST /api
 *
 * Accepts a VCF file upload via FormData, processes it through the
 * PGx pipeline, and returns a structured JSON report matching the
 * exact schema from the requirements.
 *
 * Query params:
 *   ?drug=DrugName  — optional, filter results to a specific drug
 */
export async function POST(request) {
  const startTime = Date.now();

  try {
    // ── 1. Extract file from FormData ──
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || typeof file === "string") {
      return NextResponse.json(
        { error: "No VCF file uploaded. Send a 'file' field in FormData." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // ── 2. Parse VCF with coordinate-based filtering ──
    let parseResult;
    try {
      parseResult = parseVcf(buffer);
    } catch (err) {
      return NextResponse.json(
        {
          error: "VCF parsing failed",
          details: err.message,
          quality_metrics: { vcf_parsing_success: false },
        },
        { status: 422 }
      );
    }

    const { sampleId, variants, totalLinesProcessed } = parseResult;

    // ── 3. Run Activity Score Engine ──
    const geneResults = analyzeVariants(variants);

    // ── 4. Get drug filter from query params ──
    const { searchParams } = new URL(request.url);
    const drugFilter = searchParams.get("drug");

    // ── 5. Build per-drug entries ──
    const drugEntries = [];

    for (const geneResult of geneResults) {
      const recs = getRecommendations(geneResult.primary_gene, geneResult.phenotype);

      for (const rec of recs) {
        if (drugFilter && rec.drug.toLowerCase() !== drugFilter.toLowerCase()) {
          continue;
        }

        drugEntries.push({
          gene: geneResult.primary_gene,
          geneResult,
          rec,
        });
      }
    }

    // ── 6. Compute confidence score from average QUAL/GQ ──
    const qualScores = variants.filter((v) => v.qual > 0).map((v) => v.qual);
    const avgQual = qualScores.length > 0
      ? qualScores.reduce((a, b) => a + b, 0) / qualScores.length
      : 0;
    const confidenceScore = Math.min(1.0, Math.round((avgQual / 100) * 1000) / 1000);

    // ── 7. Gene coverage ──
    const targetGenes = ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"];
    const geneCoverage = {};
    for (const g of targetGenes) {
      geneCoverage[g] = variants.some((v) => v.gene === g);
    }

    // ── 8. Call Groq LLM for explanations (concurrent with Promise.all) ──
    let explanations = {};
    try {
      const explainTasks = drugEntries.map((dr) =>
        explainMechanism(
          dr.gene,
          dr.geneResult.diplotype,
          dr.geneResult.phenotype,
          dr.rec.drug,
          dr.rec.risk_label
        ).then((summary) => ({ key: `${dr.gene}:${dr.rec.drug}`, summary }))
      );
      const explainResults = await Promise.all(explainTasks);
      for (const r of explainResults) {
        explanations[r.key] = r.summary;
      }
    } catch {
      // Progressive enhancement — LLM failure doesn't break the report
      explanations = {};
    }

    const processingTime = Date.now() - startTime;

    // ── Severity & phenotype validation helpers ──
    const validSeverities = ["none", "low", "moderate", "high", "critical"];
    const validPhenotypes = ["PM", "IM", "NM", "RM", "URM", "Unknown"];

    const normalizeSeverity = (s) => {
      const lower = (s || "none").toLowerCase();
      return validSeverities.includes(lower) ? lower : "none";
    };

    const normalizePhenotype = (p) => {
      return validPhenotypes.includes(p) ? p : "Unknown";
    };

    // ── 9. Build response as a single flat object ──
    // Pick the first drug entry (or filtered one)
    if (drugEntries.length === 0) {
      return NextResponse.json(
        { error: "No drug recommendations found for the detected variants." },
        { status: 404 }
      );
    }

    const dr = drugEntries[0];
    const key = `${dr.gene}:${dr.rec.drug}`;

    return NextResponse.json({
      patient_id: sampleId,
      drug: dr.rec.drug,
      timestamp: new Date().toISOString(),
      risk_assessment: {
        risk_label: dr.rec.risk_label,
        confidence_score: confidenceScore,
        severity: normalizeSeverity(dr.rec.severity),
      },
      pharmacogenomic_profile: {
        primary_gene: dr.geneResult.primary_gene,
        diplotype: dr.geneResult.diplotype,
        phenotype: normalizePhenotype(dr.geneResult.phenotype),
        detected_variants: dr.geneResult.detected_variants,
      },
      clinical_recommendation: {
        recommendation: dr.rec.recommendation,
      },
      llm_generated_explanation: {
        summary: explanations[key] || "LLM explanation unavailable — results are based on deterministic CPIC guidelines.",
      },
      quality_metrics: {
        vcf_parsing_success: true,
        total_variants_in_file: totalLinesProcessed,
        target_variants_found: variants.length,
        gene_coverage: geneCoverage,
        processing_time_ms: processingTime,
      },
    });
  } catch (err) {
    return NextResponse.json(
      {
        error: "Internal server error",
        details: err.message,
        quality_metrics: { vcf_parsing_success: false },
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api — Health check + schema info
 */
export async function GET() {
  return NextResponse.json({
    service: "PharmaGuard PGx Engine",
    version: "1.0.0",
    status: "operational",
    supported_genes: ["CYP2D6", "CYP2C19", "CYP2C9", "SLCO1B1", "TPMT", "DPYD"],
    genome_build: "GRCh38",
    usage: {
      method: "POST",
      endpoint: "/api",
      content_type: "multipart/form-data",
      body: "file=<VCF file>",
      optional_params: "?drug=DrugName",
    },
  });
}
