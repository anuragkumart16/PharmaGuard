import CpicRecommendations from "@/lib/data/CpicRecommendations.json";

/**
 * Look up CPIC clinical recommendations for a gene/phenotype pair.
 * Returns recommendations for ALL drugs associated with that gene.
 *
 * @param {string} gene - Gene symbol (e.g., "CYP2D6")
 * @param {string} phenotype - Short phenotype code (PM|IM|NM|RM|URM)
 * @returns {Array} Drug recommendations
 */
export function getRecommendations(gene, phenotype) {
  const geneData = CpicRecommendations[gene];
  if (!geneData) return [];

  const phenoData = geneData.phenotypes[phenotype];
  if (!phenoData) {
    console.warn(`[Mapper] No CPIC recommendation found for ${gene} phenotype: ${phenotype}`);
    // Fallback for Unknown phenotype
    return geneData.drugs.map((drug) => ({
      drug,
      risk_label: "Unknown",
      severity: "none",
      recommendation: `Pharmacogenomic status ${phenotype} for ${gene} has no standard CPIC recommendation. Clinical judgment required.`,
    }));
  }

  return geneData.drugs.map((drug) => ({
    drug,
    risk_label: phenoData.risk_label,
    severity: phenoData.severity,
    recommendation: phenoData.recommendation,
  }));
}

/**
 * Get all recommendations for all analyzed genes.
 *
 * @param {Array} geneResults - Output from activityScoreEngine.analyzeVariants
 * @returns {Array} Flat array of all drug recommendations
 */
export function getAllRecommendations(geneResults) {
  const all = [];
  for (const result of geneResults) {
    const recs = getRecommendations(result.primary_gene, result.phenotype);
    all.push(...recs.map((r) => ({ ...r, gene: result.primary_gene })));
  }
  return all;
}
