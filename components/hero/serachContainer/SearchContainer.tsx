'use client'

import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import TrendingFilters from '../bottomFilters/TrendingFilters';
import { SearchLocation } from '@/components/Filters/SearchLocation';
import SearchByDate from '@/components/Filters/SearchByDate';
import SearchByGuestCount from '@/components/Filters/SearchByGuestCount';
import MobileContainer from './MobileContainer';
import { useRouter } from 'next/navigation';
import { PlaceAutocompleteResult } from '@googlemaps/google-maps-services-js';
import { DateRange } from 'react-day-picker';
import { CountState } from '@/common/types';
import { CheckTimeType, refactorDate } from '@/common/commonClientFunctions';
import { toast } from '@/hooks/use-toast';

const SearchContainer = () => {
    const [expanded, setExpanded] = useState(false);
    const [backgroundVisible, setBackgroundVisible] = useState(false);
    const [counts, setCounts] = useState<CountState>({ adults: 1, children: 0, rooms: 1, pets: false, });
    const [prediction, setPrediction] = useState<any>(null);
    const [revealText, setRevealText] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
    const router = useRouter();

    useEffect(() => {
        const buttonTimer = setTimeout(() => {
            setExpanded(true);
        }, 300);

        const backgroundTimer = setTimeout(() => {
            setBackgroundVisible(true);
            setRevealText(true);
        }, 700);

        return () => {
            clearTimeout(buttonTimer);
            clearTimeout(backgroundTimer);
        };
    }, []);

    const handlePlaceId = (prediction: PlaceAutocompleteResult) => {
        setPrediction(prediction)
    }


    const handleDate = (date: DateRange | undefined) => {
        setDateRange(date)
    }
    const handleCount = (adults: number, children: number, rooms: number, pets: boolean) => {
        setCounts({ adults, children, rooms, pets, });
    };

    const parseLocation = (description: string) => {
        if (!description) {
            return null;
        }
        const parts = description.split(", ");
        const city = parts[0] || "Unknown";
        const country = parts[parts.length - 1] || "Unknown";
        return { city, country };
    };


    const handleSearch = ({ highlightId }: { highlightId?: string } = {}) => {
        const { city } = parseLocation(prediction?.description || null) ?? { city: prediction?.label || null };
        
        if (city && !prediction.place_id) {
            toast({
                description: "choose a location",
                className: "bg-secondary font-poppins text-white p-4 rounded-lg shadow-md",
                duration: 3000,
            });
            return;
        }

        const queryParams: Record<string, string> = {
            destination: city,
            place_id: prediction?.place_id ?? '',
            checkin: dateRange?.from ? refactorDate(dateRange.from, CheckTimeType.CHECKIN).toISOString() : "",
            checkout: dateRange?.to ? refactorDate(dateRange.to, CheckTimeType.CHECKOUT).toISOString() : "",
            no_adults: counts.adults.toString(),
            no_rooms: counts.rooms.toString(),
            no_children: counts.children.toString(),
            pets: counts.pets.toString(),
            filter: highlightId ?? "",
        };

        const filteredParams = Object.fromEntries(
            Object.entries(queryParams).filter(([_, value]) => value !== "")
        );

        const params = new URLSearchParams(filteredParams).toString();

        router.push(`/search-results?${params}`);
    }

    return (
        <section className="relative flex flex-col justify-between items-center self-center-custom bg-transparent w-screen h-screen">
            <div className="top-[25%] max-[450px]:top-[15%] absolute flex flex-col justify-center items-center w-full search-container-section">

                <h1
                    className={`hero-title  text-white ${revealText ? 'animate-reveal title-delay' : ''} home-title-responsive `}
                >
                    {/* <Image src={hat} alt='hat' className='max-[1001px]:hidden -top-10 -left-12 absolute w-28 h-auto -rotate-12' /> */}
                    Discover The Wonderland
                </h1>
                <p
                    className={`hero-subtitle text-white ${revealText ? 'animate-reveal subtitle-delay' : ''} sub-title-responsive capitalize`}
                >
                    Book your dream stays across Sri Lanka
                </p>
            </div>

            <div className="top-[3%] z-10 absolute flex flex-col justify-center items-center bg-transparent w-screen h-screen">
                {backgroundVisible && (
                    <>
                        <div className="relative flex border background-expand">
                            <div className="left-5 z-2 absolute flex flex-row items-center w-[85%] font-poppins">
                                <div>
                                    <SearchLocation onChangePlaceId={handlePlaceId} />
                                </div>

                                <div>
                                    <SearchByDate onDateChangeDate={handleDate} />
                                </div>

                                <div>
                                    <SearchByGuestCount onChangeCounts={handleCount} />
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div
                    className={`relative h-[52px] ${expanded ? 'w-[147px] max-[1095px]:w-[130px]' : 'w-[52px]'} rounded-[100px] border-[5px] border-[#B5C0C4] flex items-center justify-center transition-all duration-200 ${backgroundVisible ? 'search-button' : ''} ${expanded ? 'animate-expand' : 'animate-spin-scale'}`}
                >
                    <Button
                        className="z-20 flex justify-center items-center bg-secondary rounded-[84px] w-full h-full text-center transition-all duration-300 cursor-pointer"
                        onClick={() => { handleSearch() }}
                    >
                        <FaSearch className="text-white" />
                        {expanded && <span className="search-text-name max-[1095px]:text-sm">Search</span>}
                    </Button>

                </div>
            </div>

            <div className='hidden top-[40%] z-20 absolute max-[970px]:flex flex-col justify-center items-center w-full'>
                <MobileContainer />
            </div>

            <TrendingFilters onChange={(e) => {
                handleSearch({ highlightId: e.toString() })
            }} />
        </section>
    );
};

export default SearchContainer;
