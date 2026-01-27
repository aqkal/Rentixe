import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import EditListingForm from "./index"

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    // Fetch listing with images
    const { data: listing, error } = await supabase
        .from('listings')
        .select(`
            *,
            listing_images(id, image_url, is_cover, sort_order)
        `)
        .eq('id', id)
        .single()

    if (error || !listing) {
        notFound()
    }

    // Verify ownership
    if (listing.user_id !== user.id) {
        redirect('/dashboard')
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <h1 className="text-3xl font-bold text-slate-900 mb-8">Edit Listing</h1>
            <EditListingForm listing={listing} />
        </div>
    )
}
