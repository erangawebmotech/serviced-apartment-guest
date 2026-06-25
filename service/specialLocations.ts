"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";


export async function getSpecialLocations(data: {locations: string[]}) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: 'api/v1/web/properties/special-location',
        body: data,
    };
    return await callApi(apiObject);
    
}
