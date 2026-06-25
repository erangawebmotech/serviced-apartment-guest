"use server"

import { ContactFormData, sendContactMessage } from "@/service/contact";
import { verifyCaptchaToken } from "../utils/captcha";

export const sendMessage = async ({ data, token }: { data: ContactFormData, token: string | null }) => {

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

    if (!data || !data.name || !data.email || !data.contactNo || !data.description) {
        return {
            error: true,
            errors: {
                status: 400,
                message: "All fields are required"
            }
        }
    } 

    try {
        const res = await sendContactMessage(data);
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