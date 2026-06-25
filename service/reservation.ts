"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";
import { ReservationReqProps } from "@/common/interfaces";
import { TransactionType } from "@/common/constants";

export async function getReservationSummary(data: ReservationReqProps) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reservations/summary`,
        body: data,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}
export async function ReserveProperty(data: ReservationReqProps) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reservations`,
        body: data,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}
export async function PreCheck(id: number) {
    const apiObject: ApiObject = {
        method: 'PATCH',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reservation-payments/pre-payment-check/${id}`,
        body: null,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}

export async function OpenTransaction(data: TransactionType) {
    const apiObject: ApiObject = {
        method: 'PATCH',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reservation-payments/pay`,
        body: data,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}
export async function cancelExistingReservation({ data, id }: { data: { status: string, reason: string }, id: number }) {
    const apiObject: ApiObject = {
        method: 'PATCH',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reservations/cancelled/${id}`,
        body: data,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}

export async function getReservationSuccess(id: string) {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reservations/find-by-code?code=${id}`,
        body: null,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}

export async function getPDFToDownload(id: number) {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        arrayBufferType: true,
        multipart: false,
        endpoint: `api/v1/web/reservation-payments/download-reservation-pdf/${id}`,
        body: null,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}
export async function getReservationHistory({ page, propertyName, code, checkIn, checkOut }: { page: number, propertyName: string, code: string, checkIn: string, checkOut: string }) {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reservations/my?page=${page}&perPage=${5}&propertyName=${propertyName}&code=${code}&checkIn=${checkIn}&checkOut=${checkOut}`,
        body: null,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}