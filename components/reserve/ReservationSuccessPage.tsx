'use client'
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useLoginModal } from '@/common/auth/handleLoginModal';
import { Download, List, RefreshCcw } from 'lucide-react';
import {
    cancelReservation,
    createTransaction,
    getReservationSuccessData,
    reservationPreCheck
} from '@/actions/services/getReservationDetails';
import TimelineLayout from '../timeline-layout';
import { PAYMENT_STATUS_TYPES, PAYMENT_TYPES, RESERVATION_STATUS_TYPES } from '@/common/constants';
import Spinner from '../common/Spinner';
import { toast } from '@/hooks/use-toast';
import { FaEnvelope, FaPen } from 'react-icons/fa';
import { ReviewModal } from './ReviewModal';
import { getRatingCategoriesData } from '@/actions/services/getRatingDetails';
import { PayloadProps } from '@/app/(main)/pay/[code]/page';
import { useCountdownTimer } from '@/hooks/useCountdownTimer';
import { TbCircleX } from "react-icons/tb";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from '../ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { FaWhatsapp } from 'react-icons/fa6';
import { sendWhatsappMessage } from '@/lib/whatsapp';
import Navbar from '../navigation/Navbar';
import { getPDFToDownload } from '@/service/reservation';
import { changePaymentMethodAfterReservation } from "@/service/payment";
import { PaymentMethodModal } from "@/components/reserve/PaymentMethodModal";

const formatString = (input: string): string => {
    return input
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());
};

interface ImageObject {
    id: number,
    originalName: string,
    originalPath: string,
    smallPath: string,
    largePath: string,
    mediumPath: string

}

interface reservationTimelineProps {
    reason: null | string,
    createdAt: string | Date,
    status: string
}

interface paymentTimeLineProps {
    id: null | number,
    createdAt: string | Date,
    status: string
}

interface RoomDetailsProps {
    maxHeadCount: number,
    name: string,
    roomCount: number,
    unitPrice: number,
}

export interface ReservationDataProps {
    id: number,
    checkIn: string | Date,
    checkOut: string | Date,
    totalGuest: number,
    contactDetails: { firstName: string, lastName: string, countryCode: string, contactNo: string, email: string }
    cancellationPolicy: { name: string, description: string, isCancellationAllowed: boolean },
    adult: number,
    child: number,
    infant: number,
    pet: number,
    subTotal: number,
    totalDiscount: number,
    netTotal: number,
    discountName: string | null,
    code: string,
    isReviewAvailable: boolean,
    securityDeposit: number
    reservedUser: {
        id: number,
        firstName: string,
        lastName: string,
        file: ImageObject | null,
        countryCode: string | number,
        contactNo: string | number
    },
    nrpEnabled: boolean,
    status: string,
    property: {
        id: number,
        payAtProperty?: boolean;
        name: string,
        allowInstantBooking: boolean;
        file: ImageObject | null,
        slug: string;
        propertyType: string;
        plan: {
            id: number,
            name: string,
        },
        owner: {
            id: number,
            firstName: string,
            lastName: string,
            file: ImageObject | null,
            countryCode: string | number,
            contactNo: string | number,
        },
        host: {
            contactNo: string,
            countryCode: string,
            email: string,
            file: {
                id: number,
                smallPath: string,
                originalPath: string,
                largePath: string,
                originalName: string,
                mediumPath: string
            },
            firstName: string,
            id: number,
            lastName: string,
            whatsappContactNo: string,
        }
        description: string,
    },
    roomCount: number,
    roomDetails: RoomDetailsProps[] | null,
    paymentStatus: string;
    paymentsTimeLines: paymentTimeLineProps[] | null,
    paymentType: string,
    reservationTimelines: reservationTimelineProps[] | null,
    reservationPayments: null,
    entireProperty: boolean
}

export interface RatingCategoriesProps {
    id: number,
    name: string,
}

