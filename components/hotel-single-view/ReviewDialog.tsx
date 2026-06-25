"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Dot, Map, Star } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area"
import { DialogTitle } from "@radix-ui/react-dialog";
import UserImage from '@/public/shared/defaultUser.png'
import Image from "next/image";
import StarRating from "./StartsRating";
import { getHotelReviewsById } from "@/service/hotel";
import { getMonthsOnServicedApartments } from "@/common/commonClientFunctions";


interface ReviewModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    reviews: any;
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
function formatDateToMonthYear(dateString: string): string {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
    return date.toLocaleDateString("en-US", options);
}

const ReviewDialog: React.FC<ReviewModalProps> = ({ isOpen, onOpenChange, reviews }) => {
    const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);
    const [searchText, setSearchText] = useState("");
    const [fetching, setFetching] = useState<boolean>(false);
    const [loadedReviews, setLoadedReviews] = useState<any>(reviews)

    const toggleExpand = (id: number) => {
        setExpandedReviewId((prev) => (prev === id ? null : id));
    };


    useEffect(() => {
        const debounce = setTimeout(() => {
            handleSearch(searchText);
        }, 500);

        return () => clearTimeout(debounce);
    }, [searchText]);

    const handleSearch = async (text: string) => {
        setFetching(true)
        await getHotelReviewsById({ id: loadedReviews?.data?.property?.id, page: 0, perPage: 4, keywords: text, sortType: 'MOST_RECENT' }).then((res) => {
            setLoadedReviews(res);
        }).catch((e) => {
            console.log(e)
        }).finally(() => {
            setFetching(false)
        })
    };

    return (
        <Dialog open={isOpen} modal onOpenChange={onOpenChange}>

            <DialogContent className="p-6 w-full max-w-6xl font-poppins" >
                <DialogHeader>
                    <DialogTitle>
                        <div className="flex items-center gap-2 font-medium text-3xl">
                            <Star className="fill-secondary w-6 h-6 text-secondary" />
                            {loadedReviews?.data?.averageRating || 0}
                        </div>
                    </DialogTitle>
                </DialogHeader>
                <div className="flex justify-between items-start gap-10 w-full">
                    <div className="flex flex-col items-start w-3/6">

                        <div className="w-full">
                            <span className="text-sm">Overall Reviews</span>

                            <div className="flex flex-col gap-1 mt-2">
                                {
                                    loadedReviews?.data?.ratingCounts?.map((rating: { rateCount: number, totalRating: number }, key: number) => (
                                        <div className="flex justify-center items-center gap-2" key={key}>
                                            <span className="w-max font-medium text-sm">{rating?.rateCount}</span>
                                            <Progress
                                                value={rating?.totalRating}
                                                className="bg-gray-200 w-full h-1 custom-progress"
                                            />
                                        </div>
                                    ))
                                }

                            </div>

                        </div>
                        <div className="flex flex-col gap-2 mt-8 w-full">
                            {
                                loadedReviews?.data?.categoryRatings?.map((item: any, index: number) => (
                                    <div key={index} className="flex justify-between items-center mb-2 pb-4 border-b w-full">
                                        <div className="flex justify-center items-center gap-2">
                                            <Map />
                                            <span>{formatText(item?.ratingCategoryName || '')}</span>
                                        </div>
                                        <span>{convertPercentageToFive(item?.ratingCount || 0)}</span>
                                    </div>
                                ))
                            }


                        </div>
                    </div>

                    <div className="relative flex flex-col w-full h-full">
                        <div className="-top-5 absolute flex justify-between items-start w-full h-max">
                            <span className="font-medium text-xl">{loadedReviews?.pagination?.totalCount || 0} Review{`${loadedReviews?.pagination?.totalCount > 1 ? 's' : ''}`}</span>
                            <Select defaultValue="MOST_RECENT">
                                <SelectTrigger className="w-2/6">
                                    <SelectValue placeholder="Select Value" />
                                </SelectTrigger>
                                <SelectContent className="font-poppins">
                                    <SelectItem value="MOST_RECENT">Most Recent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="relative mt-10 w-full h-max">
                            <Search className="top-1/2 left-3 absolute w-5 h-5 text-gray-400 -translate-y-1/2 transform" />
                            <Input
                                type="text"
                                placeholder="Search Reviews"
                                className="shadow-none py-2 pr-4 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-400 h-11"
                                onChange={(e) => setSearchText(e.target.value)}
                            />
                        </div>

                        <div className="mt-2 w-full h-[30rem]">
                            <ScrollArea
                                data-lenis-prevent
                                className="p-4 rounded-md w-full h-full overflow-auto"
                            >
                                {
                                    fetching ? (
                                        <span className="text-sm">Loading...</span>
                                    ) : (
                                        <div className="flex flex-col items-center gap-5 space-y-4">
                                            {loadedReviews?.data?.reviews?.map((review: any, index: number) => {
                                                const isExpanded = expandedReviewId === index;
                                                return (
                                                    <div key={index} className="w-full">
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
                                                            <span className="text-gray-400">Stayed {review?.reservationDetail?.nightCount ?? 0} night{review?.reservationDetail?.nightCount !== 1 ? 's' : ''}</span>
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
                                    )
                                }
                            </ScrollArea>
                        </div>
                    </div>

                </div>

            </DialogContent >
        </Dialog >
    );
};

export default ReviewDialog;
