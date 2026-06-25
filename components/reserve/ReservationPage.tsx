"use client";

import Image from "next/image";
import { notFound, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import "@/styles/reservation.css";
import { getLoggedUser } from "@/common/commonFunctions";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import cash from '@/public/reservation/cash.png'
import card from '@/public/reservation/card.png'
import { Separator } from "@/components/ui/separator";
import StarRating from "@/components/hotel-single-view/StartsRating";
import defaultImage from "@/public/shared/DefaultLocationHover.png"
import { useLoginModal } from "@/common/auth/handleLoginModal";
import { addReservation, createTransaction, getReservationSummaryDetails, reservationPreCheck } from "@/actions/services/getReservationDetails";
import { Skeleton } from "../ui/skeleton";
import { PhoneInput } from "./PhoneInput";
import { paymentType, ReservationReqProps } from "@/common/interfaces";
import { getCountryCallingCode, parsePhoneNumber } from "react-phone-number-input";
import { DateAndTimePicker } from "./DateAndTimePicker";
import { toZonedTime } from "date-fns-tz";
import { format, setHours, setMinutes, setSeconds } from "date-fns";
import Spinner from "../common/Spinner";
import { toast } from "@/hooks/use-toast";
import { PAYMENT_TYPES } from "@/common/constants";
import { getCaptchaToken } from "@/actions/utils/captcha";
import Navbar from "../navigation/Navbar";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const reservationSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
    countryCode: z.string().min(1, "Country code must be at least 1 digit"),
    specialRequests: z.string().optional(),
    arrivalTime: z.string().min(1, "Arrival time is required"),
    paymentMethod: z.enum(["CARD", "PAY_AT_PROPERTY"]),
    cardInfo: z
        .object({
            cardNumber: z.string().regex(/^\d{16}$/, "Card number must be 16 digits"),
            expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Invalid date format (MM/YY)"),
            cvv: z.string().regex(/^\d{3}$/, "CVV must be 3 digits"),
            cardHolderName: z.string().min(1, "Card holder name is required"),
        })
        .optional(),
    country: z.string().optional(),
    nonRefundable: z.boolean().default(false),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

interface nonRefundableDetailProps {
    enabled: boolean,
    rate: number,
    amount: number,
}
interface discountDetailProps {
    name: string,
    description: string,
    discountAmount: number,
    type: string,
    calculationMethod: string,
    value: number
}

interface accommodationUnitsProps {
    id: number,
    name: string,
    maxHeadCount: number,
    reservationCount: number,
    subTotal: number,
    totalDiscount: number,
    netTotal: number,
    discountDetail: discountDetailProps | null
}
interface ReservationSummaryProps {
    data: {
        property: {
            slug: string,
            name: string,
            file: {
                id: number,
                originalName: string,
                originalPath: string,
                smallPath: string,
                mediumPath: string,
                largePath: string,
                type: string | null
            },
            summaryReviews: {
                averageReviews: number,
                totalReviews: number,
            }
        },
        checkIn: Date,
        checkOut: Date,
        totalGuest: number,
        adult: number,
        child: number,
        infant: number,
        pet: number,
        entireProperty: boolean,
        instantBookingEnabled: boolean,
        longTermChargesApplied: boolean,
        payAtPropertyEnabled: boolean,
        nrpRate: number | null,
        priceDetail: {
            subTotal: number,
            totalDiscount: number,
            netTotal: number,
            withOutNrpDiscount: number,
            securityDeposit: number,
            nonRefundableDetail: nonRefundableDetailProps | null,
            accommodationUnits: accommodationUnitsProps[] | null
        },
        roomCount: number,
        stayDuration: number,
    },
    message: string
}

const ReservationPage = () => {

    const [hasSession, setHasSession] = useState<boolean>(false);
    const [nrpEnabled, setNrpEnabled] = useState<boolean>(false);
    const [nrpFetching, setNrpFetching] = useState<boolean>(false);
    const [reserving, setReserving] = useState<boolean>(false);
    const [loggedUser, setLoggedUser] = useState<any>([]);
    const [paymentMethod, setPaymentMethod] = useState<string | paymentType>(paymentType.PAY_AT_PROPERTY);
    const [reservationSummary, setReservationSummary] = useState<ReservationSummaryProps | null>(null);
    const [reservationReq, setReservationReq] = useState<ReservationReqProps | null>(null);
    const timeZone = process.env.NEXT_PUBLIC_TIME_ZONE;

    const router = useRouter();
    const { handleLoginModal } = useLoginModal();


    const {
        register,
        handleSubmit,
        watch,
        setValue,
        getValues,
        formState: { errors },
    } = useForm<ReservationFormValues>({
        resolver: zodResolver(reservationSchema),
        defaultValues: {
            paymentMethod: paymentType.PAY_AT_PROPERTY,
        },
    });

    useEffect(() => {
        const storedNrp = sessionStorage.getItem('nrp');
        setNrpEnabled(storedNrp ? JSON.parse(storedNrp) : false);
        const storedData = sessionStorage.getItem('reservation-details');
        setReservationReq(storedData ? JSON.parse(storedData) : {})
        checkSessionStatus();
        getReservationSummary();
    }, []);


    useEffect(() => {
        if (loggedUser) {
            setValue("firstName", loggedUser.firstName || "");
            setValue("lastName", loggedUser.lastName || "");
            setValue("email", loggedUser.email || "");
            setValue("countryCode", loggedUser.countryCode || "")
            setValue("mobileNumber", loggedUser.countryCode + loggedUser.contactNo || "");
        }
    }, [loggedUser, setValue]);

    const checkSessionStatus = async () => {
        try {
            const response = await fetch("/api/session/check", { method: "POST" });
            const result = await response.json();

            if (!result.success) {
                handleLoginModal({ open: true });
            }

            if (result.success) {
                setHasSession(result.success);
                const user = await getLoggedUser();
                if (user) {
                    setLoggedUser(user);
                }
            }
        } catch (error) {
            console.error("Error checking session:", error);
        }
    };

    const getReservationSummary = async () => {
        setReservationSummary(JSON.parse(sessionStorage.getItem("reservation-summary") || '{}'));
    }



    useEffect(() => {
        if (!reservationSummary) return;
        // const zonedDate = toZonedTime(
        //     setSeconds(
        //         setMinutes(
        //             setHours(reservationSummary?.data?.checkIn! || new Date(), 10),
        //             0
        //         ),
        //         0
        //     ),
        //     timeZone!
        // );
        // const formattedDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss");

        const localDate = setSeconds(
            setMinutes(
                setHours(reservationSummary?.data?.checkIn || new Date(), 10),
                0
            ),
            0
        );

        const formattedDate = format(localDate, "yyyy-MM-dd'T'HH:mm:ss");

        setValue("arrivalTime", formattedDate || "")
        reservationSummary?.data?.payAtPropertyEnabled && !nrpEnabled ? setPaymentMethod(paymentType.PAY_AT_PROPERTY) :
            nrpEnabled ? setPaymentMethod(paymentType.CARD) : setPaymentMethod(paymentType.CARD)

    }, [reservationSummary]);



    const onSubmit = async (data: ReservationFormValues) => {

        const mobileNumber = data.mobileNumber.replace(data.countryCode, '')

        const reservationObject = {
            slug: reservationSummary?.data?.property?.slug || '',
            maxHeadCount: reservationReq?.maxHeadCount,
            unitDetails: reservationReq?.unitDetails,
            checkIn: reservationReq?.checkIn,
            checkOut: reservationReq?.checkOut,
            adult: reservationReq?.adult || 1,
            child: reservationReq?.child || 0,
            infant: reservationReq?.infant || 0,
            pet: reservationReq?.pet || 0,
            arrivalTime: data.arrivalTime,
            paymentType: paymentMethod,
            isEntireProperty: reservationSummary?.data?.entireProperty || false,
            nrpEnabled: nrpEnabled,
            specialRequest: data.specialRequests || '',
            userDetails: {
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                countryCode: data.countryCode,
                contactNo: mobileNumber
            }
        }
        setReserving(true)

        const token = await getCaptchaToken();

        await addReservation({ reservationObject, token }).then(async (res) => {

            if (res?.error) {
                throw res?.errors
            }
            toast({
                description: res.message,
                className: "bg-primary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            })

            const { paymentType } = await res?.data;
            const { id } = await res?.data;
            const { netTotal } = await res?.data;
            const { reservedUser } = await res?.data;
            const code = await res?.data?.code;
            const allowInstantBooking = await res?.data?.property?.allowInstantBooking;

            if (paymentType === PAYMENT_TYPES.CARD && allowInstantBooking) {
                setReserving(true)
                await reservationPreCheck(id).then(async (res) => {
                    if (res?.error) {
                        throw res?.errors
                    }

                    if (res?.data) {
                        setReserving(true)
                        const data = {
                            reservationId: id,
                            reservationCode: code,
                            amount: netTotal,
                            currency: 'USD',
                            redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/payment`,
                            customerName: `${reservedUser?.firstName} ${reservedUser?.lastName}`,
                            customerEmail: reservedUser?.email || reservationObject?.userDetails?.email || null,
                        }

                        await createTransaction(data).then((res: any) => {
                            if (res?.error) {
                                throw res?.errors
                            }
                            if (res) {
                                const { url } = res?.data;
                                if (url) {
                                    window.location.href = url;
                                } else {
                                    throw {
                                        error: true,
                                        errors: {
                                            status: 404,
                                            message: "Redirect Url not Found"
                                        }
                                    };
                                }

                            }

                        }).catch((err) => {
                            console.log(err)
                            setReserving(false);
                        }).finally(() => {

                        })

                    } else {
                        throw {
                            error: true,
                            errors: {
                                status: 400,
                                message: "Bad Credentials"
                            }
                        };
                    }
                }).catch((err) => {
                    console.log(err)
                    setReserving(false)
                }).finally(() => {

                })
                return;
            } else if (paymentType === PAYMENT_TYPES.PAY_AT_PROPERTY || (paymentType === PAYMENT_TYPES.CARD && !allowInstantBooking)) {

                // await window.open(`/${res?.data?.property?.propertyType || "hotel"}/${reservationSummary?.data?.property?.slug}/reserve/${code || ''}`, "_blank");
                const paymentUrl = new URL(window.location.origin + "/payment");
                paymentUrl.searchParams.set("state", "CONFIRMED");
                paymentUrl.searchParams.set("reservationCode", code);
                await window.open(paymentUrl.toString(), "_blank");
                window.close();
                return;
            } else {
                throw {
                    error: true,
                    errors: {
                        status: 400,
                        message: "Bad Request"
                    }
                };
            }

        }).catch((err) => {
            console.log(err)

            toast({
                description: err.message,
                className: "bg-secondary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            })
            setReserving(false)
            if (err.status === 403) {
                handleLoginModal({ open: true });
            }
            if (err.status === 401) {
                notFound()
            }
            setReserving(false)
        })

    };

    useEffect(() => {
        updateNrp(nrpEnabled)
        setPaymentMethod(paymentType.CARD)
    }, [nrpEnabled])

    const updateNrp = async (action: boolean) => {

        if (!reservationSummary) return;
        sessionStorage.setItem('nrp', JSON.stringify(action))
        try {
            setNrpFetching(true);

            if (!setReservationReq) return;

            const request = {
                slug: reservationReq?.slug ?? "",
                maxHeadCount: reservationReq?.maxHeadCount,
                unitDetails: reservationReq?.unitDetails,
                checkIn: reservationReq?.checkIn,
                checkOut: reservationReq?.checkOut,
                adult: Number(reservationReq?.adult),
                child: Number(reservationReq?.child),
                infant: Number(reservationReq?.infant),
                nrpEnabled: action,
                pet: Number(reservationReq?.pet),
                isEntireProperty: !!reservationReq?.isEntireProperty,
                arrivalTime: null,
                paymentType: null,
                specialRequest: null,
                userDetails: {
                    firstName: getValues("firstName"),
                    lastName: getValues("lastName"),
                    email: getValues("email"),
                    countryCode: Number(getValues("countryCode")),
                    contactNo: Number(getValues("mobileNumber"))
                }
            }


            await getReservationSummaryDetails(request).then((reservation) => {
                setReservationSummary(reservation);
                sessionStorage.setItem('reservation-summary', JSON.stringify(reservation));
            }).catch((error) => {
                console.log(error)
            });

        } catch (err: any) {
            let parsedError;

            try {
                parsedError = JSON.parse(err.message);
            } catch (parseError) {
                parsedError = { message: "An unexpected error occurred", status: 403 };
            }

            if (parsedError.status === 403) {
                console.error(parsedError);
                handleLoginModal({ open: true });
            }
        } finally {
            setNrpFetching(false);
        }
    };

    const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return "th";
        const suffixes = ["st", "nd", "rd"];
        return suffixes[(day % 10) - 1] || "th";
    };

    const formatDateWithSuffix = (dateInput: Date | string | undefined) => {
        if (!dateInput) return "";

        const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
        const day = date.getDate();
        const suffix = getOrdinalSuffix(day);

        return `${day}${suffix} ${date.toLocaleDateString("en-GB", {
            month: "long",
            year: "numeric",
        })}`;
    }; 

    const formatAccommodationData = (data: any[]) => {
        const groupedData: Record<number, { id: number; name: string; headCount: any[] }> = {};

        data.forEach(({ id, name, maxHeadCount, netTotal, reservationCount, subTotal, totalDiscount }) => {
            if (!groupedData[id]) {
                groupedData[id] = { id, name, headCount: [] };
            }
            groupedData[id].headCount.push({ maxHeadCount: maxHeadCount, netTotal: netTotal, reservationCount: reservationCount, subTotal: subTotal, totalDiscount: totalDiscount });
        });

        return Object.values(groupedData).sort((a, b) => a.id - b.id);
    };

    return (
        <section className="relative flex flex-col items-center bg-[#F7F7F7] p-10 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 w-full font-poppins">
            <div className="relative max-[1000px]:p-0 px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 w-full h-full">
                <Navbar className='bg-[#F7F7F7] px-48 max-[1030px]:px-5 max-[1450px]:px-10 max-[1730px]:px-32 py-4' />

                <form onSubmit={handleSubmit(onSubmit)}>
                    <h1 className="mt-10 mb-5 font-medium text-3xl">Request to book</h1>
                    <div className="flex flex-wrap lg:flex-nowrap gap-6 lg:gap-12">
                        <div className="space-y-6 w-full lg:w-2/3">
                            <section className="form-section">
                                <h2 className="form-section-header">Enter your details</h2>
                                <div className="gap-4 grid grid-cols-1 sm:grid-cols-2">
                                    <div>
                                        <label htmlFor="first-name" className="input-label">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="first-name"
                                            placeholder="First Name"
                                            className="input-field"
                                            {...register("firstName")}
                                        />
                                        {errors.firstName && (
                                            <p className="mt-2 text-red-600 text-sm">
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label htmlFor="last-name" className="input-label">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <Input
                                            id="last-name"
                                            placeholder="Last Name"
                                            className="input-field"
                                            {...register("lastName")}
                                        />
                                        {errors.lastName && (
                                            <p className="mt-2 text-red-600 text-sm">
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email" className="input-label">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <Input
                                        id="email"
                                        placeholder="Email Address"
                                        className="input-field"
                                        {...register("email")}
                                    />
                                    {errors.email && (
                                        <p className="mt-2 text-red-600 text-sm">{errors.email.message}</p>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="mobile" className="input-label">
                                        Mobile Number <span className="text-red-500">*</span>
                                    </label>
                                    <div id="mobile" {...register("mobileNumber")}>

                                        <PhoneInput
                                            defaultCountry="LK"
                                            international
                                            value={watch("mobileNumber")}
                                            onChange={(value) => {
                                                if (value) {
                                                    try {
                                                        const phoneNumber = parsePhoneNumber(value);
                                                        const nationalNumber = phoneNumber?.nationalNumber || "";
                                                        const fullNumber = phoneNumber?.number || value;
                                                        const countryCode = phoneNumber ? `+${getCountryCallingCode(phoneNumber.country!)}` : "";

                                                        setValue("mobileNumber", fullNumber, { shouldValidate: true });
                                                        setValue("countryCode", countryCode, { shouldValidate: true });
                                                    } catch (error) {
                                                        console.error("Invalid phone number:", error);
                                                        setValue("mobileNumber", value, { shouldValidate: true });
                                                        setValue("countryCode", "", { shouldValidate: true });
                                                    }
                                                } else {
                                                    setValue("mobileNumber", "", { shouldValidate: true });
                                                    setValue("countryCode", "", { shouldValidate: true });
                                                }
                                            }}
                                        />
                                    </div>
                                    {errors.mobileNumber && (
                                        <p className="mt-2 text-red-600 text-sm">
                                            {errors.mobileNumber.message}
                                        </p>
                                    )}
                                    {errors.countryCode && (
                                        <p className="mt-2 text-red-600 text-sm">
                                            {errors.countryCode.message}
                                        </p>
                                    )}
                                </div>
                            </section>
                            <section className="form-section">
                                <h2 className="form-section-header">Your arrival time</h2>
                                <p className="input-label">
                                    Your room will be ready for check-in between 12:00 and 20:00
                                </p>

                                <div {...register("arrivalTime")} id="arrivalTime">

                                    <label htmlFor="email" className="input-label">
                                        Estimated Arrival Time <span className="text-red-500">*</span>
                                    </label>
                                    <DateAndTimePicker
                                        defaultDate={reservationSummary?.data?.checkIn}
                                        onChange={(value) => {
                                            // const zonedDate = toZonedTime(value, timeZone!);
                                            // const formattedDate = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ss");
                                            const formattedDate = format(value, "yyyy-MM-dd'T'HH:mm:ss");

                                            setValue("arrivalTime", formattedDate, { shouldValidate: true })
                                        }}
                                    />
                                    <p className="mt-2 text-red-600 text-sm"> {errors.arrivalTime?.message}</p>

                                </div>

                            </section>
                            <section className="form-section">
                                <h2 className="form-section-header">Special requests</h2>
                                <p className="input-label">
                                    Special requests cannot be guaranteed – but the property will do its best to meet your needs. You can always make a special request after your booking is complete!
                                </p>

                                <div id="specialRequests">
                                    <label htmlFor="specialRequests" className="input-label">
                                        Please write your requests in English. (optional)
                                    </label>
                                    <Textarea
                                        placeholder="Requests"
                                        id="special-req"
                                        className="shadow-none h-20 focus:h-40 transition-all duration-300 ease-in-out"
                                        {...register("specialRequests")}
                                    />
                                </div>


                            </section>


                            <section>
                                <span className="block bg-gray-300 p-4 rounded-tl-xl rounded-tr-xl">
                                    <h2 className="">Important information about your booking</h2>
                                </span>

                                {
                                    reservationSummary?.data?.nrpRate && (
                                        <div className="flex items-center gap-2 bg-secondary/40 my-4 p-4 rounded-lg">
                                            <Checkbox id="non-refundable" onClick={() => {
                                                setNrpEnabled(!nrpEnabled)
                                                setValue("nonRefundable", !nrpEnabled)
                                            }} checked={nrpEnabled} />
                                            <label htmlFor="non-refundable" className="font-normal text-sm cursor-pointer">
                                                Agreeing to the non-refundable cancellation policy will grant you a {reservationSummary?.data?.nrpRate}% discount on your total.
                                            </label>
                                        </div>
                                    )
                                }


                                <ol className="space-y-4 p-4 font-normal text-gray-700 text-sm">
                                    <li className="list-decimal">
                                        A valid government-issued ID and the booking confirmation email must be presented upon arrival for
                                        check-in.
                                    </li>
                                    <li className="list-decimal">
                                        Your booking is confirmed once payment is successfully processed. Please check your email for the
                                        confirmation details and keep them for future reference.
                                    </li>
                                </ol>
                                <p className="font-normal text-gray-700 text-sm">
                                    By clicking the button below, I acknowledge that I have reviewed the{" "}
                                    <a className="text-blue-600 underline cursor-pointer" onClick={() => { window.open('/help/articles/privacy-policy', '_blank') }}>
                                        Privacy Policy
                                    </a>{" "}
                                    and have reviewed and accept the{" "}
                                    <a className="text-blue-600 underline cursor-pointer" onClick={() => { window.open('/help/articles/terms-and-conditions', '_blank') }}>
                                        Terms And Conditions
                                    </a>.
                                </p>
                                {
                                    !reservationSummary?.data?.instantBookingEnabled && (
                                        <span className="block bg-secondary bg-opacity-15 mt-5 p-4 rounded-lg">
                                            <h2 className="">This property can't be reserved instantly. Host approval is required.</h2>
                                            <small className="text-gray-600 text-xs">After completing your booking, you'll receive a confirmation email.</small>
                                        </span>
                                    )
                                }

                            </section>


                            <div className="relative form-section">

                                <h2 className="form-section-header">{`${!reservationSummary?.data?.instantBookingEnabled ? 'Preferred Payment Type' : 'Payment Selection'}`}</h2>
                                <p className="mb-6 input-label">
                                    Please select and enter your billing information.
                                </p>


                                <RadioGroup
                                    value={paymentMethod}
                                    onValueChange={setPaymentMethod}
                                    className="flex max-[425px]:flex-col items-center max-[425px]:items-start gap-10 max-[425px]:gap-5 pb-5 radio-payment"
                                >
                                    <div className={`flex items-center gap-2 ${!reservationSummary?.data?.payAtPropertyEnabled || nrpEnabled ? 'text-gray-500' : ''}`}>
                                        <RadioGroupItem disabled={!reservationSummary?.data?.payAtPropertyEnabled || nrpEnabled}
                                            value={paymentType.PAY_AT_PROPERTY}
                                            id="pay-on-property"

                                        />
                                        <label htmlFor="pay-on-property" className="flex items-center gap-1 font-normal text-sm cursor-pointer">
                                            <Image src={cash} alt="pay on property serviced apartments" className={`${!reservationSummary?.data?.payAtPropertyEnabled || nrpEnabled ? 'saturate-0' : ''}`} /> Pay at Property
                                        </label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <RadioGroupItem
                                            value={paymentType.CARD}
                                            id="card-payment"
                                        />
                                        <label htmlFor="card-payment" className="flex items-center gap-1 font-normal text-sm cursor-pointer">
                                            <Image src={card} alt="pay on property serviced apartments" /> Card Payment
                                        </label>
                                    </div>
                                </RadioGroup>
                                {
                                    !reservationSummary?.data?.instantBookingEnabled ? (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    className="bg-primary hover:bg-blue-900 !py-6 rounded-md text-white"
                                                    size={"lg"}
                                                    disabled={reserving}
                                                >
                                                    {
                                                        reserving && (
                                                            <Spinner />
                                                        )
                                                    }
                                                    Complete Your Booking
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent className="font-poppins">
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle className="text-primary">One last step</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Host approval is required for this booking. A confirmation email will be sent to you once it has been approved
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={async () => {
                                                            try {

                                                                await handleSubmit(async (data) => {
                                                                    const cleanedNumber = data.mobileNumber.replace(data.countryCode, '');

                                                                    const payload = {
                                                                        ...data,
                                                                        mobileNumber: cleanedNumber,
                                                                    };

                                                                    onSubmit(payload)
                                                                })();
                                                            } catch (err) {
                                                                console.log("Please fill in all required fields correctly.");
                                                            }
                                                        }}
                                                    >
                                                        Continue
                                                    </AlertDialogAction>

                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    ) : (
                                        <Button
                                            type="submit"
                                            className="bg-primary hover:bg-blue-900 !py-6 rounded-md text-white"
                                            size={"lg"}
                                            disabled={reserving}
                                        >
                                            {
                                                reserving && (
                                                    <Spinner />
                                                )
                                            }
                                            Complete Your Booking
                                        </Button>
                                    )
                                }
                            </div>

                        </div>
                        <aside className="relative flex flex-col items-center w-full lg:w-1/3">
                            <div className="top-10 sticky">
                                <div className="relative">
                                    <Image
                                        src={`${reservationSummary?.data?.property?.file?.mediumPath || defaultImage.src}`}
                                        priority
                                        alt="The Palace by Ocean"
                                        width={450}
                                        height={200}
                                        className="rounded-md"
                                    />

                                    <div className="top-0 left-0 absolute bg-gradient-to-t from-black/60 to-transparent rounded-md w-full h-full"></div>


                                    <div className="bottom-3 left-3 absolute">
                                        <h2 className="font-medium text-white text-lg">{`${reservationSummary?.data?.property?.name || ''}`}</h2>
                                        <StarRating rating={reservationSummary?.data?.property?.summaryReviews?.averageReviews || 0} />
                                    </div>
                                </div>
                                <div className="pt-3 w-full">
                                    {
                                        reservationSummary?.data?.priceDetail?.nonRefundableDetail?.amount && (
                                            <p className="!mb-0 !text-red-500 input-label">Non refundable</p>
                                        )
                                    }
                                    {
                                        reservationSummary?.data?.roomCount! > 0 && (
                                            <p className="form-section-header">
                                                {reservationSummary?.data?.roomCount || 0} Room{reservationSummary?.data?.roomCount! > 1 ? 's' : ''}
                                                {' '}for {reservationSummary?.data?.adult || 0} adult{reservationSummary?.data?.adult !== 1 ? 's' : ''}
                                                {reservationSummary?.data?.child! > 0 ? ` and ${reservationSummary?.data?.child} child${reservationSummary?.data?.child! > 1 ? 'ren' : ''}` : null}
                                            </p>
                                        )
                                    }
                                    <p className="!text-gray-600 input-label">
                                        {reservationSummary?.data?.stayDuration} night stay (
                                        {formatDateWithSuffix(reservationSummary?.data?.checkIn!)} -
                                        {formatDateWithSuffix(reservationSummary?.data?.checkOut!)}
                                        )
                                    </p>
                                    <Separator className="my-3" />

                                    <div className="space-y-2 mt-4 border border-gray-300 rounded-lg input-label">
                                        <span className="block bg-gray-300 p-3 border-gray-300 border-b rounded-tl-lg rounded-tr-lg !font-normal !text-black !text-base form-section-header">
                                            <h2 >Booking Details</h2>
                                        </span>

                                        <div className="flex flex-col items-center gap-1 px-3 border-gray-300">
                                            {reservationSummary?.data?.priceDetail?.accommodationUnits?.length! > 0 &&
                                                (() => {
                                                    return (
                                                        <div className="flex flex-col w-full">
                                                            {formatAccommodationData(reservationSummary?.data?.priceDetail?.accommodationUnits!).map((unit, index) => {

                                                                return (
                                                                    <div key={index} className="py-2 border-b">
                                                                        <div className="mb-2 font-medium text-sm">
                                                                            {unit?.name ? unit.name : reservationSummary?.data?.entireProperty ? 'Entire Property' : ''}
                                                                        </div>

                                                                        {unit?.headCount?.map((head, i) => (
                                                                            <div key={i} className="flex justify-between items-start">
                                                                                <div className="flex justify-between items-center w-full">
                                                                                    <span className="text-gray-400 text-xs">
                                                                                        {head?.maxHeadCount} person {head?.reservationCount ? `x ${head?.reservationCount}` : null}
                                                                                    </span>
                                                                                    <div className="flex items-center gap-1">
                                                                                        {head?.totalDiscount > 0 && (
                                                                                            <div
                                                                                                className="flex items-center gap-1 text-secondary text-xs line-through cursor-pointer"
                                                                                                title={`You saved $${head?.totalDiscount} with our ${reservationSummary?.data?.priceDetail?.accommodationUnits![index].discountDetail?.name}!`}
                                                                                            >
                                                                                                ${head?.subTotal}
                                                                                            </div>
                                                                                        )}

                                                                                        <div className="font-medium text-primary text-sm">
                                                                                            ${head?.netTotal}
                                                                                        </div>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                );
                                                            })}

                                                        </div>
                                                    );
                                                })()}

                                        </div>


                                    </div>
                                    {reservationSummary?.data?.priceDetail?.securityDeposit! > 0 && (
                                        <div className="space-y-2 mt-4 border border-gray-300 rounded-lg input-label">
                                            <span className="block bg-gray-300 p-3 border-gray-300 border-b rounded-tl-lg rounded-tr-lg !font-normal !text-black !text-base form-section-header">
                                                <h2 >Damage Deposit</h2>
                                            </span>
                                            <div className="flex flex-col items-center gap-1 p-3 border-gray-300 border-b">


                                                <div className="flex justify-between items-center w-full">
                                                    <span className="max-w-[30ch]">Amount (Fully Refundable)</span>
                                                    <span>${reservationSummary?.data?.priceDetail?.securityDeposit}</span>
                                                </div>

                                                <div className="mt-3">
                                                    This security deposit is <span className="font-semibold">not included</span> in your booking payment and must be paid separately at the property during check-in.
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                    <div className="space-y-2 mt-4 border border-gray-300 rounded-lg input-label">
                                        <span className="block bg-gray-300 p-3 border-gray-300 border-b rounded-tl-lg rounded-tr-lg !font-normal !text-black !text-base form-section-header">
                                            <h2 >Price Details</h2>
                                        </span>
                                        <div className="flex flex-col items-center gap-1 p-3 border-gray-300 border-b">
                                            {
                                                nrpFetching ? (
                                                    <div className="space-y-2 w-full">
                                                        <Skeleton className="w-full h-3" />
                                                        <Skeleton className="w-full h-3" />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex justify-between w-full">
                                                            <span>{reservationSummary?.data?.roomCount || 0} room{reservationSummary?.data?.roomCount! > 1 ? 's' : ''} x {reservationSummary?.data?.stayDuration} night {reservationSummary?.data?.stayDuration! > 1 ? "s" : ""}</span>
                                                            <span>${reservationSummary?.data?.priceDetail?.subTotal}</span>
                                                        </div>

                                                        {reservationSummary?.data?.longTermChargesApplied && (
                                                            <span className="self-start text-secondary text-xs">
                                                                Utility bills not included.
                                                            </span>
                                                        )}
                                                        {reservationSummary?.data?.priceDetail?.withOutNrpDiscount! > 0 && (
                                                            <div className="flex justify-between items-center w-full text-green-700">
                                                                <span className="max-w-[25ch]">Discount</span>
                                                                <span>${reservationSummary?.data?.priceDetail?.withOutNrpDiscount}</span>
                                                            </div>
                                                        )}

                                                        {
                                                            reservationSummary?.data?.priceDetail?.nonRefundableDetail?.amount && (
                                                                <div className="flex justify-between items-center w-full text-green-700">
                                                                    <span className="max-w-[25ch]">Non Refundable Offer ({reservationSummary?.data?.nrpRate}%)</span>
                                                                    <span>${reservationSummary?.data?.priceDetail?.nonRefundableDetail?.amount}</span>
                                                                </div>
                                                            )
                                                        }
                                                    </>
                                                )
                                            }


                                        </div>
                                        <div className="flex justify-between items-end px-3 pb-2 !font-medium !text-black form-section-header">
                                            {
                                                nrpFetching ? (
                                                    <div className="flex justify-between items-center w-full">
                                                        <Skeleton className="w-3/12 h-3" />
                                                        <Skeleton className="w-2/5 h-3" />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <span>Total</span>
                                                        <div className="flex justify-end items-end gap-1">
                                                            {reservationSummary?.data?.priceDetail?.totalDiscount! > 0 && (
                                                                <span className="text-secondary text-base line-through cursor-pointer" title={`You saved $${reservationSummary?.data?.priceDetail?.totalDiscount}`}>${reservationSummary?.data?.priceDetail?.subTotal!}</span>
                                                            )}
                                                            <span className="font-semi--bold text-primary text-2xl">${reservationSummary?.data?.priceDetail?.netTotal}</span>
                                                        </div>
                                                    </>
                                                )
                                            }

                                        </div>
                                    </div>
                                </div>
                            </div>

                        </aside>
                    </div>
                </form>
            </div >
        </section >
    )
}

export default ReservationPage