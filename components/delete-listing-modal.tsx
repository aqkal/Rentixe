'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, AlertTriangle, X } from 'lucide-react'
import { deleteListing } from '@/app/dashboard/actions'
import { useRouter } from 'next/navigation'

interface DeleteListingModalProps {
    listingId: string
    listingTitle: string
    isOpen: boolean
    onClose: () => void
}

export function DeleteListingModal({ listingId, listingTitle, isOpen, onClose }: DeleteListingModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    if (!isOpen) return null

    const handleDelete = async () => {
        setIsDeleting(true)
        setError(null)

        const result = await deleteListing(listingId)

        if (result.error) {
            setError(result.error)
            setIsDeleting(false)
        } else {
            onClose()
            router.refresh()
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 p-6 animate-in zoom-in-95 fade-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Listing?</h2>

                    <p className="text-slate-500 mb-2">
                        Are you sure you want to delete
                    </p>
                    <p className="font-semibold text-slate-900 mb-4 line-clamp-2">
                        "{listingTitle}"
                    </p>

                    <p className="text-sm text-slate-400 mb-6">
                        This action cannot be undone. All images and data will be permanently removed.
                    </p>

                    {error && (
                        <div className="w-full bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3 w-full">
                        <Button
                            variant="outline"
                            className="flex-1"
                            onClick={onClose}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                'Delete'
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
