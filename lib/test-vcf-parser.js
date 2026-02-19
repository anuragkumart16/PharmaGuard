
const VCF = require("@gmod/vcf");

const header = `##fileformat=VCFv4.2
#CHROM	POS	ID	REF	ALT	QUAL	FILTER	INFO	FORMAT	SAMPLE`;

const line = "chr10	94781859	rs4244285	G	A	99	PASS	RS=rs4244285	GT:GQ	0/1:99";

const vcf = new VCF({ header });
const variant = vcf.parseLine(line);

console.log("Variant Keys:", Object.keys(variant));
console.log("QUAL:", variant.QUAL);
console.log("quality:", variant.quality);
console.log("pos:", variant.pos);
console.log("POS:", variant.POS);
