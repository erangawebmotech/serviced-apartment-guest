"use server"

import { GooglePlaceDetails } from "@/common/googlePlaceDetails.interface";
import { Client } from "@googlemaps/google-maps-services-js"
const client = new Client()

export const autoComplete = async (input: string) => {
    if (!input) return [];
    try {
        const response = await client.placeAutocomplete({
            params: {
                input,
                key: process.env.GOOGLE_API_KEY!,
                components: ["country:lk"],
            }
        });
        return response.data.predictions;
    } catch (error) {
        console.error("Error fetching predictions:", error);
        return [];
    }
};

export const getPlaceDetails = async (placeId: string): Promise<GooglePlaceDetails | null> => {
    if (!placeId || placeId === "undefined") return null;

    try {
        const response = await client.placeDetails({
            params: {
                place_id: placeId,
                key: process.env.GOOGLE_API_KEY!,
                fields: [
                    "address_components",
                    "adr_address",
                    "formatted_address",
                    "geometry",
                    "name",
                ],
            },
        });

        const result = response.data.result;
        if (!result) return null;

        return {
            address_components: result.address_components,
            adr_address: result.adr_address,
            formatted_address: result.formatted_address,
            geometry: result.geometry,
            name: result.name,
        };

    } catch (error) {
        console.error("Error fetching place details:", error);
        return null;
    }
};



// fields: [
//     'address_components', 'adr_address', 'business_status',
//     'current_opening_hours', 'formatted_address', 'geometry',
//     'icon', 'international_phone_number', 'name', 'opening_hours',
//     'photos', 'plus_code', 'rating', 'reviews'
// ],