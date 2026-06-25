"use client"

import * as React from "react"
import { MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLenis } from "lenis/react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState, useRef } from "react"
import { autoComplete } from "@/lib/google"
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js"
import img1 from "@/public/hero-images/locationIcons/img1.png"
import img2 from "@/public/hero-images/locationIcons/img2.png"
import img3 from "@/public/hero-images/locationIcons/img3.png"
import img4 from "@/public/hero-images/locationIcons/img4.png"
import img5 from "@/public/hero-images/locationIcons/img5.png"
import Image from "next/image"

// Utility to throttle function calls
function throttle(func: (...args: any[]) => void, limit: number) {
  let lastFunc: NodeJS.Timeout | null = null
  let lastRan: number | null = null

  return function (this: any, ...args: any[]) {
    const context = this
    const now = Date.now()

    if (lastRan === null || now - lastRan >= limit) {
      func.apply(context, args)
      lastRan = now
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc)
      }
      lastFunc = setTimeout(() => {
        func.apply(context, args)
        lastRan = Date.now()
      }, limit - (now - lastRan))
    }
  }
}

const locations = [
  { place_id: "ChIJx1QVTkOA4zoRnH2TTEAIFik", value: 'nuwara-eliya', label: "Nuwara Eliya", country: "Sri Lanka", src: img1 },
  { place_id: "ChIJO_eya5zu4joRPm8YCOkmFqU", value: 'negombo', label: "Negombo", country: "Sri Lanka", src: img2 },
  { place_id: "ChIJ4_wyabtz4ToRA0zG-QO5NUo", value: 'galle', label: "Galle", country: "Sri Lanka", src: img3 },
  { place_id: "ChIJJZrAW5Vl5DoR-4fE3trc-r0", value: 'ella', label: "Ella", country: "Sri Lanka", src: img4 },
  { place_id: "ChIJA3B6D9FT4joRjYPTMk0uCzI", value: 'colombo', label: "Colombo", country: "Sri Lanka", src: img5 },
]

export function SearchLocation({ onChangePlaceId }: { onChangePlaceId: (prediction: any) => void }) {
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState("")
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([])

  const throttledSearch = useRef(
    throttle(async (searchValue: string) => {
      try {
        const predictions = await autoComplete(searchValue)
        setPredictions(predictions || [])
        onChangePlaceId(predictions[0] ?? []);
      } catch (error) {
        console.error("Failed to fetch autocomplete results:", error)
        setPredictions([])
      }
    }, 300)

  ).current

  const parseLocation = (description: string) => {
    const parts = description.split(", ");
    const city = parts[0] || "Unknown";
    const country = parts[parts.length - 1] || "Unknown";
    return { city, country };
  };

  const clearSelection = (event: React.MouseEvent) => {
    event.stopPropagation()
    setValue("")
    setPredictions([])
  }

  useEffect(() => {
    if (value.trim()) {
      throttledSearch(value)
    } else {
      setPredictions([])
    }
  }, [value])

  const lenis = useLenis()
  useEffect(() => {
    if (open) {
      lenis?.stop()
    } else {
      lenis?.start()
    }
  }, [open, lenis])



  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-haspopup="dialog"
          aria-controls="radix-«rg»"
          data-state="closed"
          aria-label="Where are you going?"
          aria-expanded={open}
          className="flex justify-between items-center bg-transparent hover:bg-transparent py-6 border-[#807e7e] border-0 border-r rounded-none w-[358px] max-[1095px]:w-[230px] max-[1267px]:w-[260px] max-[1315px]:w-[290px] text-left transition-transform duration-100 pointer-events-auto"
        >
          <span className="flex items-center gap-1 font-normal max-[1315px]:text-sm text-base pointer-events-none">
            <MapPin className="search-icons" />
            {value ? value : "Where are you going?"}

          </span>
          {value && (
            <span
              onClick={clearSelection}
              className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer pointer-events-auto"
              style={{ width: "16px", height: "16px", background: "transparent", border: "none" }}
              aria-label="Clear selection"
            >
              <X />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="shadow-lg p-0 w-full md:w-[300px]">
        <Command>
          <CommandInput
            placeholder="Search location..."
            className="px-4 h-10 font-poppins"
            value={value}
            onChangeCapture={(e: any) => setValue(e.target.value)}
          />
          <CommandList className="font-poppins">
            <CommandEmpty>No locations found.</CommandEmpty>
            <CommandGroup heading="Popular destinations nearby">
              {locations.map((location: any) => (
                <CommandItem
                  key={location.value}
                  value={location.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : locations.find((location) => location.value === currentValue)?.label || currentValue)
                    onChangePlaceId(location)
                    setOpen(false)
                  }}
                >
                  {/* <MapPin className="mr-2 text-gray-500" /> */}
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
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : city);
                        onChangePlaceId(prediction || null)
                        setOpen(false);
                      }}
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
    </Popover >
  )
}