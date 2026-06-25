"use client";

import * as React from "react";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { addDays, format, isBefore, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { useEffect, useRef, useState } from "react";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { FaSearch } from "react-icons/fa";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "react-responsive";
import img1 from "@/public/hero-images/locationIcons/img1.png";
import img2 from "@/public/hero-images/locationIcons/img2.png";
import img3 from "@/public/hero-images/locationIcons/img3.png";
import img4 from "@/public/hero-images/locationIcons/img4.png";
import img5 from "@/public/hero-images/locationIcons/img5.png";
import Image, { StaticImageData } from "next/image";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { autoComplete, getPlaceDetails } from "@/lib/google";
import clsx from "clsx";
import { GooglePlaceDetails } from "@/common/googlePlaceDetails.interface";

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

// function throttle(func: (...args: any[]) => void, limit: number) { // eslint-disable-line @typescript-eslint/no-explicit-any 
//   let lastFunc: NodeJS.Timeout | null = null;
//   let lastRan: number | null = null;

//   return function (this: any, ...args: any[]) { // eslint-disable-line @typescript-eslint/no-explicit-any
//     const context = this;
//     const now = Date.now();

//     if (lastRan === null || now - lastRan >= limit) {
//       func.apply(context, args);
//       lastRan = now;
//     } else {
//       if (lastFunc) {
//         clearTimeout(lastFunc);
//       }
//       lastFunc = setTimeout(() => {
//         func.apply(context, args);
//         lastRan = Date.now();
//       }, limit - (now - lastRan));
//     }
//   };
// }


function throttle<F extends (...args: never[]) => unknown>(
  func: F,
  limit: number
): (...args: Parameters<F>) => void {
  let lastFunc: ReturnType<typeof setTimeout> | null = null;
  let lastRan: number | null = null;

  return (...args: Parameters<F>): void => {
    const now = Date.now();

    if (lastRan === null || now - lastRan >= limit) {
      void func(...args);
      lastRan = now;
    } else {
      if (lastFunc) {
        clearTimeout(lastFunc);
      }

      lastFunc = setTimeout(() => {
        void func(...args);
        lastRan = Date.now();
      }, limit - (now - lastRan));
    }
  };
}


interface SearchByLocationFilterPageProps {
  onLocationDetailsChange: (details: GooglePlaceDetails | null) => void;
  defaultLocation: string;
  handleSearchParams: () => void;
  onChangeCounts: (
    adults: number,
    children: number,
    rooms: number,
    pets: boolean
  ) => void;
  /** Synced from URL / server search params (same source as desktop guest picker). */
  defaultCount: {
    adult: number;
    children: number;
  };
  defaultDateRange: { from?: string; to?: string };
  onDateChange: (date: DateRange | undefined) => void;
  isCompact: boolean;
  /** Disables Search while results or location details are loading (anti-spam). */
  isSearchBusy?: boolean;
}
const parseDate = (dateStr: string | undefined) => {
  if (!dateStr) return undefined;
  const parsedDate = parseISO(dateStr);
  return isValid(parsedDate) ? parsedDate : undefined;
};

const MobileSearchContainer = ({
  onLocationDetailsChange,
  defaultLocation,
  handleSearchParams,
  onChangeCounts,
  defaultCount,
  defaultDateRange,
  onDateChange,
  isCompact,
  isSearchBusy = false,
}: SearchByLocationFilterPageProps) => {
  const [open, setOpen] = useState(false);
  const [openCalender, setOpenCalender] = useState(false);
  const [openGuests, setOpenGuests] = useState<boolean>(false);
  const [value, setValue] = useState<string| undefined | null>("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>(undefined);
  const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([]);
  const [isAtTop, setIsAtTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY < 10) {
        setIsAtTop(true);
      } else {
        setIsAtTop(false);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const isMediumScreen = useMediaQuery({ minWidth: 640, maxWidth: 971 });

  const increment = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number
  ) => {
    setter((prev) => prev + value);
  };

  const decrement = (
    setter: React.Dispatch<React.SetStateAction<number>>,
    value: number
  ) => {
    setter((prev) => Math.max(0, prev - value));
  };

  const clearSelection = (event: React.MouseEvent) => {
    event.stopPropagation();
    setValue(undefined);
    setPredictions([]);
    onLocationDetailsChange(null);
  };

  useEffect(() => {
    setDate({
      from: new Date(),
      to: addDays(new Date(), 3),
    });
  }, []);

  useEffect(() => {
    if (defaultDateRange) {
      setDate({
        from: parseDate(defaultDateRange?.from),
        to: parseDate(defaultDateRange?.to),
      });
    }
  }, [defaultDateRange]);

  const parseLocation = (description: string) => {
    const parts = description.split(", ");
    const city = parts[0] || "Unknown";
    const country = parts[parts.length - 1] || "Unknown";
    return { city, country };
  };

  const throttledSearch = useRef(
    throttle(async (searchValue: string) => {
      try {
        const predictions = await autoComplete(searchValue);
        setPredictions(predictions || []);
      } catch (error) {
        console.error("Failed to fetch autocomplete results:", error);
        setPredictions([]);
      }
    }, 300)
  ).current;

  // useEffect(() => {
  //   if (selectedPrediction) {
  //     getLocationDetails();
  //   }
  // }, [selectedPrediction]);

  // const getLocationDetails = async () => {
  //   const response = await getPlaceDetails(selectedPrediction.place_id);
  //   const fullLocation = {
  //     ...response,
  //     place_id: selectedPrediction.place_id,
  //   };
  //   onLocationDetailsChange(fullLocation);
  // };

  useEffect(() => {
    if (defaultLocation == "Unknown" || defaultLocation === "null") {
      setValue(undefined);
      return;
    }
    setValue(defaultLocation);
  }, [defaultLocation]);

  useEffect(() => {
    if (!value) {
      return;
    }
    if (value.trim()) {
      throttledSearch(value);
    } else {
      setPredictions([]);
    }
  }, [value, throttledSearch]);

  useEffect(() => {
    onChangeCounts(adults, children, 1, false);
  }, [adults, children]);

  useEffect(() => {
    setAdults(Number(defaultCount.adult) || 1);
    setChildren(Number(defaultCount.children) || 0);
  }, [defaultCount.adult, defaultCount.children]);

  return (
    <div
      className={clsx(
        "w-full max-[1000px]:w-[90%] font-poppins transition-all duration-300 ease-in-out",
        isAtTop
          ? "relative glass-bg rounded-xl transition-all duration-300 ease-in-out"
          : "fixed top-[74px] z-[51] bg-[#f7f7f7] pb-3 rounded-none transition-all duration-300 ease-in-out"
      )}
    >
      <div
        className={clsx(
          "overflow-hidden transition-all duration-500 ease-in-out will-change-[max-height,opacity]",
          isCompact
            ? "opacity-0 max-h-0 pointer-events-none"
            : "opacity-100 max-h-[500px] pointer-events-auto"
        )}
      >
        <div>
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="flex justify-between items-center bg-transparent py-6 border border-[#807e7e] rounded-none rounded-tl-xl rounded-tr-xl w-full text-left"
              >
                <span className="flex items-center gap-1 font-normal max-[1315px]:text-sm text-base">
                  <MapPin className="search-icons" />
                  {/* {value
                                    ? locations.find((location) => location.value === value)?.label
                                    : "Where are you going?"} */}
                  {value ? value : "Where are you going?"}
                </span>
                {value && (
                  <button
                    onClick={clearSelection}
                    className="ml-2 text-gray-500 hover:text-gray-700 cursor-pointer"
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
            </DrawerTrigger>

            <DrawerContent className="bg-white rounded-t-xl h-[80vh] font-poppins">
              <DrawerHeader className="px-4 pt-4 pb-2">
                <DrawerTitle className="font-semibold text-lg text-left">
                  Search for a location
                </DrawerTitle>
              </DrawerHeader>
              <div className="p-4">
                <Command>
                  <CommandInput
                    placeholder="Search location..."
                    className="px-4 h-10 font-poppins"
                    value={value || ""}
                    onChangeCapture={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                  />
                  <CommandList className="font-poppins">
                    <CommandEmpty>No locations found.</CommandEmpty>
                    <p className="px-4 py-2 font-semibold text-gray-700 text-sm">
                      Popular destinations nearby
                    </p>

                    {locations.map((location: {
                      place_id: string,
                      value: string,
                      label: string,
                      country: string,
                      src: StaticImageData,
                    }) => (
                      <CommandItem
                        key={location.value}
                        value={location.value}
                        // onSelect={(currentValue) => {
                        //   setValue(
                        //     currentValue === value
                        //       ? ""
                        //       : locations.find(
                        //           (location) => location.value === currentValue
                        //         )?.label || currentValue
                        //   );
                        //   setSelectedPrediction(location);
                        //   setOpen(false);
                        // }}
                        onSelect={async () => {
                          setOpen(false);
                          setValue(location.label); // use display label
                          try {
                            const result = await getPlaceDetails(location.place_id);
                            const fullLocation = {
                              ...result,
                              name: location.label,
                              place_id: location.place_id,
                            };
                            onLocationDetailsChange(fullLocation);
                          } catch (err) {
                            console.error("getPlaceDetails failed:", err);
                            onLocationDetailsChange(null);
                          }
                        }}

                      >
                        <Image
                          src={location.src}
                          alt={location.label}
                          className="w-10"
                        />
                        <div>
                          <p className="font-medium">{location.label}</p>
                          <p className="text-gray-500 text-xs">
                            {location.country}
                          </p>
                        </div>
                      </CommandItem>
                    ))}
                    {predictions.length > 0 && (
                      <CommandGroup heading="Suggested Locations">
                        {predictions.map((prediction) => {
                          const { city, country } = parseLocation(
                            prediction.description
                          );

                          return (
                            <CommandItem
                              key={prediction.place_id}
                              value={prediction.description}
                              // onSelect={(currentValue) => {
                              //   setValue(currentValue === value ? "" : city);
                              //   setSelectedPrediction(prediction);
                              //   setOpen(false);
                              // }}
                              onSelect={async () => {
                                setOpen(false);
                                const { city } = parseLocation(prediction.description);
                                setValue(city);
                                try {
                                  const result = await getPlaceDetails(prediction.place_id);
                                  const fullLocation = {
                                    ...result,
                                    name: prediction.description,
                                    place_id: prediction.place_id,
                                  };
                                  onLocationDetailsChange(fullLocation);
                                } catch (err) {
                                  console.error("getPlaceDetails failed:", err);
                                  onLocationDetailsChange(null);
                                }
                              }}

                            >
                              <MapPin className="mr-2 text-gray-500" />
                              <div>
                                <p className="font-medium">{city}</p>
                                <p className="text-gray-500 text-xs">
                                  {country}
                                </p>
                              </div>
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    )}
                  </CommandList>
                </Command>
              </div>
              <DrawerFooter className="flex justify-end p-4 border-gray-200 border-t">
                <DrawerClose asChild>
                  <Button className="w-full">Done</Button>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <div className="flex max-[600px]:flex-col">
          <div className="w-[50%] max-[600px]:w-full">
            <Drawer open={openCalender} onOpenChange={setOpenCalender}>
              <DrawerTrigger asChild>
                <Button
                  id="date"
                  variant={"outline"}
                  className={cn(
                    "justify-start bg-transparent py-6 border border-[#807e7e] rounded-none max-[600px]:rounded-none rounded-bl-xl w-full font-normal max-[1315px]:text-sm text-base text-left",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="search-icons" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </DrawerTrigger>

              <DrawerContent className="flex flex-col justify-between bg-white p-4 rounded-t-xl h-[66vh] max-h-[90vh] overflow-y-auto font-poppins">
                <DrawerHeader className="px-4 pt-4 pb-2">
                  <h2 className="font-semibold text-lg">Select Date</h2>
                </DrawerHeader>

                <div className="flex flex-1 justify-center items-center">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    // onSelect={setDate}
                    onSelect={(selectedRange: DateRange | undefined) => {
                      if (!selectedRange) return;

                      const { from, to } = selectedRange;
                      if (
                        from &&
                        to &&
                        format(from, "yyyy-MM-dd") === format(to, "yyyy-MM-dd")
                      ) {
                        setDate({ from, to: undefined });
                        return;
                      }
                      if (from && to) {
                        if (date?.from && date?.to) {
                          if (isBefore(from, date.from)) {
                            setDate({ from, to: undefined });
                            onDateChange({ from, to: undefined });
                          } else {
                            setDate({ from: to, to: undefined });
                            onDateChange({ from: to, to: undefined });
                          }
                        } else {
                          setDate({ from, to });
                          onDateChange({ from, to });
                        }
                      }
                      // onChange(selectedRange)
                    }}
                    numberOfMonths={isMediumScreen ? 2 : 1}
                    className="custom-calendar"
                    style={{
                      transform: isMediumScreen ? "scale(1.15)" : "scale(1.15)",
                      transformOrigin: "center",
                    }}
                  />
                </div>
                <DrawerFooter className="flex justify-end p-4 border-gray-200 border-t">
                  <DrawerClose asChild>
                    <Button className="w-full">Done</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          <div className="w-[50%] max-[600px]:w-full">
            <Drawer open={openGuests} onOpenChange={setOpenGuests}>
              {/* Trigger Button */}
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="flex justify-start bg-transparent py-6 border border-[#807e7e] rounded-none max-[600px]:rounded-bl-xl rounded-br-xl w-full text-base"
                >
                  <span className="flex items-start gap-2 font-normal max-[1315px]:text-sm">
                    <Users className="search-icons" />
                    {`${adults} adult${adults > 1 ? "s" : ""
                      } · ${children} child${children !== 1 ? "ren" : ""}`}
                    {/* {`${adults} adult${adults > 1 ? "s" : ""} · ${children} child${children !== 1 ? "ren" : ""
                                        } · ${rooms} room${rooms > 1 ? "s" : ""}`} */}
                  </span>
                </Button>
              </DrawerTrigger>

              {/* Drawer Content */}
              <DrawerContent className="flex flex-col justify-between bg-white p-4 rounded-t-xl h-[70vh] max-h-[90vh] overflow-y-auto font-poppins">
                {/* Header */}
                <DrawerHeader className="pb-4">
                  <h2 className="font-semibold text-lg">Guests</h2>
                </DrawerHeader>

                {/* Guests Selection */}
                <div className="space-y-4">
                  {/* Adults */}
                  <div className="flex justify-between items-center">
                    <label className="font-medium">Adults</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => decrement(setAdults, 1)}
                        disabled={adults <= 1}
                      >
                        -
                      </Button>
                      <span>{adults}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => increment(setAdults, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex justify-between items-center">
                    <label className="font-medium">Children</label>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => decrement(setChildren, 1)}
                        disabled={children <= 0}
                      >
                        -
                      </Button>
                      <span>{children}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="w-8 h-8"
                        onClick={() => increment(setChildren, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <DrawerFooter className="flex justify-end pt-4 border-gray-200 border-t">
                  <Button
                    className="w-full"
                    onClick={() => setOpenGuests(false)}
                  >
                    Done
                  </Button>
                </DrawerFooter>
              </DrawerContent>

              {/* Assistance Animals Dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="font-poppins">
                  <DialogHeader>
                    <DialogTitle>Traveling with Assistance Animals</DialogTitle>
                    <DialogDescription>
                      Assistance animals are not considered pets and can
                      accompany you during your travels without any additional
                      fees. Make sure to carry the necessary documentation to
                      avoid any inconvenience.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Drawer>
          </div>
        </div>
      </div>
      <div
        className={clsx(
          "relative flex flex-col justify-center items-center w-full transition-all duration-300 ease-in-out",
          isCompact ? "h-10" : ""
        )}
      >
        <div
          className={clsx(
            "transition-all duration-300 ease-in-out",
            isCompact ? "w-fit absolute -top-1" : "w-full"
          )}
        >
          <Button
            className={clsx(
              "z-20 flex justify-center items-center bg-secondary hover:bg-secondary mt-1 py-3 w-full h-full text-center transition-all duration-300 cursor-pointer",
              isCompact ? "rounded-bl-xl rounded-br-xl" : "rounded-xl"
            )}
            disabled={isSearchBusy}
            aria-busy={isSearchBusy}
            onClick={() => {
              handleSearchParams();
            }}
          >
            <FaSearch className="text-white" />
            <span className="search-text-name max-[1095px]:text-sm">
              Search
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MobileSearchContainer;
