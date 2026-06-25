import { useEffect, useState } from "react";
import FilterLabel from "@/components/search-results/FilterLabel";
import { ArrowDown } from "lucide-react";

const FilterSection = ({
  title,
  filters,
  onFiltersChange,
  isMobile,
}: {
  title: string;
  filters: {
    id: string;
    description: string;
    value: string;
    isDynamic: boolean;
  }[];
  isMobile?: boolean;
  onFiltersChange: (processedFilters: Record<string, Set<number>>) => void;
}) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const toggleShowAll = () => setShowAll((prev) => !prev);

  const displayedFilters = showAll ? filters : filters.slice(0, 5);
  const remainingFiltersCount = filters.length - 5;

  useEffect(() => {
    const processFilters = (filters: string[]): Record<string, Set<number>> => {
      return filters.reduce((acc, filter) => {
        const [key, value] = filter.split("-");
        const numericValue = parseInt(value, 10);

        if (!acc[key]) {
          acc[key] = new Set();
        }

        acc[key].add(numericValue);

        return acc;
      }, {} as Record<string, Set<number>>);
    };

    const processedFilters = processFilters(selectedFilters);

    onFiltersChange(processedFilters);
  }, [selectedFilters, onFiltersChange]);

  return (
    <div className="flex flex-col justify-between items-start gap-3 py-5 border-b w-full">
      {isMobile ? (
        <span className="font-semibold text-base">{title}</span>
      ) : (
        <span className="font-medium text-sm">{title}</span>
      )}
      {displayedFilters.map((filter) => {
        return (
          <FilterLabel
            key={filter.id}
            id={filter.id}
            description={filter.description}
            value={filter.value}
            isDynamic={filter.isDynamic}
            category={filter.id}
          />
        );
      })}
      {filters.length > 5 && (
        <div
          className="flex items-center gap-2 w-full text-blue-500 cursor-pointer"
          onClick={toggleShowAll}
        >
          {showAll ? (
            <span className="font-light text-sm">Show Less</span>
          ) : (
            <div className="flex justify-between items-center w-full">
              <div className="flex justify-center items-start gap-1">
                <ArrowDown size={18} />
                <span className="font-light text-sm">Show All</span>
              </div>
              <span className="font-light text-sm">
                {remainingFiltersCount}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterSection;
