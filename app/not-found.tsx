
import Link from 'next/link';
import { Home, FileSearch, Dna } from 'lucide-react';

export default function NotFound() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh] px-4">
            {/* Premium Card Container */}
            <div className="max-w-xl w-full bg-card rounded-[var(--radius-card)] shadow-[var(--shadow-card)] border border-border overflow-hidden animate-slide-in">

                {/* Top Accent Bar */}
                <div className="h-1.5 w-full bg-primary" />

                <div className="p-12 flex flex-col items-center text-center">

                    {/* Visual Indicator */}
                    <div className="mb-8 relative">
                        <div className="absolute inset-0 bg-primary/5 rounded-full scale-150 blur-xl" />
                        <div className="relative h-24 w-24 bg-bg-subtle rounded-2xl flex items-center justify-center border border-border shadow-soft transform rotate-3 hover:rotate-0 transition-transform duration-500">
                            <FileSearch className="h-10 w-10 text-primary" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-card rounded-lg shadow-md flex items-center justify-center border border-border animate-bounce">
                            <Dna className="h-5 w-5 text-accent" />
                        </div>
                    </div>

                    {/* Heading Section */}
                    <div className="space-y-3 mb-10">
                        <h1 className="text-6xl font-black text-primary tracking-tighter uppercase italic opacity-10 absolute -top-4 left-1/2 -translate-x-1/2 -z-10 select-none">
                            Not Found
                        </h1>
                        <h2 className="text-4xl font-bold text-text tracking-tight">
                            Error 404
                        </h2>
                        <p className="text-text-soft text-lg font-medium leading-relaxed max-w-sm mx-auto">
                            We couldn't find the genomic sequence or dashboard section you requested.
                        </p>
                    </div>

                    {/* Action Area */}
                    <div className="w-full space-y-4">
                        <Link
                            href="/dashboard"
                            className="group w-full flex items-center justify-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-[var(--radius-input)] shadow-lg transition-all duration-300 hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <Home className="h-5 w-5 transition-transform group-hover:scale-110" />
                            <span>Back to Dashboard</span>
                        </Link>

                        <p className="text-xs text-text-muted font-bold uppercase tracking-[0.2em]">
                            PharmaGuard Clinical Interface
                        </p>
                    </div>
                </div>
            </div>

            {/* Subtle Background Detail */}
            <div className="mt-8 text-text-muted/30 select-none pointer-events-none font-mono text-[10px] tracking-widest text-center">
                SYSTEM_ERR_ROUTE_UNDEFINED // GENOMIC_ENGINE_ID_0x82FS
            </div>
        </div>
    );
}
