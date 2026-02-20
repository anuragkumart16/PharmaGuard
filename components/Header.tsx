"use client";

import { Dna, LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export default function Header() {
    const { user, logout } = useAuth();

    return (
        <header
            className="h-[70px] md:h-[80px] w-full flex items-center justify-between px-4 md:px-8 bg-primary shadow-lg sticky top-0 z-50 backdrop-blur-sm transition-all"
        >
            {/* Left side: Icon + Title + Subtitle */}
            <div className="flex items-center gap-3 md:gap-4">
                <div className="bg-white/10 p-2 md:p-2.5 rounded-xl border border-white/10 backdrop-blur-md shadow-inner transition-transform hover:scale-105 duration-300">
                    <Dna className="size-5 md:size-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-lg md:text-xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                        PharmaGuard
                    </h1>
                    <p className="text-[10px] md:text-xs text-accent font-bold tracking-wide uppercase opacity-90 hidden md:block">
                        Pharmacogenomic Risk Engine
                    </p>
                </div>
            </div>

            {/* Right side: User Profile & Logout */}
            {user && (
                <div className="flex items-center gap-3 md:gap-4">
                    <div className="flex items-center gap-2 md:gap-3 px-3 py-1.5 md:px-4 md:py-2 bg-white/10 rounded-xl border border-white/10">
                        <div className="h-7 w-7 md:h-8 md:w-8 rounded-lg bg-accent/20 flex items-center justify-center border border-accent/20">
                            <UserIcon className="h-3.5 w-3.5 md:h-4 md:w-4 text-accent" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] md:text-xs font-bold text-white leading-none whitespace-nowrap">{user.firstName} {user.lastName}</span>
                            <span className="text-[8px] md:text-[10px] text-white/60 font-medium hidden md:block">Practitioner</span>
                        </div>
                    </div>
                    <button
                        onClick={logout}
                        className="p-2 md:p-2.5 hover:bg-white/10 rounded-xl border border-transparent hover:border-white/10 text-white/80 hover:text-white transition-all group"
                        title="Logout"
                    >
                        <LogOut className="h-4 w-4 md:h-5 md:w-5 group-hover:scale-110 transition-transform" />
                    </button>
                </div>
            )}
        </header>
    );
}
