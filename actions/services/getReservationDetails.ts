"use server"

import { PAYMENT_STATUS_TYPES, TransactionType } from "@/common/constants";
import { ReservationReqProps } from "@/common/interfaces";
import { cancelExistingReservation, getReservationHistory, getReservationSuccess, getReservationSummary, OpenTransaction, PreCheck, ReserveProperty } from "@/service/reservation";
import { verifyCaptchaToken } from "../utils/captcha";



export const getReservationSummaryDetails = async (data: ReservationReqProps) => {

    try {
        const response = await getReservationSummary(data);
        return response;
    } catch (error: any) {
        return {
            error: true,
            errors: {
                message: error.message || "Something went wrong",
                status: error.status || 500,
            },
        };
    }

}

export const addReservation = async ({ reservationObject, token }: { reservationObject: ReservationReqProps, token: string | null }) => {


    if (!token) {
        return {
            error: true,
            errors: {
                status: 401,
                message: "Token not Found"
            }
        }
    }

    const captchaData = await verifyCaptchaToken(token)

    if (!captchaData) {
        return {
            error: true,
            errors: {
                status: 401,
                message: "Captcha Failed"
            }
        }
    }
    if (!captchaData.success || captchaData.score < 0.5) {

        return {
            error: true,
            errors: {
                status: 401,
                message: !captchaData.success ? captchaData["error-codes"] : undefined
            }
        }

    }

    try {
        const res = await ReserveProperty(reservationObject);
        return res;
    } catch (err: any) {
        console.log(err)
        return {
            error: true,
            errors: {
                status: err?.status || 500,
                message: err?.message || "Internal Server Error"
            }
        }
    }

}


export const reservationPreCheck = async (id: number) => {
    try {
        const res = await PreCheck(id);
        return res;
    } catch (err: any) {
        console.log(err)
        return {
            error: true,
            errors: {
                status: err?.status || 500,
                message: err?.message || "Internal Server Error"
            }
        }
    }

}

export const createTransaction = async (data: TransactionType) => {

    try {
        const res = await OpenTransaction(data);
        return res;
    } catch (err: any) {
        console.log(err)
        return {
            error: true,
            errors: {
                status: err?.status || 500,
                message: err?.message || "Internal Server Error"
            }
        }
    }

}
export const cancelReservation = async ({ reason, id }: { reason: string, id: number }) => {

    const data = {
        status: PAYMENT_STATUS_TYPES.CANCELLED_BY_GUEST,
        reason: reason
    }
    try {
        const res = await cancelExistingReservation({ data: data, id: id });
        return res;
    } catch (err: any) {
        console.log(err)
        return {
            error: true,
            errors: {
                status: err?.status || 500,
                message: err?.message || "Internal Server Error"
            }
        }
    }

}

export const getReservationSuccessData = async (id: string) => {
    try {
        const res = await getReservationSuccess(id);
        return res;
    } catch (err: any) {
        console.log(err)
        return {
            error: true,
            errors: {
                status: err?.status || 500,
                message: err?.message || "Internal Server Error"
            }
        }
    }

}
export const getReservationHistoryData = async ({ page, propertyName, code, checkIn, checkOut }: { page: number, propertyName: string, code: string, checkIn: string, checkOut: string }) => {
    try {
        const res = await getReservationHistory({ page: page, propertyName: propertyName, code: code, checkIn: checkIn, checkOut: checkOut });
        return res;
    } catch (err: any) {
        console.log(err)
        return {
            error: true,
            errors: {
                status: err?.status || 500,
                message: err?.message || "Internal Server Error"
            }
        }
    }

}