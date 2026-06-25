import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const SingleViewSkeleton = () => {
    return (
        <div className="space-y-8 px-48 max-[1000px]:px-0 py-4 w-full">
            {/* Navbar */}
            <div className="flex justify-between items-center">
                <Skeleton className="w-36 h-10" /> {/* Logo */}
                <Skeleton className="rounded-full w-10 h-10" /> {/* Login Button or Avatar */}
            </div>

            {/* Hero Section */}
            <div className="relative space-y-4">
                <Skeleton className="rounded-xl w-full h-[70vh] max-[1000px]:h-[30vh]" /> {/* Hero Image */}
                <div className="bottom-4 left-4 absolute space-y-2">
                    <Skeleton className="w-1/2 h-8" /> {/* Title */}
                    <Skeleton className="w-32 h-6" /> {/* Rating */}
                </div>
            </div>

            {/* Image Selection (Mobile) */}
            <div className="flex space-x-4">
                <Skeleton className="rounded-lg w-24 h-16" />
                <Skeleton className="rounded-lg w-24 h-16" />
                <Skeleton className="rounded-lg w-24 h-16" />
            </div>

            {/* Property Details */}
            <div className="space-y-4">
                <Skeleton className="w-1/3 h-8" /> {/* Section Title */}
                <Skeleton className="w-full h-6" /> {/* Paragraph */}
                <Skeleton className="w-3/4 h-6" /> {/* Paragraph */}
            </div>

            {/* Reviews Section */}
            <div className="space-y-4">
                <Skeleton className="w-1/4 h-8" /> {/* Section Title */}
                <div className="space-y-2">
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                    <Skeleton className="w-full h-10" />
                </div>
            </div>
        </div>
    );
};

export default SingleViewSkeleton;
