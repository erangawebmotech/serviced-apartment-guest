import { RootState } from "@/store/store";
import { X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
    removePropertyType,
    removeHighlight,
    removeAmenity,
    removeBedType,
} from "@/store/reducers/filterReducer";
import { FilterDataProps } from "@/common/filter.interface";

type FilterType = "propertyType" | "highlight" | "amenity" | "bedType";

interface ActiveTag {
    id: number;
    name: string;
    type: FilterType;
}

export const ActiveFilterTag = ({ filterData }: { filterData: FilterDataProps | [] }) => {
    if (Array.isArray(filterData)) return [];
    if (!filterData) return null;
    const dispatch = useDispatch();
    const filters = useSelector((state: RootState) => state.filters);
    const activeTags: ActiveTag[] = [
        ...(filters.propertyTypes || []).map(id => {
            const item = filterData?.propertyTypes?.find((item: any) => item.id === id);
            return item ? { ...item, type: "propertyType" as const } : null;
        }),
        ...(filters.highlights || []).map(id => {
            const item = filterData?.highlights?.find((item: any) => item.id === id);
            return item ? { ...item, type: "highlight" as const } : null;
        }),
        ...(filters.amenities || []).map(id => {
            const item = filterData?.amenities?.find((item: any) => item.id === id);
            return item ? { ...item, type: "amenity" as const } : null;
        }),
        ...(filters.bedTypes || []).map(id => {
            const item = filterData?.bedTypes?.find((item: any) => item.id === id);
            return item ? { ...item, type: "bedType" as const } : null;
        }),
    ].filter(Boolean) as ActiveTag[];

    const uniqueTags = activeTags.filter(
        (tag, index, self) =>
            index === self.findIndex((t) => t.id === tag.id && t.type === tag.type)
    );

    const handleRemove = (tag: ActiveTag) => {
        switch (tag.type) {
            case "propertyType":
                dispatch(removePropertyType(tag.id));
                break;
            case "highlight":
                dispatch(removeHighlight(tag.id));
                break;
            case "amenity":
                dispatch(removeAmenity(tag.id));
                break;
            case "bedType":
                dispatch(removeBedType(tag.id));
                break;
        }
    };

    return (
        <div className="flex flex-wrap gap-2">
            {uniqueTags.map((tag) => (
                <div
                    key={`${tag.type}-${tag.id}`}
                    className="flex items-center gap-1 bg-primary/10 hover:bg-primary/20 px-3 py-1 border border-primary rounded-full text-primary text-sm transition"
                >
                    <span className="font-poppins">{tag.name}</span>
                    <button onClick={() => handleRemove(tag)} className="!z-[1] hover:text-red-500">
                        <X className="w-4 h-4 cursor-pointer" />
                    </button>
                </div>
            ))}
        </div>
    );
};
