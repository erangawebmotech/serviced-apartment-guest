"use server"

import { getFilters, getFilteredPropertyDetails } from "@/service/Filter";


let cachedFilters: any = null;
let lastFetchTime = 0;

export async function getFilterDetails() {
  const CACHE_DURATION = 1000 * 60 * 5;

  if (cachedFilters && Date.now() - lastFetchTime < CACHE_DURATION) {
    return cachedFilters;
  }

  const response = await getFilters();
  cachedFilters = response;
  lastFetchTime = Date.now();
  return response;
}

export const getFilteredProperties = async ({ location, highlights, minMaxVal, adults, children, amenityIds, bedTypeIds, activeRating, propertyTypeIds, hasBreakfast, sortType = 'PRICE_ASC', page = 0, perPage = 5, checkIn, checkOut }:
  { minMaxVal: any, sortType: string, bedTypeIds: any, adults: number, checkIn: Date, checkOut: Date, children: number, activeRating: null | number, location: any; hasBreakfast: true | null, propertyTypeIds: any; amenityIds: any; highlights: any; page: number; perPage?: number; }) => {
  const dataObj = {
    location: location ? location : null,
    propertyTypeIds: propertyTypeIds ? propertyTypeIds : [],
    highlightIds: highlights ? highlights : [],
    amenityIds: amenityIds ? amenityIds : [],
    bedTypeIds: bedTypeIds ? bedTypeIds : [],
    minPrice: minMaxVal?.min || 0,
    maxPrice: minMaxVal.max || 0,
    rating: activeRating,
    page: page,
    adults: adults,
    checkIn: checkIn,
    checkOut: checkOut,
    children: children,
    perPage: perPage,
    hasBreakfast: hasBreakfast,
    sortType: sortType,
  }
  try {
    const response = await getFilteredPropertyDetails(dataObj)
    return response;
  } catch (error) {
    throw error;
  }
}

