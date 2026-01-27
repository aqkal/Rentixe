'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export function FavoriteButton({ listingId, initialIsFavorite }: { listingId: string, initialIsFavorite: boolean }) {
    const supabase = createClient();
    const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggleFavorite = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        setLoading(true);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }

        // Toggle UI immediately (optimistic)
        const newState = !isFavorite;
        setIsFavorite(newState);

        try {
            if (newState) {
                await supabase.from('favorites').insert({ user_id: user.id, listing_id: listingId });
            } else {
                await supabase.from('favorites').delete().match({ user_id: user.id, listing_id: listingId });
            }
        } catch (error) {
            // Revert on error
            setIsFavorite(!newState);
            console.error('Favorite toggle failed:', error);
        } finally {
            setLoading(false);
        }

        router.refresh();
    };

    return (
        <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-white/80 backdrop-blur-sm hover:bg-white text-rose-500 hover:text-rose-600 shadow-sm"
            onClick={toggleFavorite}
            disabled={loading}
        >
            <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
    );
}
