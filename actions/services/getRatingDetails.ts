"use server"

import { ReviewDataProps } from "@/common/interfaces";
import { addReview, getRatingCategories } from "@/service/rating";

export const getRatingCategoriesData = async () => {
    try {
        const res = await getRatingCategories();
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
export const addNewReview = async (data: ReviewDataProps) => {
    try {
        const res = await addReview(data);
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