'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { updateListing } from '@/app/dashboard/actions'
import { Loader2, CheckCircle, MapPin, Home, Info } from 'lucide-react'
import { useFormStatus } from 'react-dom'

const MapPicker = dynamic(() => import('@/components/map-picker'), {
    ssr: false,
    loading: () => <div className="h-[300px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">Loading Map...</div>
})

interface EditListingFormProps {
    listing: any
}

function SubmitButton() {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" disabled={pending} className="bg-indigo-600 hover:bg-indigo-700 min-w-[140px]">
            {pending ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
            ) : (
                <><CheckCircle className="w-4 h-4 mr-2" /> Save Changes</>
            )}
        </Button>
    )
}

export default function EditListingForm({ listing }: EditListingFormProps) {
    const router = useRouter()
    const updateListingWithId = updateListing.bind(null, listing.id)
    const [state, formAction] = useActionState(updateListingWithId, null)

    // Pre-fill with existing data
    const [title, setTitle] = useState(listing.title || '')
    const [purpose, setPurpose] = useState(listing.purpose || 'rent')
    const [category, setCategory] = useState(listing.category || 'residential')
    const [propertyType, setPropertyType] = useState(listing.property_type || 'apartment')
    const [price, setPrice] = useState(listing.price?.toString() || '')
    const [bedrooms, setBedrooms] = useState(listing.bedrooms?.toString() || '')
    const [bathrooms, setBathrooms] = useState(listing.bathrooms?.toString() || '')
    const [areaSize, setAreaSize] = useState(listing.area_size?.toString() || '')
    const [furnished, setFurnished] = useState(listing.furnished || false)
    const [description, setDescription] = useState(listing.description || '')
    const [city, setCity] = useState(listing.city || '')
    const [areaName, setAreaName] = useState(listing.area_name || '')
    const [addressText, setAddressText] = useState(listing.address_text || '')
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(
        listing.latitude && listing.longitude
            ? { lat: listing.latitude, lng: listing.longitude }
            : null
    )

    // Handle successful update
    if (state?.success) {
        router.push('/dashboard')
        return null
    }

    return (
        <form action={formAction}>
            {/* Hidden inputs for form submission */}
            <input type="hidden" name="latitude" value={location?.lat || ''} />
            <input type="hidden" name="longitude" value={location?.lng || ''} />
            <input type="hidden" name="title" value={title} />
            <input type="hidden" name="purpose" value={purpose} />
            <input type="hidden" name="category" value={category} />
            <input type="hidden" name="property_type" value={propertyType} />
            <input type="hidden" name="price" value={price} />
            <input type="hidden" name="bedrooms" value={bedrooms} />
            <input type="hidden" name="bathrooms" value={bathrooms} />
            <input type="hidden" name="area_size" value={areaSize} />
            <input type="hidden" name="furnished" value={furnished ? 'on' : 'off'} />
            <input type="hidden" name="description" value={description} />
            <input type="hidden" name="city" value={city} />
            <input type="hidden" name="area_name" value={areaName} />
            <input type="hidden" name="address_text" value={addressText} />

            {state?.error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl flex items-center gap-2">
                    <Info className="w-5 h-5 shrink-0" />
                    <span className="font-medium">{state.error}</span>
                </div>
            )}

            <div className="space-y-6">
                {/* Basic Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Home className="text-indigo-600" /> Basic Info</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Listing Title</label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Luxury Villa in Palm Jumeirah" required />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Purpose</label>
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button type="button" onClick={() => setPurpose('rent')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${purpose === 'rent' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Rent</button>
                                    <button type="button" onClick={() => setPurpose('sale')} className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${purpose === 'sale' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500'}`}>Sale</button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm"
                                    value={category}
                                    onChange={e => setCategory(e.target.value)}
                                >
                                    <option value="residential">Residential</option>
                                    <option value="commercial">Commercial</option>
                                    <option value="land">Land</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Property Type</label>
                                <select
                                    className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm"
                                    value={propertyType}
                                    onChange={e => setPropertyType(e.target.value)}
                                >
                                    <option value="apartment">Apartment</option>
                                    <option value="villa">Villa</option>
                                    <option value="townhouse">Townhouse</option>
                                    <option value="penthouse">Penthouse</option>
                                    <option value="office">Office</option>
                                    <option value="shop">Shop</option>
                                    <option value="warehouse">Warehouse</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price (AED)</label>
                                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="e.g. 150000" required />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Property Details */}
                <Card>
                    <CardHeader>
                        <CardTitle>Property Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bedrooms</label>
                                <Input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Bathrooms</label>
                                <Input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} placeholder="0" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Area (sqft)</label>
                                <Input type="number" value={areaSize} onChange={e => setAreaSize(e.target.value)} placeholder="e.g. 1500" />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="furnished"
                                checked={furnished}
                                onChange={e => setFurnished(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor="furnished" className="text-sm font-medium">Furnished</label>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                className="flex min-h-[120px] w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Describe your property..."
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Location */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><MapPin className="text-indigo-600" /> Location</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">City</label>
                                <Input value={city} onChange={e => setCity(e.target.value)} placeholder="e.g. Dubai" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Area/Neighborhood</label>
                                <Input value={areaName} onChange={e => setAreaName(e.target.value)} placeholder="e.g. Marina" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Address</label>
                            <Input value={addressText} onChange={e => setAddressText(e.target.value)} placeholder="Full address..." />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Pin Location on Map</label>
                            <MapPicker
                                onLocationSelect={(lat, lng) => setLocation({ lat, lng })}
                                initialLat={location?.lat}
                                initialLng={location?.lng}
                            />
                            {location && (
                                <p className="text-xs text-slate-500">
                                    Selected: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                                </p>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <SubmitButton />
                    </CardFooter>
                </Card>
            </div>
        </form>
    )
}
