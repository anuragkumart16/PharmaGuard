
"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { Dna, Mail, Lock, User, Loader2, ArrowRight } from "lucide-react";
import Toast from "@/components/Toast";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ variant: "success" | "error"; title: string; description: string } | null>(null);

    const { login } = useAuth();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                // Auto-login upon successful signup
                login(data.user);
            } else {
                setToast({
                    variant: "error",
                    title: "Signup Failed",
                    description: data.message || "Could not create account. Please try again.",
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
                    <h1 className="text-3xl font-black text-text tracking-tight uppercase italic">Get Started</h1>
                    <p className="text-text-soft font-medium">Create your clinical profile</p>
                </div>

                <div className="bg-card p-8 rounded-3xl border border-border shadow-[var(--shadow-card)] space-y-6">
                    <form onSubmit={handleSignup} className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">First Name</label>
                                <div className="relative group">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        className="w-full pl-10 pr-4 py-3 bg-bg-subtle/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                        placeholder="Param"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Last Name</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        required
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        className="w-full px-4 py-3 bg-bg-subtle/50 border border-border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm"
                                        placeholder="Khodiyar"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-text-muted ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
                                    Create Account
                                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="relative pt-2">
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
                                setFormData({
                                    firstName: "Demo",
                                    lastName: "User",
                                    email: "demouser@gmail.com",
                                    password: "demo123"
                                });
                            }}
                            className="w-full h-10 border border-primary/20 bg-primary/5 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/10 transition-all active:scale-[0.98]"
                        >
                            Autofill Demo Data
                        </button>
                    </form>

                    <div className="pt-4 text-center">
                        <p className="text-sm text-text-soft font-medium">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary font-bold hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <p className="text-center text-[10px] text-text-muted uppercase font-black tracking-widest">
                    Secured with Industry Grade SSL • HIPAA Compliant
                </p>
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
