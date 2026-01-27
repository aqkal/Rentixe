'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function createListing(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to create a listing' }
    }

    // Extract data
    const title = formData.get('title') as string
    const purpose = formData.get('purpose') as string
    const category = formData.get('category') as string
    const property_type = formData.get('property_type') as string
    const price = parseFloat(formData.get('price') as string)
    const description = formData.get('description') as string
    const bedrooms = formData.get('bedrooms') ? parseInt(formData.get('bedrooms') as string) : null
    const bathrooms = formData.get('bathrooms') ? parseInt(formData.get('bathrooms') as string) : null
    const area_size = formData.get('area_size') ? parseFloat(formData.get('area_size') as string) : null
    const furnished = formData.get('furnished') === 'on'
    const city = formData.get('city') as string
    const area_name = formData.get('area_name') as string
    const address_text = formData.get('address_text') as string
    const lat = parseFloat(formData.get('latitude') as string)
    const lng = parseFloat(formData.get('longitude') as string)

    // Image URLs (passed as hidden inputs from client upload)
    // We expect multiple 'image_urls' entries
    const imageUrls = formData.getAll('image_urls') as string[]

    if (!title || !purpose || !price || !lat || !lng || imageUrls.length === 0) {
        return { error: 'Please fill in all required fields and upload at least one image.' }
    }

    // Insert Listing
    const { data: listing, error: listingError } = await supabase
        .from('listings')
        .insert({
            user_id: user.id,
            title,
            description,
            purpose,
            category,
            property_type,
            price,
            bedrooms,
            bathrooms,
            area_size,
            furnished,
            city,
            area_name,
            address_text,
            latitude: lat,
            longitude: lng
        })
        .select()
        .single()

    if (listingError) {
        return { error: listingError.message }
    }

    // Insert Images
    const imageInserts = imageUrls.map((url, index) => ({
        listing_id: listing.id,
        image_url: url,
        is_cover: index === 0, // First image is cover
        sort_order: index
    }))

    const { error: imagesError } = await supabase
        .from('listing_images')
        .insert(imageInserts)

    if (imagesError) {
        // Optional: delete listing if images fail? Or just warn.
        return { error: 'Listing created but image link failed: ' + imagesError.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/search')
    redirect('/dashboard')
}
