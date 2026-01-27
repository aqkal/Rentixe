'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Listing } from '@/types/supabase'
import { MapPin, Bed, Bath, Move, Pencil, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FavoriteButton } from '@/components/favorite-button'
import { DeleteListingModal } from '@/components/delete-listing-modal'

interface ListingCardProps {
    listing: Listing & { image_url?: string }
    isOwner?: boolean
    isAdmin?: boolean
    isFavorite?: boolean
}

export function ListingCard({ listing, isOwner, isAdmin, isFavorite = false }: ListingCardProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)

    const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0,
    }).format(listing.price)

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setShowDeleteModal(true)
    }

    return (
        <>
            <Link href={`/listing/${listing.id}`} className="group block h-full focus-ring rounded-3xl">
                <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm card-lift h-full flex flex-col">
                    {/* Image Section */}
                    <div className="relative h-64 bg-slate-200 overflow-hidden">
                        {listing.image_url ? (
                            <img
                                src={listing.image_url}
                                alt={listing.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-100">
                                No Image
                            </div>
                        )}

                        {/* Overlay Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 border-0 shadow-sm font-bold hover:bg-white">
                                {listing.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                            </Badge>
                            {listing.property_type && (
                                <Badge variant="secondary" className="bg-slate-900/50 backdrop-blur-sm text-white border-0 shadow-sm capitalize hover:bg-slate-900/60">
                                    {listing.property_type.replace('_', ' ')}
                                </Badge>
                            )}
                        </div>

                        {/* Top Right Actions */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            {(isOwner || isAdmin) ? (
                                <>
                                    <Link
                                        href={`/dashboard/edit/${listing.id}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-indigo-600 transition-colors shadow-sm"
                                    >
                                        <Pencil className="w-4 h-4" />
                                    </Link>
                                    <button
                                        onClick={handleDeleteClick}
                                        className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-slate-700 hover:bg-white hover:text-red-600 transition-colors shadow-sm"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </>
                            ) : (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <FavoriteButton listingId={listing.id} initialIsFavorite={isFavorite} />
                                </div>
                            )}
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60" />
                    </div>

                    {/* Content Section */}
                    <div className="p-5 flex flex-col flex-1">
                        <div className="flex justify-between items-start mb-2">
                            <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                                {listing.title}
                            </h3>
                            <div className="text-indigo-600 font-bold whitespace-nowrap">
                                {formattedPrice}
                                {listing.purpose === 'rent' && <span className="text-slate-400 font-normal text-sm">/yr</span>}
                            </div>
                        </div>

                        <div className="flex items-center text-slate-500 text-sm mb-4">
                            <MapPin className="w-4 h-4 mr-1 shrink-0" />
                            <span className="truncate">{listing.area_name}, {listing.city}</span>
                        </div>

                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-slate-500 text-sm">
                            <div className="flex items-center gap-1" title="Bedrooms">
                                <Bed className="w-4 h-4" />
                                <span className="font-medium">{listing.bedrooms || '-'}</span>
                            </div>
                            <div className="w-px h-4 bg-slate-200" />
                            <div className="flex items-center gap-1" title="Bathrooms">
                                <Bath className="w-4 h-4" />
                                <span className="font-medium">{listing.bathrooms || '-'}</span>
                            </div>
                            <div className="w-px h-4 bg-slate-200" />
                            <div className="flex items-center gap-1" title="Area">
                                <Move className="w-4 h-4" />
                                <span className="font-medium">{listing.area_size} <span className="text-xs">sqft</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Delete Confirmation Modal */}
            <DeleteListingModal
                listingId={listing.id}
                listingTitle={listing.title}
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
            />
        </>
    )
}
