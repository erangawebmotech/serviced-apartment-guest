"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";


export async function getHighlights(perPage:number) {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        // state:'refresh_token',
        endpoint: `api/v1/web/highlights?page=${0}&perPage=${perPage}`,
        body: null,
    };
    return await callApi(apiObject);
    
}
