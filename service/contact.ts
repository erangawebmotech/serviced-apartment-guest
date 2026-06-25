"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";

export interface ContactFormData {
    name: string;
    email: string;
    contactNo: string;
    description: string;
}

export async function sendContactMessage(data: ContactFormData) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/inquiries/contact-us`,
        body: data,
    };
    return await callApi(apiObject);

}
