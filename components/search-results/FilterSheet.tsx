import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import PriceRangeAndChartMobile from "@/components/search-results/PriceRangeAndChartMobile";
import FilterLabel from "@/components/search-results/FilterLabel";
import Filters from "./Filters";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { useDispatch } from "react-redux";
import { clearAllFilters } from "@/store/reducers/filterReducer";
import Spinner from "../common/Spinner";
import { FilterDataProps } from "@/common/filter.interface";

const FilterSheet = ({
  filters = [],
  open,
  closeFilter,
  onFiltersChange,
  count,
  handleRating,
  handleHasBreakfast,
  hasBreakfast,
  fetching,
}: {
  filters: FilterDataProps | [];
  open: boolean;
  count: number;
  hasBreakfast: true | null;
  fetching: boolean;
  closeFilter: (open: boolean) => void;
  handleRating: (rating: any) => void;
  handleHasBreakfast: (status: true | null) => void;
  onFiltersChange?: (processedFilters: Record<string, Set<number>>) => void;
}) => {
  const dispatch = useDispatch();

  const handleFilterChange = (
    processedFilters: Record<string, Set<number>>
  ) => {
    onFiltersChange?.(processedFilters);
  };

  return (
    <Sheet open={open} onOpenChange={closeFilter}>
      <SheetContent className="bg-[#F7F7F7] p-0 pb-24 min-w-full h-full font-poppins">
        <ScrollArea className="h-full max-h-screen">
          <div className="w-full h-max">
            <SheetHeader className="p-5">
              <SheetTitle className="text-base text-left">Filters</SheetTitle>
              <Separator />
            </SheetHeader>
            <div className="px-5">
              <div className="relative py-5 border-b">
                <SheetTitle className="text-base text-left">
                  Your budget (per night)
                </SheetTitle>
                <PriceRangeAndChartMobile />
              </div>
              <div className="flex-col justify-between items-start gap-2 py-5 border-b w-full">
                <SheetTitle className="text-base text-left">
                  Property rating
                </SheetTitle>
                <div className="flex flex-col gap-3 mt-2">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <FilterLabel
                      key={rating}
                      description={`${rating} Star${rating > 1 ? "s" : ""}`}
                      value=""
                      id={`${rating}-rating`}
                      category={"rating"}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="px-5">
              <Filters
                filterData={filters}
                onFiltersChange={handleFilterChange}
                isMobile={true}
              />
            </div>

            <div className="flex flex-col justify-between items-start gap-2 px-5 py-5 border-b w-full">
              <SheetTitle className="text-base text-left">Other</SheetTitle>
              <div>
                <span className="flex justify-start items-center gap-2 hover:cursor-pointer fle">
                  <Checkbox
                    checked={hasBreakfast === true}
                    id="hasBreakfast"
                    onCheckedChange={(checked: boolean) => {
                      handleHasBreakfast(checked ? true : null);
                    }}
                    className="data-[state=checked]:bg-secondary border-secondary"
                  />
                  <Label
                    htmlFor="hasBreakfast"
                    className="font-light text-sm hover:cursor-pointer"
                  >
                    Breakfast Included
                  </Label>
                </span>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div
          className="-bottom-0 fixed flex justify-between items-center bg-white px-5 py-3 w-full"
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px",
          }}
        >
          <Button
            className="bg-transparent hover:bg-transparent shadow-none text-black"
            onClick={() => {
              dispatch(clearAllFilters());
            }}
          >
            Clear All
          </Button>
          <Button
            className="py-7 w-1/2"
            onClick={() => closeFilter(false)}
            disabled={fetching}
          >
            {fetching ? (
              <>
                <Spinner /> Finding
              </>
            ) : (
              `Show ${count} place${count > 1 ? "s" : ""}`
            )}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterSheet;
