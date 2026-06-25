"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";


export async function getDiscounts() {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: 'api/v1/web/properties/discount',
        body: null,
    };
    return await callApi(apiObject);
    
}
