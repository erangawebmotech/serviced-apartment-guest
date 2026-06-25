import React, { useState } from 'react'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '../ui/button'
import { Dot, Search, Star } from 'lucide-react'
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area"
import StarRating from './StartsRating';
import Image from 'next/image';
import UserImage from '@/public/single-page/userIcon.png'
import { getMonthsOnServicedApartments } from '@/common/commonClientFunctions';


function formatDateToMonthYear(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
}
function formatText(text: string): string {
    return text
        .toLowerCase()
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}
function convertPercentageToFive(percentage: number): number {
    if (percentage < 0 || percentage > 100) {
        throw new Error("Percentage should be between 0 and 100");
    }
    return parseFloat(((percentage / 100) * 5).toFixed(1));
}


const ReviewsDialogMobile = ({ ratings }: { ratings: any }) => {
    const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedReviewId((prev) => (prev === id ? null : id));
    };

    if (!ratings) return null;

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <div className="hidden max-[1000px]:flex max-[1000px]:justify-center items-start max-[1000px]:items-center col-span-1 md:col-span-2 text-center">
                    <Button
                        className="bg-transparent hover:bg-gray-50 shadow-sm px-4 py-2 border rounded-lg w-1/6 min-w-max font-medium text-gray-700 text-sm"
                        size="lg"
                    >
                        See all {ratings?.pagination?.totalCount} Reviews
                    </Button>
                </div>
            </DrawerTrigger>
            <DrawerContent className='font-poppins'>
                <div className="mx-auto min-[500px]:px-10 w-full">
                    <DrawerHeader>
                        <DrawerTitle>
                            <div className="flex items-center gap-2 font-medium text-3xl">
                                <Star className="fill-secondary w-6 h-6 text-secondary" />
                                {ratings?.data?.averageRating || 0}
                            </div>
                            <div className="font-normal text-sm text-left">{ratings?.pagination?.totalCount || 0} Review{`${ratings?.pagination?.totalCount > 1 ? 's' : ''}`}</div>
                            <div className="gap-1 grid grid-cols-2 mt-2 pb-2 w-full font-normal text-gray-500 text-sm">
                                {ratings?.data?.categoryRatings?.map((item: any, index: number) => (
                                    <div key={index} className="flex justify-start items-start text-left">
                                        <span className='w-32'>{formatText(item?.ratingCategoryName || '')}</span>
                                        <span className='text-secondary'>{convertPercentageToFive(item?.ratingCount || 0)}</span>
                                    </div>
                                ))}
                            </div>
                        </DrawerTitle>
                    </DrawerHeader>

                    <div className='px-2'>


                        <div className="relative w-full h-max">
                            <Search className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
                            <Input
                                type="text"
                                placeholder="Search Reviews"
                                className="shadow-none py-2 pr-4 pl-10 rounded-full focus:outline-none ring-1 ring-gray-500 focus:ring-2 h-11"
                            />
                        </div>
                        <div className="my-2 w-full h-[60vh]">
                            <ScrollArea
                                data-lenis-prevent
                                className="p-4 rounded-md w-full h-full overflow-auto"
                            >
                                <div className="flex flex-col items-center gap-5 space-y-4">
                                    {ratings?.data?.reviews?.map((review: any, index: number) => {
                                        const isExpanded = expandedReviewId === index;

                                        return (
                                            <div key={index} className='w-full'>
                                                <div className="flex justify-start items-start gap-2 w-max h-max">
                                                    <div className="relative w-12 h-12">
                                                        <Image
                                                            loading="lazy"
                                                            src={review?.user?.file?.smallPath || UserImage}
                                                            fill
                                                            alt="user Image"
                                                            className="rounded-full object-cover"
                                                        />
                                                    </div>

                                                    <div className="flex flex-col flex-grow justify-between items-start h-full">
                                                        <span className="text-sm">{`${review?.user?.firstName} ${review?.user?.lastName}`}</span>
                                                        <span className="font-light text-gray-400 text-xs">
                                                            {getMonthsOnServicedApartments(review?.user?.createdAt)}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center mt-1 font-light text-xs">
                                                    <StarRating rating={review?.average || 0} />
                                                    <Dot size={15} />
                                                    <span>{formatDateToMonthYear(review?.createdAt || "")}</span>
                                                    <Dot size={15} />
                                                    <span className="text-gray-400">Stayed one nights</span>
                                                </div>
                                                <div className="mt-1 text-sm">
                                                    {review?.reviewText && (
                                                        <p className="text-gray-500 text-sm">
                                                            {isExpanded || review?.reviewText?.length <= 255
                                                                ? review?.reviewText
                                                                : `${review?.reviewText?.slice(0, 255)}...`}
                                                            {review?.reviewText?.length > 255 && (
                                                                <button
                                                                    onClick={() => toggleExpand(index)}
                                                                    className="ml-2 text-secondary hover:underline"
                                                                >
                                                                    {isExpanded ? "see less" : "see more"}
                                                                </button>
                                                            )}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </ScrollArea>
                        </div>
                    </div>

                </div>
            </DrawerContent>
        </Drawer>
    )
}

export default ReviewsDialogMobile