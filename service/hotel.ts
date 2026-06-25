"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";
import { GetHotelRoomDetailsProps } from "@/common/hotel.interface";

export async function getHotelBySlug(slug: string) {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/properties/details/slug/${slug}`,
        body: null,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}
export async function getHotelReviewsById({ id, page, perPage, keywords, sortType }: { id: string, page: number, perPage: number, keywords?: string, sortType?: string }) {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reviews/${id}?page=${page}&perPage=${perPage}&keywords=${keywords ?? ''}&sortType=${sortType ?? ''}`,
        body: null,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}

export async function getHotelRoomsDetails({ id, adultCount, checkIn, checkOut, roomCount, childCount }: GetHotelRoomDetailsProps) {

    const apiObject: ApiObject = {
        method: 'GET',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/properties/unit-details/${id}?adultCount=${adultCount}&checkIn=${checkIn}&checkOut=${checkOut}&roomCount=${roomCount}&childCount=${childCount}`,
        body: null,
    };

    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }
}

export async function getAllProperties() {

    const apiObject: ApiObject = {
        method: 'GET',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/properties/properties-with-types`,
        body: null,
    };

    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }
}
export async function getBlockedDates({ id }: { id: string }) {

    const apiObject: ApiObject = {
        method: 'GET',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/calender/date?propertyId=${id}`,
        body: null,
    };

    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }
}