const ReservationSuccessPage = ({ id, payExternal }: { id: string, payExternal?: PayloadProps | null }) => {
    const router = useRouter();
    const pathname = usePathname();
    const searchParamsString = useSearchParams().toString();
    const { handleLoginModal, loginModal } = useLoginModal();
    const [reserving, setReserving] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const pendingReviewAfterLoginRef = useRef(false);
    const handledReviewQueryRef = useRef(false);
    const prevLoginModalRef = useRef<boolean | undefined>(undefined);
    const loginModalRef = useRef(loginModal);
    loginModalRef.current = loginModal;
    const handleLoginModalRef = useRef(handleLoginModal);
    handleLoginModalRef.current = handleLoginModal;

    const stripReviewQueryFromUrl = useCallback(() => {
        const params = new URLSearchParams(searchParamsString);
        if (!params.has('review')) return;
        params.delete('review');
        const qs = params.toString();
        router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, [pathname, router, searchParamsString]);

    const [reservationDetails, setReservationDetails] = useState<ReservationDataProps | null>(null)
    const [ratingCategories, setRatingCategories] = useState<RatingCategoriesProps[]>([])
    const { days, hours, minutes, seconds } = useCountdownTimer(payExternal?.remainingTimeInSeconds || 0);
    const [openDialog, setOpenDialog] = useState<boolean>(false)
    const [cancelling, setCancelling] = useState<boolean>(false)
    const [reason, setReason] = useState<string>("");
    const [fieldError, setFieldError] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);

    const checkSessionStatus = async () => {
        try {
            const response = await fetch('/api/session/check', { method: 'POST' });
            const result = await response.json();

            if (!result.success) {
                handleLoginModal({ open: true });
            }
        } catch (error) {
            console.error('Error checking session:', error);
            return;
        }
    };

    const canShowChangePayment =
        reservationDetails?.paymentStatus !== PAYMENT_STATUS_TYPES.SUCCESS &&
        (reservationDetails?.status === RESERVATION_STATUS_TYPES.PENDING || reservationDetails?.status === RESERVATION_STATUS_TYPES.APPROVED);

    const openChangePaymentModal = () => setOpenPaymentModal(true);

    const submitPaymentMethodChange = async (newMethod: 'CARD' | 'PAY_AT_PROPERTY') => {
        if (!reservationDetails?.id) return;
        try {
            const res = await changePaymentMethodAfterReservation(newMethod, reservationDetails.id);
            // Optimistically update local state
            setReservationDetails((prev) => prev ? ({ ...prev, paymentType: newMethod }) as any : prev);
            toast({
                description: res?.message || 'Payment method updated successfully.',
                className: "bg-primary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            });
        } catch (error: any) {
            toast({
                description: error?.message || 'Failed to update payment method.',
                className: "bg-secondary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            });
        }
    };


    const loadData = async () => {
        await getReservationSuccessData(id).then((res) => {
            if (res?.error) {
                throw res;
            }
            setReservationDetails(res?.data);
        }).catch((err) => {
            console.log(err)
        })
        await getRatingCategoriesData().then((res) => {
            if (res?.error) {
                throw res;
            }
            setRatingCategories(res?.data);
        }).catch((err) => {
            console.log(err)
        })
    }

    useEffect(() => {
        checkSessionStatus();
        loadData();
    }, []);

    useEffect(() => {
        if (!reservationDetails || handledReviewQueryRef.current) return;

        const params = new URLSearchParams(searchParamsString);
        const reviewParam = params.get('review');
        if (reviewParam !== 'true') {
            handledReviewQueryRef.current = true;
            return;
        }

        handledReviewQueryRef.current = true;

        const canLeaveReview =
            reservationDetails.status === RESERVATION_STATUS_TYPES.CHECKED_OUT &&
            reservationDetails.isReviewAvailable;

        if (!canLeaveReview) {
            stripReviewQueryFromUrl();
            return;
        }

        (async () => {
            try {
                const response = await fetch('/api/session/check', { method: 'POST' });
                const result = await response.json();

                if (result.success) {
                    setIsModalOpen(true);
                } else {
                    pendingReviewAfterLoginRef.current = true;
                    if (!loginModalRef.current) {
                        handleLoginModalRef.current({ open: true });
                    }
                }
            } catch {
                pendingReviewAfterLoginRef.current = true;
                if (!loginModalRef.current) {
                    handleLoginModalRef.current({ open: true });
                }
            }
        })();
    }, [reservationDetails, searchParamsString, stripReviewQueryFromUrl]);

    useEffect(() => {
        const wasOpen = prevLoginModalRef.current;
        prevLoginModalRef.current = loginModal;

        if (wasOpen !== true || loginModal !== false || !pendingReviewAfterLoginRef.current || !reservationDetails) {
            return;
        }

        const canLeaveReview =
            reservationDetails.status === RESERVATION_STATUS_TYPES.CHECKED_OUT &&
            reservationDetails.isReviewAvailable;

        if (!canLeaveReview) {
            pendingReviewAfterLoginRef.current = false;
            return;
        }

        (async () => {
            try {
                const response = await fetch('/api/session/check', { method: 'POST' });
                const result = await response.json();
                if (result.success) {
                    pendingReviewAfterLoginRef.current = false;
                    setIsModalOpen(true);
                }
            } catch {
                /* leave pendingReviewAfterLoginRef set so user can try again */
            }
        })();
    }, [loginModal, reservationDetails]);

    const handlePayAgain = async () => {
        try {
            if (reservationDetails?.paymentType !== PAYMENT_TYPES.CARD) return;

            setReserving(true);

            const res = await reservationPreCheck(reservationDetails?.id);
            if (res?.error) throw res?.errors;

            if (res?.data) {
                const data = {
                    reservationId: Number(reservationDetails.id),
                    reservationCode: reservationDetails?.code,
                    amount: reservationDetails?.netTotal,
                    currency: 'USD',
                    redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment`,
                    customerName: `${reservationDetails?.reservedUser?.firstName} ${reservationDetails?.reservedUser?.lastName}`,
                    customerEmail: reservationDetails?.contactDetails?.email ?? '',
                };

                const transactionRes = await createTransaction(data);
                if (transactionRes?.error) throw transactionRes?.errors;

                const { url } = transactionRes?.data || {};
                if (!url) throw { error: true, errors: { status: 404, message: "Redirect URL not found" } };

                window.location.href = url;
            }
        } catch (error: any) {
            toast({
                description: error.message,
                className: "bg-primary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            });
            setReserving(false);
        }
    };

    const handleCancelSubmit = async () => {
        if (!reason.trim()) {
            setFieldError('Please provide a reason before cancelling.')
            return;
        }
        if (!reservationDetails?.id) {
            return
        }
        setCancelling(true)
        await cancelReservation({ reason: reason, id: reservationDetails?.id }).then((res) => {
            setOpenDialog(false)
            setReason("");
            setFieldError("")
            toast({
                description: res.error ? res.errors.message : res.message,
                className: "bg-primary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            });
        }).catch((e) => {
            toast({
                description: e.message,
                className: "bg-secondary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            });
        }).finally(() => {
            setCancelling(false)
            window.location.reload();
        })


    };

    const handleDownloadPDF = async (id: number, name: string, code: string) => {
        try {
            setLoading(true);
            const res = await getPDFToDownload(id);
            const blob = new Blob([res], { type: "application/pdf" });
            const link = document.createElement("a");
            const url = window.URL.createObjectURL(blob);
            link.href = url;
            link.download = `${name}_${code}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1000);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section
            className="relative flex flex-col items-center bg-[#F7F7F7] p-10 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 w-full font-poppins"
            id='pdf-content'>
            <div
                className="relative max-[1000px]:p-0 px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 w-full h-full">
                <Navbar className='bg-[#F7F7F7] px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 py-4' />

                <div className="flex justify-center items-center mt-6 min-h-[50vh]">

                    {reservationDetails && <PaymentMethodModal
                        payAtProperty={reservationDetails?.property?.payAtProperty}
                        isOpen={openPaymentModal}
                        onClose={() => setOpenPaymentModal(false)}
                        currentMethod={(reservationDetails?.paymentType as any) || PAYMENT_TYPES.CARD}
                        onSubmit={submitPaymentMethodChange}
                    />}
                    <ReviewModal isOpen={isModalOpen} toggle={() => setIsModalOpen(false)}
                        ratingCategoriesData={ratingCategories} code={reservationDetails?.code}
                        slug={reservationDetails?.property?.slug!}
                        onSuccessfulSubmit={stripReviewQueryFromUrl}
                    />
                    {
                        reservationDetails ? (
                            <Card className="bg-transparent shadow-none border-none w-full">
                                <CardHeader className='flex flex-row justify-between items-center pl-0'>
                                    <CardTitle className="p-0 font-semibold text-2xl">
                                        <h1 className='cursor-pointer' onClick={() => {
                                            window.open(`/${reservationDetails?.property?.propertyType.toLowerCase()}/${reservationDetails?.property?.slug}`, '_blank')
                                        }}>{reservationDetails?.property?.name!}</h1>
                                        <p className='font-medium text-gray-600 text-sm'>For {reservationDetails?.adult} Adult {reservationDetails?.child > 0 ? `and ${reservationDetails?.child} Child${reservationDetails?.child > 1 ? 'ren' : null}` : null}</p>
                                    </CardTitle>
                                    {reservationDetails?.status === RESERVATION_STATUS_TYPES.CHECKED_OUT &&
                                        reservationDetails.isReviewAvailable && (
                                            <Button
                                                className="bg-transparent hover:bg-transparent shadow-none py-5 border border-primary w-max text-primary"
                                                onClick={() => setIsModalOpen(true)}
                                            >
                                                <FaPen /> Leave a Review
                                            </Button>
                                        )}

                                </CardHeader>
                                <CardContent className='p-0'>

                                    <div className="gap-10 grid grid-cols-2 max-[1000px]:grid-cols-1">
                                        <div
                                            className={`flex flex-col ${reservationDetails?.nrpEnabled ? 'gap-2' : 'gap-4'}`}>
                                            <div>
                                                <Image
                                                    src={reservationDetails?.property?.file?.largePath!}
                                                    alt={reservationDetails?.property?.name ?? 'property'}
                                                    width={500}
                                                    height={300}
                                                    className="rounded-lg w-full object-cover"
                                                />
                                                {reservationDetails?.nrpEnabled && (
                                                    <div className='mt-2 font-medium text-secondary text-sm'>Non
                                                        Refundable</div>
                                                )}
                                            </div>
                                            <div className="gap-4 grid grid-cols-2 text-sm">
                                                <div>
                                                    <p className="text-gray-500">Check-in</p>
                                                    <p className="font-medium">{new Date(reservationDetails?.checkIn).toDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Check-out</p>
                                                    <p className="font-medium">{new Date(reservationDetails?.checkOut).toDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Total Guests</p>
                                                    <p className="font-medium">{reservationDetails?.totalGuest}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-500">Total Price</p>
                                                    <p className="font-medium">${reservationDetails?.netTotal}</p>
                                                </div>

                                            </div>
                                            <div className="gap-3 grid grid-cols-2 w-full">
                                                <Button
                                                    className="bg-transparent hover:bg-primary/5 shadow-none py-6 border border-primary w-full text-primary"
                                                    onClick={() => router.push('/reservation-history')}
                                                >
                                                    <List /> My Reservations
                                                </Button>
                                                <Button
                                                    className="bg-primary hover:bg-blue-950 shadow-none py-6 w-full text-white"
                                                    disabled={payExternal?.expired || loading || false}
                                                    onClick={() => handleDownloadPDF(reservationDetails.id, reservationDetails?.property?.name, reservationDetails?.code)}
                                                >
                                                    {loading ? <Spinner /> : <Download />} Download
                                                </Button>

                                                {
                                                    (reservationDetails?.cancellationPolicy?.isCancellationAllowed && reservationDetails?.status !== PAYMENT_STATUS_TYPES.CANCELLED_BY_GUEST) && (
                                                        <TooltipProvider delayDuration={100}>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild className='cursor-pointer'>
                                                                    <span>
                                                                        <Button
                                                                            className="bg-secondary hover:bg-red-500 shadow-none py-6 w-full text-white"
                                                                            disabled={!reservationDetails?.cancellationPolicy?.isCancellationAllowed || cancelling}
                                                                            onClick={() => setOpenDialog(true)}
                                                                        >
                                                                            <TbCircleX className="mr-2" /> Cancel Reservation
                                                                        </Button>
                                                                    </span>
                                                                </TooltipTrigger>

                                                                {!reservationDetails?.cancellationPolicy?.isCancellationAllowed && (
                                                                    <TooltipContent className='bg-secondary font-poppins'
                                                                        side='bottom'>
                                                                        Cancellation not allowed for this reservation.
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )
                                                }
                                            </div>
                                        </div>

                                        <div className='flex flex-col gap-14'>

                                            <div className="flex flex-col gap-6 w-full">
                                                <h5 className="font-semibold text-lg">Accommodation Details</h5>

                                                {reservationDetails.entireProperty ? (
                                                    <div
                                                        className="flex justify-between items-center gap-4 hover:shadow-sm p-4 border border-gray-200 rounded-xl w-full max-w-3xl transition">
                                                        <div className="flex flex-col flex-1 gap-1">
                                                            <p className="font-medium text-gray-800 text-sm">
                                                                {reservationDetails?.property?.name}
                                                            </p>
                                                            <span
                                                                className="text-gray-500 text-xs">Entire Property · {reservationDetails.totalGuest} Guests</span>
                                                            <span
                                                                className="text-gray-500 text-xs">Rooms: {reservationDetails.roomCount}</span>
                                                            <span className="mt-1 font-semibold text-gray-900 text-sm">Total: ${reservationDetails.netTotal}</span>
                                                        </div>

                                                        <Image
                                                            src={reservationDetails?.property?.file?.smallPath!}
                                                            alt="Property"
                                                            width={96}
                                                            height={96}
                                                            className="rounded-lg w-24 h-24 object-cover"
                                                        />
                                                    </div>
                                                ) : reservationDetails.roomDetails ? (
                                                    <div className="gap-4 grid sm:grid-cols-2">
                                                        {reservationDetails.roomDetails.map((unit: any, index: number) => (
                                                            <div
                                                                key={index}
                                                                className="flex justify-between items-center gap-4 hover:shadow-sm p-4 border border-gray-200 rounded-xl transition"
                                                            >
                                                                <div className="flex flex-col flex-1 gap-1">
                                                                    <p className="font-medium text-gray-800 text-sm">{unit.name}</p>
                                                                    <span
                                                                        className="text-gray-500 text-xs">Rooms: {unit.roomCount}</span>
                                                                    <span
                                                                        className="text-gray-500 text-xs">Max Guests: {unit.maxHeadCount}</span>
                                                                    <span
                                                                        className="mt-1 font-semibold text-gray-900 text-sm">${unit.unitPrice}</span>
                                                                </div>

                                                                <Image
                                                                    src={reservationDetails?.property?.file?.smallPath!}
                                                                    alt="Property"
                                                                    width={96}
                                                                    height={96}
                                                                    className="rounded-lg w-24 h-24 object-cover"
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : null}
                                            </div>

                                            <div>
                                                <h5 className="font-semibold text-lg">Payment Details</h5>
                                                <div
                                                    className="max-[450px]:gap-3 grid grid-cols-3 max-[450px]:grid-cols-1 mt-2 font-medium text-sm">
                                                    <div>
                                                        <span>Type : </span>
                                                        <span
                                                            className='text-gray-500'>{formatString(reservationDetails?.paymentType)}</span>
                                                    </div>
                                                    <div>
                                                        <span>Code : </span>
                                                        <span
                                                            className='font-medium text-gray-500'>{reservationDetails?.code}</span>
                                                    </div>
                                                    <div className='flex flex-col items-start leading-1'>
                                                        <div>
                                                            <span>Status : </span>
                                                            <span className={`font-medium 
                                                                ${reservationDetails?.paymentStatus === PAYMENT_STATUS_TYPES.SUCCESS ? 'text-green-500' :
                                                                    reservationDetails?.paymentStatus === PAYMENT_STATUS_TYPES.FAILED ? 'text-red-500' :
                                                                        reservationDetails?.paymentStatus === PAYMENT_STATUS_TYPES.CANCELLED ? 'text-red-600' :
                                                                            reservationDetails?.paymentStatus === PAYMENT_STATUS_TYPES.PENDING ? 'text-yellow-500' :
                                                                                'text-gray-500'}`}>{formatString(reservationDetails?.paymentStatus)}
                                                            </span>

                                                        </div>

                                                        {
                                                            payExternal && (
                                                                payExternal.expired ? (
                                                                    <div className='text-secondary text-xs'>Oops! This
                                                                        payment link is no longer active</div>
                                                                ) : (
                                                                    <>
                                                                        <Button
                                                                            className="relative flex flex-col items-center gap-1 bg-secondary mt-2 px-4 py-6 w-full font-poppins text-base"
                                                                            size="lg"
                                                                            disabled={reserving || payExternal.expired}
                                                                            onClick={handlePayAgain}
                                                                        >
                                                                            {reserving ? (
                                                                                <div className="flex items-center gap-2">
                                                                                    <Spinner color="#fff" />
                                                                                    <span>Processing...</span>
                                                                                </div>
                                                                            ) : (
                                                                                <>
                                                                                    <span
                                                                                        className="font-base">Pay Now</span>

                                                                                </>
                                                                            )}
                                                                        </Button>
                                                                        <span className="mt-2 text-xs tracking-wide">
                                                                            Expires in: {days}d {hours}h {minutes}m {seconds}s
                                                                        </span>
                                                                    </>
                                                                )
                                                            )
                                                        }
                                                    </div>

                                                </div>

                                                <div
                                                    className={`max-[450px]:gap-3 grid grid-cols-2 max-[450px]:flex flex-col items-center justify-center mt-2 font-medium text-sm`}>

                                                    {canShowChangePayment ? (
                                                        <p
                                                            className="mt-1 text-yellow-500 text-xs underline cursor-pointer"
                                                            onClick={() => {
                                                                openChangePaymentModal()
                                                            }}
                                                        >
                                                            Do you want to change payment method?
                                                        </p>
                                                    ) : (<span></span>)}

                                                    {!payExternal && (
                                                        reservationDetails?.paymentType === PAYMENT_TYPES.CARD
                                                        && (reservationDetails?.status === PAYMENT_STATUS_TYPES.PENDING || reservationDetails.status === PAYMENT_STATUS_TYPES.APPROVED || reservationDetails.status === PAYMENT_STATUS_TYPES.CHECKED_IN)
                                                        && (reservationDetails?.paymentStatus !== PAYMENT_STATUS_TYPES.SUCCESS) && (
                                                            <Button
                                                                className='flex gap-1 bg-transparent hover:bg-transparent shadow-none m-0 p-0 text-secondary text-xs hover:underline'
                                                                onClick={handlePayAgain} disabled={reserving}>
                                                                {
                                                                    reserving ? (
                                                                        <>
                                                                            <Spinner color='#EF5A60' /> Tap here to
                                                                            try again
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <RefreshCcw /> Tap here to try again
                                                                        </>
                                                                    )
                                                                }

                                                            </Button>

                                                        )
                                                    )

                                                    }
                                                </div>


                                            </div>
                                            {reservationDetails?.reservationTimelines && reservationDetails?.reservationTimelines.length > 0 && (
                                                <>
                                                    <div>
                                                        <h5 className="font-semibold text-lg">Reservation History</h5>
                                                        <div className='max-w-4xl'>
                                                            <TimelineLayout
                                                                data={reservationDetails?.reservationTimelines} />
                                                        </div>
                                                    </div>

                                                </>
                                            )}

                                            {
                                                reservationDetails?.securityDeposit && (
                                                    <div>
                                                        <h5 className="font-semibold text-lg">Security Deposit</h5>
                                                        <div className="mt-2">
                                                            <div className='text-sm'>
                                                                <span>Amount : </span>
                                                                <span
                                                                    className='text-gray-500'>${reservationDetails?.securityDeposit}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }

                                            {reservationDetails?.property?.description && (
                                                <>
                                                    <div>
                                                        <h5 className="font-semibold text-lg">About Property</h5>
                                                        <div className="mt-2">

                                                            <p className="text-gray-600 text-sm"
                                                                dangerouslySetInnerHTML={{ __html: reservationDetails?.property?.description || "No description available" }} />

                                                        </div>
                                                    </div>

                                                </>
                                            )}


                                            {reservationDetails?.cancellationPolicy.description && (
                                                <>
                                                    <div>
                                                        <h5 className="font-semibold text-lg">Cancellation Policy</h5>
                                                        <div className='mt-2'>
                                                            <p className='text-gray-600 text-sm'>{reservationDetails?.cancellationPolicy.description}</p>
                                                        </div>
                                                    </div>

                                                </>
                                            )}
                                            {(reservationDetails?.property?.host && reservationDetails.paymentType !== PAYMENT_TYPES.PAY_AT_PROPERTY) && (
                                                // <div>
                                                //     <h5 className="font-semibold text-lg">Host Info</h5>
                                                //     <div className="mt-2 p-4 border border-gray-200 rounded-xl w-full max-w-md transition-all duration-200">
                                                //         <div className="flex items-center gap-4">
                                                //             {reservationDetails.property.host.file ? (
                                                //                 <Image
                                                //                     src={reservationDetails.property.host.file.smallPath}
                                                //                     alt={`${reservationDetails.property.host.firstName} ${reservationDetails.property.host.lastName}'s avatar`}
                                                //                     width={48}
                                                //                     height={48}
                                                //                     className="border border-gray-300 rounded-full w-12 h-12 object-cover"
                                                //                 />
                                                //             ) : (
                                                //                 <div className="flex justify-center items-center bg-gray-100 border border-gray-300 rounded-full w-12 h-12 font-medium text-gray-700 text-sm">
                                                //                     {(reservationDetails.property.host.firstName?.[0] || '').toUpperCase()}
                                                //                     {(reservationDetails.property.host.lastName?.[0] || '').toUpperCase()}
                                                //                 </div>
                                                //             )}
                                                //             <div>
                                                //                 <h3 className="font-semibold text-base">
                                                //                     {reservationDetails.property.host.firstName} {reservationDetails.property.host.lastName}
                                                //                 </h3>
                                                //                 <p className="text-gray-500 text-xs">Host</p>
                                                //             </div>
                                                //         </div>

                                                //         <div className="space-y-2 mt-4 text-sm">
                                                //             {reservationDetails.property.host.whatsappContactNo && (
                                                //                 <div className="flex justify-between items-center">
                                                //                     <span className="flex items-center gap-2 text-gray-700">
                                                //                         <FaWhatsapp className="text-green-500" />
                                                //                         <span>{reservationDetails.property.host.whatsappContactNo}</span>
                                                //                     </span>
                                                //                     <button
                                                //                         onClick={() =>
                                                //                             sendWhatsappMessage("Hello 👋", reservationDetails.property.host.whatsappContactNo)
                                                //                         }
                                                //                         className="font-medium text-green-600 text-xs hover:underline"
                                                //                     >
                                                //                         Message
                                                //                     </button>
                                                //                 </div>
                                                //             )}

                                                //             {reservationDetails.property.host.email && (
                                                //                 <div className="flex justify-between items-center">
                                                //                     <span className="flex items-center gap-2 text-gray-700">
                                                //                         <FaEnvelope className="text-primary" />
                                                //                         <span>{reservationDetails.property.host.email}</span>
                                                //                     </span>
                                                //                     <a
                                                //                         href={`mailto:${reservationDetails.property.host.email}`}
                                                //                         className="font-medium text-primary text-xs hover:underline"
                                                //                     >
                                                //                         Email
                                                //                     </a>
                                                //                 </div>
                                                //             )}
                                                //         </div>
                                                //     </div>
                                                // </div>
                                                <div className="mt-10">
                                                    {/* Section Title */}
                                                    <h5 className="mb-6 font-semibold text-xl">Meet Your Host</h5>

                                                    {/* Host Profile */}
                                                    <div className="flex items-center gap-5">
                                                        {reservationDetails.property.host.file ? (
                                                            <Image
                                                                src={reservationDetails.property.host.file.smallPath}
                                                                alt={`${reservationDetails.property.host.firstName} ${reservationDetails.property.host.lastName}'s avatar`}
                                                                width={64}
                                                                height={64}
                                                                className="rounded-full ring-2 ring-primary/20 w-16 h-16 object-cover"
                                                            />
                                                        ) : (
                                                            <div
                                                                className="flex justify-center items-center bg-gradient-to-tr from-gray-200 to-gray-300 rounded-full w-16 h-16 font-medium text-gray-700 text-lg">
                                                                {(reservationDetails.property.host.firstName?.[0] || '').toUpperCase()}
                                                                {(reservationDetails.property.host.lastName?.[0] || '').toUpperCase()}
                                                            </div>
                                                        )}

                                                        <div>
                                                            <h3 className="font-bold text-gray-900 text-lg">
                                                                {reservationDetails.property.host.firstName} {reservationDetails.property.host.lastName}
                                                            </h3>
                                                            <p className="text-gray-500 text-sm">Superhost</p>
                                                        </div>
                                                    </div>

                                                    {/* Divider */}
                                                    <div className="my-6 border-gray-200 border-t"></div>

                                                    {/* Contact Info */}
                                                    <div className="space-y-4 text-[15px]">
                                                        {reservationDetails.property.host.whatsappContactNo && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="flex items-center gap-2 text-gray-700">
                                                                    <FaWhatsapp className="text-green-500 text-lg" />
                                                                    <span
                                                                        className="tracking-wide">{reservationDetails.property.host.whatsappContactNo}</span>
                                                                </span>
                                                                <button
                                                                    onClick={() =>
                                                                        sendWhatsappMessage("Hello 👋", reservationDetails.property.host.whatsappContactNo)
                                                                    }
                                                                    className="font-medium text-green-600 text-sm hover:underline"
                                                                >
                                                                    Chat
                                                                </button>
                                                            </div>
                                                        )}

                                                        {reservationDetails.property.host.email && (
                                                            <div className="flex justify-between items-center">
                                                                <span className="flex items-center gap-2 text-gray-700">
                                                                    <FaEnvelope className="text-primary text-lg" />
                                                                    <span
                                                                        className="tracking-wide">{reservationDetails.property.host.email}</span>
                                                                </span>
                                                                <a
                                                                    href={`mailto:${reservationDetails.property.host.email}`}
                                                                    className="font-medium text-primary text-sm hover:underline"
                                                                >
                                                                    Send Email
                                                                </a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                            )}


                                        </div>

                                    </div>


                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                <span>Loading...</span>
                            </>
                        )
                    }
                </div>
            </div>

            <Dialog open={openDialog} onOpenChange={() => {
                setOpenDialog(false)
                setFieldError('')
            }}>
                <DialogContent className='font-poppins'>
                    <DialogHeader>
                        <DialogTitle>Cancel Booking?</DialogTitle>
                        <DialogDescription>
                            We're sorry to see you go. Please let us know why you're cancelling, your feedback helps us
                            improve.
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Textarea placeholder="Type your reason here." id="reason" rows={5}
                            onChange={(e) => {
                                const val = e.target.value;
                                setReason(val);
                                if (fieldError && val.trim().length > 0) {
                                    setFieldError("");
                                }
                            }}
                        />
                        <span className='text-secondary text-sm'>{fieldError}</span>
                    </div>
                    <DialogFooter>
                        <Button
                            type="submit"
                            className="bg-secondary hover:bg-red-500"
                            size="lg"
                            onClick={handleCancelSubmit}
                            disabled={cancelling}
                        >
                            {cancelling ? (
                                <>
                                    <Spinner /> <span className="ml-2">Cancelling</span>
                                </>
                            ) : (
                                'Confirm Cancellation'
                            )}
                        </Button>

                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </section>
    );
};

export default ReservationSuccessPage;
