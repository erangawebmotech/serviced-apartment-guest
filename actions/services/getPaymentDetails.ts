"use server"

import { fetchPaymentDetailsFromPaymentCode } from "@/service/payment";

export const getPaymentDetailsFromPaymentCode = async (code: string) => {

    try {
        const response = await fetchPaymentDetailsFromPaymentCode(code);
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