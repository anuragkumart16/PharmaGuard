
import { AlertTriangle, CheckCircle, X } from "lucide-react";

interface ToastProps {
    variant: "success" | "error";
    title: string;
    description: string;
    onClose?: () => void;
}

export default function Toast({ variant, title, description, onClose }: ToastProps) {
    const isSuccess = variant === "success";

    return (
        <div
            className={`
        fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 
        bg-card border-l-4 shadow-lg rounded-r-lg min-w-[320px] max-w-sm
        animate-slide-in transition-all duration-200
        ${isSuccess ? "border-success" : "border-error"}
      `}
        >
            <div className={`mt-0.5 ${isSuccess ? "text-success" : "text-error"}`}>
                {isSuccess ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            </div>

            <div className="flex-1">
                <h4 className={`text-sm font-bold mb-1 ${isSuccess ? "text-gray-900" : "text-gray-900"}`}>
                    {title}
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                    {description}
                </p>
            </div>

            {onClose && (
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={16} />
                </button>
            )}
        </div>
    );
}
