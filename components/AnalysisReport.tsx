
"use client";

import React, { useState } from "react";
import {
    ShieldAlert,
    ShieldCheck,
    ShieldQuestion,
    Dna,
    Clipboard,
    Download,
    Clock,
    User,
    Activity,
    FileJson,
    CheckCircle2,
    AlertCircle,
    Copy,
    ChevronDown,
    ChevronUp
} from "lucide-react";

interface Variant {
    gene: string;
    variant: string;
    genotype: string;
}

interface AnalysisResult {
    patient_id: string;
    drug: string;
    timestamp: string;
    risk_assessment: {
        risk_label: string;
        risk_score: number;
        confidence_score: number;
        severity: "none" | "low" | "moderate" | "high" | "critical";
    };
    pharmacogenomic_profile: {
        primary_gene: string;
        diplotype: string;
        phenotype: string;
        activity_score?: number;
        detected_variants: Array<{ rsid?: string; variant?: string; genotype?: string }>;
    };
    clinical_recommendation: {
        recommendation: string;
    };
    llm_generated_explanation: {
        summary: string;
    };
    quality_metrics: {
        vcf_parsing_success: boolean;
        total_variants_in_file: number;
        target_variants_found: number;
        gene_coverage: Record<string, boolean>;
        processing_time_ms: number;
    };
}

interface ReportCardProps {
    report: AnalysisResult;
}

