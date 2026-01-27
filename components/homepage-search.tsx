'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Building2, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export default function HomepageSearch() {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [type, setType] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [query, setQuery] = useState("");

    const propertyTypes = [
        { value: "apartment", label: "Apartment" },
        { value: "villa", label: "Villa" },
        { value: "office", label: "Office" },
        { value: "penthouse", label: "Penthouse" },
        { value: "townhouse", label: "Townhouse" },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.set('q', query);
        if (type) params.set('type', type);
        router.push(`/search?${params.toString()}`);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl max-w-4xl mx-auto mt-12 transform hover:scale-[1.01] transition-all duration-300">
            <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
                {/* Location Input */}
                <div className="flex-1 relative group">
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <MapPin className="text-white/70 w-5 h-5 group-focus-within:text-indigo-400 transition-colors" />
                    </div>
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="pl-10 h-14 bg-white/5 border-white/10 text-white placeholder:text-white/60 focus:bg-white/10 focus:border-indigo-400/50 rounded-2xl text-lg transition-all"
                        placeholder="City, Neighborhood, or Address"
                    />
                </div>

                {/* Custom Property Type Dropdown */}
                <div className="flex-1 relative" ref={dropdownRef}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "w-full pl-10 pr-10 h-14 text-left flex items-center bg-white/5 border border-white/10 text-white rounded-2xl text-lg transition-all focus:outline-none focus:border-indigo-400/50 hover:bg-white/10",
                            !type && "text-white/60"
                        )}
                    >
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Building2 className={cn("w-5 h-5 transition-colors", isOpen ? "text-indigo-400" : "text-white/70")} />
                        </div>
                        <span className="truncate">{type ? propertyTypes.find(t => t.value === type)?.label : "Property Type"}</span>
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                            <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                        </div>
                    </button>

                    {/* Dropdown Menu */}
                    {isOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
                            {propertyTypes.map((item) => (
                                <div
                                    key={item.value}
                                    onClick={() => {
                                        setType(item.value);
                                        setIsOpen(false);
                                    }}
                                    className="px-4 py-3 text-white hover:bg-white/10 cursor-pointer flex items-center justify-between transition-colors group"
                                >
                                    <span>{item.label}</span>
                                    {type === item.value && <Check className="w-4 h-4 text-indigo-400" />}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Search Button */}
                <div className="w-full md:w-48">
                    <Button type="submit" size="lg" className="w-full h-14 rounded-2xl bg-gradient-to-r from-indigo-500 to-pink-600 hover:from-indigo-600 hover:to-pink-700 text-white font-bold text-lg shadow-lg shadow-indigo-500/25 border-0">
                        Search
                    </Button>
                </div>
            </form>
        </div>
    );
}
