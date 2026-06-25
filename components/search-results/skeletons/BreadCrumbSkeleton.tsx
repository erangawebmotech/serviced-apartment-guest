import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const BreadCrumbSkeleton = () => {
    return (
        <div className="flex flex-col space-y-3 mt-3 w-full">
            <Skeleton className="bg-primary bg-opacity-15 rounded-sm w-[40%] h-5" />
        </div>
    )
}

export default BreadCrumbSkeleton