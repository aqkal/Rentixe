'use client';

import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix Leaflet default icon issue in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
    onLocationSelect: (lat: number, lng: number) => void;
    initialLat?: number;
    initialLng?: number;
}

function LocationMarker({ onSelect, initialPosition }: { onSelect: (lat: number, lng: number) => void, initialPosition?: [number, number] }) {
    const [position, setPosition] = useState<L.LatLng | null>(initialPosition ? new L.LatLng(initialPosition[0], initialPosition[1]) : null);

    const map = useMapEvents({
        click(e) {
            setPosition(e.latlng);
            onSelect(e.latlng.lat, e.latlng.lng);
            map.flyTo(e.latlng, map.getZoom());
        },
    });

    // If initial position is provided, fly to it once
    useEffect(() => {
        if (initialPosition) {
            map.setView(initialPosition, 13);
        }
    }, [initialPosition, map]);

    return position === null ? null : (
        <Marker position={position} />
    );
}

export default function MapPicker({ onLocationSelect, initialLat = 19.0760, initialLng = 72.8777 }: MapPickerProps) {
    // Default to Mumbai coordinates
    return (
        <div className="h-[400px] w-full rounded-xl overflow-hidden border border-slate-200 z-0">
            <MapContainer
                center={[initialLat, initialLng]}
                zoom={11}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker onSelect={onLocationSelect} initialPosition={initialLat !== 25.2048 ? [initialLat, initialLng] : undefined} />
            </MapContainer>
            <div className="text-xs text-muted-foreground mt-2 text-center">
                Click on the map to pin the exact location
            </div>
        </div>
    );
}
