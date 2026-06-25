"use server"

import { getDiscounts } from "@/service/discounts";


export const loadInitialDiscounts = async () => {
    const response = await getDiscounts();
    return response;
}