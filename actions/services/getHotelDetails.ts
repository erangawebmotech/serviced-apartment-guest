"use server"

import { getHotelBySlug, getHotelReviewsById, getHotelRoomsDetails } from "@/service/hotel"
import { cache } from "react";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";
import { format } from "date-fns";
const dateFormat = "yyyy-MM-dd'T'HH:mm:ss";
export const getHotelDetails = cache(async (slug: string) => {
    try {
        const response = await getHotelBySlug(slug);
        return response;
    } catch (error) {
        throw error;
    }
});

export const getHotelReviews = async ({ id, page, perPage }: { id: string, page: number, perPage: number }) => {
    try {
        const response = await getHotelReviewsById({ id: id, perPage: perPage, page: page });
        return response;
    } catch (error) {
        throw error;
    }
}

// const timeZone = process.env.NEXT_PUBLIC_TIME_ZONE!;
// const toLocalDateTimeString = (date: Date, hour: number, minute: number, second: number) => {
//     const local = new Date(date);
//     local.setHours(hour, minute, second, 0);

//     const zoned = toZonedTime(local, timeZone);
//     return formatInTimeZone(zoned, timeZone, dateFormat);
// };
const toLocalDateTimeString = (date: Date, hour: number, minute: number, second: number): string => {
    const local = new Date(date);
    local.setHours(hour, minute, second, 0);

    return format(local, dateFormat);
};

export const getHotelRooms = async ({ id, adultCount, checkIn, checkOut, roomCount, childCount, availabilitycheck }: {
    id: string | number;
    adultCount?: string | number;
    checkIn?: any;
    checkOut?: any;
    roomCount?: string | number;
    availabilitycheck?: boolean;
    childCount?: string | number;
}) => {


    let inDate;
    let outDate;

    if (!availabilitycheck) {
        inDate = checkIn
            ? toLocalDateTimeString(new Date(checkIn), 0, 0, 0)
            : toLocalDateTimeString(new Date(), 0, 0, 0);

        outDate = checkOut
            ? toLocalDateTimeString(new Date(checkOut), 23, 59, 59)
            : toLocalDateTimeString(new Date(Date.now() + 86400000), 23, 59, 59);
    }
    try {
        const response = await getHotelRoomsDetails({
            id: id || '',
            adultCount: adultCount || 1,
            checkIn: checkIn,
            checkOut: checkOut,
            // checkIn: availabilitycheck ? checkIn : inDate,
            // checkOut: availabilitycheck ? checkOut : outDate,
            roomCount: roomCount || 1,
            childCount: childCount || 0,
        });
        return response;

    } catch (error) {
        throw error;
    }
};
