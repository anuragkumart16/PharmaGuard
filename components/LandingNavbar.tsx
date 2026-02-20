"use client";

import Link from "next/link";
import { Dna, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LandingNavbar() {
    const { user } = useAuth();

    return (
        <>
            <nav className="fixed top-0 left-0 right-0 h-16 md:h-20 px-4 md:px-8 flex items-center justify-between z-50 bg-white/70 backdrop-blur-md border-b border-border transition-all">
                <div className="flex items-center gap-2 md:gap-3">
                    <div className="bg-primary p-1.5 md:p-2 rounded-xl shadow-lg">
                        <Dna className="size-5 md:size-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg md:text-xl font-black text-text tracking-tight italic uppercase leading-none">PharmaGuard</span>
                        <span className="text-[8px] md:text-[10px] font-black text-primary tracking-widest uppercase hidden md:block">Risk Engine</span>
                    </div>
                </div>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/features" className="text-xs font-black uppercase tracking-widest text-text-soft hover:text-primary transition-colors">Features</Link>
                    <Link href="/methodology" className="text-xs font-black uppercase tracking-widest text-text-soft hover:text-primary transition-colors">Methodology</Link>
                </div>

                <div className="flex items-center gap-4">
                    {user ? (
                        <Link
                            href="/dashboard"
                            className="group flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            <span className="hidden md:inline">Go to Console</span>
                            <span className="md:hidden">Console</span>
                            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="hidden md:block px-5 py-2.5 text-text text-xs font-black uppercase tracking-widest hover:text-primary transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/signup"
                                className="group flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            >
                                <span className="hidden md:inline">Get Started</span>
                                <span className="md:hidden">Start</span>
                                <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </>
                    )}
                </div>

            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-border flex items-center justify-around z-50 px-4 pb-safe shadow-[0_-5px_10px_rgba(0,0,0,0.02)]">
                <Link href="/" className="flex flex-col items-center gap-1 text-text-soft hover:text-primary active:text-primary transition-colors">
                    <Dna className="size-5" />
                    <span className="text-[10px] font-black uppercase tracking-wider">Home</span>
                </Link>
                <Link href="/features" className="flex flex-col items-center gap-1 text-text-soft hover:text-primary active:text-primary transition-colors">
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-wider">Features</span>
                </Link>
                <Link href="/methodology" className="flex flex-col items-center gap-1 text-text-soft hover:text-primary active:text-primary transition-colors">
                    <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span className="text-[10px] font-black uppercase tracking-wider">Method</span>
                </Link>
                {user ? (
                    <Link href="/dashboard" className="flex flex-col items-center gap-1 text-primary">
                        <div className="size-9 bg-primary text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
                            <ArrowRight className="size-5" />
                        </div>
                    </Link>
                ) : (
                    <Link href="/login" className="flex flex-col items-center gap-1 text-text-soft hover:text-primary active:text-primary transition-colors">
                        <svg className="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-[10px] font-black uppercase tracking-wider">Login</span>
                    </Link>
                )}
            </div>
        </>
    );
}
