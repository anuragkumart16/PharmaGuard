import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Call Groq LLM to explain the clinical mechanism for a specific
 * gene + phenotype + drug combination.
 *
 * @param {string} gene       - Gene symbol (e.g., "CYP2D6")
 * @param {string} diplotype  - Diplotype string (e.g., "*1/*4")
 * @param {string} phenotype  - Short code (PM|IM|NM|RM|URM)
 * @param {string} drug       - Drug name (e.g., "Codeine")
 * @param {string} riskLabel  - Risk label (Safe|Toxic|Adjust Dosage)
 * @returns {Promise<string|null>} LLM summary or null on failure
 */
export async function explainMechanism(gene, diplotype, phenotype, drug, riskLabel) {
  try {
    const phenotypeMap = {
      PM: "Poor Metabolizer",
      IM: "Intermediate Metabolizer",
      NM: "Normal Metabolizer",
      RM: "Rapid Metabolizer",
      URM: "Ultrarapid Metabolizer",
    };

    const outcomeMap = {
      Safe: "SAFE",
      Toxic: "TOXIC",
      "Adjust Dosage": "requires DOSAGE ADJUSTMENT",
    };

    const fullPhenotype = phenotypeMap[phenotype] || phenotype;
    const outcome = outcomeMap[riskLabel] || riskLabel;

    const prompt = `Provide a two-part clinical summary for a patient with ${gene} ${fullPhenotype} (diplotype: ${diplotype}) status taking ${drug}.

Part 1: Professional Mechanistic Summary (For Clinicians)
- Mechanism: Explain the specific enzyme-drug interaction (e.g., prodrug activation vs. active drug clearance) using technical terms like pharmacokinetic (PK) impact.
- Justification: State why the ${fullPhenotype} phenotype makes the drug ${outcome} based on expected systemic concentrations.
- Evidence: Explicitly state the CPIC Recommendation level (e.g., Level A: Strong).

Part 2: Patient-Friendly Summary (Easy to Understand)
- The Analogy: Use a simple "Engine" analogy (e.g., "Your body processes this like a very fast engine").
- The 'So What?': In 2 sentences of 5th-grade level English, explain what this means for their treatment (e.g., "This medicine may not work for you, and we might need to try a different one").

Format your response clearly with "**For Your Doctor:**" and "**For You:**" section headers.`;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are a Senior Clinical Pharmacologist and CPIC Guideline expert. Provide concise, evidence-based, two-part explanations of drug-gene interactions: one for clinicians and one patient-friendly.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.3,
      max_tokens: 500,
    });

    return response.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error(`[Groq] Failed for ${gene}/${drug}:`, err.message);
    return null;
  }
}

/**
 * Explain all drug recommendations concurrently using Promise.all.
 *
 * @param {Array} geneResults - Gene analysis results
 * @param {Array} recommendations - Drug recommendations from clinicalMapper
 * @returns {Promise<Object>} Map of "gene:drug" → explanation string
 */
export async function explainAll(geneResults, recommendations) {
  const tasks = recommendations.map((rec) => {
    const geneResult = geneResults.find((g) => g.primary_gene === rec.gene);
    if (!geneResult) return Promise.resolve({ key: `${rec.gene}:${rec.drug}`, summary: null });

    return explainMechanism(
      rec.gene,
      geneResult.diplotype,
      geneResult.phenotype,
      rec.drug,
      rec.risk_label
    ).then((summary) => ({ key: `${rec.gene}:${rec.drug}`, summary }));
  });

  const results = await Promise.all(tasks);
  const map = {};
  for (const r of results) {
    map[r.key] = r.summary;
  }
  return map;
}
