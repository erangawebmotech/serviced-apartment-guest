'use client';

import { useSearchParams, useRouter, notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import dynamic from "next/dynamic";
import tick from "@/public/success/successfully-done.json";
import { Download, List, Mail, PhoneCall } from 'lucide-react';
import { getReservationSuccessData } from '@/actions/services/getReservationDetails';
import { ReservationDataProps } from '@/components/reserve/ReservationSuccessPage';
import Image from 'next/image';
import { PAYMENT_STATUS_TYPES } from '@/common/constants';
import { getPDFToDownload } from '@/service/reservation';
import Spinner from '@/components/common/Spinner';
export default function PaymentSuccess() {
    const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
    const searchParams = useSearchParams();
    const router = useRouter();
    const [data, setData] = useState<ReservationDataProps | null>(null)
    const reservationCode = searchParams.get('reservationCode');
    const state = searchParams.get('state');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (state !== 'CONFIRMED') {
            router.replace('/payment/failed');
        }
    }, [state, router]);


    useEffect(() => {
        if (reservationCode) getData();
    }, [reservationCode]);

    const getData = async () => {
        await getReservationSuccessData(reservationCode!).then((res) => {
            if (res?.error) {
                throw res;
            }
            setData(res?.data);

        }).catch((err) => {
            console.log(err)
            notFound()
        })
    }

    const formatString = (input: string): string => {
        return input
            .toLowerCase()
            .replace(/_/g, " ")
            .replace(/\b\w/g, (char) => char.toUpperCase());
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
        <>
            {
                data ? (
                    <>
                        <div
                            className="grid grid-cols-2 max-[1000px]:grid-cols-1 p-40 max-[1000px]:p-0 w-full h-max min-h-screen font-poppins">
                            <div
                                className="flex flex-col justify-between bg-transparent shadow-none p-8 rounded-lg w-full h-full text-center">
                                <div>
                                    <div className="flex justify-center">


                                        <Lottie animationData={tick} loop className="p-0 w-52" />

                                    </div>
                                    <h2 className="font-semibold text-gray-800 text-lg">Reservation Added!</h2>
                                    <p className="mt-2 text-gray-500 text-sm">Reservation Created Successfully. Enjoy
                                        Your Stay</p>
                                </div>

                                <div className="mt-4">

                                    {
                                        !data?.property?.allowInstantBooking && data?.paymentStatus !== PAYMENT_STATUS_TYPES.SUCCESS && (
                                            <span className="block bg-secondary bg-opacity-40 mb-3 p-4 rounded-lg">
                                                <h2 className="">Waiting For Host Approval</h2>
                                                <small className="text-gray-600 text-xs">A confirmation email will be sent to {data?.contactDetails?.email} after approval.</small>
                                            </span>
                                        )
                                    }
                                    <button
                                        className="flex justify-center items-center gap-3 bg-secondary px-4 py-3 rounded-md w-full text-white"
                                        onClick={() => window.open('/reservation-history', '_blank')}
                                    >
                                        <List /> My Reservations
                                    </button>
                                    <button className="flex justify-center items-center gap-3 mt-2 px-4 py-3 border border-gray-300 rounded-md w-full text-gray-700"
                                        onClick={() => handleDownloadPDF(data.id, data.property?.name || 'reservation', data.code)} disabled={loading}
                                    >
                                        {loading ? <Spinner color='#000' /> : <Download />} Download</button>
                                </div>
                            </div>
                            <div
                                className="flex flex-col justify-between bg-gray-100 shadow-none mt-6 md:mt-0 md:ml-6 p-6 border rounded-lg w-full h-max md:h-auto">
                                <div>
                                    <h3 className="font-medium text-gray-800 text-base">{data?.property?.name}</h3>
                                    {data?.nrpEnabled && (
                                        <div className='font-medium text-secondary text-sm'>Non Refundable</div>
                                    )}

                                    <p className='font-medium text-gray-600 text-xs'>For {data?.adult} Adult {data?.child! > 0 ? `and ${data?.child} Child${data?.child! > 1 ? 'ren' : null}` : null}</p>

                                    <div className='flex gap-10 mt-5'>
                                        <div>
                                            <p className="text-gray-500 text-xs">Check-in</p>
                                            <p className="font-medium text-sm">{new Date(data?.checkIn!).toDateString()}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500 text-xs">Check-out</p>
                                            <p className="font-medium text-sm">{new Date(data?.checkOut!).toDateString()}</p>
                                        </div>
                                    </div>

                                    <div className='flex flex-col gap-14 mt-5'>

                                        <div className='flex flex-col gap-3'>
                                            {data?.entireProperty ? (
                                                <div
                                                    className="flex justify-between items-center gap-20 p-3 border rounded-lg w-max">
                                                    <div className='flex flex-col items-start gap-1'>
                                                        <p className="max-w-[30ch] font-medium text-sm break-words">{data?.property?.name} (Entire
                                                            Property)</p>
                                                        <p className="text-gray-500 text-xs">Room
                                                            Count: {data?.roomCount}</p>
                                                        <p className="text-gray-500 text-xs">Max
                                                            Guests: {data?.totalGuest}</p>
                                                        <p className="font-medium text-xs">Price: ${data?.netTotal}</p>
                                                    </div>
                                                    <Image
                                                        src={data?.property?.file?.smallPath || "/default-image.jpg"}
                                                        alt="Property"
                                                        width={100}
                                                        height={100}
                                                        className='rounded-lg w-28 h-auto aspect-square'
                                                    />
                                                </div>
                                            ) : data?.roomDetails ? (
                                                <div>

                                                    <div className="gap-2 grid grid-cols-1 mt-2">
                                                        {data?.roomDetails.map((unit: any, index) => (

                                                            <div key={index}
                                                                className="flex justify-between items-center gap-2 p-3 border rounded-lg">
                                                                <div className="flex flex-col items-start gap-1">
                                                                    <p className="max-w-[30ch] font-medium text-sm break-words">{unit.name}</p>
                                                                    <p className="text-gray-500 text-xs">Room
                                                                        Count: {unit.roomCount}</p>
                                                                    <p className="text-gray-500 text-xs">Max
                                                                        Guests: {unit.maxHeadCount}</p>
                                                                    <p className="font-medium text-xs">Price:
                                                                        ${parseFloat(unit.unitPrice).toFixed(2)}</p>
                                                                </div>
                                                                <Image
                                                                    src={unit?.files?.[0]?.smallPath ?? "/default-image.jpg"}
                                                                    alt="Property"
                                                                    width={100}
                                                                    height={100}
                                                                    className="rounded-lg w-28 h-auto object-cover aspect-square"
                                                                />
                                                            </div>

                                                        ))}
                                                    </div>
                                                </div>
                                            ) : null}
                                        </div>

                                    </div>

                                    <div>
                                        <h3 className="mt-5 font-medium text-gray-800 text-base">Payment Details</h3>
                                        <div className="gap-2 grid grid-cols-2 mt-2 font-medium text-sm">
                                            <div>
                                                <span className="text-gray-500 text-xs">Type : </span>
                                                <span
                                                    className='font-medium text-sm'>{formatString(data?.paymentType!)}</span>
                                            </div>
                                            <div>
                                                <span className="text-gray-500 text-xs">Code : </span>
                                                <span className='font-medium text-sm'>{data?.code}</span>
                                            </div>

                                            <div className='flex flex-col items-start leading-1'>
                                                <div>
                                                    <span className="text-gray-500 text-xs">Status : </span>
                                                    <span className={`font-medium text-sm 
                                                            ${data?.paymentStatus === PAYMENT_STATUS_TYPES.SUCCESS ? 'text-green-600' :
                                                            data?.paymentStatus === PAYMENT_STATUS_TYPES.FAILED ? 'text-red-500' :
                                                                data?.paymentStatus === PAYMENT_STATUS_TYPES.PENDING ? 'text-yellow-500' :
                                                                    'text-gray-500'}`}>{formatString(data?.paymentStatus!)}
                                                    </span>

                                                </div>

                                            </div>

                                        </div>
                                    </div>

                                    {
                                        data?.securityDeposit > 0 && (
                                            <div
                                                className="flex flex-col gap-1 bg-primary/10 mt-5 p-4 border border-primary rounded-lg">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-semibold text-primary text-base">
                                                        Damage Deposit <span className="text-gray-600 text-xs">(Fully Refundable)</span>
                                                    </span>
                                                    <span className="font-semibold text-green-600 text-2xl">
                                                        ${data?.securityDeposit}
                                                    </span>
                                                </div>
                                                <p className="text-primary text-sm">
                                                    This security deposit is <span
                                                        className="font-semibold">not included</span> in your booking payment
                                                    and must be paid separately at the property during check-in.
                                                </p>
                                            </div>
                                        )
                                    }


                                    <div className='mt-5'>
                                        <h3 className="mt-5 font-medium text-gray-800 text-base">Cancellation
                                            Policy</h3>
                                        <p className="mt-2 text-gray-500 text-xs">{data?.cancellationPolicy?.description}</p>
                                    </div>
                                    <div className='mt-5'>
                                        <h3 className="mt-5 font-medium text-gray-800 text-base">Got Questions? Let’s
                                            Talk.</h3>
                                        <div className='grid grid-cols-2 max-[550px]:grid-cols-1'>
                                            <a
                                                href="tel:+94770033848"
                                                className="flex items-center gap-2 mt-2 text-gray-500 hover:text-gray-700 text-xs transition-colors duration-200"
                                            >
                                                <PhoneCall size={16} /> +94 77 00 33 848
                                            </a>
                                            <a
                                                href="mailto:support@servicedapartments.lk"
                                                className="flex items-center gap-2 mt-2 text-gray-500 hover:text-gray-700 text-xs transition-colors duration-200"
                                            >
                                                <Mail size={16} /> support@servicedapartments.lk
                                            </a>
                                        </div>
                                    </div>

                                    <div
                                        className="flex justify-between mt-5 pt-2 border-t font-semibold text-green-600 text-3xl">
                                        <p>Total</p>
                                        <p>
                                            {data.subTotal && data.subTotal > 0 && data.subTotal !== data.netTotal &&
                                                <span className='font-light text-secondary text-lg line-through cursor-pointer'
                                                    title={`You saved $${data.totalDiscount} with our ${data.discountName ?? ''} `}
                                                >${data?.subTotal}</span>
                                            } ${data?.netTotal}</p>
                                    </div>

                                </div>
                            </div>

                        </div>
                    </>
                ) : (
                    <>
                        Loading...
                    </>
                )
            }
        </>
    );

}
