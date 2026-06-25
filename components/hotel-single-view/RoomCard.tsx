"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import defaultImage from "@/public/logo-sm.png";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";
import React from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import { ChevronLeft, ChevronRight, Dot, X } from "lucide-react";
import { Button } from "../ui/button";
import { motion } from "framer-motion";
import { parseInt } from "lodash";
import defaultPlaceholder from '@/public/shared/DefaultLocation.png'

interface RoomCardProps {
    roomObj: any;
    isLast: boolean;
    bedRoomNumber: number;
    onChangeSelectedRoomCount: ({ subUnit, headCount, selectedCount, price }: { subUnit: any, headCount: number, selectedCount: number, price: number }) => void;
    onUpdateAvailability: any;
    allowEntireProperty: boolean;
    allowIndividualUnit: boolean;
}

export default function RoomCard({ roomObj, isLast, bedRoomNumber, onChangeSelectedRoomCount, onUpdateAvailability, allowEntireProperty, allowIndividualUnit }: RoomCardProps) {
    const [roomCount, setRoomCount] = useState<number>(0);
    const [selectedRoomCounts, setSelectedRoomCounts] = useState<number[]>([]);
    const [selectedValues, setSelectedValues] = useState<{ [key: number]: string }>({});
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)
    const [count, setCount] = React.useState(0)

    useEffect(() => {
        if (!api) {
            return
        }

        setCount(api.scrollSnapList().length)
        setCurrent(api.selectedScrollSnap() + 1)

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1)
        })
    }, [api])

    useEffect(() => {
        setRoomCount(roomObj?.subUnits?.length || 0);
        setSelectedRoomCounts(Array(roomObj?.prices?.length || 0).fill(0));
    }, [roomObj]);


    const handleRoomSelect = (index: number, value: string, roomObj: any, price: number) => {
        const count = value.split("-")[1];

        const updatedCounts = [...selectedRoomCounts];
        updatedCounts[index] = parseInt(count) || 0;
        setSelectedRoomCounts(updatedCounts);


        setSelectedValues((prev) => ({ ...prev, [index]: value }));

        onChangeSelectedRoomCount({
            subUnit: roomObj,
            headCount: index + 1,
            selectedCount: parseInt(count) || 0,
            price: price,
        });
    };

    const isDisabled = (count: number) => {
        const selectedSum = selectedRoomCounts.reduce((sum, num) => sum + num, 0);
        return selectedSum + count > roomCount;
    };

    useEffect(() => {
        setSelectedValues([])
        onChangeSelectedRoomCount({
            subUnit: null,
            headCount: 0,
            selectedCount: 0,
            price: 0,
        });
    }, [onUpdateAvailability])


    const maxVisibleDots = 5;
    const startIndex = Math.max(0, Math.min(current - Math.ceil(maxVisibleDots / 2), count - maxVisibleDots));
    const visibleDots = Array.from({ length: Math.min(count, maxVisibleDots) }, (_, i) => startIndex + i);
    return (
        <Card
            className={`bg-transparent shadow-none mb-5 max-[865px]:border-none p-4 border-t-0 border-r-0 ${!isLast ? "border-b" : "border-b-0"} border-l-0 rounded-none w-full font-poppins max-[865px]:p-0 ${allowEntireProperty ? 'border-none' : ''}`}
        >
            <h2 className="mb-4 font-medium text-sm text-wrap">{roomObj?.name || ""}</h2>
            <div className="flex flex-row max-[865px]:flex-col gap-4 max-[865px]:gap-1">
                <div className="relative flex flex-col w-max max-[865px]:w-full h-max">
                    <div>
                        <div className="mx-auto">
                            <Carousel setApi={setApi} className="relative w-full max-w-[300px] max-[865px]:max-w-full" opts={{ loop: true }}>
                                <CarouselContent>
                                    {roomObj?.images?.length > 0 ? (
                                        roomObj.images.map((image: any, index: number) => (
                                            <CarouselItem key={image.id || index}>
                                                <Card className="w-full">
                                                    <CardContent className="relative flex justify-center items-center p-16 w-full min-w-[300px] aspect-square">
                                                        <Image
                                                            src={image.file.originalPath}
                                                            alt={image.altTag || `Slide ${index + 1}`}
                                                            fill
                                                            className="rounded-lg object-cover"
                                                        />
                                                    </CardContent>
                                                </Card>
                                            </CarouselItem>
                                        ))
                                    ) : (
                                        <CarouselItem key="Serviced Apartments">
                                            <Card className="w-full">
                                                <CardContent className="relative flex justify-center items-center p-16 w-full min-w-[300px] aspect-square">
                                                    <Image
                                                        src={defaultPlaceholder}
                                                        alt="Serviced Apartments"
                                                        fill
                                                        // objectFit="cover"
                                                        style={{ objectFit: 'cover' }}
                                                        className="rounded-lg object-cover"
                                                    />
                                                </CardContent>
                                            </Card>
                                        </CarouselItem>
                                    )}
                                </CarouselContent>


                                <Button
                                    className={`top-1/2 left-3 absolute flex justify-center items-center bg-white hover:bg-gray-200 shadow-md p-1 rounded-full w-7 h-7 -translate-y-1/2 transform ${!roomObj?.images?.length ? 'hidden' : null}`}
                                    onClick={() => api?.scrollPrev()}
                                    disabled={!api?.canScrollPrev()}
                                >
                                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                                </Button>


                                <Button
                                    className={`top-1/2 right-3 absolute flex justify-center items-center bg-white hover:bg-gray-200 shadow-md p-1 rounded-full w-7 h-7 -translate-y-1/2 transform ${!roomObj?.images?.length ? 'hidden' : null}`}
                                    onClick={() => api?.scrollNext()}
                                    disabled={!api?.canScrollNext()}
                                >
                                    <ChevronRight className="w-5 h-5 text-gray-600" />
                                </Button>
                                <div className={`bottom-3 left-1/2 absolute flex justify-center items-center space-x-1 -translate-x-1/2 transform  ${!roomObj?.images?.length ? 'hidden' : null}`}>
                                    {visibleDots.map((index) => (
                                        <motion.div
                                            key={index}
                                            className={`cursor-pointer rounded-full transition-all duration-300 ${current === index + 1 ? "bg-white w-2 h-2" : "bg-gray-200 opacity-50 w-1.5 h-1.5"
                                                }`}
                                            onClick={() => api?.scrollTo(index)}
                                            animate={{ scale: current === index + 1 ? 1.2 : 1, opacity: current === index + 1 ? 1 : 0.5 }}
                                            transition={{ duration: 0.3, ease: "easeOut" }}
                                        ></motion.div>
                                    ))}
                                </div>
                            </Carousel>
                        </div>
                    </div>

                    {
                        allowEntireProperty && !allowIndividualUnit && (
                            <>
                                <div className="mt-1 font-medium text-sm">
                                    <span>{`Bed Room ${bedRoomNumber || ''}`}</span>
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs">
                                    {roomObj?.beds?.map((bed: any) => (
                                        <div
                                            className="flex items-center gap-1 max-w-full font-normal break-words leading-relaxed"
                                            key={bed?.bedType?.id}
                                        >
                                            <div className="flex flex-wrap justify-center items-end gap-1">
                                                {/* <Dot /> */}
                                                <Image src={'/single-page/bed-icon.webp'} alt="Bed Icon" width={20} height={20} className="brightness-50 grayscale" />
                                                {bed?.count || ""} {bed?.bedType?.name || "No description"}{" "}
                                                {bed?.count > 1 ? "beds" : "bed"}
                                            </div>
                                        </div>
                                    ))}
                                    {roomObj?.bathrooms?.map((bathroom: any) => (
                                        <div
                                            className="flex items-center gap-1 max-w-full font-normal break-words leading-relaxed"
                                            key={bathroom?.bathroomType?.id}
                                        >
                                            <span className="flex flex-wrap justify-center items-end gap-1">
                                                {/* <Dot /> */}
                                                <Image src={'/single-page/bathroom-icon.webp'} alt="Bed Icon" width={20} height={20} className="brightness-50 grayscale" />
                                                {bathroom?.count || ""} {bathroom?.bathroomType?.name || "No description"}
                                                {bathroom?.count > 1 && "s"}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                            </>
                        )
                    }

                    {
                        allowIndividualUnit && (
                            <>
                                <div className="gap-1 grid grid-cols-2 mt-2 w-full">
                                    {roomObj?.beds?.map((bed: any) => (
                                        <div
                                            className="flex items-center gap-1 font-normal text-sm leading-relaxed"
                                            key={bed?.bedType?.id}
                                        >
                                            <div className="flex flex-wrap justify-center items-end gap-1">
                                                {/* <Dot /> */}
                                                <Image src={'/single-page/bed-icon.webp'} alt="Bed Icon" width={20} height={20} className="brightness-50 grayscale" />
                                                {bed?.count || ""} {bed?.bedType?.name || "No description"}{" "}
                                                {bed?.count > 1 ? "beds" : "bed"}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="gap-1 grid grid-cols-1 mt-2 max-[865px]:mt-1 w-full">
                                    {roomObj?.bathrooms?.map((bathroom: any) => (
                                        <div
                                            className="flex items-center gap-1 max-w-full font-normal break-words leading-relaxed"
                                            key={bathroom?.bathroomType?.id}
                                        >
                                            <span className="flex flex-wrap justify-center items-end gap-1 text-sm">
                                                {/* <Dot /> */}
                                                <Image src={'/single-page/bathroom-icon.webp'} alt="Bed Icon" width={20} height={20} className="brightness-50 grayscale" />
                                                {bathroom?.count || ""} {bathroom?.bathroomType?.name || "No description"}
                                                {bathroom?.count > 1 && "s"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                <div className="gap-1 grid grid-cols-1 mt-2 max-[865px]:mt-1 w-full">
                                    {roomObj?.size && (
                                        <div className="flex items-center gap-1 font-normal text-sm leading-relaxed" >
                                            <span>{roomObj.size} ft²</span>

                                        </div>
                                    )}
                                </div>
                            </>
                        )
                    }

                </div>

                <div className="flex flex-col flex-1 justify-between items-start gap-3 max-[865px]:p-0 pl-5 h-max">
                    {/* {roomObj?.unitAmenities?.length > 0 && !roomObj?.isTypeEntireProperty && (
                        <div>
                            <span className="font-normal text-gray-600 text-xs">Amenities</span>
                            <div className="gap-1 grid grid-cols-4 max-[1216px]:grid-cols-2 max-[1600px]:grid-cols-3 mt-2 pl-2 w-full">
                                {roomObj?.unitAmenities.map((amenity: any) => (
                                    <div
                                        className="flex items-center gap-1 w-max font-normal text-sm leading-relaxed"
                                        key={amenity?.amenity?.id}
                                    >
                                        <Image
                                            src={amenity?.amenity?.file?.smallPath || defaultImage}
                                            width={20}
                                            height={20}
                                            alt={amenity?.amenity?.name || ""}
                                            className="mix-blend-multiply"
                                        />
                                        <span>{amenity?.amenity?.name || ""}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}


                    {/* {roomObj?.highlights?.length > 0 && !roomObj?.isTypeEntireProperty && (
                        <div>
                            <span className="font-normal text-gray-600 text-xs">Highlights</span>
                            <div className="gap-5 grid grid-cols-4 max-[865px]:grid-cols-2 mt-2 pl-2 w-full">
                                {roomObj?.highlights.map((highlight: any) => (
                                    <div
                                        className="flex items-center gap-1 w-max font-normal text-sm leading-relaxed"
                                        key={highlight?.id}
                                    >
                                        <Image
                                            src={highlight?.file?.smallPath || defaultImage}
                                            width={20}
                                            height={20}
                                            alt={highlight?.name || ""}
                                            className="mix-blend-multiply"
                                        />
                                        <span>{highlight?.name || ""}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )} */}


                    {roomObj?.unitAmenities?.length > 0 && !roomObj?.isTypeEntireProperty && (
                        <div className="w-full">
                            <span className="font-normal text-gray-600 text-xs">Amenities</span>
                            <div className="flex flex-wrap gap-x-8 gap-y-6 mt-2 pl-2">
                                {roomObj?.unitAmenities?.map((amenity: any) => (
                                    <div
                                        key={amenity?.amenity?.id}
                                        className="flex items-center gap-3 font-normal text-sm leading-relaxed"
                                    >
                                        <Image
                                            src={amenity?.amenity?.file?.smallPath || defaultImage}
                                            width={20}
                                            height={20}
                                            alt={amenity?.amenity?.name || ""}
                                            className="mix-blend-multiply"
                                        />
                                        <span className="whitespace-normal">
                                            {amenity?.amenity?.name || ""}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {roomObj?.highlights?.length > 0 && !roomObj?.isTypeEntireProperty && (
                        <div className="w-full">
                            <span className="font-normal text-gray-600 text-xs">Highlights</span>
                            <div className="flex flex-wrap gap-x-8 gap-y-6 mt-2 pl-2">
                                {roomObj?.highlights.map((highlight: any) => (
                                    <div
                                        key={highlight?.id}
                                        className="flex items-center gap-3 font-normal text-sm leading-relaxed"
                                    >
                                        <Image
                                            src={highlight?.file?.smallPath || defaultImage}
                                            width={20}
                                            height={20}
                                            alt={highlight?.name || ""}
                                            className="mix-blend-multiply"
                                        />
                                        <span className="whitespace-normal">{highlight?.name || ""}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {
                        allowIndividualUnit && (

                            <div className="max-[865px]:p-50 pr-5 w-full">
                                <span className="font-normal text-gray-600 text-xs">Room Details</span>
                                <div className="max-[865px]:p-0 pl-2 w-full">
                                    {roomObj?.prices.map((price: any, index: number) => (
                                        <div className="flex" key={index}>
                                            <CardContent
                                                className={`flex items-center  max-[865px]:items-start justify-between flex-1 p-0 py-2 ${index !== roomObj.prices.length - 1 ? "border-b" : ""
                                                    }`}
                                            >
                                                <div className="flex gap-1">
                                                    {price?.maxHeadCount <= 4 ? (
                                                        Array.from({ length: price?.maxHeadCount || 0 }, (_, i) => (
                                                            <FaUser key={i} />
                                                        ))
                                                    ) : (
                                                        <div className="flex items-center gap-1"><FaUser /> <span className="flex justify-center items-center"><X size={12} />{price?.maxHeadCount || 0}</span></div>
                                                    )}
                                                </div>

                                                <div className="flex flex-row max-[865px]:flex-col justify-between items-end gap-5 max-[865px]:gap-2">
                                                    <div>
                                                        <div className="flex justify-start max-[865px]:justify-end items-center gap-2">
                                                            <div className="font-bold text-lg">
                                                                {price?.priceWithDiscount ? (
                                                                    `$${price?.priceWithDiscount}`
                                                                ) : (
                                                                    `$${price?.priceForMaxCount}`
                                                                )}

                                                            </div>
                                                            <div className="text-red-500 text-sm line-through">
                                                                {price?.priceWithDiscount ? (
                                                                    `$${price?.priceForMaxCount}`
                                                                ) : (null)}
                                                            </div>
                                                        </div>
                                                        {roomObj?.subUnits?.length > 0 && roomObj?.monthlyRateApplied &&
                                                            (
                                                                <div className="text-secondary text-xs">
                                                                    Utility bills not included.
                                                                </div>
                                                            )
                                                        }
                                                        <div className="text-gray-500 text-xs">
                                                            Includes taxes and fees
                                                        </div>
                                                    </div>

                                                    {
                                                        roomObj.subUnits.length > 0 ? (
                                                            <Select
                                                                value={selectedValues[index] || "0"}
                                                                onValueChange={(value) =>
                                                                    handleRoomSelect(
                                                                        index,
                                                                        value,
                                                                        roomObj || [],
                                                                        price?.priceWithDiscount ? price.priceWithDiscount : price.priceForMaxCount
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger className="w-[140px]">
                                                                    <SelectValue placeholder="Room Count" />
                                                                </SelectTrigger>
                                                                <SelectContent className="font-poppins">
                                                                    <SelectItem key={0} value="0">0</SelectItem>
                                                                    {roomObj?.subUnits?.map((subUnit: any, i: number) => (
                                                                        <SelectItem
                                                                            key={i}
                                                                            value={`${subUnit}-${i + 1}`}
                                                                            disabled={isDisabled(i + 1)}
                                                                        >
                                                                            {i + 1}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        ) : (
                                                            <span className="font-medium text-secondary text-sm">Already Reserved</span>
                                                        )
                                                    }
                                                </div>
                                            </CardContent>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    }
                </div>
            </div >
        </Card >
    );
}
