export interface FilteredPropertyDetailsProps {
    location: any,
    propertyTypeIds: number[] | [],
    highlightIds: number[] | [],
    amenityIds: number[] | [],
    bedTypeIds: number[] | [],
    minPrice: number,
    maxPrice: number,
    rating: number | null,
    page: number,
    adults: number,
    checkIn: Date,
    checkOut: Date,
    children: number,
    perPage: number,
    hasBreakfast: boolean | null,
    sortType: string,
}




type FilterItem = {
    id: number;
    name: string;
    count?: number;
};

export type FilterDataProps = Record<string, FilterItem[]>;

type ProcessedFilter = {
    id: string;
    description: string;
    value: string;
    isDynamic: boolean;
};

export type FilterSectionProps = {
    id: string;
    title: string;
    filters: ProcessedFilter[];
};
