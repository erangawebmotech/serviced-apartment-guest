import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const ResultCardSkeleton = () => {
    return (
        <div className="flex flex-row max-[1000px]:flex-col justify-between max-[1000px]:justify-center items-center gap-4 bg-white shadow-sm max-[1000px]:mt-0 mb-5 ml-5 max-[1000px]:p-3 px-5 py-6 border rounded-lg w-full max-[1000px]:w-max font-poppins animate-pulse">

            <div className="relative flex w-max max-[1000px]:w-full h-max">
                <Skeleton className="rounded-lg w-80 max-[1000px]:w-80 h-40 max-[1000px]:h-80" />
            </div>


            <div className="flex flex-col flex-1 justify-between items-start max-[1000px]:w-full">
                <div className='w-full'>
                    <Skeleton className="bg-primary bg-opacity-15 mb-2 rounded-sm w-[50%] h-5" />

                    <div className='flex justify-start items-start gap-2 text-sm'>
                        <Skeleton className="bg-primary bg-opacity-15 rounded-full w-6 h-6" />
                        <Skeleton className="bg-primary bg-opacity-15 rounded-sm w-24 h-5" />
                    </div>

                    <div className="max-[1000px]:hidden flex flex-col gap-1 my-2">
                        <Skeleton className="bg-primary bg-opacity-15 mb-1 rounded-sm w-[40%] h-5" />
                        <Skeleton className="bg-primary bg-opacity-15 mb-1 rounded-sm w-[60%] h-4" />
                        <Skeleton className="bg-primary bg-opacity-15 mb-1 rounded-sm w-[50%] h-4" />
                    </div>
                </div>


                <Skeleton className="bg-primary bg-opacity-15 mb-2 rounded-sm w-[60%] h-5" />
            </div>


            <div className="max-[1000px]:hidden flex flex-col justify-between items-start self-start gap-3 w-36">
                <div className="flex flex-col justify-start items-start gap-2">

                    <Skeleton className="bg-primary bg-opacity-15 mb-2 rounded-sm w-20 h-5" />
                </div>


                <Skeleton className="bg-primary bg-opacity-15 rounded-sm w-[100%] h-10" />
            </div>
        </div>
    );
}

export default ResultCardSkeleton;
