"use client";

import Link from "next/link";
import { Dna, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function LandingNavbar() {
    const { user } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 h-20 px-8 flex items-center justify-between z-50 bg-white/70 backdrop-blur-md border-b border-border">
            <div className="flex items-center gap-3">
                <div className="bg-primary p-2 rounded-xl shadow-lg">
                    <Dna className="size-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <span className="text-xl font-black text-text tracking-tight italic uppercase leading-none">PharmaGuard</span>
                    <span className="text-[10px] font-black text-primary tracking-widest uppercase">Risk Engine</span>
                </div>
            </div>

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
                        Go to Console
                        <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                ) : (
                    <>
                        <Link
                            href="/login"
                            className="px-5 py-2.5 text-text text-xs font-black uppercase tracking-widest hover:text-primary transition-colors"
                        >
                            Sign In
                        </Link>
                        <Link
                            href="/signup"
                            className="group flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                        >
                            Get Started
                            <ArrowRight className="size-3.5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}
