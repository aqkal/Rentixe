'use client'

import { Skeleton, SkeletonText } from "@/components/ui/skeleton"

export function ListingCardSkeleton() {
    return (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm h-full flex flex-col">
            {/* Image Skeleton */}
            <div className="relative h-64 skeleton" />

            {/* Content Skeleton */}
            <div className="p-5 flex flex-col flex-1 space-y-4">
                {/* Title and Price */}
                <div className="flex justify-between items-start gap-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-6 w-20" />
                </div>

                {/* Location */}
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Stats */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-16" />
                </div>
            </div>
        </div>
    )
}

export function ListingCardSkeletonGrid({ count = 6 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <ListingCardSkeleton key={i} />
            ))}
        </>
    )
}
