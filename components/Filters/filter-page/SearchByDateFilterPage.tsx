"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { format, isBefore, isValid, parseISO } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";

const parseDate = (dateStr: string | undefined) => {
    if (!dateStr) return undefined;
    const parsedDate = parseISO(dateStr);
    return isValid(parsedDate) ? parsedDate : undefined;
};

const SearchByDateFilterPage = ({
    defaultDateRange,
    onChangeDate
}: {
    defaultDateRange: { from?: string; to?: string };
    onChangeDate: (date: DateRange | undefined) => void;
}) => {
    const [date, setDate] = useState<DateRange | undefined>({
        from: parseDate(defaultDateRange?.from),
        to: parseDate(defaultDateRange?.to),
    });

    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (defaultDateRange) {
            setDate({
                from: parseDate(defaultDateRange?.from),
                to: parseDate(defaultDateRange?.to),
            });
        }
    }, [defaultDateRange]);

    useEffect(() => {
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
                        "justify-start bg-transparent hover:bg-transparent shadow-none py-6 border-[#807e7e] border-0 border-r rounded-none w-[300px] max-[1108px]:w-[240px] max-[1195px]:w-[250px] max-[1267px]:w-[290px] max-[1342px]:w-[270px] max-[1671px]:w-[320px] max-[1730px]:w-[340px] max-[1870px]:w-[320px] font-normal text-sm max-[1315px]:text-sm text-left hover:scale-[1.02] transition-transform duration-100",
                        !date?.from && "text-muted-foreground"
                    )}
                >
                    <CalendarIcon />
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
            </PopoverTrigger>
            <PopoverContent className="p-0 w-auto" align="start">
                <Calendar
                    initialFocus
                    mode="range"
                    selected={date}
                    defaultMonth={date?.from || undefined}
                    numberOfMonths={2}
                    className="custom-calendar"
                    disabled={{ before: new Date() }}
                    onSelect={(selectedRange: DateRange | undefined) => {
                        if (!selectedRange) return;

                        const { from, to } = selectedRange;

                        if (from && to && format(from, 'yyyy-MM-dd') === format(to, 'yyyy-MM-dd')) {
                            setDate({ from, to: undefined });
                            onChangeDate({ from, to: undefined });
                            return;
                        }

                        if (from && to) {
                            if (date?.from && date?.to) {
                                if (isBefore(from, date.from)) {
                                    setDate({ from, to: undefined });
                                    onChangeDate({ from, to: undefined });
                                } else {
                                    setDate({ from: to, to: undefined });
                                    onChangeDate({ from: to, to: undefined });
                                }
                            } else {
                                setDate({ from, to });
                                onChangeDate({ from, to });
                            }
                        }
                    }}
                />
            </PopoverContent>
        </Popover>
    );
};

export default SearchByDateFilterPage;
