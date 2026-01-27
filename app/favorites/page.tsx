import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ListingCard } from "@/components/listing-card";
import { Listing } from "@/types/supabase";
import { Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function FavoritesPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const { data: favorites } = await supabase
        .from("favorites")
        .select(`
      listing_id,
      listings (
        *,
        listing_images (image_url)
      )
    `)
        .eq("user_id", user.id);

    // Transform data
    const listings = favorites?.map((f: any) => ({
        ...f.listings,
        image_url: f.listings.listing_images?.[0]?.image_url
    })).filter((l: any) => l && l.id) || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Favorites</h1>
                    <p className="text-slate-500">{listings.length} saved properties</p>
                </div>
            </div>

            {listings.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="w-10 h-10 text-slate-400" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-700 mb-2">No favorites yet</h3>
                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">
                        Start exploring properties and save your favorites by clicking the heart icon.
                    </p>
                    <Link href="/search">
                        <Button className="bg-indigo-600 hover:bg-indigo-700 gap-2">
                            <Search className="w-4 h-4" /> Browse Properties
                        </Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {listings.map((l: any) => (
                        <ListingCard key={l.id} listing={l} isFavorite={true} />
                    ))}
                </div>
            )}
        </div>
    );
}
