import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import StarRating from "./StartsRating";
import { Separator } from "../ui/separator";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import defaultUser from '@/public/logo-sm.png'
import logoWhite from '@/public/shared/Logo-white.png'

const SinglePropertyImageView = ({ defaultImages, name, reviews }: { defaultImages: any[], name: string, reviews: any }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const thumbnailRefs = useRef<(HTMLDivElement | null)[]>([]);
    const [expandedReviewId, setExpandedReviewId] = useState<number | null>(null);

    const toggleExpand = (id: number) => {
        setExpandedReviewId((prev) => (prev === id ? null : id));
    };

    useEffect(() => {
        if (thumbnailRefs.current[currentIndex]) {
            thumbnailRefs.current[currentIndex].scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
            });
        }
    }, [currentIndex]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev === 0 ? defaultImages.length - 1 : prev - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev === defaultImages.length - 1 ? 0 : prev + 1));
    };


    function formatDateToMonthYear(dateString: string): string {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
        return date.toLocaleDateString("en-US", options);
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="hover:!bg-white !bg-opacity-80 w-full !text-primary transition-transform duration-300 ease-in-out custom-glass-container">
                    <Image
                        src={logoWhite}
                        alt="Serviced Apartments Logo"
                        className="invert w-4 h-4"
                    />
                    <span className="text-black">
                        See More
                    </span>
                </Button>
            </DialogTrigger>
            <DialogContent className="min-w-[72%] max-w-[900px] max-h-[90vh] overflow-hidden font-poppins">
                <DialogHeader>
                    <DialogTitle className="font-semibold text-gray-800 text-xl">
                        {name}
                    </DialogTitle>
                </DialogHeader>
                <div className="flex gap-8">

                    <div className="relative bg-gray-100 rounded-md w-2/3 h-min aspect-video overflow-hidden">
                        <div className="relative w-full h-0" style={{ paddingTop: "56.25%" }}>
                            <Image
                                src={defaultImages[currentIndex]?.largePath}
                                alt={`Property Image ${currentIndex + 1}`}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <button
                            onClick={handlePrev}
                            className="top-1/2 left-2 absolute bg-white hover:bg-gray-100 shadow p-2 rounded-full -translate-y-1/2 transform"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={handleNext}
                            className="top-1/2 right-2 absolute bg-white hover:bg-gray-100 shadow p-2 rounded-full -translate-y-1/2 transform"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>


                    <div className="relative flex flex-col bg-white border border-gray-200 rounded-md w-1/3">
                        <div className="bg-white px-4 py-2 rounded-md w-full">
                            <div className="flex justify-start items-center gap-2 w-max">
                                <span className="font-medium text-4xl">{reviews?.data?.averageRating || 0}</span>
                                <div>
                                    <StarRating rating={reviews?.data?.averageRating || 0} size={12} />
                                    <span className="text-gray-500 text-sm">{reviews?.pagination?.totalCount || 0} review{`${reviews?.pagination?.totalCount > 1 ? 's' : ''}`}</span>
                                </div>
                            </div>
                        </div>
                        <Separator />
                        <h2 className="mt-2 px-4 font-medium text-gray-700 text-base">
                            {reviews?.data?.reviews?.length > 0 ? 'Guests who stayed here' : 'Not Rated Yet'}
                        </h2>
                        <ScrollArea className="mt-2 px-4 rounded-md w-full">
                            {reviews?.data?.reviews?.map((review: any, index: number) => {
                                const isExpanded = expandedReviewId === index;
                                return (
                                    <div key={index} className="mb-4">
                                        <div className="mt-1">
                                            {review?.reviewText && (
                                                <p className="text-gray-600 text-xs">
                                                    {isExpanded || review?.reviewText?.length <= 200
                                                        ? review?.reviewText
                                                        : `${review?.reviewText?.slice(0, 200)}...`}
                                                    {review?.reviewText?.length > 200 && (
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
                                        <div className="flex items-center gap-2 mt-1 mb-6">
                                            <Avatar className="w-8 h-8">
                                                <AvatarImage src={review?.user?.file?.smallPath || defaultUser.src} alt="User Image" />
                                                <AvatarFallback>SA</AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col justify-start items-start">
                                                <span className="font-medium text-sm">{`${review?.user?.firstName} ${review?.user?.lastName}` || ''}</span>
                                                <span className="text-gray-500 text-xs">
                                                    {formatDateToMonthYear(review?.createdAt || '')}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}

                        </ScrollArea>

                    </div>
                </div>


                <ScrollArea className="flex gap-2 mt-4 w-2/3">
                    <div className="flex gap-2">
                        {defaultImages.map((img, index) => (
                            <div
                                key={index}
                                ref={(el: HTMLDivElement | null) => { thumbnailRefs.current[index] = el; }}
                                className={`relative h-20 rounded-sm aspect-video cursor-pointer border ${currentIndex === index ? "border-primary" : "border-gray-200 opacity-65"}`}
                                onClick={() => setCurrentIndex(index)}
                            >
                                <Image
                                    src={img.smallPath}
                                    alt={`Thumbnail ${index + 1}`}
                                    fill
                                    className="rounded-sm object-cover"
                                />
                            </div>

                        ))}
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog >
    );
};

export default SinglePropertyImageView;
