"use server"

import { getHighlights } from "@/service/highlights";

export const loadInitialHighlights = async (perPage:number) => {
    const response = await getHighlights(perPage);
    return response;
}