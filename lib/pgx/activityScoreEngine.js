import GeneMap from "@/lib/data/GeneMap.json";
import AlleleScores from "@/lib/data/AlleleScores.json";

/**
 * Identify star alleles from detected RSID variants for a given gene.
 */
function identifyAlleles(gene, variants) {
  const region = GeneMap[gene];
  if (!region) return [];

  const alleles = [];
  for (const v of variants) {
    for (const [rsid, info] of Object.entries(region.rsids)) {
      if (v.rsid.includes(rsid)) {
        const gtParts = v.genotype.split(/[/|]/);
        for (const a of gtParts) {
          if (a !== "0" && a !== ".") {
            if (!alleles.includes(info.allele)) {
              alleles.push(info.allele);
            }
          }
        }
      }
    }
  }
  return alleles;
}

/**
 * Determine diplotype from detected alleles.
 * No variants → *1/*1 (wild-type reference).
 */
function determineDiplotype(gene, variants) {
  const detected = identifyAlleles(gene, variants);

  if (detected.length === 0) {
    return { diplotype: "*1/*1", allele1: "*1", allele2: "*1" };
  }

  if (detected.length === 1) {
    // Check if homozygous alt
    const region = GeneMap[gene];
    const variant = variants.find((v) => {
      for (const [rsid, info] of Object.entries(region.rsids)) {
        if (v.rsid.includes(rsid) && info.allele === detected[0]) return true;
      }
      return false;
    });

    if (variant) {
      const gt = variant.genotype.split(/[/|]/);
      if (gt.length >= 2 && gt[0] !== "0" && gt[1] !== "0" && gt[0] !== ".") {
        return { diplotype: `${detected[0]}/${detected[0]}`, allele1: detected[0], allele2: detected[0] };
      }
    }
    return { diplotype: `*1/${detected[0]}`, allele1: "*1", allele2: detected[0] };
  }

  // Compound heterozygous
  return { diplotype: `${detected[0]}/${detected[1]}`, allele1: detected[0], allele2: detected[1] };
}

/**
 * Get activity score for a single allele. Default: 1.0 (normal).
 */
function getAlleleScore(gene, allele) {
  const scores = AlleleScores[gene];
  if (!scores) return 1.0;
  return scores[allele] ?? 1.0;
}

/**
 * Translate total AS → phenotype short code.
 *
 * AS = 0           → PM (Poor Metabolizer)
 * 0 < AS < 1.25    → IM (Intermediate Metabolizer)
 * 1.25 ≤ AS ≤ 2.25 → NM (Normal Metabolizer)
 * AS > 2.25        → URM (Ultrarapid Metabolizer)
 */
function translatePhenotype(totalAS) {
  if (totalAS === 0) return "PM";
  if (totalAS < 1.25) return "IM";
  if (totalAS <= 2.25) return "NM";
  return "URM";
}

/**
 * Analyze all detected variants → per-gene diplotype/phenotype/AS.
 *
 * @param {Array} variants - Parsed variants from VCF
 * @returns {Array} Gene-level results
 */
export function analyzeVariants(variants) {
  // Group variants by gene
  const geneVariants = {};
  for (const v of variants) {
    if (!geneVariants[v.gene]) geneVariants[v.gene] = [];
    geneVariants[v.gene].push(v);
  }

  const results = [];

  for (const gene of Object.keys(GeneMap)) {
    const geneVars = geneVariants[gene] || [];
    const { diplotype, allele1, allele2 } = determineDiplotype(gene, geneVars);

    // ── Deterministic AS: AS_total = AS_allele1 + AS_allele2 ──
    const as1 = getAlleleScore(gene, allele1);
    const as2 = getAlleleScore(gene, allele2);
    const activity_score = as1 + as2;
    const phenotype = translatePhenotype(activity_score);

    results.push({
      primary_gene: gene,
      diplotype,
      phenotype,
      activity_score,
      detected_variants: geneVars.map((v) => ({ rsid: v.rsid })),
    });
  }

  return results;
}
