'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteListing(listingId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to delete a listing' }
    }

    // Verify ownership or admin status
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    const { data: listing } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single()

    if (!listing) {
        return { error: 'Listing not found' }
    }

    const isOwner = listing.user_id === user.id
    const isAdmin = profile?.role === 'admin'

    if (!isOwner && !isAdmin) {
        return { error: 'You do not have permission to delete this listing' }
    }

    // Delete images from storage (get URLs first)
    const { data: images } = await supabase
        .from('listing_images')
        .select('image_url')
        .eq('listing_id', listingId)

    // Delete image records
    await supabase
        .from('listing_images')
        .delete()
        .eq('listing_id', listingId)

    // Delete favorites referencing this listing
    await supabase
        .from('favorites')
        .delete()
        .eq('listing_id', listingId)

    // Delete the listing
    const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId)

    if (error) {
        return { error: error.message }
    }

    // Delete actual files from storage
    if (images && images.length > 0) {
        const filePaths = images
            .map(img => {
                // Extract path from URL: .../storage/v1/object/public/listing-images/PATH
                const match = img.image_url.match(/listing-images\/(.+)$/)
                return match ? match[1] : null
            })
            .filter(Boolean) as string[]

        if (filePaths.length > 0) {
            await supabase.storage.from('listing-images').remove(filePaths)
        }
    }

    revalidatePath('/dashboard')
    revalidatePath('/search')
    revalidatePath('/favorites')

    return { success: true }
}

export async function updateListing(listingId: string, prevState: any, formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'You must be logged in to update a listing' }
    }

    // Verify ownership
    const { data: listing } = await supabase
        .from('listings')
        .select('user_id')
        .eq('id', listingId)
        .single()

    if (!listing || listing.user_id !== user.id) {
        return { error: 'You do not have permission to edit this listing' }
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

    if (!title || !purpose || !price || !lat || !lng) {
        return { error: 'Please fill in all required fields.' }
    }

    // Update Listing
    const { error: updateError } = await supabase
        .from('listings')
        .update({
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
            longitude: lng,
            currency: 'INR',
            updated_at: new Date().toISOString()
        })
        .eq('id', listingId)

    if (updateError) {
        return { error: updateError.message }
    }

    revalidatePath('/dashboard')
    revalidatePath('/search')
    revalidatePath(`/listing/${listingId}`)

    return { success: true }
}
