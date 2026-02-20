
import { Dna, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
    return (
        <footer className="w-full bg-white border-t border-border py-12 px-8 z-10 relative">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/5 p-2 rounded-lg border border-primary/10">
                            <Dna className="size-5 text-primary" />
                        </div>
                        <span className="text-lg font-black tracking-tight italic uppercase">PharmaGuard</span>
                    </div>
                    <p className="text-sm text-text-soft leading-relaxed">
                        Revolutionizing clinical decision support through advanced pharmacogenomic analysis and deterministic risk engine.
                    </p>
                </div>

                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-text mb-4">Platform</h4>
                    <ul className="space-y-2 text-sm text-text-soft font-medium">
                        <li className="hover:text-primary cursor-pointer transition-colors">Risk Engine</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">Clinical Mapping</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">API Documentation</li>
                        <li className="hover:text-primary cursor-pointer transition-colors">Case History</li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-xs font-black uppercase tracking-widest text-text mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm text-text-soft font-medium">
                        <div className="space-y-3">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-text-muted">
                                Resources
                            </h4>

                            <ul className="space-y-2 text-sm">
                                <li>
                                    <a
                                        href="https://cpicpgx.org/guidelines/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition"
                                    >
                                        CPIC Guidelines
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="https://www.pharmgkb.org/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition"
                                    >
                                        PharmGKB Data
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="https://www.ncbi.nlm.nih.gov/clinvar/"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition"
                                    >
                                        ClinVar Database
                                    </a>
                                </li>

                                <li>
                                    <a
                                        href="https://www.fda.gov/drugs/science-research-drugs/table-pharmacogenetic-associations"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-primary transition"
                                    >
                                        FDA PGx Table
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </ul>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-widest text-text mb-4">Connect</h4>
                    <div className="flex items-center gap-4">
                        <button className="p-2 bg-bg-subtle hover:bg-bg-hover rounded-lg border border-border transition-all hover:scale-110">
                            <Twitter className="size-4 text-text-soft" />
                        </button>
                        <button className="p-2 bg-bg-subtle hover:bg-bg-hover rounded-lg border border-border transition-all hover:scale-110">
                            <Github className="size-4 text-text-soft" />
                        </button>
                        <button className="p-2 bg-bg-subtle hover:bg-bg-hover rounded-lg border border-border transition-all hover:scale-110">
                            <Linkedin className="size-4 text-text-soft" />
                        </button>
                        <button className="p-2 bg-bg-subtle hover:bg-bg-hover rounded-lg border border-border transition-all hover:scale-110">
                            <Mail className="size-4 text-text-soft" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                    © 2026 PharmaGuard. Engineered for Clinical Excellence and Genomic Precision.
                </p>
                <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <span className="hover:text-primary cursor-pointer underline-offset-4 hover:underline">Privacy Policy</span>
                    <span className="hover:text-primary cursor-pointer underline-offset-4 hover:underline">Terms of Service</span>
                </div>
            </div>
        </footer>
    );
}
