import VCF from "@gmod/vcf";
import GeneMap from "@/lib/data/GeneMap.json";

// ── Build chromosome lookup index for O(1) filtering ──
const chrIndex = {};
for (const [gene, region] of Object.entries(GeneMap)) {
  const chr = region.chr.replace(/^chr/i, "").toUpperCase();
  if (!chrIndex[chr]) chrIndex[chr] = [];
  chrIndex[chr].push({ gene, region });
}

function normalizeChr(c) {
  return c.replace(/^chr/i, "").toUpperCase();
}

/**
 * Fast coordinate check — is this position within any target gene region?
 */
function findTargetGene(chrom, pos) {
  const chr = normalizeChr(chrom);
  const regions = chrIndex[chr];
  if (!regions) return null;
  for (const entry of regions) {
    if (pos >= entry.region.start && pos <= entry.region.end) {
      return entry;
    }
  }
  return null;
}

/**
 * Parse a VCF file buffer with coordinate-based filtering.
 * Only lines within the 6 target gene regions get fully parsed.
 *
 * @param {Buffer} buffer - Raw VCF file contents
 * @returns {{ sampleId: string, variants: Array, totalLinesProcessed: number }}
 */
export function parseVcf(buffer) {
  const text = buffer.toString("utf-8");
  const lines = text.split(/\r?\n/);

  // ── Accumulate header lines ──
  const headerLines = [];
  let dataStartIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("#")) {
      headerLines.push(lines[i]);
      dataStartIdx = i + 1;
    } else {
      break;
    }
  }

  // ── Extract sample ID from #CHROM header ──
  const lastHeader = headerLines[headerLines.length - 1] || "";
  const headerCols = lastHeader.split("\t");
  const sampleId = headerCols.length > 9 ? headerCols[9] : `SAMPLE_${Date.now()}`;

  // ── Initialize @gmod/vcf parser ──
  const headerString = headerLines.join("\n");
  let vcfParser;
  try {
    vcfParser = new VCF({ header: headerString });
  } catch {
    vcfParser = new VCF({ header: headerString, strict: false });
  }

  // ── Process data lines with coordinate filter ──
  const variants = [];
  let totalLinesProcessed = 0;

  for (let i = dataStartIdx; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    totalLinesProcessed++;

    // ── Cheap filter: extract CHROM and POS via tab split ──
    const firstTab = line.indexOf("\t");
    if (firstTab === -1) continue;
    const secondTab = line.indexOf("\t", firstTab + 1);
    if (secondTab === -1) continue;

    const chrom = line.substring(0, firstTab);
    const pos = parseInt(line.substring(firstTab + 1, secondTab), 10);
    if (isNaN(pos)) continue;

    // ── Coordinate-based filter — skip non-target regions ──
    const target = findTargetGene(chrom, pos);
    if (!target) continue;

    // ── Full parse only for matching lines ──
    try {
      const variant = vcfParser.parseLine(line);
      const samples = variant.SAMPLES();
      const sampleNames = Object.keys(samples);
      const firstSample = sampleNames[0] ? samples[sampleNames[0]] : null;
      const gt = firstSample?.GT?.[0] ?? "./.";
      const gq = firstSample?.GQ?.[0] ?? null;
      const qual = variant.QUAL ?? 0;
      const ids = variant.ID ?? [];
      const rsid = ids.length > 0 ? ids.join(";") : `${chrom}:${pos}`;

      variants.push({
        rsid,
        chromosome: chrom,
        position: pos,
        genotype: gt,
        qual: typeof qual === "number" ? qual : parseFloat(String(qual)) || 0,
        gq: gq !== null ? (typeof gq === "number" ? gq : parseFloat(String(gq)) || 0) : null,
        gene: target.gene,
        ref: variant.REF ?? ".",
        alt: (variant.ALT ?? []).join(","),
      });
    } catch {
      continue;
    }
  }

  return { sampleId, variants, totalLinesProcessed };
}
