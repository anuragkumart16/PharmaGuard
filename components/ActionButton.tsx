
import { Loader2 } from "lucide-react";

interface ActionButtonProps {
    onRunAnalysis: () => void;
    disabled: boolean;
    isLoading?: boolean;
}

export default function ActionButton({ onRunAnalysis, disabled, isLoading }: ActionButtonProps) {
    return (
        <div className="w-full mt-8">
            <button
                onClick={onRunAnalysis}
                disabled={disabled || isLoading}
                className={`
          w-full h-12 flex items-center justify-center rounded-lg text-white font-semibold transition-all duration-200
          ${(disabled || isLoading)
                        ? "bg-primary opacity-50 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90 transform hover:scale-[1.01] shadow-md"}
        `}
            >
                {isLoading ? (
                    <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Processing Genomic Data...</span>
                    </div>
                ) : (
                    <span>Run Pharmacogenomic Analysis</span>
                )}
            </button>
        </div>
    );
}