const SeverityBadge = ({ severity, label }: { severity: string, label: string }) => {
    const styles = {
        none: "bg-success/10 text-success border-success/20",
        low: "bg-success/10 text-success border-success/20",
        moderate: "bg-warning/10 text-warning border-warning/20",
        high: "bg-error/10 text-error border-error/20",
        critical: "bg-error/20 text-error border-error/30 animate-pulse",
    };

    return (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${styles[severity as keyof typeof styles] || styles.none}`}>
            {label}
        </span>
    );
};

const FormattedText = ({ text }: { text: string }) => {
    if (!text) return null;

    // Split by newlines first
    const lines = text.split('\n');

    return (
        <div className="space-y-3">
            {lines.map((line, i) => {
                // Split by bold markers **
                const parts = line.split(/(\*\*.*?\*\*)/g);
                return (
                    <p key={i} className="text-xs text-text-soft leading-relaxed transition-all">
                        {parts.map((part, j) => {
                            if (part.startsWith('**') && part.endsWith('**')) {
                                return <strong key={j} className="font-black text-primary uppercase tracking-tighter mr-0.5">{part.slice(2, -2)}</strong>;
                            }
                            return part;
                        })}
                    </p>
                );
            })}
        </div>
    );
};

const ReportCard = ({ report }: ReportCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(report, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadJson = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `PGx_Report_${report.drug}_${report.patient_id}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const getRiskIcon = () => {
        const s = report.risk_assessment.severity;
        if (s === "high" || s === "critical") return <ShieldAlert className="h-6 w-6 text-error" />;
        if (s === "moderate") return <ShieldQuestion className="h-6 w-6 text-warning" />;
        return <ShieldCheck className="h-6 w-6 text-success" />;
    };

    const getRiskBorder = () => {
        const s = report.risk_assessment.severity;
        if (s === "high" || s === "critical") return "border-l-error";
        if (s === "moderate") return "border-l-warning";
        return "border-l-success";
    };

    return (
        <div className={`w-full bg-card border border-border border-l-4 ${getRiskBorder()} rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md h-fit`}>
            {/* Header Segment */}
            <div className="p-6 flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-2xl ${report.risk_assessment.severity === "high" ? "bg-error/5" : "bg-success/5"}`}>
                        {getRiskIcon()}
                    </div>
                    <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-text uppercase italic tracking-tight">{report.drug}</h3>
                            <SeverityBadge
                                severity={report.risk_assessment.severity}
                                label={report.risk_assessment.risk_label || report.risk_assessment.severity}
                            />
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-xs text-text-muted font-medium flex items-center gap-2">
                                <Activity className="h-3 w-3" />
                                {report.pharmacogenomic_profile.phenotype} Phenotype Status
                            </p>
                            <div className="hidden sm:flex items-center gap-3 ml-2 pl-3 border-l border-border">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-none mb-1">Clinical Risk Index</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-border rounded-full overflow-hidden shadow-inner">
                                            <div
                                                className={`h-full transition-all duration-1000 ${report.risk_assessment.severity === 'critical' || report.risk_assessment.severity === 'high'
                                                        ? 'bg-error'
                                                        : report.risk_assessment.severity === 'moderate'
                                                            ? 'bg-warning'
                                                            : 'bg-success'
                                                    }`}
                                                style={{ width: `${report.risk_assessment.risk_score}%` }}
                                            />
                                        </div>
                                        <span className={`text-xs font-black ${report.risk_assessment.severity === 'critical' || report.risk_assessment.severity === 'high'
                                                ? 'text-error'
                                                : report.risk_assessment.severity === 'moderate'
                                                    ? 'text-warning'
                                                    : 'text-success'
                                            }`}>
                                            {report.risk_assessment.risk_score}%
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={copyToClipboard}
                        className="p-2 hover:bg-bg-hover rounded-lg transition-colors text-text-muted hover:text-primary"
                        title="Copy JSON"
                    >
                        {copied ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </button>
                    <button
                        onClick={downloadJson}
                        className="p-2 hover:bg-bg-hover rounded-lg transition-colors text-text-muted hover:text-primary"
                        title="Download report"
                    >
                        <Download className="h-4 w-4" />
                    </button>
                </div>
            </div>

            {/* Recommendation Block */}
            <div className="px-6 pb-6 pt-2">
                <div className="bg-bg-subtle/50 p-5 rounded-2xl border border-border/50">
                    <div className="flex items-center gap-2 mb-3 text-xs font-black uppercase tracking-widest text-primary">
                        <Clipboard className="h-3.5 w-3.5" />
                        Clinical Guidance
                    </div>
                    <p className="text-sm text-text leading-relaxed font-medium">
                        {report.clinical_recommendation.recommendation}
                    </p>
                </div>
            </div>

            {/* AI Explanation Block */}
            <div className="px-6 pb-6">
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                    <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm border border-primary/5 mt-0.5 shrink-0">
                        <Dna className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary/70 block mb-1">Pharmacological Mechanism</span>
                        <FormattedText text={report.llm_generated_explanation.summary} />
                    </div>
                </div>
            </div>

            {/* Expandable Details */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full h-10 bg-bg-subtle/30 hover:bg-bg-subtle/50 border-t border-border/50 flex items-center justify-center gap-2 transition-colors text-[10px] font-black uppercase tracking-widest text-text-muted"
            >
                {isExpanded ? (
                    <>Less Details <ChevronUp className="h-3 w-3" /></>
                ) : (
                    <>View Technical Analysis <ChevronDown className="h-3 w-3" /></>
                )}
            </button>

            {isExpanded && (
                <div className="p-6 bg-card animate-slide-in space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-bg-subtle border border-border">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-2">Molecular Profile</span>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-soft">Diplotype:</span>
                                    <span className="font-bold text-text">{report.pharmacogenomic_profile.diplotype}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-soft">Primary Gene:</span>
                                    <span className="font-bold text-text">{report.pharmacogenomic_profile.primary_gene}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-soft">Activity Score (AS):</span>
                                    <span className="font-bold text-primary">{report.pharmacogenomic_profile.activity_score ?? '1.0'}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-soft">Sequence Confidence:</span>
                                    <span className="font-bold text-text">{(report.risk_assessment.confidence_score * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                        <div className="p-4 rounded-xl bg-bg-subtle border border-border">
                            <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-2">Quality Metrics</span>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-soft">Engine Time:</span>
                                    <span className="font-bold text-text">{report.quality_metrics.processing_time_ms}ms</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-soft">Total Variants:</span>
                                    <span className="font-bold text-text">{report.quality_metrics.total_variants_in_file}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-text-soft">Findings:</span>
                                    <span className="font-bold text-success">{report.quality_metrics.target_variants_found} SNVs</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted block mb-3 pl-1">Identified Variants</span>
                        <div className="overflow-hidden rounded-xl border border-border">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-bg-subtle border-b border-border">
                                    <tr>
                                        <th className="px-4 py-2 font-black text-text-muted uppercase">Variant</th>
                                        <th className="px-4 py-2 font-black text-text-muted uppercase">Genotype</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {report.pharmacogenomic_profile.detected_variants.map((v: any, i) => (
                                        <tr key={i} className="bg-white">
                                            <td className="px-4 py-2 font-mono text-primary">{v.rsid || v.variant}</td>
                                            <td className="px-4 py-2 font-bold text-text-soft">{v.genotype || 'Detected'}</td>
                                        </tr>
                                    ))}
                                    {report.pharmacogenomic_profile.detected_variants.length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="px-4 py-4 text-center text-text-muted italic">No specific SNPs found in target coding regions.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-text-muted border-t border-border pt-4">
                        <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> Evaluated: {new Date(report.timestamp).toLocaleString()}</span>
                        <span className="flex items-center gap-1 font-mono uppercase">Internal ID: {report.patient_id || 'ANALYSIS_993'}</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default function AnalysisReport({ results }: { results: AnalysisResult[] }) {
    const [showRaw, setShowRaw] = useState(false);

    return (
        <div className="w-full space-y-8 animate-slide-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-black text-text tracking-tight uppercase italic">Clinical Assessment</h2>
                    <p className="text-sm text-text-soft font-medium">Genomic cross-reference results from PGx Engine</p>
                </div>
                <button
                    onClick={() => setShowRaw(!showRaw)}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-border rounded-xl text-xs font-black uppercase tracking-widest text-text-soft hover:bg-bg-hover transition-colors"
                >
                    <FileJson className="h-3.5 w-3.5" />
                    {showRaw ? "Visual Mode" : "Raw JSON"}
                </button>
            </div>

            {showRaw ? (
                <div className="w-full bg-slate-900 rounded-2xl p-6 overflow-hidden">
                    <pre className="text-[11px] text-emerald-400 font-mono overflow-auto max-h-[600px] leading-relaxed">
                        {JSON.stringify(results, null, 2)}
                    </pre>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {results.map((report, index) => (
                        <ReportCard key={`${report.drug}-${index}`} report={report} />
                    ))}
                </div>
            )}
        </div>
    );
}
