"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  ShieldCheck,
  Activity,
  Zap,
  Database,
  ArrowRight,
  CheckCircle2,
  Lock,
  Globe,
  Share2
} from "lucide-react";
import DnaBackground from "@/components/DnaBackground";
import Footer from "@/components/Footer";
import LandingNavbar from "@/components/LandingNavbar";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-white selection:bg-primary/20">
      <DnaBackground />
      <LandingNavbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-8 w-full max-w-7xl flex flex-col items-center text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 mb-8"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary">Project is Live 2.0</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-6xl md:text-8xl font-black text-text tracking-tight uppercase italic leading-[0.9] mb-8"
        >
          Genomics-Guided <span className="text-primary italic">Drug Safety</span> <br /> Instantly
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-text-soft font-medium max-w-2xl leading-relaxed mb-12"
        >
          Determine drug-gene compatibility in milliseconds. Our deterministic risk engine cross-references genomic profiles with CPIC guidelines to deliver quantified clinical safety reports.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-6"
        >
          <Link
            href="/signup"
            className="group px-8 py-4 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-[0_20px_40px_rgba(47,58,143,0.3)] hover:shadow-primary/40 hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            Launch Clinical Console
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white border border-border text-text rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-bg-hover transition-all"
          >
            Practitioner Login
          </Link>
        </motion.div>

        {/* Hero Features Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-28 flex flex-wrap justify-center gap-6 md:gap-10 w-full"
        >
          {[
            { label: "Accuracy", value: "CPIC Tier 1 Data", icon: Database },
            { label: "Interoperability", value: "JSON Standards", icon: Share2 },
            { label: "Global", value: "VCF v4.2 Support", icon: Globe }
          ].map((item, i) => (
            <div
              key={i}
              className="
        group
        px-8 py-6
        bg-white/70 dark:bg-white/5
        backdrop-blur-md
        border border-primary/20
        rounded-2xl
        shadow-sm
        hover:shadow-lg
        transition-all duration-300
        flex flex-col items-center md:items-start gap-2
        min-w-[260px]
      "
            >
              <div className="flex items-center gap-3 mb-1">
                <item.icon className="size-5 text-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-text-muted">
                  {item.label}
                </span>
              </div>

              <span className="text-lg md:text-xl font-black uppercase italic tracking-tight text-text">
                {item.value}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Feature Grid */}
      <section
        id="features"
        className="relative py-32 px-8 w-full max-w-7xl mx-auto z-10"
      >
        {/* Header */}
        <div className="text-center mb-20 space-y-4">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-primary">
            Capabilities
          </span>

          <h2 className="text-4xl md:text-5xl font-black text-text uppercase italic tracking-tight">
            The Future of Pharmacy
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <FeatureCard
            icon={
              <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm">
                <Activity className="size-6 text-primary" />
              </div>
            }
            title="Real-time Risk Scoring"
            desc="Dynamic Clinical Risk Index (0-100) derived from metabolic polymorphisms and drug severity models."
          />

          <FeatureCard
            icon={
              <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm">
                <Lock className="size-6 text-primary" />
              </div>
            }
            title="Secure Case History"
            desc="Encrypted practitioner workspace with AES-256 archival for patient pharmacogenomic profiles."
          />

          <FeatureCard
            icon={
              <div className="p-3 rounded-xl bg-primary/10 backdrop-blur-sm">
                <CheckCircle2 className="size-6 text-primary" />
              </div>
            }
            title="Evidence-Based Reports"
            desc="Auto-generated clinical reports referencing PharmGKB, CPIC, and ClinVar annotations."
          />

        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full bg-primary py-24 px-8 z-10 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 gap-0 h-full">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border-[0.5px] border-white/20 h-12 w-full" />
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 relative z-10">
          <div className="text-center md:text-left">
            <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter uppercase leading-[0.85]">
              Optimizing <br /> Outcomes. <br /> <span className="text-accent underline decoration-4 underline-offset-8">Saving Lives.</span>
            </h3>
          </div>
          <div className="flex flex-wrap justify-center gap-12">
            <StatBox value="50ms" label="Inference Time" />
            <StatBox value="1.2M" label="Variants Indexed" />
            <StatBox value="100%" label="Deterministic" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <motion.div
      whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="p-8 bg-white/60 backdrop-blur-md border border-primary/20 rounded-[2.5rem] shadow-sm transition-all duration-300 group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10">
        <div className="mb-6 inline-block transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
          {icon}
        </div>
        <h3 className="text-xl font-black text-text uppercase italic tracking-tight mb-4">{title}</h3>
        <p className="text-sm text-text-soft leading-relaxed font-medium">
          {desc}
        </p>
      </div>
    </motion.div>
  );
}

function StatBox({ value, label }: { value: string, label: string }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-5xl md:text-7xl font-black text-white italic tracking-tighter mb-2">{value}</span>
      <span className="text-[10px] font-black uppercase tracking-widest text-accent/80">{label}</span>
    </div>
  );
}
