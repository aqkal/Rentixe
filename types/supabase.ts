export type Profile = {
    id: string
    full_name: string | null
    phone: string | null
    role: 'user' | 'admin'
    created_at: string
}

export type Listing = {
    id: string
    user_id: string
    title: string
    description: string | null
    purpose: 'rent' | 'sale'
    category: 'residential' | 'commercial' | 'land'
    property_type: string
    price: number
    currency: string
    bedrooms: number | null
    bathrooms: number | null
    area_size: number | null
    area_unit: string
    furnished: boolean | null
    city: string | null
    area_name: string | null
    address_text: string | null
    latitude: number
    longitude: number
    created_at: string
}

export type ListingImage = {
    id: string
    listing_id: string
    image_url: string
    is_cover: boolean
    sort_order: number
    created_at: string
}

export type Favorite = {
    user_id: string
    listing_id: string
    created_at: string
}
