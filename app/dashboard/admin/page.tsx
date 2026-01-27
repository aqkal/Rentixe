import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building2, DollarSign, Activity } from "lucide-react";
import { ListingCard } from "@/components/listing-card";
import { Listing } from "@/types/supabase";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Check role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

    if (profile?.role !== 'admin') {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Activity className="w-10 h-10 text-red-500" />
                </div>
                <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
                <p className="text-slate-500">You do not have permission to view this page.</p>
            </div>
        )
    }

    // Fetch Stats
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: listingCount } = await supabase.from('listings').select('*', { count: 'exact', head: true });

    // Fetch all listings for moderation
    const { data: listings } = await supabase
        .from('listings')
        .select(`*, listing_images(image_url)`)
        .order('created_at', { ascending: false })
        .limit(20);

    const formattedListings = listings?.map(l => ({
        ...l as Listing,
        image_url: l.listing_images?.[0]?.image_url
    })) || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-slate-900">Admin Dashboard</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-indigo-100">Total Users</CardTitle>
                        <Users className="w-4 h-4 text-indigo-100" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{userCount || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Active Listings</CardTitle>
                        <Building2 className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">{listingCount || 0}</div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Revenue</CardTitle>
                        <DollarSign className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-900">$0.00</div>
                    </CardContent>
                </Card>
                <Card className="bg-white border-slate-200 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">System Status</CardTitle>
                        <Activity className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">Healthy</div>
                    </CardContent>
                </Card>
            </div>

            {/* Listing Moderation */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-6">All Listings (Moderation)</h2>
                <p className="text-slate-500 text-sm mb-6">
                    As an admin, you can delete any listing by clicking the trash icon.
                </p>

                {formattedListings.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        No listings to moderate.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {formattedListings.map(listing => (
                            <ListingCard
                                key={listing.id}
                                listing={listing}
                                isAdmin={true}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
