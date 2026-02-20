"use client";

import { motion } from "motion/react";
import {
    Dna,
    Upload,
    Search,
    FileText,
    History,
    Zap,
    ShieldCheck,
    Share2,
    Layers
} from "lucide-react";
import LandingNavbar from "@/components/LandingNavbar";
import DnaBackground from "@/components/DnaBackground";
import Footer from "@/components/Footer";

export default function FeaturesPage() {
    return (
        <div className="min-h-screen bg-white">
            <DnaBackground />
            <LandingNavbar />

            <main className="pt-32 pb-20 px-8 w-full max-w-6xl mx-auto relative z-10">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-4 mb-24"
                >
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Capabilities</span>
                    <h1 className="text-5xl md:text-7xl font-black text-text uppercase italic tracking-tighter leading-tight">
                        Advanced Clinical <br /> <span className="text-primary italic">Tooling</span>
                    </h1>
                    <p className="text-lg text-text-soft font-medium max-w-2xl mx-auto leading-relaxed">
                        PharmaGuard provides a complete suite of tools for practitioners to assess, track, and manage pharmacogenomic risk.
                    </p>
                </motion.section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureShowcase
                        icon={<Upload className="size-8 text-primary" />}
                        title="VCF Streamlining"
                        desc="Upload raw .VCF genomic data directly. Our engine handles normalization, filtering, and target variant extraction in seconds."
                    />
                    <FeatureShowcase
                        icon={<Layers className="size-8 text-primary" />}
                        title="Multi-Drug Analysis"
                        desc="Screen patients against multiple medications simultaneously. Get a unified dashboard of all relevant drug-gene interactions."
                    />
                    <FeatureShowcase
                        icon={<Zap className="size-8 text-primary" />}
                        title="Insta-Risk Scoring"
                        desc="Proprietary algorithm that calculates a 0-100% Clinical Risk Index based on activity scores and phenotype severity."
                    />
                    <FeatureShowcase
                        icon={<History className="size-8 text-primary" />}
                        title="Clinical History"
                        desc="Securely archive all past assessments. Search by Patient ID or Drug Name to retrieve historical risk reports instantly."
                    />
                    <FeatureShowcase
                        icon={<Share2 className="size-8 text-primary" />}
                        title="JSON Portability"
                        desc="Export clinical assessments in standard JSON format for integration into Electronic Health Record (EHR) systems."
                    />
                    <FeatureShowcase
                        icon={<ShieldCheck className="size-8 text-primary" />}
                        title="Engine Verification"
                        desc="Full transparency into the logic. View the specific genotypes and star-alleles detected for every clinical recommendation."
                    />
                </section>

                <section className="mt-32 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-bg-subtle/50 p-8 md:p-16 rounded-[4rem] border border-border">
                    <div className="space-y-8">
                        <h2 className="text-4xl font-black text-text uppercase italic tracking-tighter leading-tight">
                            Designed for <br /> <span className="text-primary italic">Practitioners</span>
                        </h2>
                        <ul className="space-y-6">
                            <li className="flex gap-4">
                                <div className="size-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-1">
                                    <CheckCircleIcon />
                                </div>
                                <div>
                                    <span className="block text-lg font-black uppercase italic tracking-tight text-text">Zero-Latency Sync</span>
                                    <p className="text-sm text-text-soft font-medium">Auto-saving assessments ensures no data loss during critical clinical workflows.</p>
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="size-6 bg-primary rounded-full flex items-center justify-center shrink-0 mt-1">
                                    <CheckCircleIcon />
                                </div>
                                <div>
                                    <span className="block text-lg font-black uppercase italic tracking-tight text-text">Sub-atomic Parsing</span>
                                    <p className="text-sm text-text-soft font-medium">Detects even minor variations in coding regions for Chromosome 22 with surgical precision.</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <div className="relative aspect-square bg-white rounded-[3rem] shadow-2xl border border-border overflow-hidden group">
                        <div className="absolute inset-0 bg-primary/5 group-hover:bg-transparent transition-colors duration-500" />
                        <div className="flex items-center justify-center h-full">
                            <Dna className="size-48 text-primary animate-pulse" strokeWidth={1} />
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}

function FeatureShowcase({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="p-10 bg-white border border-border rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-300 group"
        >
            <div className="size-16 bg-primary/5 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                {icon}
            </div>
            <h3 className="text-2xl font-black text-text uppercase italic tracking-tight mb-4">{title}</h3>
            <p className="text-sm text-text-soft leading-relaxed font-medium">
                {desc}
            </p>
        </motion.div>
    );
}

function CheckCircleIcon() {
    return (
        <svg className="size-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
    );
}
