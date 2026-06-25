import React, { useEffect, useRef, useState } from 'react';
import TrustedClientImage from './TrustedClientImage';
import AboutButton from '../common/about/AboutButton';
import LocationsList from './LocationsList';
import LocationsDetails from './LocationsDetails';
import LocationDescription from './LocationDescription';
import { Locations } from '@/common/interfaces';
import EarnMore from '../earnMore/EarnMore';
import '@/styles/popular-locations.css'
import { getPopularLocations } from '@/actions/services/getPopularLocations';
import { useRouter } from 'next/navigation';
import WeekendDeals from '../deals/WeekendDeals';


const PopularLocation = () => {
  const [locationDetails, setLocationDetails] = useState<any>([]);
  const [description, setDescription] = useState<string>('')
  const [name, setName] = useState<string>('Colombo')
  const [reviewers, setReviewers] = useState([]);
  const [properties, setProperties] = useState([]);

  const discoverContainerRef = useRef<HTMLDivElement | null>(null);
  const slideUpRef = useRef<(HTMLDivElement | null)[]>([]);

  const animationsTriggered = useRef(false);
  const router = useRouter();



  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationsTriggered.current) {
          animationsTriggered.current = true;
          loadData();
          slideUpRef.current.forEach((div) => {
            if (entry.isIntersecting) {
              div?.classList.add('animatedSlideUp');
            } else {
              div?.classList.remove('animatedSlideUp');
            }
          });

        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (discoverContainerRef.current) {
      observer.observe(discoverContainerRef.current);
    }

    return () => {
      if (discoverContainerRef.current) {
        observer.unobserve(discoverContainerRef.current);
      }
    };
  }, []);

  const loadData = async () => {
    const response = await getPopularLocations();
    setLocationDetails(response.data)
  }

  useEffect(() => {
    if (locationDetails.length > 0) {
      setProperties(locationDetails[0].properties || []);
    }
  }, [locationDetails])

  const updateLocationDetails = (newDescription: string, newName: string | undefined, locations: Locations[], reviewers?: any, properties?: any) => {
    setDescription(newDescription);
    setName(newName || '');
    setReviewers(reviewers ? reviewers : []);
    setProperties(properties ? properties : []);

  };

  const handleFilterByCity = (name: string) => {
    const locationDetails = [
      { name: 'Colombo', placeId: 'ChIJA3B6D9FT4joRjYPTMk0uCzI' },
      { name: 'Galle', placeId: 'ChIJ4_wyabtz4ToRA0zG-QO5NUo' },
      { name: 'Negombo', placeId: "ChIJO_eya5zu4joRPm8YCOkmFqU" },
      { name: 'Kalutara', placeId: 'ChIJ5VeV5R434joRUXuKDoS6hos' },
    ]

    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 3);

    const queryParams: Record<string, string> = {
      destination: `${name}`,
      place_id: locationDetails.find((location) => location.name === name)?.placeId || '',
      checkin: today.toISOString(),
      checkout: tomorrow.toISOString(),
      no_adults: '1',
      no_rooms: '1',
      no_children: '0',
      pets: false.toString(),
    };

    const filteredParams = Object.fromEntries(
      Object.entries(queryParams).filter(([_, value]) => value !== "")
    );

    const params = new URLSearchParams(filteredParams).toString();

    router.push(`/search-results?${params}`);
    // router.push('/feature/filter-page');
  }

  return (
    <>

      <div className="relative flex flex-col items-center bg-white p-20 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 w-full" ref={discoverContainerRef}>
        <div className='flex max-[1000px]:flex-col justify-between items-start opacity-0 py-10 w-full h-max' ref={(el) => { slideUpRef.current[0] = el }}>

          <div className='flex flex-col max-[1000px]:mb-5 max-[875px]:mb-0 w-3/5 max-[1000px]:w-full'>
            <LocationsDetails updateLocationDetails={updateLocationDetails} locationData={locationDetails} />
          </div>

          <div className='flex flex-col justify-between items-start mt-2 max-[1000px]:p-0 pl-10 w-full h-max'>

            <LocationDescription paragraph={description} />
            <div className='flex -space-x-4 my-8 max-[1440px]:my-5 max-[875px]:my-3'>
              {
                reviewers &&
                reviewers.map((review: any, index: number) => (
                  <TrustedClientImage href={review} key={index} />
                ))
              }
            </div>
            <AboutButton label={`Find more Places in ${name}`} type={'default'} onClick={() => { handleFilterByCity(name) }} />

          </div>

        </div>

        <div className='max-[768px]:m-0 mt-14'>
          <LocationsList locations={properties} />
        </div>

      </div>
      <div className="perahara-pattern"></div>
      <EarnMore />
      <WeekendDeals />
    </>
  );
};

export default PopularLocation;
