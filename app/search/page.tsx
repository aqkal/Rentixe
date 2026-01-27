import { createClient } from "@/lib/supabase/server";
import { ListingCard } from "@/components/listing-card";
import { SearchFilters } from "@/components/search-filters";
import { Listing } from "@/types/supabase";
import ClientMapView from '@/components/client-map-view';

interface SearchPageProps {
    searchParams: Promise<{
        q?: string;
        purpose?: string;
        type?: string;
        minPrice?: string;
        maxPrice?: string;
        sort?: string;
    }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const params = await searchParams;
    const supabase = await createClient();

    // Determine sort order
    let orderColumn = 'created_at';
    let orderAscending = false;

    if (params.sort === 'price_asc') {
        orderColumn = 'price';
        orderAscending = true;
    } else if (params.sort === 'price_desc') {
        orderColumn = 'price';
        orderAscending = false;
    }

    let query = supabase
        .from("listings")
        .select(`*, listing_images(image_url)`)
        .order(orderColumn, { ascending: orderAscending });

    // Apply filters
    if (params.purpose) query = query.eq("purpose", params.purpose);
    if (params.type) query = query.eq("property_type", params.type);
    if (params.minPrice) query = query.gte("price", parseFloat(params.minPrice));
    if (params.maxPrice) query = query.lte("price", parseFloat(params.maxPrice));
    if (params.q) {
        const sanitizedQuery = params.q.replace(/[%_\\]/g, '\\$&');
        query = query.or(`title.ilike.%${sanitizedQuery}%,city.ilike.%${sanitizedQuery}%,area_name.ilike.%${sanitizedQuery}%`);
    }

    const { data: listings } = await query;

    const formattedListings = listings?.map(l => ({
        ...l as Listing,
        image_url: l.listing_images?.[0]?.image_url
    })) || [];


    return (
        <div className="container mx-auto px-4 py-8 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex gap-6 h-full">
                {/* Sidebar Filters */}
                <div className="w-full max-w-[280px] hidden lg:block overflow-y-auto pr-2">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 sticky top-4">
                        <h2 className="font-bold text-lg mb-6 text-slate-900">Filters</h2>
                        <SearchFilters />
                    </div>
                </div>

                {/* Results Area */}
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-center mb-6 pl-2">
                        <h1 className="text-2xl font-bold text-slate-900">{formattedListings.length} Properties Found</h1>
                    </div>
                    <div className="flex-1 flex gap-4 min-h-0">
                        {/* List View */}
                        <div className="flex-1 overflow-y-auto pr-2">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 pb-20">
                                {formattedListings.map(l => (
                                    <ListingCard key={l.id} listing={l} />
                                ))}
                                {formattedListings.length === 0 && (
                                    <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                            <svg className="w-10 h-10 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                            </svg>
                                        </div>
                                        <h3 className="text-xl font-semibold text-slate-900 mb-2">No properties found</h3>
                                        <p className="text-slate-500 max-w-sm">Try adjusting your filters or search for a different location.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Map View Toggle/Split */}
                        <div className="hidden xl:block w-[400px] h-full sticky top-0">
                            <ClientMapView listings={formattedListings} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
