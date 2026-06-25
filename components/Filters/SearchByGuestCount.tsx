import React, { useEffect, useState } from 'react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from '@/components/ui/button';
import { Users } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";

const SearchByGuestCount = ({ onChangeCounts }: { onChangeCounts: (adults: number, children: number, rooms: number, pets: boolean) => void }) => {
    const [adults, setAdults] = useState<number>(1);
    const [children, setChildren] = useState<number>(0);
    const [rooms, setRooms] = useState<number>(1);
    const [pets, setPets] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

    const increment = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prev => prev + value);
    };

    const decrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prev => Math.max(0, prev - value));
    };

    useEffect(() => {
        setRooms((prevRooms) => {
            if (adults > prevRooms) return adults;
            if (adults < prevRooms) return Math.max(adults, prevRooms);
            return prevRooms;
        });
        onChangeCounts(adults, children, rooms, pets);
    }, [adults, children, rooms, pets]);

    return (
        <>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="bg-transparent hover:bg-transparent py-6 border-[#807e7e] border-0 border-r rounded-none w-[285px] max-[1095px]:w-[240px] max-[1267px]:w-[260px] max-[1315px]:w-[290px] text-base transition-transform duration-100">
                        <span className="flex items-center gap-2 font-normal max-[1315px]:text-sm">
                            <Users className='search-icons' />
                            {`${adults} Adult${adults > 1 ? "s" : ""} · ${children} Child${children !== 1 ? "ren" : ""} `}
                            {/* {`${adults} adult${adults > 1 ? 's' : ''} · ${children} child${children !== 1 ? 'ren' : ''} · ${rooms} room${rooms > 1 ? 's' : ''}`} */}
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="p-4 font-poppins">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <label>Adults</label>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-8 h-8"
                                    onClick={() => {
                                        decrement(setAdults, 1)
                                        decrement(setRooms, 1)
                                    }}
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
                        <div >
                            <div className="flex justify-between items-center">
                                <label>Children</label>
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
                            <p className='mt-2 text-secondary text-sm text-right'>Applies to children below 12</p>
                        </div>

                        {/* <div className="flex justify-between items-center">
                            <label>Rooms</label>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-8 h-8"
                                    onClick={() => decrement(setRooms, 1)}
                                    disabled={rooms <= adults}
                                >
                                    -
                                </Button>
                                <span>{rooms}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-8 h-8"
                                    onClick={() => increment(setRooms, 1)}
                                >
                                    +
                                </Button>
                            </div>
                        </div> */}

                        {/* <div className="flex justify-between items-center">
                            <label>Traveling with pets?</label>
                            <Switch checked={pets} onCheckedChange={setPets} />
                        </div> */}

                        {/* <p className="text-xs">
                            Assistance animals aren’t considered pets.{" "}
                            <a
                                href="#"
                                className="text-blue-600 underline"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setIsDialogOpen(true);
                                }}
                            >
                                Read more about traveling with assistance animals
                            </a>
                        </p> */}
                        <div className='flex justify-end items-center w-full h-max'>
                            <Button onClick={() => setIsPopoverOpen(false)}>Done</Button>
                        </div>

                    </div>
                </PopoverContent>
            </Popover>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='font-poppins'>
                    <DialogHeader>
                        <DialogTitle>Traveling with Assistance Animals</DialogTitle>
                        <DialogDescription>
                            Assistance animals are not considered pets and can accompany you during your travels without any additional fees. Make sure to carry the necessary documentation to avoid any inconvenience.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default SearchByGuestCount;
