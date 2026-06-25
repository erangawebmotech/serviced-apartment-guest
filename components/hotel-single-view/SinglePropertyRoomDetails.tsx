'use client'
import React, { useEffect, useMemo, useRef, useState } from "react";
import RoomCard from "./RoomCard";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import Spinner from "../common/Spinner";
import { zodResolver } from "@hookform/resolvers/zod"
import { addDays, eachDayOfInterval, format, isSameDay, isValid, parseISO, setHours, setMinutes, setSeconds, startOfDay, subDays } from "date-fns"
import { CalendarIcon, Dot, Users, XIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { date, z } from "zod"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getHotelRooms } from "@/actions/services/getHotelDetails";
import { FaUser } from "react-icons/fa";
import { formatDate } from "@/components/search-results/ResultPage";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { toZonedTime } from "date-fns-tz";
import { getReservationSummaryDetails } from "@/actions/services/getReservationDetails";
import { useLoginModal } from "@/common/auth/handleLoginModal";
import { toast } from "@/hooks/use-toast";

/** API uses sub-ms precision (e.g. .999999999); WebKit cannot parse that, so isSameDay with raw strings fails on iOS. */
function calendarDayFromApiValue(value: unknown): Date | null {
    if (value == null || value === "") return null;
    if (value instanceof Date) {
        return isValid(value) ? startOfDay(value) : null;
    }
    if (typeof value === "string") {
        const m = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (m) {
            return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
        }
        const parsed = parseISO(value);
        return isValid(parsed) ? startOfDay(parsed) : null;
    }
    return null;
}

function calendarDaysFromApiValues(values: unknown[]): Date[] {
    const out: Date[] = [];
    for (const v of values) {
        const d = calendarDayFromApiValue(v);
        if (d) out.push(d);
    }
    return out;
}

const FormSchema = z.object({
    checkOutDate: z.date({
        required_error: "check-out date is required",
    }),
    checkInDate: z.date({
        required_error: "check-in date is required",
    }),
})
interface SelectedDetailsProps {
    selectedRoomCount: number,
    headCount: number,
}
interface SubUnitCountProps {
    subUnit: any,
    selectedDetails: SelectedDetailsProps[],
}
interface SubUnitDetailsProp {
    totalRooms: number,
    totalPrice: number,
}

