import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { SortingTypes } from "@/common/constants";

const SortByDrawer = ({
  open,
  closeFilter,
  handleChange,
}: {
  open: boolean;
  closeFilter: (isOpen: boolean) => void;
  handleChange: (value: string) => void;
}) => {
  const [selectedSort, setSelectedSort] = useState(SortingTypes[0].value);

  const handleSortChange = (value: string) => {
    setSelectedSort(value);
    handleChange(value);
    closeFilter(false); 
  };

  return (
    <Drawer 
      open={open} 
      onOpenChange={(isOpen) => closeFilter(isOpen)}
    >
      <DrawerContent className="font-poppins">
        <DrawerHeader>
          <DrawerTitle className="font-semibold text-lg text-left">
            Sort by
          </DrawerTitle>
          <Separator />
        </DrawerHeader>

        <RadioGroup
          value={selectedSort}
          onValueChange={handleSortChange}
          className="flex flex-col space-y-4 my-4 mb-10 px-5"
        >
          {SortingTypes.map((option, index) => (
            <label
              key={index}
              className="flex items-center space-x-3 text-sm cursor-pointer"
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <span>{option.label}</span>
            </label>
          ))}
        </RadioGroup>
      </DrawerContent>
    </Drawer>
  );
};

export default SortByDrawer;
