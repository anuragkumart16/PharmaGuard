
"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";

interface UploadCardProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

export default function UploadCard({ onFileSelect, selectedFile }: UploadCardProps) {
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onFileSelect(e.dataTransfer.files[0]);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    };

    return (
        <div
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            onDragOver={!selectedFile ? handleDragOver : undefined}
            onDragLeave={!selectedFile ? handleDragLeave : undefined}
            onDrop={!selectedFile ? handleDrop : undefined}
            className={`
        mt-8 w-full rounded-xl transition-all duration-300 cursor-pointer overflow-hidden
        ${selectedFile ? "border border-border bg-card p-0" :
                    `border-2 border-dashed p-10 flex flex-col items-center justify-center text-center
           ${isDragOver
                        ? "border-secondary bg-accent-soft/30"
                        : "border-border hover:border-secondary hover:bg-bg-hover bg-card"}`
                }
      `}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".vcf,.vcf.gz"
            />

            {!selectedFile ? (
                // Idle State
                <>
                    <div className={`
            p-4 rounded-full mb-4 transition-colors duration-200
            ${isDragOver ? "bg-accent-soft" : "bg-card shadow-sm border border-border"}
          `}>
                        <Upload className={`size-8 ${isDragOver ? "text-primary" : "text-text-muted"}`} />
                    </div>
                    <h3 className="text-lg font-semibold text-text mb-1">Upload VCF File</h3>
                    <p className="text-sm text-gray-500">Drag & drop or click to browse</p>
                    <p className="text-xs text-gray-400 mt-2">Max size: 5MB</p>
                </>
            ) : (
                // Selected State
                <div className="flex items-center justify-between p-6 animate-slide-in">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent-soft/20 rounded-lg">
                            <FileText className="size-8 text-primary" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-gray-800 text-sm truncate max-w-[200px] sm:max-w-md">
                                    {selectedFile.name}
                                </p>
                                <CheckCircle className="size-4 text-success" />
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {formatSize(selectedFile.size)} • <span className="text-success">Ready for analysis</span>
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={handleRemove}
                        className="p-2 hover:bg-red-50 rounded-lg text-gray-400 hover:text-error transition-colors"
                    >
                        <X className="size-5" />
                    </button>
                </div>
            )}
        </div>
    );
}
