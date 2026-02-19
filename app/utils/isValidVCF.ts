export function isValidVCF(vcfText: string): boolean {
  if (!vcfText || typeof vcfText !== "string") return false;

  const lines = vcfText.trim().split("\n");
  if (lines.length < 2) return false;

  // 1️⃣ Check fileformat header
  const hasFileFormat = lines.some(line =>
    line.startsWith("##fileformat=VCFv")
  );
  if (!hasFileFormat) return false;

  // 2️⃣ Check column header
  const headerLine = lines.find(line =>
    line.startsWith("#CHROM")
  );
  if (!headerLine) return false;

  const headerColumns = headerLine.split("\t");
  if (headerColumns.length < 8) return false;

  // 3️⃣ Validate at least one data line
  const dataLines = lines.filter(line => !line.startsWith("#"));
  if (dataLines.length === 0) return false;

  for (const line of dataLines) {
    const cols = line.split("\t");

    // Must have at least 8 required VCF columns
    if (cols.length < 8) return false;

    // POS must be numeric
    if (isNaN(Number(cols[1]))) return false;

    // REF and ALT must not be empty
    if (!cols[3] || !cols[4]) return false;
  }

  return true;
}
