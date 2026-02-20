"use client";

import { useState, useEffect } from "react";
import UploadCard from "@/components/UploadCard";
import DrugInput from "@/components/DrugInput";
import ActionButton from "@/components/ActionButton";
import ResultsPlaceholder from "@/components/ResultsPlaceholder";
import Toast from "@/components/Toast";
import AnalysisReport from "@/components/AnalysisReport";
import Stepper, { Step } from "@/components/Stepper";
import Header from "@/components/Header";
import { Loader2, ShieldCheck, FileText, Pill, AlertCircle, Info, RefreshCw, History as HistoryIcon, Beaker, Search } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<"analysis" | "history">("analysis");
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [isFetchingHistory, setIsFetchingHistory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);
  const itemsPerPage = 5;

  const [patientId, setPatientId] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    if (viewMode === "history" && user) {
      fetchHistory();
    }
  }, [viewMode, user]);

  const fetchHistory = async () => {
    if (!user) return;
    setIsFetchingHistory(true);
    try {
      const res = await fetch(`/api/history?email=${encodeURIComponent(user.email)}`);
      const data = await res.json();
      if (res.ok) {
        setUserHistory(data.history || []);
      } else {
        showToast("error", "History Error", "Could not retrieve your past reports.");
      }
    } catch (error) {
      showToast("error", "System Error", "Failed to connect to history service.");
    } finally {
      setIsFetchingHistory(false);
    }
  };

  // Filter history based on search query (drug or patient id)
  const filteredHistory = userHistory.filter(h => {
    const report = h.reportData;
    const search = searchQuery.toLowerCase();
    return (
      report.drug?.toLowerCase().includes(search) ||
      report.patient_id?.toLowerCase().includes(search) ||
      report.pharmacogenomic_profile?.primary_gene?.toLowerCase().includes(search)
    );
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage);
  const paginatedHistory = filteredHistory.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const saveToHistory = async (reportData: any) => {
    if (!user) return;
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          reportData
        })
      });
    } catch (error) {
      console.error("Failed to save report to history:", error);
    }
  };

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
        if (patientId.trim()) formData.append("patientId", patientId.trim());

        const res = await fetch(`/api?drug=${encodeURIComponent(drug)}`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          results.push(data);
          // Auto-save to history if logged in
          if (user) {
            await saveToHistory(data);
          }
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
          showToast("success", "Analysis Complete", "Clinical risk reports generated successfully and saved to history.");
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
    <div className="min-h-screen bg-app-bg">
      <Header />
      <main className="max-w-4xl mx-auto px-6 pt-12 pb-24 w-full space-y-8">

        {/* Tab Switcher */}
        <div className="flex justify-center mb-8">
          <div className="bg-bg-subtle/50 p-1.5 rounded-2xl border border-border flex items-center gap-1">
            <button
              onClick={() => {
                setViewMode("analysis");
                setSelectedReport(null);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'analysis' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text'}`}
            >
              <Beaker className="h-3.5 w-3.5" />
              Diagnostics
            </button>
            <button
              onClick={() => {
                setViewMode("history");
                setSelectedReport(null);
              }}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${viewMode === 'history' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text'}`}
            >
              <HistoryIcon className="h-3.5 w-3.5" />
              Case History
            </button>
          </div>

        </div>

        {viewMode === "analysis" ? (
          <>
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
                      <div className="flex items-start gap-4 p-6 bg-primary/5 rounded-2xl border border-primary/10">
                        <Info className="h-6 w-6 text-primary shrink-0 mt-1" />
                        <p className="text-sm text-text-soft leading-relaxed max-w-xl">
                          Please upload a <strong>.VCF</strong> file containing variant data for Chromosome 22 or genome-wide.
                        </p>
                      </div>

                      {/* Patient ID string input */}
                      <div className="mt-6 space-y-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-text-muted ml-1">Patient Identifier (Optional)</label>
                        <input
                          type="text"
                          value={patientId}
                          onChange={(e) => setPatientId(e.target.value)}
                          placeholder="E.g., PATIENT-001"
                          className="w-full px-4 py-3 bg-card border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm text-text placeholder-text-muted font-medium"
                        />
                        <p className="text-[10px] uppercase font-bold text-text-muted ml-1 tracking-wider opacity-80">If left empty, system extracts ID from VCF structure.</p>
                      </div>

                      <div className="mt-6">
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
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-primary/10 rounded-2xl border border-primary/20 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shrink-0">
                          <ShieldCheck className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-black text-text uppercase italic tracking-tight leading-none mb-1">Session Complete</h3>
                          <p className="text-xs text-text-soft font-bold uppercase tracking-widest break-words">{file?.name} • {analysisResults.length} Matches</p>
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
                        className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 md:py-2 bg-white hover:bg-bg-hover text-text rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border border-border shadow-sm active:scale-95"
                      >
                        <RefreshCw className="h-3 w-3" />
                        New Analysis
                      </button>
                    </div>
                    <AnalysisReport results={analysisResults} />
                  </div>
                )}
              </section>
            )}
          </>
        ) : (
          <section className="animate-slide-in space-y-6">
            {selectedReport ? (
              <div className="space-y-6">
                <button
                  onClick={() => setSelectedReport(null)}
                  className="flex items-center gap-2 text-primary font-black text-[10px] uppercase tracking-widest hover:underline"
                >
                  ← Back to Records
                </button>
                <AnalysisReport results={[selectedReport]} />
              </div>
            ) : (
              <>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-text tracking-tight uppercase italic">Clinical Records</h2>
                    <p className="text-sm text-text-soft font-medium">Historical pharmacogenomic assessments for this account</p>
                  </div>

                  <div className="relative max-w-xs w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-text-muted" />
                    <input
                      type="text"
                      placeholder="Search drug or patient ID..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-xs font-medium placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                {isFetchingHistory ? (
                  <div className="py-20 flex flex-col items-center justify-center space-y-4">
                    <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    <p className="text-xs font-black uppercase tracking-widest text-text-muted">Syncing with clinical database...</p>
                  </div>
                ) : filteredHistory.length > 0 ? (
                  <div className="space-y-4">
                    <div className="space-y-3">
                      {paginatedHistory.map((h, i) => {
                        const report = h.reportData;
                        const date = new Date(h.createdAt).toLocaleDateString();
                        const severity = report.risk_assessment?.severity || "none";

                        return (
                          <div
                            key={h._id || i}
                            onClick={() => setSelectedReport(report)}
                            className="group bg-card border border-border p-4 rounded-xl flex items-center justify-between hover:border-primary/40 hover:shadow-md transition-all cursor-pointer active:scale-[0.99]"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`p-2.5 rounded-lg ${severity === 'high' || severity === 'critical' ? 'bg-error/10 text-error' : severity === 'moderate' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>
                                <FileText className="h-5 w-5" />
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-text uppercase italic tracking-tight group-hover:text-primary transition-colors">{report.drug}</h4>
                                <p className="text-[10px] text-text-soft font-bold uppercase tracking-widest">
                                  {report.pharmacogenomic_profile?.primary_gene} • {report.pharmacogenomic_profile?.phenotype}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-[10px] font-black text-text-muted uppercase mb-0.5">{date}</p>
                              <p className="text-[10px] font-mono text-text-soft">ID: {report.patient_id?.slice(0, 8)}...</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2 pt-4">
                        <button
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(p => p - 1)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg border border-border bg-card text-text-soft disabled:opacity-30 hover:bg-bg-hover"
                        >
                          ←
                        </button>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted px-4">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(p => p + 1)}
                          className="h-8 w-8 flex items-center justify-center rounded-lg border border-border bg-card text-text-soft disabled:opacity-30 hover:bg-bg-hover"
                        >
                          →
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="bg-card border border-border rounded-2xl p-20 text-center space-y-4 border-dashed">
                    <HistoryIcon className="h-12 w-12 text-text-muted mx-auto opacity-20" />
                    <div className="space-y-2">
                      <h3 className="text-lg font-black text-text-soft uppercase">No Records Found</h3>
                      <p className="text-xs text-text-muted font-medium max-w-xs mx-auto">
                        {searchQuery ? "No reports match your search criteria." : "You haven't performed any clinical assessments yet."}
                      </p>
                    </div>
                  </div>
                )}
              </>
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
    </div>
  );
}
