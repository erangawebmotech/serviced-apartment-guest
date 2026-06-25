import React, { useEffect, useState } from "react";
import Image from "next/image";

import lightIcon from '@/public/single-page/lightIcon.png'
import cupIcon from '@/public/single-page/cupIcon.png'
import parkIcon from '@/public/single-page/parkIcon.png'
import heartIcon from '@/public/single-page/heartIcon.png'
import OverviewTabContent from "./OverviewTabContent";
import SinglePropertyReviews from "./SinglePropertyReviews";
import SinglePropertyRoomDetails from "./SinglePropertyRoomDetails";
import { getBlockedDates } from "@/service/hotel";


const PropertyDetails = ({ hotel, reviews, roomDetails, checkin, checkout }:
    { hotel: any, reviews: any[], roomDetails: any, checkin: any, checkout: any, }) => {

    const [activeTab, setActiveTab] = useState<string>("Overview");
    const [hotelData, setHotelData] = useState<any>([]);
    const [blockedDates, setBlockedDates] = useState<{ reserved: Date[][], blocked: Date[][] }>({ reserved: [], blocked: [] });

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tabs = ["Overview", "Rooms", "Guest Reviews"];

    useEffect(() => {
        setHotelData(hotel)

        const loadBlockedDates = async () => {
            await getBlockedDates({ id: hotel?.id }).then((res) => {
                setBlockedDates(res?.data)
            }).catch((error) => {
                console.log(error)
            })
        }

        loadBlockedDates();
    }, [hotel])

    return (
        <div className="flex justify-between items-start pt-10 max-[865px]:pt-5 w-full h-max">

            <div className="w-full">
                <nav className="flex space-x-4 mb-4 font-poppins text-gray-500 text-sm">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`cursor-pointer pb-2 transition-all duration-200 ${activeTab === tab
                                ? "border-b-2 border-black text-black font-semibold"
                                : "hover:text-black"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>

                <div>
                    {activeTab === "Overview" && (

                        <>
                            <OverviewTabContent hotel={hotelData} />
                            <div className="mt-10 max-[865px]:mt-5"></div>
                            <SinglePropertyRoomDetails hotel={hotel} roomDetails={roomDetails} checkin={checkin} checkout={checkout} blockedDates={blockedDates} />

                            <SinglePropertyReviews ratings={reviews} />
                            <div className="mt-10"></div>
                        </>
                    )}
                    {activeTab === "Rooms" && (
                        <SinglePropertyRoomDetails hotel={hotel} roomDetails={roomDetails} checkin={checkin} checkout={checkout} blockedDates={blockedDates} />
                    )}
                    {activeTab === "Guest Reviews" && (
                        <SinglePropertyReviews ratings={reviews} />
                    )}
                </div>
            </div>


            <div className="hidden bg-[#46A5DF14] p-4 rounded-lg w-1/3 font-poppins">

                <h2 className="mb-2 font-semibold text-lg">Property highlights</h2>
                <div className="flex items-center mb-4 pl-3 text-gray-600 text-sm">
                    <Image src={lightIcon} alt="highly rated Image" />
                    <span className="ml-2">
                        Top location: Highly rated by recent guests (9.1)
                    </span>
                </div>


                <h2 className="mb-2 font-semibold text-lg">Breakfast info</h2>
                <div className="flex items-center mb-4 pl-3 text-gray-600 text-sm">
                    <Image src={cupIcon} alt="highly rated Image" />
                    <span className="ml-2">
                        Continental, Vegetarian, Halal, Gluten-free, Breakfast to go
                    </span>
                </div>


                <div className="flex items-center mb-4 pl-3 text-gray-600 text-sm">
                    <Image src={parkIcon} alt="highly rated Image" />
                    <span className="ml-2">Free private parking available on-site</span>
                </div>


                <div className="flex flex-col space-y-2">
                    <button className="bg-primary hover:bg-blue-950 py-2 rounded text-white text-sm">
                        Reserve
                    </button>
                    <button className="flex justify-center items-center hover:bg-blue-100 py-2 border border-primary rounded text-primary text-sm">
                        <Image src={heartIcon} alt="highly rated Image" width={18} />
                        <span className="ml-1">Save Property</span>
                    </button>
                </div>
            </div>
        </div >
    );
};

export default PropertyDetails;
