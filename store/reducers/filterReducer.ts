// Define the interface for filter details
interface FilterDetails {
    propertyTypes: number[];
    highlights: number[];
    amenities: number[];
    bedTypes: number[];
}

// Action types
type FilterAction =
    | { type: 'SET_PROPERTY_TYPES'; payload: number[] }
    | { type: 'SET_HIGHLIGHTS'; payload: number[] }
    | { type: 'SET_AMENITIES'; payload: number[] }
    | { type: 'SET_BED_TYPES'; payload: number[] }
    | { type: 'ADD_PROPERTY_TYPE'; payload: number }
    | { type: 'REMOVE_PROPERTY_TYPE'; payload: number }
    | { type: 'ADD_HIGHLIGHT'; payload: number }
    | { type: 'REMOVE_HIGHLIGHT'; payload: number }
    | { type: 'ADD_AMENITY'; payload: number }
    | { type: 'REMOVE_AMENITY'; payload: number }
    | { type: 'ADD_BED_TYPE'; payload: number }
    | { type: 'REMOVE_BED_TYPE'; payload: number }
    | { type: 'CLEAR_ALL_FILTERS' };

// Initial state
const initialState: FilterDetails = {
    propertyTypes: [],
    highlights: [],
    amenities: [],
    bedTypes: [],
};

// Action types constants
const actionTypes = {
    SET_PROPERTY_TYPES: 'SET_PROPERTY_TYPES',
    SET_HIGHLIGHTS: 'SET_HIGHLIGHTS',
    SET_AMENITIES: 'SET_AMENITIES',
    SET_BED_TYPES: 'SET_BED_TYPES',
    ADD_PROPERTY_TYPE: 'ADD_PROPERTY_TYPE',
    REMOVE_PROPERTY_TYPE: 'REMOVE_PROPERTY_TYPE',
    ADD_HIGHLIGHT: 'ADD_HIGHLIGHT',
    REMOVE_HIGHLIGHT: 'REMOVE_HIGHLIGHT',
    ADD_AMENITY: 'ADD_AMENITY',
    REMOVE_AMENITY: 'REMOVE_AMENITY',
    ADD_BED_TYPE: 'ADD_BED_TYPE',
    REMOVE_BED_TYPE: 'REMOVE_BED_TYPE',
    CLEAR_ALL_FILTERS: 'CLEAR_ALL_FILTERS',
} as const;

// Action creators
export const setPropertyTypes = (propertyTypes: number[]) => ({
    type: actionTypes.SET_PROPERTY_TYPES,
    payload: propertyTypes,
});

export const setHighlights = (highlights: number[]) => ({
    type: actionTypes.SET_HIGHLIGHTS,
    payload: highlights,
});

export const setAmenities = (amenities: number[]) => ({
    type: actionTypes.SET_AMENITIES,
    payload: amenities,
});

export const setBedTypes = (bedTypes: number[]) => ({
    type: actionTypes.SET_BED_TYPES,
    payload: bedTypes,
});

export const addPropertyType = (id: number) => ({
    type: actionTypes.ADD_PROPERTY_TYPE,
    payload: id,
});

export const removePropertyType = (id: number) => ({
    type: actionTypes.REMOVE_PROPERTY_TYPE,
    payload: id,
});

export const addHighlight = (id: number) => {
    return ({
        type: actionTypes.ADD_HIGHLIGHT,
        payload: id,
    })
};

export const removeHighlight = (id: number) => ({
    type: actionTypes.REMOVE_HIGHLIGHT,
    payload: id,
});

export const addAmenity = (id: number) => ({
    type: actionTypes.ADD_AMENITY,
    payload: id,
});

export const removeAmenity = (id: number) => ({
    type: actionTypes.REMOVE_AMENITY,
    payload: id,
});

export const addBedType = (id: number) => ({
    type: actionTypes.ADD_BED_TYPE,
    payload: id,
});

export const removeBedType = (id: number) => ({
    type: actionTypes.REMOVE_BED_TYPE,
    payload: id,
});

export const clearAllFilters = () => ({
    type: actionTypes.CLEAR_ALL_FILTERS,
});

const filterReducer = (state = initialState, action: FilterAction): FilterDetails => {
    switch (action.type) {
        case actionTypes.SET_PROPERTY_TYPES:
            const updatedPropertyTypes = action.payload;
            return { ...state, propertyTypes: updatedPropertyTypes };

        case actionTypes.SET_HIGHLIGHTS: {
            const newHighlights: number[] = action.payload;

            const deduplicatedPayload = Array.from(new Set(newHighlights));

            const existingSet = new Set(state.highlights);

            const uniqueNewHighlights = deduplicatedPayload.filter(h => !existingSet.has(h));

            return {
                ...state,
                highlights: [...state.highlights, ...uniqueNewHighlights],
            };
        }



        case actionTypes.SET_AMENITIES:
            const updatedAmenities = action.payload;
            return { ...state, amenities: updatedAmenities };

        case actionTypes.SET_BED_TYPES:
            const updatedBedTypes = action.payload;
            return { ...state, bedTypes: updatedBedTypes };

        case actionTypes.ADD_PROPERTY_TYPE:
            const addedPropertyType = action.payload;
            const newPropertyTypes = [...state.propertyTypes, addedPropertyType];
            return { ...state, propertyTypes: newPropertyTypes };

        case actionTypes.REMOVE_PROPERTY_TYPE:
            const removedPropertyType = action.payload;
            const propertyTypesAfterRemoval = state.propertyTypes.filter(id => id !== removedPropertyType);
            return { ...state, propertyTypes: propertyTypesAfterRemoval };

        case actionTypes.ADD_HIGHLIGHT:
            const addedHighlight = action.payload;
            const newHighlights = [...state.highlights, addedHighlight];
            const var1 = { ...state, highlights: newHighlights };
            return var1;

        case actionTypes.REMOVE_HIGHLIGHT:
            const removedHighlight = action.payload;
            const currentUrl = new URL(window.location.href);
            const filterID = currentUrl.searchParams.get('filter')
            if (filterID === removedHighlight?.toString()) {
                currentUrl.searchParams.set("filter", '');;
                window.history.replaceState(null, "", currentUrl.toString());
            }
            const highlightsAfterRemoval = state.highlights.filter(id => id !== removedHighlight);
            return { ...state, highlights: highlightsAfterRemoval };

        case actionTypes.ADD_AMENITY:
            const addedAmenity = action.payload;
            const newAmenities = [...state.amenities, addedAmenity];
            return { ...state, amenities: newAmenities };

        case actionTypes.REMOVE_AMENITY:
            const removedAmenity = action.payload;
            const amenitiesAfterRemoval = state.amenities.filter(id => id !== removedAmenity);
            return { ...state, amenities: amenitiesAfterRemoval };

        case actionTypes.ADD_BED_TYPE:
            const addedBedType = action.payload;
            const newBedTypes = [...state.bedTypes, addedBedType];
            return { ...state, bedTypes: newBedTypes };

        case actionTypes.REMOVE_BED_TYPE:
            const removedBedType = action.payload;
            const bedTypesAfterRemoval = state.bedTypes.filter(id => id !== removedBedType);
            return { ...state, bedTypes: bedTypesAfterRemoval };

        case actionTypes.CLEAR_ALL_FILTERS:
            return { ...state, propertyTypes: [], highlights: [], amenities: [], bedTypes: [] };

        default:
            return state;
    }
};



export default filterReducer;
