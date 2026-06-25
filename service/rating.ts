"use server"

import { ApiObject } from "@/lib/utils";
import { callApi } from "./apiService";
import { ReviewDataProps } from "@/common/interfaces";

export async function getRatingCategories() {
    const apiObject: ApiObject = {
        method: 'GET',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/rating-categories`,
        body: null,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}

export async function addReview(data: ReviewDataProps) {
    const apiObject: ApiObject = {
        method: 'POST',
        authentication: true,
        urlencoded: false,
        isWithoutPrefix: false,
        endpoint: `api/v1/web/reviews`,
        body: data,
    };
    try {
        const response = await callApi(apiObject);
        return response;
    } catch (error) {
        throw error;
    }

}