"use client";

import React, { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation';
import StarRating from './StartsRating';
import Image from 'next/image';
import location from '@/public/single-page/locationIconDark.png'
import logo from '@/public/logo-sm.png'
import { differenceInCalendarDays, format, isValid, parseISO, startOfDay } from 'date-fns';


const DEFAULT_SHORT =
    "Free cancellation available up to 30 days before check-in. A partial refund may apply thereafter.";
const DEFAULT_LONG =
    "Cancellations made more than 30 days before check-in may be eligible for a full or partial refund. Please refer to the hotel's policy for details.";

/** Calendar days between check-in and check-out (checkout − check-in). Null if either date is missing or invalid. */
export function getStayDurationDays(
    checkinRaw: string | undefined | null,
    checkoutRaw: string | undefined | null,
): number | null {
    if (
        checkinRaw == null ||
        checkoutRaw == null ||
        checkinRaw === "" ||
        checkoutRaw === "" ||
        checkinRaw === "undefined" ||
        checkoutRaw === "undefined"
    ) {
        return null;
    }
    let start = parseISO(checkinRaw);
    if (!isValid(start)) start = new Date(checkinRaw);
    let end = parseISO(checkoutRaw);
    if (!isValid(end)) end = new Date(checkoutRaw);
    if (!isValid(start) || !isValid(end)) return null;
    const days = differenceInCalendarDays(startOfDay(end), startOfDay(start));
    if (days <= 0) return null;
    return days;
}

function OverviewTabContentInner({ hotel, }: { hotel: any; }) {
    const searchParams = useSearchParams();
    const checkin = searchParams.get("checkin") ?? undefined;
    const checkout = searchParams.get("checkout") ?? undefined;

    const [isExpanded, setIsExpanded] = useState(false);
    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const stayDurationDays = getStayDurationDays(checkin, checkout);
    const showCancellationPolicies = stayDurationDays !== null;
    /** Stay under 30 days → short policy only; 30+ days → long policy only. */
    const useShortPolicy =
        stayDurationDays !== null ? stayDurationDays < 30 : false;

    return (
        <div>
            <h1 className="mb-1 max-[500px]:mb-0 max-[500px]:text-3xl text-4xl">{hotel.name || "Undefined"}</h1>

            <div className="flex items-center space-x-2 mb-2 font-poppins text-gray-500 text-sm">

                <div className="flex items-center text-orange-400">
                    <StarRating rating={hotel?.summaryReviews?.averageReviews || 0} />
                    <span className="ml-1 font-medium text-gray-700">{hotel?.summaryReviews?.averageReviews || ''}</span>
                    <span className="ml-1 text-gray-400 max-[500px]:text-xs">{hotel?.summaryReviews?.totalReviews ? `(${hotel?.summaryReviews?.totalReviews} Reviews)` : 'Not rated yet'}</span>
                </div>



                <div className='max-[500px]:hidden'>|</div>
                <div className="max-[500px]:hidden flex justify-center items-center gap-2">
                    <Image src={location} alt="Location Map mark" />
                    <p>Entire {hotel?.propertyType?.name || ''} in {hotel?.city || ''}, Sri Lanka</p>
                </div>
            </div>

            <div className="font-poppins text-gray-700 text-sm leading-relaxed">
                {hotel.description ? (
                    <>


                        {window.innerWidth <= 1000 && window.innerWidth > 500 ? (
                            <div className="font-poppins text-gray-700 leading-relaxed">
                                {isExpanded || hotel.description.length <= 1000 ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: hotel.description,
                                        }}
                                    />
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: `${hotel.description.slice(0, 1000)}...`,
                                        }}
                                    />
                                )}
                                {hotel.description.length > 1000 && (
                                    <button
                                        onClick={toggleExpand}
                                        className="text-secondary hover:underline"
                                    >
                                        {isExpanded ? "see less" : "see more"}
                                    </button>
                                )}
                            </div>
                        ) : window.innerWidth <= 500 ? (
                            <div className="font-poppins text-gray-700 leading-relaxed">
                                {isExpanded || hotel.description.length <= 255 ? (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: hotel.description,
                                        }}
                                    />
                                ) : (
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: `${hotel.description.slice(0, 255)}...`,
                                        }}
                                    />
                                )}
                                {hotel.description.length > 255 && (
                                    <button
                                        onClick={toggleExpand}
                                        className="text-secondary hover:underline"
                                    >
                                        {isExpanded ? "see less" : "see more"}
                                    </button>
                                )}
                            </div>
                        ) : (
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: hotel.description,
                                }}
                                className="font-poppins text-gray-700 leading-relaxed"
                            />
                        )}
                    </>
                ) : (
                    <p>No description available.</p>
                )}
            </div>



            <hr className='my-10 max-[500px]:my-5' />
            {hotel?.unitHighlights?.length > 0 && (
                <div className='font-poppins'>
                    <h2 className="mb-4 font-semibold text-lg">Highlights</h2>
                    <div className="gap-y-4 grid grid-cols-2 md:grid-cols-4 w-3/5 max-[1230px]:w-full">
                        {hotel?.unitHighlights?.map((highlight: {
                            id: number,
                            name: string,
                            file: {
                                cover: boolean | null,
                                id: number | null,
                                largePath: string | null,
                                mediumPath: string | null,
                                originalName: string | null,
                                originalPath: string | null,
                                smallPath: string | null
                            }
                        }) => (
                            <div className='flex justify-start items-center gap-2' key={highlight?.id}>
                                <div className="relative w-6 h-6">
                                    <Image src={highlight?.file?.smallPath || logo}
                                        alt={highlight?.name || 'Serviced Apartments Apartment HIghlights'}
                                        fill
                                        loading='lazy'
                                        className="object-cover mix-blend-multiply"
                                    />
                                </div>
                                <span className="text-gray-700 text-sm">{highlight?.name || ''}</span>
                            </div>
                        ))}

                    </div>
                </div>)}

            <div className='mt-10 font-poppins'>
                <h2 className="mb-4 font-semibold text-lg">What this place offers</h2>
                <div className="gap-y-4 grid grid-cols-2 md:grid-cols-4 w-3/5 max-[1230px]:w-full">
                    {
                        hotel?.propertyAmenities?.map((amenity: any, index: number) =>
                        (
                            <div className='flex justify-start items-center gap-2' key={index}>
                                <div className="relative w-6 h-6">
                                    <Image src={amenity?.amenity?.file?.smallPath || logo}
                                        alt={amenity?.amenity?.file?.originalName || 'Serviced Apartments Apartment Amenities'}
                                        fill
                                        loading='lazy'
                                        className="object-cover mix-blend-multiply"
                                    />
                                </div>
                                <span className="text-gray-700 text-sm">{amenity?.amenity?.name || ''}</span>
                            </div>
                        )
                        )
                    }

                </div>
            </div>

            {showCancellationPolicies && (
                <>
                    <hr className='my-10 max-[500px]:my-5' />

                    <div className='font-poppins'>
                        <h2 className="mb-4 font-semibold text-lg">Cancellation Policies</h2>
                        <div className="w-full">
                            <ul className="flex flex-col gap-5 font-poppins text-gray-700 text-sm leading-relaxed">
                                {useShortPolicy && (
                                    <li>
                                        <p className="text-gray-600 text-sm">
                                            {hotel?.shortCancellationPolicy?.description || DEFAULT_SHORT}
                                        </p>
                                    </li>
                                )}
                                {!useShortPolicy && (
                                    <li>
                                        <p className="text-gray-600 text-sm">
                                            {hotel?.longCancellationPolicy?.description || DEFAULT_LONG}
                                        </p>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    <hr className='my-10 max-[500px]:my-5' />
                </>
            )}

        </div>
    )
}

export default function OverviewTabContent(props: { hotel: any }) {
    return (
        <Suspense fallback={null}>
            <OverviewTabContentInner {...props} />
        </Suspense>
    );
}
