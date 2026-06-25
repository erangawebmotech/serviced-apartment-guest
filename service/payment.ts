
"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";


export async function fetchPaymentDetailsFromPaymentCode(code: string) {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reservation-payments/extract-payment-code/${code}`,
        body: null,
    };
    return await callApi(apiObject);

}

export async function changePaymentMethodAfterReservation(payment_Type: string,id:number) {
    const apiObject: ApiObject = {
        method: 'PATCH',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reservations/change-payment-type/${id}?paymentType=${payment_Type}`,
        body: null,
    };
    return await callApi(apiObject);

}
