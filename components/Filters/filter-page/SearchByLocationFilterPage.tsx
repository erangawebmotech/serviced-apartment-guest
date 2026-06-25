"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLenis } from "lenis/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { autoComplete, getPlaceDetails } from "@/lib/google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import Image from "next/image";

import img1 from "@/public/hero-images/locationIcons/img1.png";
import img2 from "@/public/hero-images/locationIcons/img2.png";
import img3 from "@/public/hero-images/locationIcons/img3.png";
import img4 from "@/public/hero-images/locationIcons/img4.png";
import img5 from "@/public/hero-images/locationIcons/img5.png";

interface SearchByLocationFilterPageProps {
  onLocationDetailsChange: (details: any) => void;
  defaultLocation?: string | null;
  selectedLocation?: any | null;
}

function throttle(func: (...args: any[]) => void, limit: number) {
  let lastFunc: NodeJS.Timeout | null = null;
  let lastRan: number | null = null;

  return function (this: any, ...args: any[]) {
    const context = this;
    const now = Date.now();

    if (lastRan === null || now - lastRan >= limit) {
      func.apply(context, args);
      lastRan = now;
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }
      lastFunc = setTimeout(() => {
        func.apply(context, args);
        lastRan = Date.now();
      }, limit - (now - lastRan));
    }
  };
}

const locations = [
  {
    place_id: "ChIJx1QVTkOA4zoRnH2TTEAIFik",
    value: "nuwara-eliya",
    label: "Nuwara Eliya",
    country: "Sri Lanka",
    src: img1,
  },
  {
    place_id: "ChIJO_eya5zu4joRPm8YCOkmFqU",
    value: "negombo",
    label: "Negombo",
    country: "Sri Lanka",
    src: img2,
  },
  {
    place_id: "ChIJ4_wyabtz4ToRA0zG-QO5NUo",
    value: "galle",
    label: "Galle",
    country: "Sri Lanka",
    src: img3,
  },
  {
    place_id: "ChIJJZrAW5Vl5DoR-4fE3trc-r0",
    value: "ella",
    label: "Ella",
    country: "Sri Lanka",
    src: img4,
  },
  {
    place_id: "ChIJA3B6D9FT4joRjYPTMk0uCzI",
    value: "colombo",
    label: "Colombo",
    country: "Sri Lanka",
    src: img5,
  },
];

export function SearchByLocationFilterPage({
  onLocationDetailsChange,
  defaultLocation,
  selectedLocation,
}: SearchByLocationFilterPageProps) {
  const [open, setOpen] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const wasManuallyCleared = useRef(false);

  const throttledSearch = useRef(
    throttle(async (searchValue: string) => {
      try {
        const results = await autoComplete(searchValue);
        setPredictions(results || []);
      } catch (error) {
        console.error("Autocomplete error:", error);
        setPredictions([]);
      }
    }, 300)
  ).current;

  const parseLocation = (description: string) => {
    const parts = description.split(", ");
    const city = parts[0] || "Unknown";
    const country = parts[parts.length - 1] || "Unknown";
    return { city, country };
  };

  useEffect(() => {
    if (wasManuallyCleared.current) {
      wasManuallyCleared.current = false;
      return;
    }

    const name =
      selectedLocation?.name || selectedLocation?.label || defaultLocation || "";
    setDisplayValue(name);
  }, [selectedLocation?.place_id]);

  useEffect(() => {
    if (!displayValue?.trim()) {
      setPredictions([]);
      if (selectedLocation) {
        onLocationDetailsChange(null);
      }
      return;
    }

    const selectedName = selectedLocation?.name || selectedLocation?.label;
    if (displayValue === selectedName) return;

    throttledSearch(displayValue);
  }, [displayValue]);

  const clearSelection = (event: React.MouseEvent) => {
    event.stopPropagation();
    wasManuallyCleared.current = true;
    setDisplayValue("");
    setPredictions([]);
    onLocationDetailsChange(null);
  };

  const handleSelectPrediction = async (place: any, label: string) => {
    setDisplayValue(label);
    setOpen(false);

    try {
      const result = await getPlaceDetails(place.place_id);
      const fullLocation = {
        ...result,
        name: label,
        place_id: place.place_id,
      };
      onLocationDetailsChange(fullLocation);
    } catch (err) {
      console.error("getPlaceDetails failed:", err);
      onLocationDetailsChange(null);
    }
  };

  const lenis = useLenis();
  useEffect(() => {
    open ? lenis?.stop() : lenis?.start();
  }, [open, lenis]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="flex justify-between items-center bg-transparent hover:bg-transparent shadow-none py-6 border-0 border-r rounded-none w-[358px] text-left hover:scale-[1.02] transition-transform duration-100 pointer-events-auto"
        >
          <span className="flex items-center gap-1 font-normal pointer-events-none">
            <MapPin className="search-icons" />
            {displayValue || "Where are you going?"}
          </span>
          {displayValue && (
            <button
              onClick={clearSelection}
              className="ml-2 text-gray-500 hover:text-gray-700 pointer-events-auto"
              style={{
                width: "16px",
                height: "16px",
                background: "transparent",
                border: "none",
              }}
              aria-label="Clear selection"
            >
              <X />
            </button>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="shadow-lg p-0 w-full md:w-[300px]">
        <Command>
          <CommandInput
            placeholder="Search location..."
            className="px-4 h-10 font-poppins"
            value={displayValue}
            onValueChange={setDisplayValue}
          />
          <CommandList className="font-poppins">
            <CommandEmpty>No locations found.</CommandEmpty>

            <CommandGroup heading="Popular destinations nearby">
              {locations.map((location) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={() =>
                    handleSelectPrediction(location, location.label)
                  }
                >
                  <Image src={location.src} alt={location.label} className="w-10" />
                  <div>
                    <p className="font-medium">{location.label}</p>
                    <p className="text-gray-500 text-xs">{location.country}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {predictions.length > 0 && (
              <CommandGroup heading="Suggested Locations">
                {predictions.map((prediction) => {
                  const { city, country } = parseLocation(prediction.description);
                  return (
                    <CommandItem
                      key={prediction.place_id}
                      value={prediction.description}
                      onSelect={() =>
                        handleSelectPrediction(prediction, prediction.description)
                      }
                    >
                      <MapPin className="mr-2 text-gray-500" />
                      <div>
                        <p className="font-medium">{city}</p>
                        <p className="text-gray-500 text-xs">{country}</p>
                      </div>
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
