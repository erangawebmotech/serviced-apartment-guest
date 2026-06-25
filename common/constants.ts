export const VERIFY_CODE = 'verify_code';
export const BASIC_AUTH = 'basic_auth';
export const REFRESH_TOKEN = 'refresh_token';
export const ACCESS_TOKEN = 'access_token';
export const CSRF_TOKEN_KEY = 'csrf_token';

export const PROPERTY_TYPES = {
    APARTMENT: 'apartment',
    HOTEL: 'hotel',
    ROOM: 'room',
}

export enum PAYMENT_TYPES {
    PAY_AT_PROPERTY = 'PAY_AT_PROPERTY',
    CARD = 'CARD',
}
export enum PAYMENT_STATUS_TYPES {
    SUCCESS = 'SUCCESS',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    CANCELLED = 'CANCELLED',
    PENDING = 'PENDING',
    FAILED = 'FAILED',
    CHECKED_IN = 'CHECKED_IN',
    CHECKED_OUT = 'CHECKED_OUT',
    CANCELLED_BY_GUEST = 'CANCELLED_BY_GUEST',

}

export enum RESERVATION_STATUS_TYPES {
    PENDING = 'PENDING',
    REJECTED = 'REJECTED',
    APPROVED = "APPROVED",
    CANCELLED = "CANCELLED",
    CANCELLED_BY_GUEST = "CANCELLED_BY_GUEST",
    CANCELLED_BY_HOST = "CANCELLED_BY_HOST",
    CHECKED_IN = "CHECKED_IN",
    NO_SHOW = "NO_SHOW",
    CHECKED_OUT = "CHECKED_OUT",
}

export type TransactionType = {
    reservationId: number,
    amount: number,
    currency: string,
    redirectUrl: string,
    customerName: string,
    customerEmail: string,

}

export type AccessType = 'CUSTOMER_EMAIL_SIGN_UP' | 'ADMIN' | 'SUPER_ADMIN';
export type PASSWORDRESETACTIONTYPE = 'RESET_PASSWORD' | 'UPDATE_PASSWORD';

interface SortingType {
    label: string;
    value: string;
}

export const SortingTypes: SortingType[] = [
    { label: "Price (lowest first)", value: "PRICE_ASC" },
    { label: "Price (highest first)", value: "PRICE_DESC" },
    { label: "Property rating (low to high)", value: "RATING_ASC" },
    { label: "Property rating (high to low)", value: "RATING_DESC" },
];
