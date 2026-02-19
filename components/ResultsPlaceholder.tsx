
import { Shield } from "lucide-react";

export default function ResultsPlaceholder() {
    return (
        <div className="mt-12 w-full flex flex-col items-center justify-center p-8 bg-card border border-border border-dashed rounded-xl h-64 text-center">
            <div className="mb-4 bg-card p-4 rounded-full shadow-sm border border-border">
                <Shield className="size-8 text-primary opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-text-soft mb-2">
                Awaiting Genomic Data
            </h3>
            <p className="max-w-md text-sm text-text-muted leading-relaxed">
                Upload a valid VCF file and provide drug information to generate personalized pharmacogenomic risk insights.
            </p>
        </div>
    );
}
