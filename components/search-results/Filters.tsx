import { useEffect, useState } from "react";
import { FilterDataProps, FilterSectionProps } from "@/common/filter.interface";
import FilterSection from "./FilterSection";

const Filters = ({ filterData, onFiltersChange, isMobile }: { filterData: FilterDataProps | [], isMobile?: boolean, onFiltersChange?: (processedFilters: Record<string, Set<number>>) => void; }) => {

    const [dynamicFilters, setDynamicFilters] = useState<{ id: string; title: string; filters: { id: string; description: string; value: string; isDynamic: boolean }[] }[]>([]);

    function formatTitle(key: string) {
        return key
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/_/g, " ")
            .replace(/^\w/, (c) => c.toUpperCase());
    }


    function convertToDataArray(filterData: FilterDataProps | []): FilterSectionProps[] {
        return Object.entries(filterData).map(([key, items], sectionIndex) => {
            const title = formatTitle(key);

            const filters = items.map((item, index) => ({
                id: `${key}-${item.id ?? index}`,
                description: item.name,
                value: item.count?.toString() ?? "",
                isDynamic: false,
            }));

            return {
                id: `${key}-${sectionIndex}`,
                title,
                filters,
            };
        });
    }

    useEffect(() => {
        if (filterData) {
            const formattedFilters = convertToDataArray(filterData);
            setDynamicFilters(formattedFilters);
        }
    }, [filterData]);

    const handleFiltersChange = (processedFilters: Record<string, Set<number>>) => {
        onFiltersChange?.(processedFilters)
    };

    return (
        <div>
            {dynamicFilters.map((section) => (
                <FilterSection
                    key={section.id}
                    title={section.title}
                    filters={section.filters}
                    onFiltersChange={handleFiltersChange}
                    isMobile={isMobile}
                />
            ))}
        </div>
    );
};

export default Filters;
