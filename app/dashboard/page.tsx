
"use client";

import { useState } from "react";
import UploadCard from "@/components/UploadCard";
import DrugInput from "@/components/DrugInput";
import ActionButton from "@/components/ActionButton";
import ResultsPlaceholder from "@/components/ResultsPlaceholder";
import Toast from "@/components/Toast";
import Stepper, { Step } from "@/components/Stepper";
import { Loader2, ShieldCheck, FileText, Pill, AlertCircle, Info } from "lucide-react";
import { motion } from "motion/react";

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

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    // Mock intuitive Loading
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisComplete(true);
      showToast("success", "Analysis Complete", "Pharmacogenomic risk insights generated successfully.");
    }, 2800);
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
            <div className="space-y-8">
              {/* Results Summary Card */}
              <div className="w-full bg-card border-2 border-primary rounded-[var(--radius-card)] p-12 flex flex-col items-center justify-center space-y-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                  <ShieldCheck className="h-12 w-12 text-primary" />
                </div>

                <div className="text-center space-y-4">
                  <h3 className="text-3xl font-black text-text tracking-tight uppercase italic">Analysis Complete</h3>

                  <div className="flex flex-wrap items-center justify-center gap-8 py-6 px-10 bg-bg-subtle rounded-2xl border border-border shadow-inner">
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-6 w-6 text-primary" />
                      <span className="text-[11px] uppercase font-black text-text-muted">{file?.name.split('.').pop()} Data Active</span>
                    </div>
                    <div className="w-px h-10 bg-border hidden sm:block" />
                    <div className="flex flex-col items-center gap-2">
                      <Pill className="h-6 w-6 text-primary" />
                      <span className="text-[11px] uppercase font-black text-text-muted">{selectedDrugs.length} Drugs Evaluated</span>
                    </div>
                  </div>

                  <p className="text-text-soft font-medium max-w-md mx-auto leading-relaxed pt-2">
                    Personalized pharmacogenomic risk scores have been generated based on detected SNPs in your genomic sequence.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                  <button className="flex-1 px-8 py-4 bg-primary text-white rounded-xl font-bold shadow-lg hover:shadow-primary/30 hover:-translate-y-1 transition-all active:translate-y-0">
                    View Full Report
                  </button>
                  <button
                    onClick={() => {
                      setAnalysisComplete(false);
                      setFile(null);
                      setSelectedDrugs([]);
                      setActiveStep(1);
                    }}
                    className="px-8 py-4 bg-bg-hover text-text rounded-xl font-bold hover:bg-border transition-colors text-sm"
                  >
                    New Analysis
                  </button>
                </div>
              </div>
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
