'use client';

import dynamic from 'next/dynamic';
import { Listing } from '@/types/supabase';

// Dynamically load the actual MapView component with SSR disabled
const MapViewElement = dynamic(() => import('@/components/map-view'), {
    ssr: false,
    loading: () => (
        <div className="h-full w-full bg-slate-100 animate-pulse flex items-center justify-center text-muted-foreground rounded-xl">
            Loading Map...
        </div>
    ),
});

interface ClientMapViewProps {
    listings: (Listing & { image_url?: string })[];
}

export default function ClientMapView({ listings }: ClientMapViewProps) {
    return <MapViewElement listings={listings} />;
}
