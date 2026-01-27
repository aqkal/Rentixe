'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useTransition } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';

export function SearchFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [filters, setFilters] = useState({
        purpose: searchParams.get('purpose') || 'rent',
        query: searchParams.get('q') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        type: searchParams.get('type') || '',
        sort: searchParams.get('sort') || 'newest',
    });

    const handleSearch = () => {
        startTransition(() => {
            const params = new URLSearchParams();
            if (filters.purpose) params.set('purpose', filters.purpose);
            if (filters.query) params.set('q', filters.query);
            if (filters.minPrice) params.set('minPrice', filters.minPrice);
            if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
            if (filters.type) params.set('type', filters.type);
            if (filters.sort) params.set('sort', filters.sort);

            router.push(`/search?${params.toString()}`);
        });
    };

    return (
        <div className="space-y-4">
            {/* Purpose Toggle */}
            <div className="flex bg-slate-100 p-1 rounded-lg">
                {['rent', 'sale'].map((p) => (
                    <button
                        key={p}
                        onClick={() => setFilters({ ...filters, purpose: p })}
                        className={`flex-1 py-2 text-sm font-medium rounded-md capitalize transition-all ${filters.purpose === p ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
                    >
                        For {p === 'rent' ? 'Rent' : 'Sale'}
                    </button>
                ))}
            </div>

            {/* Location Search */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Location</label>
                <Input
                    placeholder="City, Area..."
                    value={filters.query}
                    onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                    className="bg-slate-50 border-slate-200"
                />
            </div>

            {/* Price Range */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Price Range</label>
                <div className="grid grid-cols-2 gap-2">
                    <Input
                        placeholder="Min"
                        type="number"
                        value={filters.minPrice}
                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                        className="bg-slate-50 border-slate-200"
                    />
                    <Input
                        placeholder="Max"
                        type="number"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                        className="bg-slate-50 border-slate-200"
                    />
                </div>
            </div>

            {/* Property Type */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Property Type</label>
                <select
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                >
                    <option value="">Any Type</option>
                    <option value="apartment">Apartment</option>
                    <option value="villa">Villa</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="penthouse">Penthouse</option>
                    <option value="office">Office</option>
                    <option value="shop">Shop</option>
                </select>
            </div>

            {/* Sort */}
            <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 uppercase tracking-wide flex items-center gap-1">
                    <ArrowUpDown className="w-3 h-3" /> Sort By
                </label>
                <select
                    className="flex h-10 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={filters.sort}
                    onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                >
                    <option value="newest">Newest First</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                </select>
            </div>

            <Button onClick={handleSearch} className="w-full bg-indigo-600 hover:bg-indigo-700 press-effect" disabled={isPending}>
                {isPending ? 'Searching...' : 'Apply Filters'}
            </Button>
        </div>
    );
}
