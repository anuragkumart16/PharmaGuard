import GeneMap from "@/lib/data/GeneMap.json";
import AlleleScores from "@/lib/data/AlleleScores.json";

/**
 * Identify star alleles from detected variants for a given gene.
 * Uses dual-path matching: ID (RSID) and Position.
 */
function identifyAlleles(gene, variants) {
  const region = GeneMap[gene];
  if (!region) return [];

  const alleles = [];
  const targetRSIDs = region.rsids;

  for (const v of variants) {
    let matchedAllele = null;

    // Path 1: Match by ID (RSID)
    for (const [rsid, info] of Object.entries(targetRSIDs)) {
      if (v.ids && v.ids.includes(rsid.toLowerCase())) {
        matchedAllele = info.allele;
        break;
      }
    }

    // Path 2: Match by Position (Fallback if ID missing/different)
    if (!matchedAllele) {
      for (const [rsid, info] of Object.entries(targetRSIDs)) {
        if (v.position === info.pos) {
          matchedAllele = info.allele;
          console.log(`[Engine] Position Match found for ${gene}: ${info.allele} at ${v.position}`);
          break;
        }
      }
    }

    if (matchedAllele) {
      const gtParts = v.genotype.split(/[/|]/);
      for (const a of gtParts) {
        if (a !== "0" && a !== ".") {
          if (!alleles.includes(matchedAllele)) {
            alleles.push(matchedAllele);
          }
        }
      }
    }
  }
  return alleles;
}

/**
 * Determine diplotype from detected alleles.
 */
function determineDiplotype(gene, variants) {
  const detected = identifyAlleles(gene, variants);

  if (detected.length === 0) {
    return { diplotype: "*1/*1", allele1: "*1", allele2: "*1" };
  }

  if (detected.length === 1) {
    const allele = detected[0];
    const region = GeneMap[gene];

    // Find the variant that triggered this allele
    const variant = variants.find((v) => {
      // ID check
      if (v.ids && v.ids.some(id =>
        Object.entries(region.rsids).some(([rs, info]) => rs.toLowerCase() === id && info.allele === allele)
      )) return true;

      // Position check
      return Object.values(region.rsids).some(info => info.pos === v.position && info.allele === allele);
    });

    if (variant) {
      const gt = variant.genotype.split(/[/|]/);
      // Homozygous check: e.g., 1/1, 2/2 (indices not 0)
      if (gt.length >= 2 && gt[0] !== "0" && gt[1] !== "0" && gt[0] !== "." && gt[1] !== ".") {
        return { diplotype: `${allele}/${allele}`, allele1: allele, allele2: allele };
      }
    }
    return { diplotype: `*1/${allele}`, allele1: "*1", allele2: allele };
  }

  // Compound heterozygous: *x/*y
  return { diplotype: `${detected[0]}/${detected[1]}`, allele1: detected[0], allele2: detected[1] };
}

/**
 * Get activity score for a single allele.
 */
function getAlleleScore(gene, allele) {
  const scores = AlleleScores[gene];
  if (!scores) {
    console.warn(`[Engine] No allele scores defined for gene ${gene}`);
    return 1.0;
  }
  if (scores[allele] === undefined) {
    if (allele !== "*1") console.log(`[Engine] Unknown allele ${allele} for ${gene}, defaulting to 1.0`);
    return 1.0;
  }
  return scores[allele];
}

/**
 * Translate total AS → phenotype short code centered on CPIC guidelines.
 * 
 * PM: AS = 0 or 0.5
 * IM: 1.0 <= AS < 1.25
 * NM: 1.25 <= AS <= 2.25
 * URM: AS > 2.25
 */
function translatePhenotype(totalAS) {
  if (totalAS <= 0.5) return "PM";
  if (totalAS < 1.25) return "IM";
  if (totalAS <= 2.25) return "NM";
  return "URM";
}

/**
 * Analyze all detected variants → per-gene results.
 */
export function analyzeVariants(variants) {
  console.log(`[Engine] Analyzing ${variants.length} qualifying variants...`);

  const geneVariants = {};
  for (const v of variants) {
    if (!geneVariants[v.gene]) geneVariants[v.gene] = [];
    geneVariants[v.gene].push(v);
  }

  const results = [];

  for (const gene of Object.keys(GeneMap)) {
    const geneVars = geneVariants[gene] || [];
    const { diplotype, allele1, allele2 } = determineDiplotype(gene, geneVars);

    const as1 = getAlleleScore(gene, allele1);
    const as2 = getAlleleScore(gene, allele2);
    const activity_score = as1 + as2;
    const phenotype = translatePhenotype(activity_score);

    console.log(`[Engine] ${gene} Result: ${diplotype} -> ${phenotype} (AS: ${activity_score})`);

    results.push({
      primary_gene: gene,
      diplotype,
      phenotype,
      activity_score,
      detected_variants: geneVars.map((v) => ({ rsid: v.ids?.[0] || `${v.chromosome}:${v.position}` })),
    });
  }

  return results;
}
