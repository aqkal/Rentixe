import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { Listing } from "@/types/supabase";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch listings with their cover image
    const { data: listings, error } = await supabase
        .from("listings")
        .select(`
      *,
      listing_images(image_url)
    `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    // Transform data to get first image as cover
    const formattedListings = listings?.map(l => ({
        ...l as Listing,
        image_url: l.listing_images?.[0]?.image_url
    })) || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Dashboard</h1>
                    <p className="text-muted-foreground mt-1">Manage your properties and account</p>
                </div>
                <Link href="/dashboard/create">
                    <Button className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-200">
                        <PlusCircle className="mr-2 h-4 w-4" /> Create Listing
                    </Button>
                </Link>
            </div>

            {formattedListings.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <h3 className="text-xl font-bold text-slate-700">No Listings Yet</h3>
                    <p className="text-slate-500 mt-2">Start by creating your first property listing.</p>
                    <Link href="/dashboard/create" className="mt-6 inline-block">
                        <Button variant="outline">Create Listing</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {formattedListings.map((listing) => (
                        <ListingCard
                            key={listing.id}
                            listing={listing}
                            isOwner={true}
                        // onDelete={handleDelete} // Need client interactive part for delete
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
