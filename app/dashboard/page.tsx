
"use client";

import { useState } from "react";
import UploadCard from "@/components/UploadCard";
import DrugInput from "@/components/DrugInput";
import ActionButton from "@/components/ActionButton";
import ResultsPlaceholder from "@/components/ResultsPlaceholder";
import Toast from "@/components/Toast";
import AnalysisReport from "@/components/AnalysisReport";
import Stepper, { Step } from "@/components/Stepper";
import { Loader2, ShieldCheck, FileText, Pill, AlertCircle, Info, RefreshCw } from "lucide-react";
import { motion } from "motion/react";

import { useAuth } from "@/lib/auth-context";

interface ToastState {
  variant: "success" | "error";
  title: string;
  description: string;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [selectedDrugs, setSelectedDrugs] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [activeStep, setActiveStep] = useState(1);
  const [analysisResults, setAnalysisResults] = useState<any[]>([]);
  const { user } = useAuth();

  const showToast = (variant: "success" | "error", title: string, description: string) => {
    setToast({ variant, title, description });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleFileSelect = (selectedFile: File | null) => {
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast("error", "File too large", "Please upload a VCF file smaller than 5MB.");
        return;
      }
      setFile(selectedFile);
      setAnalysisComplete(false);
      showToast("success", "File Accepted", `${selectedFile.name} ready for analysis.`);
    } else {
      setFile(null);
      setAnalysisComplete(false);
    }
  };

  const handleDrugChange = (drugs: string[]) => {
    setSelectedDrugs(drugs);
    setAnalysisComplete(false);
  };

  const handleRunAnalysis = async () => {
    if (!file || selectedDrugs.length === 0) return;

    setIsAnalyzing(true);
    const results: any[] = [];
    let hasError = false;

    try {
      // For each drug, we run an analysis. The API takes 'file' and '?drug='
      for (const drug of selectedDrugs) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`/api?drug=${encodeURIComponent(drug)}`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          results.push(data);
        } else {
          console.error(`Error analyzing ${drug}:`, data.error);
          hasError = true;
          // Keep continuing for other drugs if possible
        }
      }

      if (results.length > 0) {
        setAnalysisResults(results);
        setAnalysisComplete(true);
        if (hasError) {
          showToast("success", "Partial Results", "Analysis complete, but some drugs could not be matched.");
        } else {
          showToast("success", "Analysis Complete", "Clinical risk reports generated successfully.");
        }
      } else {
        showToast("error", "Analysis Failed", "Could not match genomic data with any selected drugs.");
      }
    } catch (error) {
      showToast("error", "System Error", "Failed to connect to analysis engine.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Stepper logic: Step 1 depends on File, Step 2 depends on Drugs
  const isNextDisabled = activeStep === 1 ? !file : activeStep === 2 ? selectedDrugs.length === 0 : false;

  return (
    <main className="max-w-4xl mx-auto px-6 py-12 w-full space-y-8">

      {!analysisComplete && !isAnalyzing ? (
        <div className="space-y-6">
          <div className="text-center space-y-3 mb-12">
            <h1 className="text-4xl font-black text-text tracking-tight uppercase italic">PharmaGuard</h1>
            <p className="text-text-soft font-medium max-w-lg mx-auto leading-relaxed">
              Advanced Pharmacogenomic Risk Assessment Engine.
              Follow the clinical workflow to generate your report.
            </p>
          </div>

          <Stepper
            onStepChange={setActiveStep}
            isNextDisabled={isNextDisabled}
            onFinalStepCompleted={handleRunAnalysis}
          >
            <Step>
              <div className="space-y-10 px-6 py-8 pb-10">

                {/* Info box */}
                <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <Info className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <p className="text-sm text-text-soft leading-relaxed max-w-xl">
                    Please upload a <strong>.VCF</strong> file containing variant data for Chromosome 22 or genome-wide.
                  </p>
                </div>

                {/* Upload section */}
                <div className="mt-2">
                  <UploadCard
                    onFileSelect={handleFileSelect}
                    selectedFile={file}
                  />
                </div>

              </div>
            </Step>

            <Step>
              <div className="space-y-10 px-6 py-8 pb-10">

                <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                  <Pill className="h-6 w-6 text-primary shrink-0 mt-1" />
                  <p className="text-sm text-text-soft leading-relaxed max-w-xl">
                    Select the medications you wish to screen for pharmacogenomic compatibility.
                  </p>
                </div>

                <div className="mt-4">
                  <DrugInput
                    selectedDrugs={selectedDrugs}
                    onChange={handleDrugChange}
                    disabled={isAnalyzing}
                  />
                </div>

              </div>
            </Step>
          </Stepper>
        </div>
      ) : (
        <section className="animate-slide-in">
          {isAnalyzing ? (
            <div className="w-full bg-card border border-border rounded-[var(--radius-card)] p-16 flex flex-col items-center justify-center space-y-8 shadow-xl min-h-[400px]">
              <div className="relative">
                <Loader2 className="h-20 w-20 text-primary animate-spin stroke-[2px]" />
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl scale-125" />
              </div>
              <div className="text-center space-y-4 max-w-sm">
                <h3 className="text-2xl font-black text-text tracking-tight">Processing Sequence</h3>
                <p className="text-text-soft font-medium leading-relaxed">
                  Cross-referencing variants with <strong>PharmGKB</strong> and <strong>ClinVar</strong> repositories for risk scoring...
                </p>
                <div className="w-full h-1.5 bg-border rounded-full overflow-hidden mt-6">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.8, ease: "linear" }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8 animate-slide-in">
              {/* Summary Header */}
              <div className="flex items-center justify-between p-6 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-text uppercase italic tracking-tight leading-none mb-1">Session Complete</h3>
                    <p className="text-xs text-text-soft font-bold uppercase tracking-widest">{file?.name} • {analysisResults.length} Drug Matches Found</p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAnalysisComplete(false);
                    setFile(null);
                    setSelectedDrugs([]);
                    setAnalysisResults([]);
                    setActiveStep(1);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-bg-hover text-text rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-border shadow-sm active:scale-95"
                >
                  <RefreshCw className="h-3 w-3" />
                  New Analysis
                </button>
              </div>

              {/* Professional Report Display */}
              <AnalysisReport results={analysisResults} />
            </div>
          )}
        </section>
      )}

      {toast && (
        <Toast
          variant={toast.variant}
          title={toast.title}
          description={toast.description}
          onClose={() => setToast(null)}
        />
      )}
    </main>
  );
}
