import React from "react";
import { Skeleton } from "@/components/ui/skeleton"; 
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";

const FiltersSkeleton = () => {
  return (
    <Card className="max-[1000px]:hidden w-full">
      <CardHeader className="border-b">
        <Skeleton className="w-32 h-6" />
      </CardHeader>
      <CardContent>
        <div className="py-5 border-b">
          <Skeleton className="w-40 h-5" />
          <div className="mt-2">
            <Skeleton className="w-full h-12" />
            <Skeleton className="mt-2 w-full h-2" />
            <Skeleton className="mt-2 w-3/4 h-2" />
          </div>
        </div>

        <div className="flex-col justify-between items-start gap-2 py-5 border-b w-full">
          <Skeleton className="mb-3 w-24 h-5" />
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-2 py-3 border hover:border-[#FFECEC] w-full duration-100 cursor-pointer"
            >
              <Skeleton className="rounded-full w-4 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          ))}
        </div>

        <div className="py-5">
          <Skeleton className="w-full h-8" />
          <Skeleton className="mt-2 w-full h-8" />
        </div>
      </CardContent>
    </Card>
  );
};

export default FiltersSkeleton;

