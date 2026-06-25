import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

const ResultsCountSkeleton = () => {
    return (
        <div className="max-[1000px]:hidden flex justify-between items-start mt-3 pl-5 w-ful">
            <Skeleton className="bg-primary bg-opacity-15 rounded-sm w-[40%] h-5" />
            <Skeleton className="bg-primary bg-opacity-15 rounded-sm w-[40%] h-7" />
        </div>
    )
}

export default ResultsCountSkeleton