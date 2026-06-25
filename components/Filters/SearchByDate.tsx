"use client"

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { addDays, format, isBefore } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DateRange } from 'react-day-picker';

const SearchByDate = ({ onDateChangeDate }: { onDateChangeDate: (date: DateRange | undefined) => void }) => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 3),
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        onDateChangeDate(date)
        if (date?.from && date?.to) {
            setOpen(false);
        }
    }, [date]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    id="date"
                    variant={"outline"}
                    onClick={() => setOpen(true)}
                    className={cn(
                        "justify-start bg-transparent hover:bg-transparent py-6 border-[#807e7e] border-0 border-r rounded-none w-[380px] max-[1095px]:w-[270px] max-[1267px]:w-[290px] max-[1315px]:w-[320px] font-normal max-[1315px]:text-sm text-base text-left transition-transform duration-100",
                        !date && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon className='search-icons' />
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
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={date?.from}
                    selected={date}
                    onSelect={(selectedRange: DateRange | undefined) => {
                        if (!selectedRange) return;

                        const { from, to } = selectedRange;

                        if (from && to) {
                            if (format(from, 'yyyy-MM-dd') === format(to, 'yyyy-MM-dd')) {
                                setDate({ from, to: undefined });
                                return;
                            }

                            if (date?.from && date?.to) {
                                if (isBefore(from, date.from)) {
                                    setDate({ from, to: undefined });
                                } else {
                                    setDate({ from: to, to: undefined });
                                }
                            } else {
                                setDate({ from, to });
                            }
                        } else {
                            setDate({ from, to });
                        }
                    }}
                    disabled={{ before: new Date() }}
                    numberOfMonths={2}
                    className="custom-calendar"
                />
            </PopoverContent>
        </Popover>
    )
}

export default SearchByDate