const SinglePropertyRoomDetails = ({ hotel, roomDetails, defaultCount, checkin, checkout, blockedDates }:
    { hotel: any, roomDetails: any, defaultCount?: { adult: number; children: number; room: number; pets: any }, checkin: any, checkout: any, blockedDates: { reserved: Date[][], blocked: Date[][] } }) => {
    const [pending, setPending] = useState<boolean>(false);
    const [pendingEntProperty, setPendingEntProperty] = useState<boolean>(false);
    const [checking, setChecking] = useState<boolean>(false);
    const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);
    const [newRoomDetails, setNewRoomDetails] = useState<any>(roomDetails);
    const router = useRouter();
    const pathname = usePathname();
    const [adults, setAdults] = useState(defaultCount?.adult || 1);
    const [children, setChildren] = useState(0);
    const [rooms, setRooms] = useState(1)
    const [checkInDate, setCheckInDate] = useState<Date>(checkin);
    const [checkOutDate, setCheckoutDate] = useState<Date>(checkout);
    const [prices, setPrices] = useState<any>([]);
    const [lastHeadCount, setLastHeadCount] = useState<number>(0);
    const [selectedGuestCount, setSelectedGuestCount] = useState(1);
    const [selectedSubUnitCount, setSelectedSubUnitCount] = useState<SubUnitCountProps[]>([]);
    const [totalPersonCount, setTotalPersonCount] = useState<number>(0);
    const [totalEntPropPersonCount, setTotalEntPropPersonCount] = useState<number>(0);
    const [totalSubUnitDetails, setTotalSubUnitDetails] = useState<SubUnitDetailsProp>({ totalPrice: 0, totalRooms: 0 });
    const [reserveButtonDisabled, setReserveButtonDisabled] = useState<boolean>(false)
    const [reserveEntPropertyButtonDisabled, setReserveEntPropertyButtonDisabled] = useState<boolean>(false)
    const timeZone = process.env.NEXT_PUBLIC_TIME_ZONE;
    const { handleLoginModal } = useLoginModal();
    const currentUrl = new URL(window.location.href);
    const [checkInOpen, setCheckInOpen] = useState(false);
    const [checkOutOpen, setCheckOutOpen] = useState(false);
    const [reservedDatesArray, setReservedDatesArray] = useState<Date[]>([])
    const [checkoutReservedDatesArray, setCheckoutReservedDatesArray] = useState<Date[]>([])
    const [checkoutBlockedDatesArray, setCheckoutBlockedDatesArray] = useState<Date[]>([])
    const [blockedDatesArray, setBlockedDatesArray] = useState<Date[]>([])

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const formatDateWithTimeZone = (date: Date, type: "checkIn" | "checkOut"): string => {
        const updatedDate = setHours(
            setMinutes(
                setSeconds(date, type === "checkIn" ? 0 : 59),
                type === "checkIn" ? 0 : 59
            ),
            type === "checkIn" ? 0 : 23
        );

        return format(updatedDate, "yyyy-MM-dd'T'HH:mm:ss");
    };

    const increment = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prev => prev + value);
    };

    const decrement = (setter: React.Dispatch<React.SetStateAction<number>>, value: number) => {
        setter(prev => Math.max(0, prev - value));
    };

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            // checkInDate: checkin ? new Date(checkin) : new Date(),
            // checkOutDate: checkout ? new Date(checkout) : new Date(new Date().setDate(new Date().getDate() + 1)),
            checkInDate: checkin ? new Date(checkin) : undefined,
            checkOutDate: checkout ? new Date(checkout) : undefined,
        },
    });

    useEffect(() => {
        setNewRoomDetails(roomDetails)
        const adultsFromParams = Number(new URL(window.location.href).searchParams.get("adults")) || 1;
        setAdults(adultsFromParams);
        setSelectedGuestCount(adultsFromParams);
        setChildren(Number(new URL(window.location.href).searchParams.get("children")) || 0);
        setRooms(Number(new URL(window.location.href).searchParams.get("rooms")) || 1);
    }, [])


    useEffect(() => {
        const subUnits = newRoomDetails?.data?.subUnits;
        if (!Array.isArray(subUnits) || subUnits.length === 0) return;

        const firstSubUnit = subUnits[0];
        const subUnitPrices = firstSubUnit.prices || [];
        setPrices(subUnitPrices);

        const last = subUnitPrices.at(-1)?.maxHeadCount;
        setLastHeadCount(last ?? 0);

        const allowEnt = !!newRoomDetails?.data?.allowEntireProperty;
        const allowInd = !!newRoomDetails?.data?.allowIndividualUnit;
        const entirePropertyOnly = allowEnt && !allowInd;

        if (!entirePropertyOnly) {
            if (!allowEnt && allowInd) {
                setSelectedGuestCount(adults);
            }
            return;
        }

        if (firstSubUnit?.monthlyRateApplied && subUnitPrices.length > 0) {
            const v = last ?? 1;
            setSelectedGuestCount(v);
            setAdults(v);
            return;
        }

        const validTiers = subUnitPrices
            .map((p: { maxHeadCount?: number }) => p.maxHeadCount)
            .filter((n: number | undefined): n is number => typeof n === "number");
        if (validTiers.length === 0) return;

        const snapToTier = (n: number) =>
            validTiers.includes(n)
                ? n
                : validTiers.reduce((best: number, t: number) => (Math.abs(t - n) < Math.abs(best - n) ? t : best));

        const maxCap = newRoomDetails?.data?.propertyMaxHeadCount ?? Math.max(...validTiers);
        const raw = Math.min(Math.max(1, adults), maxCap);
        const next = snapToTier(raw);
        setSelectedGuestCount(next);
        if (next !== adults) setAdults(next);
    }, [newRoomDetails, adults]);

    useEffect(() => {
        const filteredReserved = blockedDates.reserved.length > 0 ? blockedDates.reserved.map(arr => arr.slice(1, -1)).flat() : [];
        // const filteredReserved = blockedDates.reserved.length > 0 ? blockedDates.reserved.map((dateGroup) => dateGroup.slice(1)) : [];

        const adjustedBlocked = blockedDates.blocked.map((group: Date[]) => {
            if (group.length === 0) return [];
            const firstNorm = calendarDayFromApiValue(group[0]);
            if (!firstNorm) return [];
            const dayBefore = subDays(firstNorm, 1);
            return [dayBefore, ...group];
        });

        const cleanedReserved = blockedDates.reserved.map(arr => arr.slice(0, -1)).flat();

        setCheckoutReservedDatesArray(calendarDaysFromApiValues(filteredReserved.flat() as unknown[]));
        setReservedDatesArray(calendarDaysFromApiValues(cleanedReserved as unknown[]));
        setCheckoutBlockedDatesArray(calendarDaysFromApiValues(blockedDates.blocked.flat() as unknown[]));
        setBlockedDatesArray(calendarDaysFromApiValues(adjustedBlocked.flat() as unknown[]));
    }, [blockedDates])

    const modifiers = {
        reserved: (date: Date) =>
            reservedDatesArray.some((reserved) => isSameDay(date, reserved)),
        blocked: (date: Date) =>
            blockedDatesArray.some((blocked) => isSameDay(date, blocked)),
    };
    const checkoutModifiers = {
        reserved: (date: Date) =>
            checkoutReservedDatesArray.some((reserved) => isSameDay(date, reserved)),
        blocked: (date: Date) =>
            checkoutBlockedDatesArray.some((blocked) => isSameDay(date, blocked)),
    };

    useEffect(() => {
        checkHeadCount()
    }, [totalPersonCount, totalEntPropPersonCount])

    const checkHeadCount = () => {

        // if (
        //     (newRoomDetails?.data?.allowEntireProperty && newRoomDetails?.data?.isEntirePropertyAvailable && !newRoomDetails?.data?.allowIndividualUnit && totalEntPropPersonCount > 0) ||
        //     (!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.isEntirePropertyAvailable && newRoomDetails?.data?.allowIndividualUnit && totalPersonCount > 0)
        // ) {
        //     setReserveButtonDisabled(true)
        // } else if (newRoomDetails?.data?.allowEntireProperty && newRoomDetails?.data?.isEntirePropertyAvailable && newRoomDetails?.data?.allowIndividualUnit && totalEntPropPersonCount > 0) {
        //     setReserveButtonDisabled(false)
        //     setReserveEntPropertyButtonDisabled(false)
        // } else {
        //     setReserveEntPropertyButtonDisabled(false)
        //     setReserveButtonDisabled(false)
        // }
        const isApartment = newRoomDetails?.data?.allowEntireProperty;
        const isHotel = newRoomDetails?.data?.allowIndividualUnit;
        const isApartmentAvailable = newRoomDetails?.data?.isEntirePropertyAvailable;

        if ((isApartment && isApartmentAvailable && !isHotel && selectedGuestCount < 1) ||
            (!isApartment && !isApartmentAvailable && isHotel && selectedSubUnitCount.length <= 0)) {
            setReserveButtonDisabled(true);
        } else if (isApartment && isApartmentAvailable && isHotel && selectedSubUnitCount.length <= 0) {
            setReserveButtonDisabled(true)

        } else {
            setReserveButtonDisabled(false)
            setReserveEntPropertyButtonDisabled(false)
        }

    }

    const selectedPrice = useMemo(() => {
        return prices.find((p: any) => p.maxHeadCount === selectedGuestCount)?.priceForMaxCount;
    }, [prices, selectedGuestCount]);

    const discountedPrice = useMemo(() => {
        return prices.find((p: any) => p.maxHeadCount === selectedGuestCount)?.priceWithDiscount;
    }, [prices, selectedGuestCount]);

    function applyEntirePropertyGuestTier(value: number) {
        const maxCap = newRoomDetails?.data?.propertyMaxHeadCount ?? value;
        const n = Math.min(Math.max(1, value), maxCap);
        setAdults(n);
        setSelectedGuestCount(n);
    }

    function onSubmit(data: z.infer<typeof FormSchema>) {
        // setTotalPersonCount(adults + children)
        setChecking(true)
        // const currentUrl = new URL(window.location.href);
        setTotalPersonCount(adults)

        currentUrl.searchParams.set("checkin", data?.checkInDate ? formatDate(data.checkInDate) : '');
        currentUrl.searchParams.set("checkout", data?.checkOutDate ? formatDate(data.checkOutDate) : '');
        currentUrl.searchParams.set("adults", adults.toString());
        currentUrl.searchParams.set("children", children.toString());

        setCheckInDate(data?.checkInDate)
        setCheckoutDate(data?.checkOutDate)

        const qs = currentUrl.searchParams.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });

        // const chekindate = data.checkInDate.toLocaleDateString('en-CA', { timeZone: timeZone });
        // const chekoutdate = data.checkOutDate.toLocaleDateString('en-CA', { timeZone: timeZone });

        const checkInDate = data.checkInDate.toLocaleDateString('en-CA');
        const checkOutDate = data.checkOutDate.toLocaleDateString('en-CA');

        const payload = {
            id: hotel?.id || hotel?.slug || '',
            checkIn: checkInDate + "T00:00:00",
            checkOut: checkOutDate + "T23:59:59",
            availabilitycheck: true,
            roomCount: rooms,
            adultCount: adults,
            childCount: children,
        }

        const loadRooms = async () => {
            await getHotelRooms(payload).then((res) => {
                setNewRoomDetails(res);
            }).catch((error) => {
                console.error(error)
            }).finally(() => {
                setChecking(false)
            }
            )

        };
        loadRooms();
    }

    const submitAvailabilityRef = useRef(onSubmit);
    submitAvailabilityRef.current = onSubmit;

    const watchedCheckIn = form.watch("checkInDate");
    const watchedCheckOut = form.watch("checkOutDate");

    useEffect(() => {
        if (!watchedCheckIn || !watchedCheckOut) return;
        const timer = window.setTimeout(() => {
            void form.handleSubmit((formData) => submitAvailabilityRef.current(formData))();
        }, 350);
        return () => window.clearTimeout(timer);
    }, [watchedCheckIn, watchedCheckOut, adults, children, form]);

    const handleCheckInChange = (date: Date | undefined) => {
        if (!date) return;

        // const checkInWithTime = toZonedTime(setHours(setMinutes(setSeconds(date, 59), 59), 23), timeZone!);
        const checkInWithTime = setHours(setMinutes(setSeconds(date, 59), 59), 23);

        const checkOutDate = form.getValues("checkOutDate");

        const isConflict = hasReservedDatesBetween(checkInWithTime, checkOutDate);

        if (isConflict) {

            // const newCheckOutDate = toZonedTime(setHours(setMinutes(setSeconds(addDays(checkInWithTime, 1), 59), 59), 23), timeZone!);
            const newCheckOutDate = setHours(setMinutes(setSeconds(addDays(checkInWithTime, 1), 59), 59), 23);

            if (hasReservedDate(newCheckOutDate)) {
                console.log('There is a conflict with the check-out date. Please select a different date.');
            }
            form.setValue("checkInDate", checkInWithTime);
            form.setValue("checkOutDate", newCheckOutDate);
            return;
        }

        form.setValue("checkInDate", checkInWithTime);

        if (checkOutDate && checkOutDate <= checkInWithTime) {
            // const newCheckOutDate = toZonedTime(setHours(setMinutes(setSeconds(addDays(checkInWithTime, 1), 59), 59), 23), timeZone!);
            const newCheckOutDate = setHours(setMinutes(setSeconds(addDays(checkInWithTime, 1), 59), 59), 23);
            form.setValue("checkOutDate", newCheckOutDate);
        }
    };

    const handleCheckOutChange = (date: Date | undefined) => {
        if (!date) return;
        // let checkOutWithTime = toZonedTime(setHours(setMinutes(setSeconds(date, 59), 59), 23), timeZone!);
        let checkOutWithTime = setHours(setMinutes(setSeconds(date, 59), 59), 23);

        const checkInDate = form.getValues("checkInDate");

        const isConflict = hasReservedDatesBetween(checkInDate, checkOutWithTime);

        if (isConflict) {
            toast({
                description: 'Oops! There’s unavailable dates between your selected dates. Please choose a different date range',
                className: "bg-secondary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            });
            return;
        }

        if (checkInDate && checkOutWithTime <= checkInDate) {
            checkOutWithTime = setHours(setMinutes(setSeconds(addDays(checkInDate, 1), 59), 59), 23);
            // checkOutWithTime = toZonedTime(setHours(setMinutes(setSeconds(addDays(checkInDate, 1), 59), 59), 23), timeZone!);
        }

        form.setValue("checkOutDate", checkOutWithTime);

    };

    const hasReservedDate = (date: Date): boolean => {
        return checkoutReservedDatesArray.some((reservedDate) => isSameDay(date, reservedDate)) ||
            checkoutBlockedDatesArray.some((blockedDate) => isSameDay(date, blockedDate));
    }

    const hasReservedDatesBetween = (checkInDate: Date, checkOutDate: Date): boolean => {
        const betweenDates = eachDayOfInterval({
            start: checkInDate,
            end: checkOutDate,
        });

        const checkoutHasReserved = betweenDates.some((date) =>
            checkoutReservedDatesArray.some((checkoutReservedDate) => isSameDay(date, checkoutReservedDate))
        );

        const checkoutHasBlocked = betweenDates.some((date) =>
            checkoutBlockedDatesArray.some((checkoutBlockedDate) => isSameDay(date, checkoutBlockedDate))
        );

        return checkoutHasReserved || checkoutHasBlocked;
    };

    const handleSelectedRoomCountChange = ({ subUnit, headCount, selectedCount, price }: { subUnit: any; headCount: number; selectedCount: number; price: number }) => {

        if (!subUnit) {
            setSelectedSubUnitCount([])
            setTotalSubUnitDetails({
                totalRooms: 0,
                totalPrice: 0,
            })
            return;
        }
        setSelectedSubUnitCount((prev) => {
            let updatedData = [...prev];

            const existingSubUnit = updatedData.find((item) => item?.subUnit?.id === subUnit?.id);

            if (existingSubUnit) {
                updatedData = updatedData.map((item) =>
                    item.subUnit.id === subUnit.id
                        ? {
                            ...item,
                            selectedDetails:
                                selectedCount === 0
                                    ? item.selectedDetails.filter((detail) => detail.headCount !== headCount)
                                    : item.selectedDetails.some((detail) => detail.headCount === headCount)
                                        ? item.selectedDetails.map((detail) =>
                                            detail.headCount === headCount
                                                ? { ...detail, selectedRoomCount: selectedCount }
                                                : detail
                                        )
                                        : [
                                            ...item.selectedDetails,
                                            { headCount, selectedRoomCount: selectedCount },
                                        ],
                        }
                        : item
                );

                updatedData = updatedData.filter((item) => item.selectedDetails.length > 0);
            } else {
                if (selectedCount > 0) {
                    updatedData.push({
                        subUnit,
                        selectedDetails: [{ headCount, selectedRoomCount: selectedCount }],
                    });
                }
            }

            let totalRooms = 0;
            let totalPrice = totalSubUnitDetails.totalPrice;

            const removedRoomDetails = totalSubUnitDetails.totalRooms > 0
                ? prev.find(item => item?.subUnit?.id === subUnit?.id)?.selectedDetails.find(detail => detail.headCount === headCount)
                : null;

            if (removedRoomDetails) {
                totalPrice -= removedRoomDetails.selectedRoomCount * price;
            }


            if (selectedCount > 0) {
                totalPrice += selectedCount * price;
            }

            updatedData.forEach((item) => {
                item.selectedDetails.forEach((detail) => {
                    totalRooms += detail.selectedRoomCount;
                });
            });

            setTotalSubUnitDetails({
                totalRooms,
                totalPrice,
            });

            totalRooms = 0;
            totalPrice = 0;
            return updatedData;
        });
    };

    useEffect(() => {
        if (selectedSubUnitCount.length > 0) {
            setTotalPersonCount(adults);
            // setTotalPersonCount((adults + children));
            let total = 0;
            selectedSubUnitCount.forEach((unit: any) => {
                unit.selectedDetails.forEach((details: any) => {
                    total += (details.headCount * details.selectedRoomCount)
                    setTotalPersonCount(adults - total)
                    // setTotalPersonCount((adults + children) - total)
                })
            })
        } else {
            setTotalPersonCount(adults)
            // setTotalPersonCount(adults + children)
            setTotalEntPropPersonCount(adults - selectedGuestCount);
            // setTotalEntPropPersonCount((adults + children) - selectedGuestCount);
        }
    }, [selectedSubUnitCount, selectedGuestCount])

    const handleCheckIn = async ({ isEntProperty = true }: { isEntProperty?: boolean }) => {
        if (!isEntProperty) {
            if ((!selectedSubUnitCount || selectedSubUnitCount.length === 0) && (!newRoomDetails?.data?.allowEntireProperty || (newRoomDetails?.data?.allowEntireProperty && newRoomDetails?.data?.allowIndividualUnit))) {
                toast({
                    description: "Please select at least one room",
                    className: "bg-secondary font-poppins text-white p-4 rounded-lg shadow-md",
                    duration: 2000,
                });
                return;
            }
        }
        setPendingEntProperty(true)
        setPending(true)

        const unitDetails = selectedSubUnitCount.flatMap((unitData) => {

            const { subUnit, selectedDetails } = unitData;


            const selectedDetailsWithAccommodationUnitId = selectedDetails.map((details) => {
                return {
                    ...details,
                    accommodationUnitId: subUnit.id || null,
                    subUnitIds: subUnit.subUnits || [],
                };
            })

            let availableSubUnits = [...selectedDetailsWithAccommodationUnitId[0].subUnitIds];

            const finalObject = selectedDetailsWithAccommodationUnitId.map((details) => {
                const index = details.selectedRoomCount;

                const reservedSubUnits = availableSubUnits.slice(0, index);

                const object = {
                    accommodationUnitId: details.accommodationUnitId,
                    subUnitIds: reservedSubUnits,
                    maxHeadCount: details.headCount,
                };
                availableSubUnits = availableSubUnits.slice(index);
                return object;
            });
            return finalObject;
        });

        if (!isEntProperty) {
            if ((unitDetails.length === 0) && (!newRoomDetails?.data?.allowEntireProperty || (newRoomDetails?.data?.allowEntireProperty && newRoomDetails?.data?.allowIndividualUnit))) {
                return;
            }
        }

        const reservationSummaryPayload = {
            slug: hotel?.slug || null,
            maxHeadCount: isEntProperty ? selectedGuestCount : null,
            unitDetails: unitDetails.length > 0 ? unitDetails : null,
            checkIn: formatDateWithTimeZone(checkInDate, 'checkIn'),
            checkOut: formatDateWithTimeZone(checkOutDate, 'checkOut'),
            adult: adults,
            child: children,
            infant: 0,
            nrpEnabled: false,
            pet: 0,
            isEntireProperty: !!isEntProperty ? isEntProperty : false,
            arrivalTime: null,
            paymentType: null,
            specialRequest: null,
            userDetails: {
                firstName: null,
                lastName: null,
                email: null,
                countryCode: null,
                contactNo: null
            }
        };

        await getReservationSummaryDetails(reservationSummaryPayload).then((res) => {
            if (res?.error) {
                throw res.errors;
            }
            // console.log(res)
            if (res) {
                sessionStorage.setItem('reservation-summary', JSON.stringify(res))
                sessionStorage.setItem('reservation-details', JSON.stringify(reservationSummaryPayload))
                router.push(`/${hotel?.propertyType?.name?.toLowerCase() || "hotel"}/${hotel?.slug || ""}/reserve`);
            }
        }).catch((err) => {
            // toast({
            //     description: err.message,
            //     className: "bg-primary font-poppins text-white p-4 rounded-lg shadow-md",
            //     duration: 3000,
            // });

            if (err.status === 403) {
                sessionStorage.setItem('pendingReservation', JSON.stringify(reservationSummaryPayload));
                sessionStorage.setItem('hasPendingReservation', JSON.stringify(true));
                handleLoginModal({ open: true });
            }
            setPendingEntProperty(false)
            setPending(false)

        })

    };

    return (
        <>
            <div className='font-poppins'>
                <h2 className="mb-4 font-semibold text-lg">Availability</h2>
                <div className="bg-white shadow-sm p-5 rounded-xl w-full font-poppins">

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex max-[1000px]:flex-col justify-between items-center gap-3 font-poppins">


                            <FormField
                                control={form.control}
                                name="checkInDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col justify-center items-center w-full">
                                        <FormLabel className="w-full font-normal text-gray-700 text-xs text-left">Checkin</FormLabel>
                                        <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="check-in-date"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setCheckInOpen(true);
                                                        setCheckOutOpen(false);
                                                    }}
                                                    className={cn(
                                                        "justify-start bg-gray-100 py-6 border rounded-md w-full font-normal text-left",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="max-[1000px]:hidden mr-2" />
                                                    {field.value ? format(field.value, "LLL dd, y") : "Pick a check-in date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 w-[--trigger-width] max-w-none" align="start">
                                                <Calendar
                                                    initialFocus
                                                    mode="single"
                                                    selected={field.value || undefined}
                                                    onSelect={(e) => {
                                                        handleCheckInChange(e);
                                                        setCheckInOpen(false);
                                                    }}
                                                    className="custom-calendar"
                                                    disabled={(date) =>
                                                        date.getTime() < new Date().setHours(0, 0, 0, 0) ||
                                                        reservedDatesArray.some((d) => isSameDay(date, d)) ||
                                                        blockedDatesArray.some((d) => isSameDay(date, d))
                                                    }
                                                    modifiers={modifiers}
                                                    modifiersClassNames={{
                                                        reserved: "day-blocked text-gray-400 pointer-events-none",
                                                        blocked: "day-blocked text-gray-400 pointer-events-none",
                                                    }}
                                                    defaultMonth={field.value || undefined}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="checkOutDate"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col justify-center items-center w-full">
                                        <FormLabel className="w-full font-normal text-gray-700 text-xs text-left">Checkout</FormLabel>
                                        <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    id="check-out-date"
                                                    variant="outline"
                                                    onClick={() => {
                                                        setCheckInOpen(false)
                                                        setCheckOutOpen(true)
                                                    }}
                                                    className={cn(
                                                        "justify-start bg-gray-100 py-6 border rounded-md w-full font-normal text-left",
                                                        !field.value && "text-muted-foreground"
                                                    )}
                                                >
                                                    <CalendarIcon className="max-[1000px]:hidden mr-2" />
                                                    {field.value ? format(field.value, "LLL dd, y") : "Pick a check-out date"}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="p-0 w-auto" align="start">
                                                <Calendar
                                                    initialFocus
                                                    mode="single"
                                                    selected={field.value || undefined}
                                                    onSelect={(e) => {
                                                        handleCheckOutChange(e)
                                                        setCheckOutOpen(false)
                                                    }}
                                                    className="custom-calendar"
                                                    disabled={(date) => {
                                                        const checkInDate = form.getValues("checkInDate");
                                                        if (!checkInDate) return false;

                                                        const minCheckoutDate = new Date(checkInDate);
                                                        minCheckoutDate.setDate(minCheckoutDate.getDate());

                                                        return date < minCheckoutDate ||
                                                            checkoutReservedDatesArray.some((d) => isSameDay(date, d)) ||
                                                            checkoutBlockedDatesArray.some((d) => isSameDay(date, d));
                                                    }}
                                                    defaultMonth={field.value}
                                                    modifiers={checkoutModifiers}
                                                    modifiersClassNames={{
                                                        reserved: "day-blocked text-gray-400 pointer-events-none",
                                                        blocked: "day-blocked text-gray-400 pointer-events-none",
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />



                            <FormItem className="flex flex-col justify-center items-center w-full">
                                <FormLabel className="w-full font-normal text-gray-700 text-xs text-left">Guest Count</FormLabel>
                                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="justify-start bg-gray-100 p-6 py-6 border rounded-md w-full font-normal text-left">
                                            <span className="flex justify-start items-center gap-2 font-normal max-[1315px]:text-sm">
                                                <Users />
                                                {`${adults} Adult${adults > 1 ? "s" : ""} · ${children} Child${children !== 1 ? "ren" : ""} `}
                                                {/* {`${adults} Adult${adults > 1 ? "s" : ""} · ${children} Child${children !== 1 ? "ren" : ""} · ${rooms} Room${rooms > 1 ? "s" : ""}`} */}
                                            </span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-4 font-poppins">
                                        <div className="space-y-4">
                                            {/* Adults */}
                                            <div className="flex justify-between items-center">
                                                <label>Adults</label>
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
                                                        disabled={adults >= newRoomDetails?.data?.propertyMaxHeadCount}
                                                        onClick={() => {
                                                            if (adults >= newRoomDetails?.data?.propertyMaxHeadCount) {
                                                                return;
                                                            } else {
                                                                increment(setAdults, 1)
                                                            }
                                                        }}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Children */}
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

                                            <div className="flex justify-end items-center w-full h-max">
                                                <Button onClick={() => setIsPopoverOpen(false)}>Done</Button>
                                            </div>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>


                            {/*
                            <Button type="submit" className="bg-secondary hover:bg-red-1000 max-[1000px]:m-0 mt-6 ml-6 p-6 w-[800px] max-[1000px]:w-full" disabled={checking}>
                                {
                                    checking && (
                                        <Spinner />
                                    )
                                }
                                {stateChanged ?
                                    <>
                                        <RefreshCcw /> Apply Changes
                                    </>
                                    : 'Check Availability'}
                            </Button>
                            */}

                        </form>
                    </Form>
                </div>

                {!!newRoomDetails?.data?.allowEntireProperty && !!newRoomDetails?.data?.allowIndividualUnit && !!newRoomDetails?.data?.isEntirePropertyAvailable && (
                    <div className="flex max-[930px]:flex-col justify-between items-start gap-4 bg-[#002B4521] mt-5 p-3 rounded-xl w-full">
                        <div className="flex items-center gap-2">
                            <h3>Book the Entire Property - Available Now!</h3>
                        </div>


                        <div className="flex max-[1000px]:flex-col max-[1000px]:items-start gap-3 max-[1000px]:w-full">
                            <div className="flex justify-center items-center gap-2">
                                <div>
                                    <Select
                                        value={selectedGuestCount.toString()}
                                        onValueChange={(value) => applyEntirePropertyGuestTier(Number(value))}
                                    >
                                        <SelectTrigger className="bg-primary/10 p-6 border border-primary w-full min-w-[250px] font-poppins">
                                            <SelectValue placeholder="Select Guest Count" />
                                        </SelectTrigger>
                                        <SelectContent className="font-poppins" >
                                            <SelectGroup className="w-full">
                                                <SelectLabel>Guest Count</SelectLabel>
                                                {newRoomDetails?.data?.subUnits[0]?.monthlyRateApplied && prices?.length > 0 ? (

                                                    <SelectItem key={prices.at(-1)?.maxHeadCount?.toString() ?? ""} value={prices.at(-1)?.maxHeadCount?.toString() ?? ""}>
                                                        <div className="flex flex-row justify-between items-center !gap-16 !max-[1000px]:gap-0">
                                                            <span className="flex items-center min-w-16">
                                                                <FaUser className="inline-block mr-1" /> x {prices.at(-1)?.maxHeadCount || "N/A"}
                                                            </span>
                                                            <div className="max-[1000px]:hidden flex items-center gap-1">
                                                                <div className="font-bold text-base" title="Included taxes and fees">
                                                                    ${prices.at(-1)?.priceWithDiscount ? prices.at(-1)?.priceWithDiscount : prices.at(-1)?.priceForMaxCount}
                                                                </div>
                                                                {prices.at(-1)?.priceWithDiscount && (
                                                                    <div className="text-red-500 text-xs line-through">${prices.at(-1)?.priceForMaxCount}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </SelectItem>
                                                ) : (
                                                    prices?.map(({ maxHeadCount, priceForMaxCount, priceWithDiscount }: { maxHeadCount?: number, priceWithDiscount: number, priceForMaxCount: number }) => {
                                                        return (
                                                            <SelectItem key={maxHeadCount || ""} value={maxHeadCount?.toString() || ""}>
                                                                <div className="flex flex-row justify-between items-center !gap-16 !max-[1000px]:gap-0">
                                                                    <span className="flex items-center min-w-16">
                                                                        <FaUser className="inline-block mr-1" /> x {maxHeadCount || "N/A"}
                                                                    </span>
                                                                    <div className="max-[1000px]:hidden flex items-center gap-1">
                                                                        <div className="font-bold text-base" title="Included taxes and fees">
                                                                            ${priceWithDiscount ? priceWithDiscount : priceForMaxCount}
                                                                        </div>
                                                                        {priceWithDiscount && (
                                                                            <div className="text-red-500 text-xs line-through">${priceForMaxCount}</div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </SelectItem>
                                                        )
                                                    })
                                                )}

                                            </SelectGroup>
                                        </SelectContent>

                                    </Select>
                                    {/*
                                   // Villa Entire Property Desktop  
                                    {
                                        !!newRoomDetails?.data?.allowEntireProperty && !!newRoomDetails?.data?.allowIndividualUnit && totalEntPropPersonCount > 0 && (
                                            // <span className="mb-2 text-secondary text-sm">You still need to fit {totalEntPropPersonCount} more guests.</span>
                                        )
                                    } */}
                                </div>

                                <div>
                                    <div className="min-[1000px]:hidden flex justify-start items-center gap-1">
                                        <div className="font-bold text-3xl" title="Included taxes and fees">
                                            ${discountedPrice ? discountedPrice : selectedPrice}
                                        </div>
                                        {
                                            discountedPrice && (
                                                <div className="text-red-500 text-sm line-through">${selectedPrice}</div>
                                            )
                                        }
                                    </div>


                                    <div className="font-medium text-secondary text-sm">
                                        {
                                            newRoomDetails?.data?.subUnits[0]?.monthlyRateApplied && (
                                                <h5>Utility bills not included.</h5>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <Button
                                size="lg"
                                className="p-6 max-[1000px]:w-full min-w-1/6 font-normal"
                                onClick={() => {
                                    handleCheckIn({
                                        isEntProperty: !!newRoomDetails?.data?.allowEntireProperty &&
                                            newRoomDetails?.data?.isEntirePropertyAvailable
                                    })
                                }}
                                disabled={pendingEntProperty || reserveEntPropertyButtonDisabled}
                            >
                                {pendingEntProperty && <Spinner />}
                                Reserve Entire Property
                            </Button>
                        </div>
                    </div>
                )}
            </div >
            <div className={`relative flex  justify-between items-start bg-white shadow-sm mt-10 p-5 rounded-xl font-poppins flex-col`}>
                {
                    !!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && (
                        <div className="min-[1000px]:hidden flex max-[1000px]:flex-col gap-3 max-[450px]:w-full">
                            <div className="flex justify-center max-[450px]:justify-start items-center gap-2 max-[450px]:w-full">
                                <div className="w-full">
                                    <Select
                                        value={selectedGuestCount.toString()}
                                        onValueChange={(value) => applyEntirePropertyGuestTier(Number(value))}

                                    >
                                        <SelectTrigger className="bg-primary/10 p-6 border border-primary w-full min-w-[250px] max-[450px]:min-w-0 font-poppins">
                                            <SelectValue placeholder="Select Guest Count" />
                                        </SelectTrigger>
                                        <SelectContent className="font-poppins" >
                                            <SelectGroup className="w-full">
                                                <SelectLabel>Guest Count</SelectLabel>
                                                {newRoomDetails?.data?.subUnits[0]?.monthlyRateApplied && prices?.length > 0 ? (
                                                    <SelectItem key={prices.at(-1)?.maxHeadCount?.toString() ?? "default"} value={prices.at(-1)?.maxHeadCount?.toString() ?? ""}>
                                                        <div className="flex flex-row justify-between items-center !gap-16 !max-[1000px]:gap-0">
                                                            <span className="flex items-center min-w-16">
                                                                <FaUser className="inline-block mr-1" /> x {prices.at(-1)?.maxHeadCount || "N/A"}
                                                            </span>
                                                            <div className="max-[1000px]:hidden flex items-center gap-1">
                                                                <div className="font-bold text-base" title="Included taxes and fees">
                                                                    ${prices.at(-1)?.priceWithDiscount ? prices.at(-1)?.priceWithDiscount : prices.at(-1)?.priceForMaxCount}
                                                                </div>
                                                                {prices.at(-1)?.priceWithDiscount && (
                                                                    <div className="text-red-500 text-xs line-through">${prices.at(-1)?.priceForMaxCount}</div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </SelectItem>

                                                ) : (
                                                    prices?.map(({ maxHeadCount, priceForMaxCount, priceWithDiscount }: { maxHeadCount?: number, priceWithDiscount: number, priceForMaxCount: number }) => (
                                                        <SelectItem key={maxHeadCount?.toString() || "default"} value={maxHeadCount?.toString() || ""}>
                                                            <div className="flex flex-row justify-between items-center !gap-16 !max-[1000px]:gap-0">
                                                                <span className="flex items-center min-w-16">
                                                                    <FaUser className="inline-block mr-1" /> x {maxHeadCount || "N/A"}
                                                                </span>
                                                                <div className="max-[1000px]:hidden flex items-center gap-1">
                                                                    <div className="font-bold text-base" title="Included taxes and fees">
                                                                        ${priceWithDiscount ? priceWithDiscount : priceForMaxCount}
                                                                    </div>
                                                                    {priceWithDiscount && (
                                                                        <div className="text-red-500 text-xs line-through">${priceForMaxCount}</div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </SelectItem>


                                                    ))
                                                )}

                                            </SelectGroup>
                                        </SelectContent>

                                    </Select>
                                    {/* {
                                        !!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && totalEntPropPersonCount > 0 && (
                                            // <span className="mb-2 text-secondary text-sm">You still need to fit {totalEntPropPersonCount} more guests.</span>
                                            <span className="mb-2 text-secondary text-sm">Select Your Rooms.</span>
                                        )
                                    } */}

                                </div>

                                <div>
                                    <div className="flex justify-start items-center gap-1">
                                        {/* <div className="font-bold text-2xl" title="Included taxes and fees">
                                            ${discountedPrice ? discountedPrice : selectedPrice}
                                        </div>
                                        {
                                            discountedPrice && (
                                                <div className="text-red-500 text-sm line-through">${selectedPrice}</div>
                                            )
                                        } */}
                                        <div className="font-bold text-2xl" title="Included taxes and fees">
                                            {discountedPrice ? (<span>${discountedPrice}</span>) : (
                                                discountedPrice === 0 ? (<span className="text-green-700">Free</span>) : (<span>${selectedPrice}</span>)
                                            )}
                                        </div>
                                        {
                                            discountedPrice ? (
                                                <div className="text-red-500 text-sm line-through">${selectedPrice}</div>
                                            ) : (
                                                discountedPrice === 0 ? (
                                                    <div className="text-red-500 text-sm line-through">${selectedPrice}</div>
                                                ) : null
                                            )
                                        }
                                    </div>


                                    <div className="font-medium text-secondary text-sm">
                                        {
                                            newRoomDetails?.data?.subUnits[0]?.monthlyRateApplied && (
                                                <h5>Utility bills not included.</h5>
                                            )
                                        }
                                    </div>
                                </div>
                            </div>
                            <Button size={'lg'} className="hidden max-[1000px]:block px-6 py-4 w-full h-full" disabled={pending || reserveButtonDisabled}
                                onClick={() => {
                                    handleCheckIn({
                                        isEntProperty: !!newRoomDetails?.data?.allowEntireProperty &&
                                            !newRoomDetails?.data?.allowIndividualUnit &&
                                            newRoomDetails?.data?.isEntirePropertyAvailable
                                    })
                                }}

                            >
                                {pending && <Spinner />}
                                Reserve{`${!!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && newRoomDetails?.data?.isEntirePropertyAvailable ? ' Entire' : ''}`} Property
                            </Button>
                        </div>
                    )
                }


                {!!newRoomDetails?.data?.allowIndividualUnit && (
                    <>
                        <div className="min-[1000px]:hidden max-[1000px]:block flex flex-col gap-2 mt-4 text-gray-600 text-sm">
                            <div className="flex flex-col gap-1">
                                {
                                    selectedSubUnitCount.map((subunit) => (
                                        <div>
                                            <h5 className="font-medium text-primary">{subunit?.subUnit?.name}</h5>

                                            <ul>
                                                {
                                                    subunit?.selectedDetails?.map((unit, index) => (
                                                        <li className="flex items-center text-xs" key={index}><span className="flex items-center"><Dot />{unit?.headCount} person</span> <XIcon size={12} /> {unit?.selectedRoomCount}</li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    ))
                                }
                            </div>
                            {totalSubUnitDetails?.totalRooms > 0 && (
                                <h5 className="font-medium">{totalSubUnitDetails?.totalRooms} Rooms For <span className="font-medium text-secondary text-lg">${totalSubUnitDetails?.totalPrice}</span></h5>
                            )
                            }
                        </div>
                        <Button size={'lg'} className="hidden max-[1000px]:block px-6 py-4 w-full h-full" disabled={pending || reserveButtonDisabled}
                            onClick={() => {
                                handleCheckIn({
                                    isEntProperty: !!newRoomDetails?.data?.allowEntireProperty &&
                                        !newRoomDetails?.data?.allowIndividualUnit &&
                                        newRoomDetails?.data?.isEntirePropertyAvailable
                                })
                            }}

                        >
                            {pending && <Spinner />}
                            Reserve{`${!!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && newRoomDetails?.data?.isEntirePropertyAvailable ? ' Entire' : ''}`} Property
                        </Button>
                    </>
                )

                }
                {
                    // !!newRoomDetails?.data?.allowIndividualUnit && totalPersonCount > 0 && (
                    !!newRoomDetails?.data?.allowIndividualUnit && selectedSubUnitCount.length <= 0 && (
                        // <span className="min-[1000px]:hidden mt-2 mb-2 text-secondary text-sm">You still need to fit {totalPersonCount} more guests.</span>
                        <span className="min-[1000px]:hidden mt-2 mb-2 text-secondary text-sm">Select Your Rooms.</span>
                    )
                }
                {
                    // !!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && totalEntPropPersonCount > 0 && (
                    !!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && selectedGuestCount <= 0 && (
                        // <span className="min-[1000px]:hidden mt-2 mb-2 text-secondary text-sm">You still need to fit {totalEntPropPersonCount} more guests.</span>
                        <span className="min-[1000px]:hidden mt-2 mb-2 text-secondary text-sm">Select Your Rooms.</span>
                    )
                }







                <div className="relative flex flex-row justify-between items-start bg-white shadow-sm max-[1000px]:shadow-none max-[1000px]:mt-5 p-5 max-[1000px]:p-0 rounded-xl w-full font-poppins">
                    <div className={`border-r  max-[1000px]:border-none w-full ${!!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit ? 'grid grid-cols-3 max-[1658px]:grid-cols-2 max-[1166px]:grid-cols-1' : ''}`}>

                        {newRoomDetails?.data?.subUnits &&
                            Array.isArray(newRoomDetails.data?.subUnits) &&
                            newRoomDetails.data?.subUnits.length > 0 ? (
                            (!newRoomDetails.data.allowEntireProperty ? newRoomDetails.data.subUnits.filter((room: any) => !room.isTypeEntireProperty) :
                                newRoomDetails.data.allowEntireProperty && newRoomDetails.data.allowIndividualUnit ?
                                    newRoomDetails.data.subUnits.filter((room: any) => !room.isTypeEntireProperty) :
                                    newRoomDetails.data.subUnits
                            ).map((room: any, index: number, arr: string | any[]) => (
                                <RoomCard
                                    key={index}
                                    roomObj={room}
                                    allowEntireProperty={!!newRoomDetails?.data?.allowEntireProperty}
                                    allowIndividualUnit={!!newRoomDetails?.data?.allowIndividualUnit}
                                    bedRoomNumber={index + 1}
                                    isLast={index === arr.length - 1}
                                    onChangeSelectedRoomCount={handleSelectedRoomCountChange}
                                    onUpdateAvailability={newRoomDetails}
                                />
                            )

                            )
                        ) : (
                            <p className="text-gray-500 text-sm">No room details available for the selected date range.</p>
                        )}


                    </div>
                    <div className="max-[1000px]:hidden top-5 right-0 sticky flex flex-col justify-start items-start pl-5 w-3/12 max-[1000px]:w-5/12">

                        {
                            !!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && (
                                <>
                                    {/* Apartment  */}
                                    <div className="flex gap-2 w-max">
                                        <Select
                                            value={selectedGuestCount.toString()}
                                            onValueChange={(value) => applyEntirePropertyGuestTier(Number(value))}
                                        >
                                            <SelectTrigger className="w-[160px] font-poppins">
                                                <SelectValue placeholder="Select Guest Count" />
                                            </SelectTrigger>
                                            <SelectContent className="font-poppins">
                                                <SelectGroup>
                                                    <SelectLabel>Guest Count</SelectLabel>
                                                    {newRoomDetails?.data?.subUnits[0]?.monthlyRateApplied && prices?.length > 0 ? (
                                                        <SelectItem key={lastHeadCount.toString() ?? "default"} value={lastHeadCount.toString() ?? ""}>
                                                            <FaUser className="inline-block mr-2" /> x {lastHeadCount ?? "N/A"}
                                                        </SelectItem>
                                                    ) : (
                                                        prices?.map(({ maxHeadCount }: { maxHeadCount?: number }) => {
                                                            return (
                                                                <SelectItem key={maxHeadCount?.toString() ?? "default"} value={maxHeadCount?.toString() ?? ""}>
                                                                    <FaUser className="inline-block mr-2" /> x {maxHeadCount ?? "N/A"}
                                                                </SelectItem>
                                                            )
                                                        })
                                                    )}

                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>

                                        <div className="flex justify-start items-center gap-1">
                                            <div className="font-bold text-2xl" title="Included taxes and fees">
                                                {discountedPrice ? (<span>${discountedPrice}</span>) : (
                                                    discountedPrice === 0 ? (<span className="text-green-700">Free</span>) : (<span>${selectedPrice}</span>)
                                                )}
                                            </div>
                                            {
                                                discountedPrice ? (
                                                    <div className="text-red-500 text-sm line-through">${selectedPrice}</div>
                                                ) : (
                                                    discountedPrice === 0 ? (
                                                        <div className="text-red-500 text-sm line-through">${selectedPrice}</div>
                                                    ) : null
                                                )
                                            }
                                        </div>
                                    </div>

                                    <div className="mt-2 font-medium text-secondary text-sm">
                                        {
                                            newRoomDetails?.data?.subUnits[0]?.monthlyRateApplied && (
                                                <h5>Utility bills not included.</h5>
                                            )
                                        }
                                    </div>
                                </>
                            )
                        }
                        <div className="flex flex-col gap-2 mt-4 text-gray-600 text-sm">
                            <div className="flex flex-col gap-1">
                                {
                                    selectedSubUnitCount.map((subunit) => (
                                        <div>
                                            <h5 className="font-medium text-primary">{subunit?.subUnit?.name}</h5>

                                            <ul>
                                                {
                                                    subunit?.selectedDetails?.map((unit) => (
                                                        <li className="flex items-center text-xs"><span className="flex items-center"><Dot />{unit?.headCount} person</span> <XIcon size={12} /> {unit?.selectedRoomCount}</li>
                                                    ))
                                                }
                                            </ul>
                                        </div>
                                    ))
                                }
                            </div>
                            {totalSubUnitDetails?.totalRooms > 0 && (
                                <h5 className="font-medium">{totalSubUnitDetails?.totalRooms} Rooms For <span className="font-medium text-secondary text-lg">${totalSubUnitDetails?.totalPrice.toFixed(2)}</span></h5>
                            )
                            }
                        </div>
                        {
                            // !!newRoomDetails?.data?.allowIndividualUnit && totalPersonCount > 0 && (
                            !!newRoomDetails?.data?.allowIndividualUnit && selectedSubUnitCount.length <= 0 && (
                                // <span className="mb-2 text-secondary text-sm">You still need to fit {totalPersonCount} more guests.</span>  
                                <span className="mb-2 text-secondary text-sm">Select Your Rooms.</span>
                            )
                        }
                        {
                            // !!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && totalEntPropPersonCount > 0 && (
                            !!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && selectedGuestCount <= 0 && (
                                // <span className="mb-2 text-secondary text-sm">You still need to fit {totalEntPropPersonCount} more guests.</span>
                                <span className="mb-2 text-secondary text-sm">Select Your Rooms.</span>
                            )
                        }
                        <div className={`flex flex-col justify-between items-start gap-4 w-full ${!!newRoomDetails?.data?.allowEntireProperty && newRoomDetails?.data?.allowIndividualUnit ? 'mt-3' : ''}`}>
                            <Button
                                size="lg"
                                className="p-6 w-full"
                                disabled={checking ||
                                    (!!newRoomDetails?.data?.allowEntireProperty &&
                                        !newRoomDetails?.data?.allowIndividualUnit &&
                                        newRoomDetails?.data?.isEntirePropertyAvailable ?
                                        !newRoomDetails?.data?.isEntirePropertyAvailable : !newRoomDetails?.data?.allowIndividualUnit
                                    )
                                    || pending || reserveButtonDisabled}
                                onClick={form.handleSubmit(() => {
                                    handleCheckIn({
                                        isEntProperty: !!newRoomDetails?.data?.allowEntireProperty &&
                                            !newRoomDetails?.data?.allowIndividualUnit &&
                                            newRoomDetails?.data?.isEntirePropertyAvailable
                                    })
                                })}
                            >
                                {pending && <Spinner />}
                                Reserve{`${!!newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && newRoomDetails?.data?.isEntirePropertyAvailable ? ' Entire' : ''}`} Property
                            </Button>

                            {
                                ((newRoomDetails?.data?.allowEntireProperty && !newRoomDetails?.data?.allowIndividualUnit && !newRoomDetails?.data?.isEntirePropertyAvailable) ||
                                    !newRoomDetails.data?.subUnits) && (
                                    <span className="text-secondary text-sm">Unavailable for selected dates</span>
                                )
                            }
                            <span>
                                <ul className="text-gray-600 text-sm">
                                    <li>It only takes 2 minutes</li>
                                    <li>Confirmation is immediate</li>
                                </ul>
                            </span>
                        </div>
                    </div>
                </div>

            </div >
        </>
    )
}

export default SinglePropertyRoomDetails