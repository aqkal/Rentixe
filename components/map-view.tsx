'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Listing } from '@/types/supabase';
import Link from 'next/link';

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
    listings: (Listing & { image_url?: string })[];
}

export default function MapView({ listings }: MapViewProps) {
    // Calculate center
    const centerLat = listings.length > 0 ? listings.reduce((sum, l) => sum + l.latitude, 0) / listings.length : 25.2048;
    const centerLng = listings.length > 0 ? listings.reduce((sum, l) => sum + l.longitude, 0) / listings.length : 55.2708;

    return (
        <div className="h-full w-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200 z-0">
            <MapContainer
                center={[centerLat, centerLng]}
                zoom={11}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {listings.map((listing) => (
                    <Marker key={listing.id} position={[listing.latitude, listing.longitude]}>
                        <Popup>
                            <div className="w-48">
                                <div className="relative h-24 w-full bg-slate-200 rounded-md overflow-hidden mb-2">
                                    {listing.image_url && <img src={listing.image_url} className="w-full h-full object-cover" />}
                                </div>
                                <h4 className="font-bold text-sm truncate">{listing.title}</h4>
                                <p className="text-indigo-600 font-semibold text-sm">{listing.price.toLocaleString()} {listing.currency}</p>
                                <Link href={`/listing/${listing.id}`} className="text-xs text-blue-500 hover:underline block mt-1">View Details</Link>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
