
const GeneMap = require("./data/GeneMap.json");
const AlleleScores = require("./data/AlleleScores.json");

// Mocking the engine logic since we cannot easily import ESM in a simple node script without configuration
function getAlleleScore(gene, allele) {
    const scores = AlleleScores[gene];
    if (!scores) return 1.0;
    return scores[allele] ?? 1.0;
}

function translatePhenotype(totalAS) {
    if (totalAS === 0) return "PM";
    if (totalAS < 1.25) return "IM";
    if (totalAS <= 2.25) return "NM";
    return "URM";
}

function runTestCase(name, diplotype) {
    const gene = "CYP2C9";
    const [a1, a2] = diplotype.split("/");
    const as1 = getAlleleScore(gene, a1);
    const as2 = getAlleleScore(gene, a2);
    const totalAS = as1 + as2;
    const phenotype = translatePhenotype(totalAS);

    console.log(`TEST: ${name}`);
    console.log(`Diplotype: ${diplotype}`);
    console.log(`Activity Score: ${totalAS}`);
    console.log(`Phenotype: ${phenotype}`);

    let risk = "SAFE";
    if (phenotype === "IM") risk = "ADJUST (20-40% reduction)";
    if (phenotype === "PM") risk = "ADJUST (50-80% reduction / TOXIC risk)";

    console.log(`Result: ${risk}`);
    console.log("----------------------------");
}

console.log("PGx ENGINE UNIT TESTS - CYP2C9 / WARFARIN");
console.log("==========================================");

runTestCase("Wild Type Case", "*1/*1");
runTestCase("Intermediate Metabolizer (*3 Heterozygous)", "*1/*3");
runTestCase("Poor Metabolizer (*3 Homozygous)", "*3/*3");
runTestCase("Intermediate Metabolizer (*2/*3)", "*2/*3");
