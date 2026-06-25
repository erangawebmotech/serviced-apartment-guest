"use client"

import * as React from "react"
import { MapPin, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import { addDays, format, isBefore } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { DateRange } from 'react-day-picker';
import { useEffect, useRef, useState } from "react"
import { Users } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { FaSearch } from "react-icons/fa"
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerClose,
    DrawerHeader,
    DrawerFooter,
    DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "react-responsive"
import img1 from "@/public/hero-images/locationIcons/img1.png"
import img2 from "@/public/hero-images/locationIcons/img2.png"
import img3 from "@/public/hero-images/locationIcons/img3.png"
import img4 from "@/public/hero-images/locationIcons/img4.png"
import img5 from "@/public/hero-images/locationIcons/img5.png"
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js"
import { autoComplete } from "@/lib/google"
import Image from "next/image"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"

const locations = [
    { place_id: "ChIJx1QVTkOA4zoRnH2TTEAIFik", value: 'nuwara-eliya', label: "Nuwara Eliya", country: "Sri Lanka", src: img1 },
    { place_id: "ChIJO_eya5zu4joRPm8YCOkmFqU", value: 'negombo', label: "Negombo", country: "Sri Lanka", src: img2 },
    { place_id: "ChIJ4_wyabtz4ToRA0zG-QO5NUo", value: 'galle', label: "Galle", country: "Sri Lanka", src: img3 },
    { place_id: "ChIJJZrAW5Vl5DoR-4fE3trc-r0", value: 'ella', label: "Ella", country: "Sri Lanka", src: img4 },
    { place_id: "ChIJA3B6D9FT4joRjYPTMk0uCzI", value: 'colombo', label: "Colombo", country: "Sri Lanka", src: img5 },
]
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

const MobileContainer = () => {
    const [open, setOpen] = useState(false)
    const [openCalender, setOpenCalender] = useState(false)
    const [openGuests, setOpenGuests] = useState(false)
    const [value, setValue] = useState("")
    const [adults, setAdults] = useState(1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1);
    const [pets, setPets] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [date, setDate] = useState<DateRange | undefined>(undefined);
    const [predictions, setPredictions] = useState<PlaceAutocompleteResult[]>([])
    const [selectedPrediction, setSelectedPrediction] = useState<any>(null);
    const [selectedLocation, setSelectedLocation] = useState<any>(null);
    const router = useRouter();
    const isMediumScreen = useMediaQuery({ minWidth: 640, maxWidth: 971 });


    const increment = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prev => prev + value);
    };

    const decrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prev => Math.max(0, prev - value));
    };

    const clearSelection = (event: React.MouseEvent) => {
        event.stopPropagation()
        setValue("")
        setSelectedPrediction(null)
        setSelectedLocation(null)
        setPredictions([])
    }

    useEffect(() => {
        setDate({
            from: new Date(),
            to: addDays(new Date(), 3),
        });
    }, []);

    const parseLocation = (description: string) => {
        const parts = description.split(", ");
        const city = parts[0] || "Unknown";
        const country = parts[parts.length - 1] || "Unknown";
        return { city, country };
    };

    const throttledSearch = useRef(
        throttle(async (searchValue: string) => {
            try {
                const predictions = await autoComplete(searchValue)
                setSelectedPrediction(predictions[0] ?? null)
                setPredictions(predictions || [])
            } catch (error) {
                console.error("Failed to fetch autocomplete results:", error)
                setPredictions([])
            }
        }, 300)
    ).current

    useEffect(() => {

        if (value.trim()) {
            throttledSearch(value)
        } else {
            setPredictions([])
        }
    }, [value, throttledSearch])

    return (
        <div className="border rounded-xl w-[80%] max-[769px]:w-[90%] font-poppins glass-bg">
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
                                    value={value}
                                    onChangeCapture={(e: any) => setValue(e.target.value)}
                                />
                                <CommandList className="font-poppins">
                                    <CommandEmpty>No locations found.</CommandEmpty>
                                    <p className="px-4 py-2 font-semibold text-gray-700 text-sm">
                                        Popular destinations nearby
                                    </p>
                                    {locations.map((location: any) => (
                                        <CommandItem
                                            key={location.value}
                                            value={location.value}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : locations.find((location) => location.value === currentValue)?.label || currentValue)
                                                setSelectedLocation(location)
                                                setOpen(false)
                                            }}
                                        >
                                            <Image src={location.src} alt={location.label} className="w-10" />
                                            <div>
                                                <p className="font-medium">{location.label}</p>
                                                <p className="text-gray-500 text-xs">{location.country}</p>
                                            </div>
                                        </CommandItem>
                                    ))}
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
                                                            setSelectedPrediction(prediction);
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
                        </div>
                        <DrawerFooter className="flex justify-end p-4 border-gray-200 border-t">
                            <DrawerClose asChild>
                                <Button className="w-full">
                                    Done
                                </Button>
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
                                            {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
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
                                        if (from && to && format(from, 'yyyy-MM-dd') === format(to, 'yyyy-MM-dd')) {
                                            setDate({ from, to: undefined });
                                            return;
                                        }
                                        if (from && to) {
                                            if (date?.from && date?.to) {
                                                if (isBefore(from, date.from)) {
                                                    setDate({ from, to: undefined })
                                                } else {
                                                    setDate({ from: to, to: undefined })
                                                }

                                            } else {
                                                setDate({ from, to })
                                            }
                                        }
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
                                    {`${adults} adult${adults > 1 ? "s" : ""} · ${children} child${children !== 1 ? "ren" : ""}`}
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
                                <Button className="w-full" onClick={() => setOpenGuests(false)}>
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
                                        Assistance animals are not considered pets and can accompany you
                                        during your travels without any additional fees. Make sure to carry
                                        the necessary documentation to avoid any inconvenience.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </Drawer>
                </div>
            </div>
            <div>
                <div className="w-full">
                    <Button className="z-20 flex justify-center items-center bg-secondary mt-1 py-3 rounded-xl w-full h-full text-center transition-all duration-300 cursor-pointer"

                        onClick={() => {
                            const { city } = parseLocation(selectedPrediction?.description || selectedLocation?.label || '') ?? { city: selectedPrediction?.label || selectedLocation.label };

                            if (!city) {
                                toast({
                                    description: "Please select a location first",
                                    className: "bg-secondary font-poppins text-white p-4 rounded-lg shadow-md",
                                    duration: 2000,
                                });
                                console.error("Destination is undefined. Redirection aborted.");
                                return;
                            }


                            const queryParams: Record<string, string> = {
                                destination: city,
                                place_id: selectedPrediction?.place_id || selectedLocation?.place_id,
                                checkin: date?.from ? date.from.toISOString() : "",
                                checkout: date?.to ? date.to.toISOString() : "",
                                no_adults: adults.toString(),
                                no_rooms: rooms.toString(),
                                no_children: children.toString(),
                                pets: pets.toString(),
                            };

                            const filteredParams = Object.fromEntries(
                                Object.entries(queryParams).filter(([_, value]) => value !== "")
                            );

                            const params = new URLSearchParams(filteredParams).toString();

                            router.push(`/search-results?${params}`);
                        }}
                    >
                        <FaSearch className="text-white" />
                        <span className="search-text-name max-[1095px]:text-sm">Search</span>

                    </Button>
                </div>
            </div>
        </div>
    )
}

export default MobileContainer