"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";
import { FilteredPropertyDetailsProps } from "@/common/filter.interface";


export async function getFilters() {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/properties/filters`,
        body: null,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}
export async function getFilteredPropertyDetails(data: FilteredPropertyDetailsProps) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: false,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/properties`,
        body: data,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}
