
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Dna, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import Toast from "@/components/Toast";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ variant: "success" | "error"; title: string; description: string } | null>(null);

    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                login(data.user);
            } else {
                setToast({
                    variant: "error",
                    title: "Login Failed",
                    description: data.message || "Invalid credentials. Please try again.",
                });
            }
        } catch (error) {
            setToast({
                variant: "error",
                title: "Error",
                description: "Something went wrong. Please check your connection.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center p-6 bg-app-bg">
            <div className="w-full max-w-md space-y-8 animate-slide-in">
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary shadow-xl border border-white/10 mb-2">
                        <Dna className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-black text-text tracking-tight uppercase italic">Welcome Back</h1>
                    <p className="text-text-soft font-medium">Access your pharmacogenomic reports</p>
                </div>

                <div className="bg-card p-8 rounded-3xl border border-border shadow-[var(--shadow-card)] space-y-6">
                    <form onSubmit={handleLogin} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-bg-subtle/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="name@clinical.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-bg-subtle/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full h-12 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 hover:shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group mt-2"
                        >
                            {isLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                <>
                                    Navigate to Dashboard
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-border" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-text-muted font-black tracking-widest">or</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setEmail("demouser@gmail.com");
                                setPassword("demo123");
                            }}
                            className="w-full h-10 border border-primary/20 bg-primary/5 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-all active:scale-[0.98]"
                        >
                            Use Demo Credentials
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        <p className="text-sm text-text-soft font-medium">
                            New to PharmaGuard?{" "}
                            <Link href="/signup" className="text-primary font-bold hover:underline">
                                Create Account
                            </Link>
                        </p>
                    </div>
                </div>

            </div>

            {toast && (
                <Toast
                    variant={toast.variant}
                    title={toast.title}
                    description={toast.description}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
