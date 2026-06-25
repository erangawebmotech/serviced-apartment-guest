"use client"
import UserAvatar from '@/components/navigation/UserAvatar'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Logo from "@/public/Logo.png";
import { useLoginModal } from '@/common/auth/handleLoginModal'
import { getLoggedUser } from '@/common/commonFunctions'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getReservationHistoryData } from '@/actions/services/getReservationDetails'
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { parseISO, format, setHours, setMinutes, setSeconds } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { CalendarIcon, ExternalLink } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { cn } from "@/lib/utils"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from 'react-day-picker'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { PAYMENT_STATUS_TYPES } from '@/common/constants'
import { CheckTimeType, refactorDate } from '@/common/commonClientFunctions'
import Navbar from '@/components/navigation/Navbar'

const Page = () => {
    const router = useRouter()
    const { handleLoginModal } = useLoginModal();
    const [hasSession, setHasSession] = useState<boolean>(false);
    const [data, setData] = useState<any>(null)
    const [fetching, setFetching] = useState<boolean>(true);
    const [searchByName, setSearchByName] = useState<string>("");
    const [searchByCode, setSearchByCode] = useState<string>("");
    const perPage = 5;
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalReservations, setTotalReservations] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + 4);

    const [debouncedSearchName, setDebouncedSearchName] = useState("");
    const [debouncedSearchCode, setDebouncedSearchCode] = useState("");
    const [debouncedDate, setDebouncedDate] = useState<DateRange | undefined>(undefined);

    const [date, setDate] = useState<DateRange | undefined>({
        from: undefined,
        to: undefined,
    })


    const checkSessionStatus = async () => {

        try {
            const response = await fetch("/api/session/check", { method: "POST" });
            const result = await response.json();

            if (!result.success) {
                handleLoginModal({ open: true });
            }

            if (result.success) {
                setHasSession(result.success);
            }
        } catch (error) {
            console.error("Error checking session:", error);
        }
    };

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchName(searchByName);
            setDebouncedSearchCode(searchByCode);
            setDebouncedDate(date)
        }, 500);

        return () => clearTimeout(handler);
    }, [searchByName, searchByCode, date]);

    useEffect(() => {
        checkSessionStatus();
        fetchData({});
    }, [])

    useEffect(() => {
        setTotalPages(Math.ceil(totalReservations / perPage))
    }, [totalReservations])

    const fetchData = async ({ pageNumber, propertyName, code, checkIn, checkOut }: { pageNumber?: number, propertyName?: string, code?: string, checkIn?: string, checkOut?: string }) => {
        setFetching(true)
        await getReservationHistoryData({ page: pageNumber ?? 0, propertyName: propertyName ?? '', code: code ?? '', checkIn: checkIn ?? '', checkOut: checkOut ?? '' }).then(async (res) => {

            if (res?.error) {
                throw res;
            }
            await setData(res)
            await setTotalReservations(res?.pagination?.totalCount)

        }).catch((error) => {
            console.log(error)
        }).finally(() => {
            setFetching(false)
        })
    }

    const handlePageClick = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
        // alert(`Page clicked: ${page}`);
    };


    const formatText = (text: string): string => {
        if (!text) return '';

        return text
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    };

    const handleNavigate = ({ type, slug, reservationCode }: { type: string, slug: string, reservationCode: string }) => {
        if (!type || !slug || !reservationCode) {
            return;
        }
        const url = `/${type.toLowerCase()}/${slug}/reserve/${reservationCode}`;
        window.open(url, '_blank');
    }

    useEffect(() => {
        const formattedCheckIn = debouncedDate?.from
            ? format(setSeconds(setMinutes(setHours(debouncedDate.from, 0), 0), 0), "yyyy-MM-dd'T'HH:mm:ss")
            : undefined;

        const formattedCheckOut = debouncedDate?.to
            ? format(setSeconds(setMinutes(setHours(debouncedDate.to, 23), 59), 59), "yyyy-MM-dd'T'HH:mm:ss")
            : undefined;

        fetchData({ pageNumber: currentPage - 1, propertyName: debouncedSearchName, code: debouncedSearchCode, checkIn: formattedCheckIn, checkOut: formattedCheckOut })
    }, [debouncedSearchName, debouncedSearchCode, debouncedDate, currentPage])

    const handleDateChange = (newDate: DateRange | undefined) => {
        if (!newDate) return;

        const adjustedRange: DateRange = {
            from: newDate.from
                ? refactorDate(newDate.from, CheckTimeType.CHECKIN)
                : undefined,
            to: newDate.to
                ? refactorDate(newDate.to, CheckTimeType.CHECKOUT)
                : undefined,
        };

        setDate(adjustedRange);
    };

    return (
        <section className="relative flex flex-col items-center bg-[#F7F7F7] p-10 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 w-full font-poppins">
            <div className="relative max-[1000px]:p-0 px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 w-full h-full">
               <Navbar className='bg-[#F7F7F7] px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 py-4' />

                <div className='mt-10 w-full min-h-[30vh]'>
                    <h1 className="mb-10 font-medium text-3xl">My Reservations</h1>

                    <div className='gap-5 grid grid-cols-5 max-[1000px]:grid-cols-1 my-10'>
                        <div>
                            <label className="block mb-2 font-medium text-gray-600 text-sm">Filter by Name</label>
                            <Input type="text" placeholder="Search By Name" value={searchByName} onChange={(e) => { setSearchByName(e.target.value) }} />
                        </div>

                        <div>
                            <label className="block mb-2 font-medium text-gray-600 text-sm">Filter by Code</label>
                            <Input type="text" placeholder="Search By Code" value={searchByCode} onChange={(e) => { setSearchByCode(e.target.value) }} />
                        </div>


                        <div>
                            <label className="block mb-2 font-medium text-gray-600 text-sm">Filter by Date</label>
                            <div className={cn("gap-2 grid")}>
                                <Popover>
                                    <PopoverTrigger asChild className='font-poppins'>
                                        <Button
                                            id="date"
                                            variant={"outline"}
                                            size="lg"
                                            className={cn(
                                                "justify-between items-center bg-transparent px-0 pl-2 w-full font-poppins font-normal text-left",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <div className='flex justify-start items-center gap-2'>
                                                <CalendarIcon className={`${!date?.from && !date?.to ? 'text-gray-500' : null}`} />
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
                                                    <span className='text-gray-500'>Pick a date</span>
                                                )}
                                            </div>

                                            {date?.from && (

                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDate(undefined)}
                                                    className="hover:bg-red-100 text-red-500"
                                                >
                                                    Clear
                                                </Button>

                                            )}

                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="p-0 w-full font-poppins" align="start">
                                        <Calendar
                                            initialFocus
                                            mode="range"
                                            className='max-sm:flex flex-col max-sm:justify-center max-sm:items-center max-sm:w-[320px]'
                                            selected={date}
                                            onSelect={handleDateChange}
                                            numberOfMonths={2}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                    </div>
                    <div className='max-[1000px]:hidden'>
                        <Table>
                            <TableCaption>A list of your recent reservations.</TableCaption>
                            <TableHeader>
                                <TableRow className='bg-transparent hover:bg-transparent'>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Ref. Number</TableHead>
                                    <TableHead>Property Name</TableHead>
                                    <TableHead>Date Details</TableHead>
                                    <TableHead>Payment Type</TableHead>
                                    <TableHead>Reservation Status</TableHead>
                                    <TableHead>Payment Status</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {fetching ? (
                                    <>
                                        {[...Array(5)].map((_, index) => (
                                            <TableRow key={index} className="hover:bg-transparent">
                                                <TableCell>
                                                    <Skeleton className="rounded-sm w-12 h-12" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-24 h-8" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-48 h-8" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-32 h-8" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-24 h-8" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-32 h-8" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-24 h-8" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-24 h-8" />
                                                </TableCell>
                                                <TableCell>
                                                    <Skeleton className="w-24 h-8" />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </>
                                ) : (
                                    <>
                                        {data?.data?.map((reservation: any) => (
                                            <TableRow key={reservation?.id} className="hover:bg-primary/5" >
                                                <TableCell>
                                                    <Image
                                                        src={reservation?.property?.file?.smallPath}
                                                        width={80}
                                                        height={80}
                                                        alt={`${reservation?.property?.name}-serviced-apartments`}
                                                        loading="lazy"
                                                        className="rounded-sm w-12 h-12 object-cover"
                                                    />
                                                </TableCell>
                                                <TableCell>{reservation?.code}</TableCell>
                                                <TableCell>{reservation?.property?.name}</TableCell>
                                                <TableCell>
                                                    {format(parseISO(reservation?.checkIn || ''), 'yyyy-MM-dd').toString()} to{' '}
                                                    {format(parseISO(reservation?.checkOut || ''), 'yyyy-MM-dd').toString()}
                                                </TableCell>
                                                <TableCell>{formatText(reservation?.paymentType)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`
                                    ${reservation?.status?.toUpperCase() === PAYMENT_STATUS_TYPES.APPROVED ? 'border-green-500 text-green-500' : ''}
                                    ${reservation?.status?.toUpperCase() === PAYMENT_STATUS_TYPES.REJECTED ? 'border-secondary text-secondary' : ''}
                                    ${reservation?.status?.toUpperCase() === PAYMENT_STATUS_TYPES.CANCELLED ? 'border-orange-500 text-orange-500' : ''}
                                    ${reservation?.status?.toUpperCase() === PAYMENT_STATUS_TYPES.PENDING ? 'border-yellow-500 text-yellow-500' : ''}
                                `}
                                                    >
                                                        {formatText(reservation?.status || '')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="outline"
                                                        className={`
                                    ${reservation?.paymentStatus?.toUpperCase() === PAYMENT_STATUS_TYPES.SUCCESS ? 'border-green-500 text-green-500' : ''}
                                    ${reservation?.paymentStatus?.toUpperCase() === PAYMENT_STATUS_TYPES.FAILED ? 'border-secondary text-secondary' : ''}
                                    ${reservation?.paymentStatus?.toUpperCase() === PAYMENT_STATUS_TYPES.CANCELLED ? 'border-gray-500 text-gray-500' : ''}
                                    ${reservation?.paymentStatus?.toUpperCase() === PAYMENT_STATUS_TYPES.PENDING ? 'border-yellow-500 text-yellow-500' : ''}
                                `}
                                                    >
                                                        {formatText(reservation?.paymentStatus || '')}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className='text-right'>${reservation?.netTotal}</TableCell>
                                                <TableCell className="flex flex-col justify-center items-center mt-3 text-left hover:underline cursor-pointer" onClick={() => {
                                                    const property = reservation?.property;
                                                    const code = reservation?.code;

                                                    if (property && code) {
                                                        handleNavigate({
                                                            slug: property?.slug,
                                                            type: property?.propertyType,
                                                            reservationCode: code
                                                        });
                                                    } else {
                                                        console.error("Reservation data or property is missing.");
                                                    }
                                                }}>

                                                    <div className='flex items-center gap-1'>
                                                        View Details
                                                        <ExternalLink size={16} />
                                                    </div>

                                                </TableCell>

                                            </TableRow>
                                        ))}
                                    </>
                                )}
                            </TableBody>
                            <TableFooter className="bg-transparent hover:bg-transparent">
                                <TableRow className="bg-transparent hover:bg-transparent w-full">
                                    <TableCell colSpan={9} className="text-right">
                                        {
                                            totalPages > 0 && (
                                                <Pagination className="flex justify-end">
                                                    <PaginationContent>
                                                        <PaginationItem>
                                                            <PaginationPrevious onClick={() => handlePageClick(currentPage - 1)} />
                                                        </PaginationItem>

                                                        {startPage > 1 && (
                                                            <>
                                                                <PaginationItem>
                                                                    <PaginationLink onClick={() => handlePageClick(1)}>1</PaginationLink>
                                                                </PaginationItem>
                                                                {startPage > 2 && <PaginationItem>...</PaginationItem>}
                                                            </>
                                                        )}

                                                        {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
                                                            const page = startPage + index;
                                                            return (
                                                                <PaginationItem key={page}>
                                                                    <PaginationLink isActive={currentPage === page} onClick={() => handlePageClick(page)}>
                                                                        {page}
                                                                    </PaginationLink>
                                                                </PaginationItem>
                                                            );
                                                        })}

                                                        {endPage < totalPages && (
                                                            <>
                                                                {endPage < totalPages - 1 && <PaginationItem>...</PaginationItem>}
                                                                <PaginationItem>
                                                                    <PaginationLink onClick={() => handlePageClick(totalPages)}>{totalPages}</PaginationLink>
                                                                </PaginationItem>
                                                            </>
                                                        )}

                                                        <PaginationItem>
                                                            <PaginationNext onClick={() => handlePageClick(currentPage + 1)} />
                                                        </PaginationItem>
                                                    </PaginationContent>
                                                </Pagination>
                                            )
                                        }
                                    </TableCell>
                                </TableRow>
                            </TableFooter>
                        </Table>

                    </div>

                    <div className='min-[1001px]:hidden flex flex-col gap-2' >

                        {fetching ? (
                            <>
                                {[...Array(5)].map((_, index) => (
                                    <Skeleton className="rounded-sm w-full h-32" />
                                ))}
                            </>
                        ) : (
                            <>
                                {data?.data?.map((reservation: any) => (
                                    <Card key={reservation?.id} className="relative flex items-start gap-5 bg-transparent shadow-none p-3 border" onClick={() => {
                                        const property = reservation?.property;
                                        const code = reservation?.code;

                                        if (property && code) {
                                            handleNavigate({
                                                slug: property?.slug,
                                                type: property?.propertyType,
                                                reservationCode: code
                                            });
                                        } else {
                                            console.error("Reservation data or property is missing.");
                                        }
                                    }}>

                                        <Image
                                            loading='lazy'
                                            src={reservation?.property?.file?.smallPath}
                                            width={80}
                                            height={80}
                                            alt={`${reservation?.property?.name}-serviced-apartments`}
                                            className="rounded-sm w-32 h-32 object-cover aspect-square"
                                        />

                                        <div className='w-full text-xs leading-5'>
                                            <div className='flex justify-between items-start'>
                                                <div>
                                                    <div> {reservation?.property?.name}</div>
                                                    <div> {reservation?.code}</div>
                                                </div>

                                                <Badge
                                                    variant="outline"
                                                    className={` ${reservation?.status?.toUpperCase() === 'APPROVED' ? 'border-green-500 text-green-500' : ''}
                                                     ${reservation?.status?.toUpperCase() === 'REJECTED' ? 'border-secondary text-secondary' : ''}
                                                      ${reservation?.status?.toUpperCase() === 'CANCELLED' ? 'border-gray-500 text-gray-500' : ''}
                                                       ${reservation?.status?.toUpperCase() === 'PENDING' ? 'border-yellow-500 text-yellow-500' : ''} 
                                                       text-[10px] border-none`}
                                                >
                                                    {formatText(reservation?.status || '')}
                                                </Badge>

                                            </div>


                                            <div>
                                                {format(parseISO(reservation?.checkIn || ''), 'yyyy-MM-dd').toString()} to{' '}
                                                {format(parseISO(reservation?.checkOut || ''), 'yyyy-MM-dd').toString()}

                                            </div>

                                            <div>
                                                {formatText(reservation?.paymentType)}
                                            </div>
                                            <div>
                                                Payment:
                                                <span
                                                    className={`
            ${reservation?.paymentStatus?.toUpperCase() === PAYMENT_STATUS_TYPES.SUCCESS ? 'border-green-500 text-green-500' : ''}
            ${reservation?.paymentStatus?.toUpperCase() === PAYMENT_STATUS_TYPES.FAILED ? 'border-secondary text-secondary' : ''}
            ${reservation?.paymentStatus?.toUpperCase() === PAYMENT_STATUS_TYPES.CANCELLED ? 'border-gray-500 text-gray-500' : ''}
            ${reservation?.paymentStatus?.toUpperCase() === PAYMENT_STATUS_TYPES.PENDING ? 'border-yellow-500 text-yellow-500' : ''}
        `}
                                                >
                                                    {" " + formatText(reservation?.paymentStatus || '')}
                                                </span>
                                            </div>


                                            <div className='font-medium text-base'>
                                                ${reservation?.netTotal}
                                            </div>
                                        </div>

                                    </Card>
                                ))}
                            </>
                        )}

                        <div className="bg-transparent hover:bg-transparent">
                            <div className="bg-transparent hover:bg-transparent w-full">
                                <div className="text-right">
                                    {
                                        totalPages > 0 && (
                                            <Pagination className="flex justify-end">
                                                <PaginationContent>
                                                    <PaginationItem>
                                                        <PaginationPrevious onClick={() => handlePageClick(currentPage - 1)} />
                                                    </PaginationItem>

                                                    {startPage > 1 && (
                                                        <>
                                                            <PaginationItem>
                                                                <PaginationLink onClick={() => handlePageClick(1)}>1</PaginationLink>
                                                            </PaginationItem>
                                                            {startPage > 2 && <PaginationItem>...</PaginationItem>}
                                                        </>
                                                    )}

                                                    {Array.from({ length: endPage - startPage + 1 }).map((_, index) => {
                                                        const page = startPage + index;
                                                        return (
                                                            <PaginationItem key={page}>
                                                                <PaginationLink isActive={currentPage === page} onClick={() => handlePageClick(page)}>
                                                                    {page}
                                                                </PaginationLink>
                                                            </PaginationItem>
                                                        );
                                                    })}

                                                    {endPage < totalPages && (
                                                        <>
                                                            {endPage < totalPages - 1 && <PaginationItem>...</PaginationItem>}
                                                            <PaginationItem>
                                                                <PaginationLink onClick={() => handlePageClick(totalPages)}>{totalPages}</PaginationLink>
                                                            </PaginationItem>
                                                        </>
                                                    )}

                                                    <PaginationItem>
                                                        <PaginationNext onClick={() => handlePageClick(currentPage + 1)} />
                                                    </PaginationItem>
                                                </PaginationContent>
                                            </Pagination>
                                        )
                                    }
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div >
        </section >
    )
}

export default Page