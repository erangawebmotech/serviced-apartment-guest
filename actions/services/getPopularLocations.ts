"use server"

import { getSpecialLocations } from "@/service/specialLocations"

export const getPopularLocations = async () => {
    const data = {
        locations: [
            "Colombo",
            "Galle",
            "Negombo", 
            "Kalutara"
        ]
    }
    const response = await getSpecialLocations(data)
    return response;
}