import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import StarRating from "./StartsRating";
import { Separator } from "../ui/separator";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import defaultUser from '@/public/logo-sm.png'

import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Autoplay from "embla-carousel-autoplay"

const SinglePropertyImageViewMobile = ({ defaultImages, name, reviews }: { defaultImages: any[], name: string, reviews: any }) => {
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

    function formatDateToMonthYear(dateString: string): string {
        const date = new Date(dateString);
        const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long" };
        return date.toLocaleDateString("en-US", options);
    }

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    return (
        <Drawer>
            <DrawerTrigger asChild>
                <div className="relative flex justify-center items-center bg-transparent hover:bg-transparent hover:bg-primary focus:bg-transparent border border-primary rounded-lg w-24 h-16 font-poppins text-primary hover:text-white text-xs transition-all duration-300 cursor-pointer">
                    <span className="font-medium tracking-wide">+ See More</span>
                </div>
            </DrawerTrigger>
            <DrawerContent className="font-poppins">
                <div className="mx-auto pb-4 w-full">
                    <DrawerHeader>
                        <DrawerTitle className="text-base text-left">{name}</DrawerTitle>


                    </DrawerHeader>
                    <div className="relative mx-4 h-0" style={{ paddingTop: "56.25%" }}>
                        <Image
                            src={defaultImages[currentIndex]?.largePath}
                            alt={`Property Image ${currentIndex + 1}`}
                            fill
                            className="rounded-lg object-cover"
                        />
                    </div>
                    <ScrollArea className="flex gap-2 mt-1 px-4 w-full">
                        <div className="flex gap-1">
                            {defaultImages.map((img, index) => (
                                <div
                                    key={index}
                                    ref={(el: HTMLDivElement | null) => { thumbnailRefs.current[index] = el; }}
                                    className={`relative h-16 rounded-sm aspect-video cursor-pointer border ${currentIndex === index ? "border-primary" : "border-gray-200 opacity-65"}`}
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
                    <div className="flex justify-start items-center gap-2 mx-4 mt-5 w-max">
                        <span className="font-medium text-4xl">{reviews?.data?.averageRating || 0}</span>
                        <div>
                            <StarRating rating={reviews?.data?.averageRating || 0} size={12} />
                            <span className="text-gray-500 text-xs">{reviews?.pagination?.totalCount || 0} review{`${reviews?.pagination?.totalCount > 1 ? 's' : ''}`}</span>
                        </div>
                    </div>
                    <Separator className="mt-2" />

                    <Carousel
                        plugins={[plugin.current]}
                        className="w-full"
                        onMouseEnter={plugin.current.stop}
                        onMouseLeave={plugin.current.reset}
                    >
                        <CarouselContent>
                            {reviews?.data?.reviews?.map((review: any, index: number) => {
                                const isExpanded = expandedReviewId === index;
                                return (
                                    <div key={index} className="px-4 pt-2 min-w-full overflow-hidden">
                                        <CarouselItem >
                                            <div className="mb-4">
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
                                        </CarouselItem>
                                    </div>

                                )
                            })}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>

                </div>
            </DrawerContent>
        </Drawer>

    );
};

export default SinglePropertyImageViewMobile;
