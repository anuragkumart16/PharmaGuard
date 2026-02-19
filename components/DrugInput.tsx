
"use client";

import { useState, useRef, useEffect } from "react";
import { X, Search } from "lucide-react";

const SUGGESTED_DRUGS = [
    "Warfarin",
    "Codeine",
    "Clopidogrel",
    "Simvastatin",
    "Azathioprine",
    "Fluorouracil",
    "Tamoxifen",
    "Citalopram",
    "Omeprazole",
    "Metoprolol"
];

interface DrugInputProps {
    selectedDrugs?: string[]; // Made optional with default empty array
    onChange: (drugs: string[]) => void;
    disabled?: boolean;
}

export default function DrugInput({ selectedDrugs = [], onChange, disabled }: DrugInputProps) {
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Safety check: ensure selectedDrugs is always an array
    const drugsList = Array.isArray(selectedDrugs) ? selectedDrugs : [];

    const filteredSuggestions = SUGGESTED_DRUGS.filter(drug =>
        drug.toLowerCase().includes(query.toLowerCase()) &&
        !drugsList.includes(drug)
    );

    const handleSelect = (drug: string) => {
        if (disabled) return;
        onChange([...drugsList, drug]);
        setQuery("");
        setShowSuggestions(false);
        inputRef.current?.focus();
    };

    const handleRemove = (drugToRemove: string) => {
        if (disabled) return;
        onChange(drugsList.filter(drug => drug !== drugToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === "Backspace" && query === "" && drugsList.length > 0) {
            handleRemove(drugsList[drugsList.length - 1]);
        }
        if (e.key === "Enter" && filteredSuggestions.length > 0 && query) {
            e.preventDefault();
            handleSelect(filteredSuggestions[0]);
        }
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className={`mt-6 flex flex-col gap-2 relative ${disabled ? "opacity-50 pointer-events-none" : ""}`} ref={containerRef}>
            <label className="text-sm font-semibold text-text-soft">
                Drug Name(s)
            </label>

            <div
                className={`
          flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-lg border bg-card transition-all duration-200 min-h-[50px]
          ${isFocused
                        ? "border-primary ring-2 ring-primary/10"
                        : "border-border hover:border-text-muted"}
        `}
                onClick={() => !disabled && inputRef.current?.focus()}
            >
                {drugsList.map((drug) => (
                    <span
                        key={drug}
                        className="
              inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium
              bg-primary/10 text-primary animate-slide-in
            "
                    >
                        {drug}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove(drug);
                            }}
                            className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                        >
                            <X size={14} />
                        </button>
                    </span>
                ))}

                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    disabled={disabled}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setShowSuggestions(true);
                    }}
                    onFocus={() => {
                        setIsFocused(true);
                        setShowSuggestions(true);
                    }}
                    onBlur={() => {
                        setIsFocused(false);
                        setTimeout(() => setShowSuggestions(false), 200);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder={drugsList.length === 0 ? "e.g. Warfarin, Codeine" : ""}
                    className="flex-1 bg-transparent outline-none min-w-[120px] text-text placeholder-text-muted"
                />
            </div>

            {showSuggestions && query && filteredSuggestions.length > 0 && (
                <div className="absolute top-[85px] left-0 w-full bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden animate-slide-in">
                    <div className="max-h-60 overflow-y-auto">
                        {filteredSuggestions.map((drug) => (
                            <button
                                key={drug}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(drug);
                                }}
                                className="w-full text-left px-4 py-3 text-sm text-text hover:bg-bg-hover hover:text-primary flex items-center gap-2 transition-colors border-b border-border last:border-0"
                            >
                                <Search size={14} className="text-text-muted" />
                                {drug}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <p className="text-xs text-text-muted mt-1">
                Type to search supported pharmacogenomic drugs.
            </p>
        </div>
    );
}
