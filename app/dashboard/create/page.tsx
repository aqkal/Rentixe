'use client'

import { useActionState, useState } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { createListing } from './actions'
import { Loader2, Upload, X, CheckCircle, MapPin, Home, Info, Image as ImageIcon } from 'lucide-react'
import { useFormStatus } from 'react-dom'

// Dynamically import MapPicker to avoid window is not defined error
const MapPicker = dynamic(() => import('@/components/map-picker'), {
    ssr: false,
    loading: () => <div className="h-[400px] w-full bg-slate-100 animate-pulse rounded-xl flex items-center justify-center text-muted-foreground">Loading Map...</div>
})


export default function CreateListingPage() {
    const supabase = createClient()
    const [step, setStep] = useState(1)

    // Global Form State
    const [images, setImages] = useState<File[]>([])
    const [imageUrls, setImageUrls] = useState<string[]>([])
    const [uploading, setUploading] = useState(false)
    const [location, setLocation] = useState<{ lat: number, lng: number } | null>(null)

    // Inputs
    const [title, setTitle] = useState('')
    const [purpose, setPurpose] = useState('rent')
    const [category, setCategory] = useState('residential')
    const [propertyType, setPropertyType] = useState('apartment')
    const [price, setPrice] = useState('')
    const [bedrooms, setBedrooms] = useState('')
    const [bathrooms, setBathrooms] = useState('')
    const [areaSize, setAreaSize] = useState('')
    const [furnished, setFurnished] = useState(false)
    const [description, setDescription] = useState('')
    const [city, setCity] = useState('')
    const [areaName, setAreaName] = useState('')
    const [addressText, setAddressText] = useState('')

    const router = useRouter()
    const [state, formAction] = useActionState(createListing, null)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return
        setUploading(true)
        const newFiles = Array.from(e.target.files)
        setImages(prev => [...prev, ...newFiles])

        const newUrls: string[] = []
        for (const file of newFiles) {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`
            const filePath = `${fileName}`

            const { data, error } = await supabase.storage
                .from('listing-images')
                .upload(filePath, file)

            if (error) {
                console.error('Upload error:', error)
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('listing-images')
                    .getPublicUrl(filePath)
                newUrls.push(publicUrl)
            }
        }
        setImageUrls(prev => [...prev, ...newUrls])
        setUploading(false)
    }

    const removeImage = (index: number) => {
        setImageUrls(prev => prev.filter((_, i) => i !== index))
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const StepIndicator = ({ current, total }: { current: number, total: number }) => (
        <div className="flex items-center justify-center space-x-2 mb-8">
            {Array.from({ length: total }).map((_, i) => (
                <div key={i} className={`h-2.5 w-2.5 rounded-full transition-colors duration-300 ${i + 1 <= current ? 'bg-indigo-600' : 'bg-slate-200'}`} />
            ))}
        </div>
    )

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <StepIndicator current={step} total={4} />

            <form action={formAction}>
                {/* 
                   HIDDEN INPUTS - The Secret Sauce 
                   These ensure all data is submitted regardless of which Step UI is visible.
                */}
                <input type="hidden" name="latitude" value={location?.lat || ''} />
                <input type="hidden" name="longitude" value={location?.lng || ''} />
                {imageUrls.map((url, i) => (
                    <input key={i} type="hidden" name="image_urls" value={url} />
                ))}

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

                {step === 1 && (
                    <Card className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Home className="text-indigo-600" /> Basic Info</CardTitle>
                            <CardDescription>Let's start with the basics of your property.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Listing Title</label>
                                <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Luxury Apartment in South Mumbai" required />
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
                                        className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="residential">Residential</option>
                                        <option value="commercial">Commercial</option>
                                        <option value="land">Land</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Property Type</label>
                                <select
                                    className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    value={propertyType}
                                    onChange={e => setPropertyType(e.target.value)}
                                >
                                    {category === 'residential' && (
                                        <>
                                            <option value="apartment">Apartment</option>
                                            <option value="villa">Villa</option>
                                            <option value="townhouse">Townhouse</option>
                                            <option value="penthouse">Penthouse</option>
                                        </>
                                    )}
                                    {category === 'commercial' && (
                                        <>
                                            <option value="office">Office</option>
                                            <option value="shop">Shop</option>
                                            <option value="warehouse">Warehouse</option>
                                        </>
                                    )}
                                    {category === 'land' && (
                                        <>
                                            <option value="residential_plot">Residential Plot</option>
                                            <option value="commercial_plot">Commercial Plot</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Price (AED)</label>
                                <Input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="0" required />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                            <Button type="button" onClick={() => setStep(2)}>Next Step</Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 2 && (
                    <Card className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Info className="text-indigo-600" /> Property Details</CardTitle>
                            <CardDescription>Tell us more about the features.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {category === 'residential' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Bedrooms</label>
                                        <Input type="number" value={bedrooms} onChange={e => setBedrooms(e.target.value)} placeholder="2" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Bathrooms</label>
                                        <Input type="number" value={bathrooms} onChange={e => setBathrooms(e.target.value)} placeholder="2" />
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Area Size (sqft)</label>
                                <Input type="number" value={areaSize} onChange={e => setAreaSize(e.target.value)} placeholder="1200" required />
                            </div>

                            {(category === 'residential' || category === 'commercial') && (
                                <div className="flex items-center space-x-2 pt-2">
                                    <input
                                        type="checkbox"
                                        id="furnished"
                                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                        checked={furnished}
                                        onChange={e => setFurnished(e.target.checked)}
                                    />
                                    <label htmlFor="furnished" className="text-sm font-medium">Furnished</label>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    className="flex min-h-[100px] w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Describe the property..."
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                            <Button type="button" onClick={() => setStep(3)}>Next Step</Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 3 && (
                    <Card className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><MapPin className="text-indigo-600" /> Location</CardTitle>
                            <CardDescription>Pin the exact location on the map.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">City</label>
                                    <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Mumbai" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Area / Neighborhood</label>
                                    <Input value={areaName} onChange={e => setAreaName(e.target.value)} placeholder="e.g. Bandra West" required />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Full Address</label>
                                <Input value={addressText} onChange={e => setAddressText(e.target.value)} placeholder="Building Name, Street..." />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Pin Location (Required)</label>
                                <MapPicker onLocationSelect={(lat, lng) => setLocation({ lat, lng })} />
                                {location ? (
                                    <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Location Selected</p>
                                ) : (
                                    <p className="text-xs text-red-500">* Please click on map to select location</p>
                                )}
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                            <Button type="button" onClick={() => setStep(4)} disabled={!location}>Next Step</Button>
                        </CardFooter>
                    </Card>
                )}

                {step === 4 && (
                    <Card className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ImageIcon className="text-indigo-600" /> Photos</CardTitle>
                            <CardDescription>Upload high quality images (First image will be cover).</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                                {imageUrls.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group">
                                        <img src={url} className="w-full h-full object-cover" alt="Uploaded" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {index === 0 && <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">Cover</span>}
                                    </div>
                                ))}
                                <label className="border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-colors aspect-square">
                                    {uploading ? <Loader2 className="w-6 h-6 animate-spin text-indigo-500" /> : <Upload className="w-6 h-6 text-slate-400" />}
                                    <span className="text-xs text-slate-500 mt-2 font-medium">Upload</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                            {imageUrls.length === 0 && <p className="text-sm text-red-500">* At least 1 image is required</p>}
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button type="button" variant="outline" onClick={() => setStep(3)}>Back</Button>
                            <SubmitButton disabled={imageUrls.length === 0 || uploading} />
                        </CardFooter>
                    </Card>
                )}
            </form>
        </div>
    )
}

function SubmitButton({ disabled }: { disabled: boolean }) {
    const { pending } = useFormStatus()
    return (
        <Button type="submit" className="bg-gradient-to-r from-indigo-500 to-purple-600 w-32" disabled={disabled || pending}>
            {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Publish Listing'}
        </Button>
    )
}
