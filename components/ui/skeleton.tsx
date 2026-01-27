import { cn } from "@/lib/utils"

interface SkeletonProps {
    className?: string
}

export function Skeleton({ className }: SkeletonProps) {
    return (
        <div className={cn("skeleton", className)} />
    )
}

// Pre-built skeleton variants for common use cases

export function SkeletonText({ className, lines = 1 }: SkeletonProps & { lines?: number }) {
    return (
        <div className={cn("space-y-2", className)}>
            {Array.from({ length: lines }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "skeleton h-4",
                        i === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
                    )}
                />
            ))}
        </div>
    )
}

export function SkeletonAvatar({ className, size = "md" }: SkeletonProps & { size?: "sm" | "md" | "lg" }) {
    const sizeClasses = {
        sm: "w-8 h-8",
        md: "w-12 h-12",
        lg: "w-16 h-16"
    }

    return (
        <div className={cn("skeleton rounded-full", sizeClasses[size], className)} />
    )
}

export function SkeletonImage({ className, aspectRatio = "video" }: SkeletonProps & { aspectRatio?: "video" | "square" | "portrait" }) {
    const aspectClasses = {
        video: "aspect-video",
        square: "aspect-square",
        portrait: "aspect-[3/4]"
    }

    return (
        <div className={cn("skeleton w-full", aspectClasses[aspectRatio], className)} />
    )
}

export function SkeletonButton({ className }: SkeletonProps) {
    return (
        <div className={cn("skeleton h-10 w-24 rounded-xl", className)} />
    )
}
