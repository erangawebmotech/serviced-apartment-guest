import { StaticImageData } from "next/image";
import singleViewImage from '@/public/single-page/singleViewSample.png'
import testImage from '@/public/search-results/result-card-test-image.png'
import { DealsProps } from "./propertyCard.interface";



export interface UserPayload {
    refresh_token: string;
    access_token: string;
    user: {
        access_token: string;
        refresh_token: string;
        user: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
            hasHost: boolean;
            contactNo: string;
            lastLoggedAt: string;
            status: string;
            role: object;
            file: any;
            permissions: any[];
        }
    };
}

export interface Payload {
    user: UserPayload;
    expires: string;
}

export interface Position {
    left: number;
    width: number;
    opacity: number;
}

export interface TabProps {
    children: React.ReactNode;
    setPosition: React.Dispatch<React.SetStateAction<Position>>;
}

export interface CursorProps {
    position: Position;
}


export interface Locations {
    name: string;
    address: string,
    favorite: boolean,
    route: string;
    rating: number,
    bgImage: StaticImageData,
    hoverImage: StaticImageData,
}


export interface AboutPageProps {
    initialDeals: DealsProps[];
}


export interface StarRatingProps {
    rating: number;
    maxStars?: number;
    className?: string;
    size?: number;
}


interface Offer {
    icon: React.ReactNode;
    label: string;
}

export const offers: Offer[] = [
    { icon: 'FaWifi', label: "Free wifi" },
    { icon: 'MdOutlineAcUnit', label: "Air Conditioning" },
    { icon: 'FaUmbrellaBeach', label: "Sea View" },
    { icon: 'MdOutlineStar', label: "Top rated in area" },
    { icon: 'FaSwimmer', label: "Swimming pool" },
    { icon: 'MdOutlineBalcony', label: "Balcony" },
    { icon: 'FaCar', label: "Parking available" },
];


export const roomData = [
    {
        title: "Little Garden Double Room",
        discount: "15% off",
        image: singleViewImage,
        breakfastPrice: "5,854",
        features: ["Flat-screen TV", "Amenities", "Towel"],
        price: "1,200",
        originalPrice: "1,500",
        extras: [
            { name: "Parking", available: false },
            { name: "B&B", available: false },
        ],
        roomCount: 3,
    },
    {
        title: "Little Garden Double Room",
        discount: "15% off",
        image: testImage,
        breakfastPrice: "5,854",
        features: ["Flat-screen TV", "Amenities", "Towel"],
        price: "1,200",
        originalPrice: "1,500",
        extras: [
            { name: "Parking", available: false },
            { name: "B&B", available: false },
        ],
        roomCount: 1,
    },
    {
        title: "Little Garden Double Room",
        discount: "15% off",
        image: singleViewImage,
        breakfastPrice: "5,854",
        features: ["Flat-screen TV", "Amenities", "Towel"],
        price: "1,200",
        originalPrice: "1,500",
        extras: [
            { name: "Parking", available: false },
            { name: "B&B", available: false },
        ],
        roomCount: 2,
    }, {
        title: "Little Garden Double Room",
        discount: "15% off",
        image: testImage,
        breakfastPrice: "5,854",
        features: ["Flat-screen TV", "Amenities", "Towel"],
        price: "1,200",
        originalPrice: "1,500",
        extras: [
            { name: "Parking", available: false },
            { name: "B&B", available: false },
        ],
        roomCount: 2,
    }, {
        title: "Little Garden Double Room",
        discount: "15% off",
        image: testImage,
        breakfastPrice: "5,854",
        features: ["Flat-screen TV", "Amenities", "Towel"],
        price: "1,200",
        originalPrice: "1,500",
        extras: [
            { name: "Parking", available: false },
            { name: "B&B", available: false },
        ],
        roomCount: 2,
    }, {
        title: "Little Garden Double Room",
        discount: "15% off",
        image: singleViewImage,
        breakfastPrice: "5,854",
        features: ["Flat-screen TV", "Amenities", "Towel"],
        price: "1,200",
        originalPrice: "1,500",
        extras: [
            { name: "Parking", available: false },
            { name: "B&B", available: false },
        ],
        roomCount: 2,
    }, {
        title: "Little Garden Double Room",
        discount: "15% off",
        image: testImage,
        breakfastPrice: "5,854",
        features: ["Flat-screen TV", "Amenities", "Towel"],
        price: "1,200",
        originalPrice: "1,500",
        extras: [
            { name: "Parking", available: false },
            { name: "B&B", available: false },
        ],
        roomCount: 2,
    }
];

export const ratingsData = [
    { label: "Excellent", percentage: 100 },
    { label: "Very Good", percentage: 30 },
    { label: "Average", percentage: 10 },
    { label: "Poor", percentage: 5 },
    { label: "Terrible", percentage: 0 },
];

interface UnitDetailsProps {
    accommodationUnitId: number | null,
    subUnitIds: number[] | null,
    maxHeadCount: number | null
}
export interface ReservationReqProps {
    slug: string | null,
    maxHeadCount: number | null | undefined,
    unitDetails: UnitDetailsProps[] | null | undefined,
    checkIn: Date | string | null | undefined,
    checkOut: Date | string | null | undefined,
    adult: number | null,
    child: number | null,
    infant: number | null,
    nrpEnabled: boolean | null,
    pet: number | null,
    isEntireProperty: boolean,
    arrivalTime: Date | null | string,
    paymentType: string | null,
    specialRequest: string | null,
    userDetails: {
        firstName: string | null,
        lastName: string | null,
        email: string | null,
        countryCode: number | null | string,
        contactNo: number | null | string
    }
}
export enum paymentType {
    PAY_AT_PROPERTY = "PAY_AT_PROPERTY",
    CARD = "CARD",
}


export interface ReviewDataProps {
    description: string,
    slug: string,
    reservationCode: number | string,
    ratings: {
        count: number,
        ratingCategoryId: number
    }[],
};