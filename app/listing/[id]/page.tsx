import { createClient, createAdminClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MapPin, Bed, Bath, Move, Phone, MessageCircle, Share2, ChevronLeft, Check } from "lucide-react";
import ClientMapView from '@/components/client-map-view';
import { Listing } from "@/types/supabase";
import Link from "next/link";

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const adminSupabase = await createAdminClient();

    // Fetch listing with images (Public RLS)
    const { data: listingData, error } = await supabase
        .from("listings")
        .select(`
      *,
      listing_images(image_url)
    `)
        .eq("id", id)
        .single();

    if (error || !listingData) {
        console.error('Listing fetch error:', error);
        notFound();
    }

    const listing = listingData as any;
    const images = listing.listing_images?.map((img: any) => img.image_url) || [];

    // Fetch owner profile (Bypass RLS using Admin Client)
    let owner = { full_name: 'Agent', phone: '', role: 'Agent' };
    if (listing.user_id) {
        const { data: profile } = await adminSupabase
            .from('profiles')
            .select('full_name, phone, role')
            .eq('id', listing.user_id)
            .single();

        if (profile) {
            owner = {
                full_name: profile.full_name || 'Agent',
                phone: profile.phone || '',
                role: profile.role || 'Agent'
            };
        }
    }

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(listing.price);

    const features = [
        listing.furnished && 'Furnished',
        listing.bedrooms && `${listing.bedrooms} Bedrooms`,
        listing.bathrooms && `${listing.bathrooms} Bathrooms`,
        listing.area_size && `${listing.area_size} sqft`,
    ].filter(Boolean);

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-slate-100">
                <div className="container mx-auto px-4 py-3">
                    <Link href="/search" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-indigo-600 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                        Back to Search
                    </Link>
                </div>
            </div>

            <div className="container mx-auto px-4 py-6">
                {/* Image Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 h-[300px] md:h-[480px] mb-8 rounded-2xl overflow-hidden">
                    {/* Main Image */}
                    <div className="md:col-span-2 md:row-span-2 relative group">
                        {images[0] ? (
                            <img src={images[0]} className="w-full h-full object-cover" alt={listing.title} />
                        ) : (
                            <div className="w-full h-full bg-slate-200 flex items-center justify-center text-slate-400">No Image</div>
                        )}
                    </div>
                    {/* Smaller Images */}
                    {images.slice(1, 5).map((img: string, i: number) => (
                        <div key={i} className="relative hidden md:block bg-slate-100">
                            <img src={img} className="w-full h-full object-cover" alt={`Gallery ${i + 1}`} />
                            {i === 3 && images.length > 5 && (
                                <button className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold text-lg hover:bg-black/70 transition-colors">
                                    +{images.length - 5} Photos
                                </button>
                            )}
                        </div>
                    ))}
                    {/* Placeholders for missing images */}
                    {Array.from({ length: Math.max(0, 4 - images.slice(1, 5).length) }).map((_, i) => (
                        <div key={`placeholder-${i}`} className="hidden md:block bg-slate-100" />
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Header */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {listing.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                                </span>
                                <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-semibold capitalize">
                                    {listing.property_type?.replace('_', ' ')}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">{listing.title}</h1>

                            <div className="flex items-center text-slate-500 mb-4">
                                <MapPin className="w-4 h-4 mr-1.5 text-indigo-500 shrink-0" />
                                <span>{[listing.address_text, listing.area_name, listing.city].filter(Boolean).join(', ')}</span>
                            </div>

                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-bold gradient-text">{formattedPrice}</span>
                                {listing.purpose === 'rent' && <span className="text-slate-400">/ year</span>}
                            </div>
                        </div>

                        {/* Key Features */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Key Features</h2>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center p-4 bg-slate-50 rounded-xl">
                                    <Bed className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                                    <div className="font-bold text-xl text-slate-900">{listing.bedrooms || '-'}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Bedrooms</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-xl">
                                    <Bath className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                                    <div className="font-bold text-xl text-slate-900">{listing.bathrooms || '-'}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Bathrooms</div>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-xl">
                                    <Move className="w-6 h-6 mx-auto mb-2 text-indigo-500" />
                                    <div className="font-bold text-xl text-slate-900">{listing.area_size || '-'}</div>
                                    <div className="text-xs text-slate-500 uppercase tracking-wide">Sqft</div>
                                </div>
                            </div>

                            {/* Amenities */}
                            {listing.furnished && (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span>Fully Furnished</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {listing.description && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h2 className="text-lg font-bold text-slate-900 mb-4">Description</h2>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                                    {listing.description}
                                </p>
                            </div>
                        )}

                        {/* Location Map */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <h2 className="text-lg font-bold text-slate-900 mb-4">Location</h2>
                            <div className="h-[300px] rounded-xl overflow-hidden border border-slate-200">
                                <ClientMapView listings={[listing]} />
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Contact Card (Desktop) */}
                    <div className="hidden lg:block">
                        <div className="sticky top-24 space-y-4">
                            <div className="p-6 bg-white border border-slate-100 rounded-2xl shadow-lg">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {owner.full_name?.[0] || 'A'}
                                    </div>
                                    <div>
                                        <div className="font-bold text-lg text-slate-900">{owner.full_name || 'Agent'}</div>
                                        <div className="text-slate-500 text-sm capitalize">{owner.role || 'Listing Agent'}</div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <a href={`https://wa.me/${owner.phone?.replace(/\+/g, '')}`} target="_blank" rel="noreferrer" className="block">
                                        <Button className="w-full h-12 bg-green-500 hover:bg-green-600 gap-2 text-base font-semibold press-effect">
                                            <MessageCircle className="w-5 h-5" /> WhatsApp
                                        </Button>
                                    </a>
                                    <a href={`tel:${owner.phone}`} className="block">
                                        <Button variant="outline" className="w-full h-12 gap-2 border-slate-200 text-base press-effect">
                                            <Phone className="w-5 h-5" /> Call Agent
                                        </Button>
                                    </a>
                                </div>
                            </div>

                            <Button variant="ghost" className="w-full gap-2 text-slate-500 hover:text-slate-700">
                                <Share2 className="w-4 h-4" /> Share this Property
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Sticky CTA */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 lg:hidden z-50">
                <div className="flex gap-3 max-w-lg mx-auto">
                    <a href={`https://wa.me/${owner.phone?.replace(/\+/g, '')}`} target="_blank" rel="noreferrer" className="flex-1">
                        <Button className="w-full h-12 bg-green-500 hover:bg-green-600 gap-2 font-semibold press-effect">
                            <MessageCircle className="w-5 h-5" /> WhatsApp
                        </Button>
                    </a>
                    <a href={`tel:${owner.phone}`} className="flex-1">
                        <Button variant="outline" className="w-full h-12 gap-2 border-slate-200 font-semibold press-effect">
                            <Phone className="w-5 h-5" /> Call
                        </Button>
                    </a>
                </div>
            </div>

            {/* Spacer for mobile sticky CTA */}
            <div className="h-24 lg:hidden" />
        </div>
    );
}
