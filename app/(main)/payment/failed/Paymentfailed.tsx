'use client'
import { Suspense } from "react";
import dynamic from "next/dynamic";
import failed from '@/public/success/failed.json'
import { List } from "lucide-react";
const PaymentFailed = () => {
    const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

    return (
        <Suspense>
            <div className="flex flex-col justify-center items-center min-h-screen font-poppins">
                <div className="flex flex-col justify-center items-center">
                    <Lottie animationData={failed} loop={false} className="p-0 w-[50rem]" />
                    <button
                        className="flex justify-center items-center gap-3 bg-gray-400 px-20 py-3 rounded-md w-max text-white"
                        onClick={() => window.open('/reservation-history', '_blank')}
                    >
                        <List /> My Reservations
                    </button>
                </div>
            </div>
        </Suspense>
    );
};

export default PaymentFailed;
