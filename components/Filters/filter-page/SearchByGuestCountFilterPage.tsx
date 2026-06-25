import React, { useEffect, useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const SearchByGuestCountFilterPage = ({
  defaultCount,
  onChangeCounts,
}: {
  defaultCount: { adult: number; children: number; room: number; pets: any };
  onChangeCounts: (
    adults: number,
    children: number,
    rooms: number,
    pets: boolean
  ) => void;
}) => {
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [rooms, setRooms] = useState(1);

  const [pets, setPets] = useState<boolean>(
    defaultCount.pets ? JSON.parse(defaultCount.pets) : false
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);

  useEffect(() => {
    setAdults(Number(defaultCount.adult) || 1);
    setChildren(Number(defaultCount.children) || 0);
    setRooms(Number(defaultCount.room) || 1);
    setPets(defaultCount.pets ? JSON.parse(defaultCount.pets) : false);
  }, [defaultCount]);

  
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

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="bg-transparent hover:bg-transparent shadow-none py-6 border-[#807e7e] border-0 rounded-none w-[280px] max-[1078px]:w-[220px] max-[1118px]:w-[230px] max-[1224px]:w-[240px] max-[1267px]:w-[260px] max-[1671px]:w-[290px] max-[1730px]:w-[320px] max-[1870px]:w-[300px] text-sm hover:scale-[1.02] transition-transform duration-100"
          >
            <span className="flex justify-start items-center gap-2 font-normal max-[1315px]:text-sm">
              <Users />
              {`${adults} Adult${adults > 1 ? "s" : ""} · ${children} Child${
                children !== 1 ? "ren" : ""
              } `}
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
                    decrement(setAdults, 1);
                    decrement(setRooms, 1);
                    onChangeCounts(adults - 1, children, rooms - 1, pets);
                  }}
                  disabled={adults <= 1}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <span>{adults}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="w-8 h-8"
                  onClick={() => {
                    increment(setAdults, 1);
                    onChangeCounts(adults + 1, children, rooms, pets);
                  }}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <label>Children</label>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => {
                      decrement(setChildren, 1);
                      onChangeCounts(adults, children - 1, rooms, pets);
                    }}
                    disabled={children <= 0}
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span>{children}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="w-8 h-8"
                    onClick={() => {
                      increment(setChildren, 1);
                      onChangeCounts(adults, children + 1, rooms, pets);
                    }}
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              <p className="mt-2 text-secondary text-sm text-right">
                Applies to children below 12
              </p>
            </div>

            {/* <div className="flex justify-between items-center">
                            <label>Rooms</label>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="w-8 h-8"
                                    onClick={() => decrement(setRooms, 1)}
                                    disabled={rooms <= 1}
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
                            <Switch checked={pets} onCheckedChange={(checked) => setPets(checked)} />
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
            <div className="flex justify-end items-center w-full h-max">
              <Button onClick={() => setIsPopoverOpen(false)}>Done</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="font-poppins">
          <DialogHeader>
            <DialogTitle>Traveling with Assistance Animals</DialogTitle>
            <DialogDescription>
              Assistance animals are not considered pets and can accompany you
              during your travels without any additional fees. Make sure to
              carry the necessary documentation to avoid any inconvenience.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SearchByGuestCountFilterPage;
