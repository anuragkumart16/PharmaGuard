
import { Dna } from "lucide-react";

export default function Header() {
    return (
        <header
            className="h-[80px] w-full flex items-center justify-between px-8 bg-primary shadow-lg sticky top-0 z-50 backdrop-blur-sm"
        >
            {/* Left side: Icon + Title + Subtitle */}
            <div className="flex items-center gap-4">
                <div className="bg-white/10 p-2.5 rounded-xl border border-white/10 backdrop-blur-md shadow-inner transition-transform hover:scale-105 duration-300">
                    <Dna className="size-6 text-white" />
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-white tracking-tight leading-tight drop-shadow-sm">
                        PharmaGuard
                    </h1>
                    <p className="text-xs text-accent font-bold tracking-wide uppercase opacity-90">
                        Pharmacogenomic Risk Engine
                    </p>
                </div>
            </div>

            {/* Right side: Status Badge */}
            {/* <div>
                <span className="px-3 py-1.5 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-widest border border-white/20 backdrop-blur-sm shadow-sm">
                    UI Prototype
                </span>
            </div> */}
        </header>
    );
}
