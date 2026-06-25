import { popularLocations } from '@/helpers/mockArrays';
import React, { useEffect, useState, useRef } from 'react';
import LocationCard from './LocationCard';
import { Locations } from '@/common/interfaces';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Galle from '@/public/discover/Galle.webp';
import Negombo from '@/public/discover/negombo.jpg';
import Kalutara from '@/public/discover/Kalutara.webp';
import Colombo from '@/public/discover/Colombo.webp';
import { Skeleton } from '@/components/ui/skeleton';

const useInView = (threshold = 0.5) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [isInView, setIsInView] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setIsInView(entry.isIntersecting),
            { threshold }
        );

        if (ref.current) observer.observe(ref.current);

        return () => {
            if (ref.current) observer.unobserve(ref.current);
        };
    }, [threshold]);

    return { ref, isInView };
};

const InViewWrapper = ({ children }: {
    children: (isInView: boolean, ref: React.RefObject<HTMLDivElement | null>) => React.ReactNode
}) => {
    const { ref, isInView } = useInView(0.6);
    return <div ref={ref}>{children(isInView, ref)}</div>;
};

const LocationsDetails = ({ updateLocationDetails, locationData }: {
    updateLocationDetails: (description: string, title: string | undefined, locations: Locations[], reviewers?: any, properties?: any) => void,
    locationData: any
}) => {
    const [title, setTitle] = useState<string | undefined>('');
    const [selectedLocationId, setSelectedLocationId] = useState<number | string>(1);
    const [data, setData] = useState<any[]>([]);

    const isLoading = data.length === 0;

    const setDescription = (paragraph: string | undefined, id: number | string, description: string, name: string, reviewers?: any, properties?: any) => {
        setTitle(paragraph);
        setSelectedLocationId(name + 'ServicedApartments');
        const updatedLocations: any = [];
        updateLocationDetails(description, name, updatedLocations, reviewers, properties);
    };

    const highlightLocationName = (description: string, locationName: string) => {
        const regex = new RegExp(`(${locationName})`, 'gi');
        return description.split(regex).map((part, index) =>
            part.toLowerCase() === locationName.toLowerCase() ? (
                <span key={index} className="text-secondary">{part}</span>
            ) : part
        );
    };

    useEffect(() => {
        if (locationData && locationData.length > 0) {
            setData(locationData);
            setSelectedLocationId(locationData[0].city + 'ServicedApartments');
        }
    }, [locationData]);

    return (
        <>
            <div className='w-full'>
                <div className="max-[769px]:hidden flex flex-row">
                    {(isLoading ? Array(4).fill(null) : data).map((location: any, index) => (
                        location ? (
                            <LocationCard
                                key={location.city + 'ServicedApartments'}
                                name={location.city}
                                href={location.city === "Colombo" ? Colombo : location.city === "Kalutara" ? Kalutara : location.city === "Galle" ? Galle : location.city === "Negombo" ? Negombo : Colombo}
                                alt={`${location.city || 'undefined'}, SriLanka`}
                                onClick={() => setDescription(
                                    location.city === 'Colombo' ? "Vibrant Culture in Colombo's Streets" : location.city === 'Galle' ? "Uncover Galle's Coastal Beauty" : location.city === 'Kalutara' ? "Where Kalutara Breathes History" : location.city === 'Negombo' ? "Coastal Roots, Negombo Vibes" : "Vibrant Culture in Colombo's Streets",
                                    location.city + 'ServicedApartments',
                                    location.description || `Are you seeking an advanced solution to manage your property across multiple platforms, or are you interested in partnering with us for full-service management? Serviced Apartments LK has partnered with the top online property agencies across the world, to connect with millions of guests who are looking for a property just like yours.`,
                                    location.city,
                                    location.reviewers,
                                    location.properties
                                )}
                                isSelected={selectedLocationId === location.city + 'ServicedApartments'}
                            />
                        ) : (
                            <Skeleton key={index} className="m-2 rounded-xl w-[300px] h-[200px]" />
                        )
                    ))}
                </div>

                <div className='hidden max-[769px]:block px-10'>
                    <Carousel>
                        <CarouselContent>
                            {popularLocations.map((location) => (
                                <CarouselItem
                                    key={location.id}
                                    className='p-3 max-[769px]:basis-1/2 max-[755px]:basis-full shrink-0'
                                >
                                    <InViewWrapper>
                                        {(isInView, ref) => {
                                            useEffect(() => {
                                                if (isInView && selectedLocationId !== location.id) {
                                                    setDescription(
                                                        location.description,
                                                        location.id,
                                                        location.paragraph || `Are you seeking an advanced solution...`,
                                                        location.name
                                                    );
                                                    setSelectedLocationId(location.id);
                                                }
                                            }, [isInView]);

                                            return (
                                                <div ref={ref}>
                                                    <LocationCard
                                                        name={location.name}
                                                        href={location.name === "Colombo" ? Colombo : location.name === "Kalutara" ? Kalutara : location.name === "Galle" ? Galle : location.name === "Negombo" ? Negombo : Colombo}
                                                        alt={location.alt}
                                                        onClick={() => setDescription(location.description, location.id, location.paragraph, location.name)}
                                                        isSelected={selectedLocationId === location.id}
                                                    />
                                                </div>
                                            );
                                        }}
                                    </InViewWrapper>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            </div>

            <div>
                <h2 className='mt-5 w-[85%] max-[1000px]:w-full md:text-left text-center description-title-large'>
                    {title
                        ? highlightLocationName(
                            title,
                            popularLocations.find(location => title.includes(location.name))?.name || ''
                        ) : (
                            <>
                                {"Vibrant Culture in "}
                                <span className="text-secondary">Colombo</span>
                                {"'s Streets"}
                            </>
                        )
                    }
                </h2>
            </div>
        </>
    );
};

export default LocationsDetails;
