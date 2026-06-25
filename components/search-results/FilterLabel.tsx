import React, { useState } from "react";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addAmenity,
  addBedType,
  addHighlight,
  addPropertyType,
  removeAmenity,
  removeBedType,
  removeHighlight,
  removePropertyType,
} from "@/store/reducers/filterReducer";
import { RootState } from "@/store/store";

interface FilterDetails {
  propertyTypes?: Set<string>;
  highlights?: Set<string>;
  amenities?: Set<string>;
  bedTypes?: Set<string>;
}

interface FilterLabelProps {
  description: string;
  value: string;
  isDynamic?: boolean;
  id: string;
  category: string;
}

const FilterLabel: React.FC<FilterLabelProps> = ({
  description,
  value,
  isDynamic = false,
  id,
  category,
}) => {
  const [count, setCount] = useState<number>(0);
  const dispatch = useDispatch();
  const filters = useSelector((state: RootState) => state.filters);

  const numericValue = isDynamic ? parseInt(value, 10) || 0 : 0;

  const [rawCategory, rawId] = category.split("-");
  const extractedCategory = rawCategory as keyof FilterDetails;
  const extractedId = Number(rawId);

  const isChecked = filters?.[extractedCategory]?.includes?.(extractedId);

  const handleCheckboxChange = () => {
    const dispatchMap: Record<string, { add: (id: number) => { type: string; payload: number; }; remove: (id: number) => { type: string; payload: number; } }> = {
      propertyTypes: {
        add: addPropertyType,
        remove: removePropertyType,
      },
      highlights: {
        add: addHighlight,
        remove: removeHighlight,
      },
      amenities: {
        add: addAmenity,
        remove: removeAmenity,
      },
      bedTypes: {
        add: addBedType,
        remove: removeBedType,
      },
    };

    const action = dispatchMap[extractedCategory];
    if (!action) return;

    if (isChecked) {
      dispatch(action.remove(extractedId));
    } else {
      dispatch(action.add(extractedId));
    }
  };

  const increment = () => setCount((prev) => Math.min(numericValue, prev + 1));
  const decrement = () => setCount((prev) => Math.max(0, prev - 1));

  return (
    <div className="flex justify-between items-center w-full">
      <div className="flex justify-between items-center space-x-2 w-full">
        <span className="flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
          <Checkbox
            checked={isChecked}
            id={id}
            onClick={handleCheckboxChange}
            className="data-[state=checked]:bg-secondary border-secondary"
          />
          <Label
            htmlFor={id}
            className="font-light text-sm hover:cursor-pointer"
          >
            {description}
          </Label>
        </span>

        {isDynamic ? (
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={decrement}
              disabled={count <= 0}
            >
              -
            </Button>
            <span className="font-light text-sm">{count}</span>
            <Button
              variant="outline"
              size="icon"
              className="w-8 h-8"
              onClick={increment}
              disabled={count >= numericValue}
            >
              +
            </Button>
          </div>
        ) : (
          <span className="font-light text-sm">{value}</span>
        )}
      </div>
    </div>
  );
};

export default FilterLabel;
