import React, { useEffect, useRef } from 'react';
import AboutButton from '../common/about/AboutButton';
import '@/styles/earn-more.css'
import { useRouter } from 'next/navigation';

const EarnMore = () => {
  const earnMoreRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();


  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {


        if (earnMoreRef.current) {
          if (entry.isIntersecting) {
            earnMoreRef.current.classList.add('animatedGradient');
          } else {
            earnMoreRef.current.classList.remove('animatedGradient');
          }
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (earnMoreRef.current) {
      observer.observe(earnMoreRef.current);
    }

    return () => {
      if (earnMoreRef.current) {
        observer.unobserve(earnMoreRef.current);
      }
    };
  }, []);

  const goToFilterPage = () => {
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 3);

    const queryParams: Record<string, any> = {
      destination: '',
      place_id: undefined,
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

    // router.push('/feature/services-page')
    // const hostUrl =  process.env.NEXT_PUBLIC_HOST_URL || 'https://apartment-host.webmotech.com';
    // window.open(hostUrl, '_blank');
  }

  return (
    <div className="relative flex flex-row max-[1000px]:flex-col justify-between items-center bg-gradient-to-r from-[#3976A6] via-[#012B4C] to-[#012B4C] p-10 px-20 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 py-24 max-[1745px]:py-20 w-full h-max overflow-hidden text-white" ref={earnMoreRef}>
      <h2 className="w-3/5 max-[1000px]:w-full max-[1000px]:text-center tracking-wide description-title-large">
        Simplify Your Journey with Serviced Apartments LK
      </h2>
      <div className="self-start p-16 max-[1000px]:p-0 w-2/5 max-[1000px]:w-full">
        <p className="max-[1000px]:mt-10 mb-12 w-full max-[1000px]:text-center leading-relaxed tracking-wide description-paragraph-default">
          Experience hassle-free travel with modern amenities, flexible bookings, and personalized service, all designed to make your stay seamless and comfortable.
        </p>

        <AboutButton label={'Explore Our Properties'} type={'host'} onClick={goToFilterPage} />

      </div>
    </div>
  );
};

export default EarnMore;
