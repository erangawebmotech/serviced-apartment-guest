export type Rating = 1 | 2 | 3 | 4 | 5;

export type CountState = {
    adults: number;
    children: number;
    rooms: number;
    pets: boolean;
};

export type TimelineItemType = {
    id: number,
    title: string,
    description: string,
    time: string
}


export type PrivacyStatementProps = {
    title: string,
    description: string,
    subDetails: string[],
    additionalDetails: string | null;
}

const actionTypes = {
    ADD_TOAST: "ADD_TOAST",
    UPDATE_TOAST: "UPDATE_TOAST",
    DISMISS_TOAST: "DISMISS_TOAST",
    REMOVE_TOAST: "REMOVE_TOAST",
} as const

export type ActionType = typeof actionTypes