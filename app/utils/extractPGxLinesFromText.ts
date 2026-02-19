export function extractPGxLinesFromText(vcfText: string): string[] {
  const TARGET_GENES = new Set([
    "CYP2D6",
    "CYP2C19",
    "CYP2C9",
    "SLCO1B1",
    "TPMT",
    "DPYD",
  ]);

  const lines = vcfText.split("\n");
  const results: string[] = [];

  for (const line of lines) {
    // Skip headers
    if (line.startsWith("#")) continue;

    // VCF columns are tab-separated
    const columns = line.split("\t");
    if (columns.length < 8) continue;

    const infoField = columns[7];

    // Extract GENE from INFO
    const geneMatch = infoField.match(/GENE=([^;]+)/);
    if (!geneMatch) continue;

    const gene = geneMatch[1];

    if (TARGET_GENES.has(gene)) {
      results.push(line.trim());
    }
  }

  return results;
}
