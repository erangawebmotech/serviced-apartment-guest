import type {
  AddressComponent,
} from "@googlemaps/google-maps-services-js";


export interface GooglePlaceDetails {
    address_components?: AddressComponent[];
    adr_address?: string;
    formatted_address?: string;
    geometry?: Geometry;
    name?: string;
    place_id?: string;
}

// export interface AddressComponent {
//     long_name: string;
//     short_name: string;
//     types: AddressComponentType[];
// }

export type AddressComponentType =
    | "locality"
    | "political"
    | "administrative_area_level_1"
    | "administrative_area_level_2"
    | "country";

export interface Geometry {
    location: LatLng;
    viewport: Viewport;
}

export interface LatLng {
    lat: number;
    lng: number;
}

export interface Viewport {
    northeast: LatLng;
    southwest: LatLng;
}
