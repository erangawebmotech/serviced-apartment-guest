"use client";
import React, { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/all";
import option1 from "@/public/about/about-option-image-1-small.png";
import option1_preview from "@/public/about/about-option-image-1.png";
import option2 from "@/public/about/about-option-image-2-small.png";
import option2_preview from "@/public/about/about-option-image-2.png";
import option3 from "@/public/about/about-option-image-3-small.png";
import option3_preview from "@/public/about/about-option-image-3.png";
import about_offers from "@/public/about/about-offers-image.webp";
import about_offers_overlay from "@/public/about/about-offers-image-overlay.png";
import about_offers_overlay_bottom from "@/public/about/about-bento-image-overlay-bottom.png";
import imageOverlay from "@/public/about/about-bento-image-overlay.png";
import OptionButton from "@/components/common/about/OptionButton";
import AboutButton from "../common/about/AboutButton";
import Image from "next/image";
import DealsList from "../weekend-deals/DealsList";
import { fetchAboutData } from "@/service/about";
import AuthModal from "../auth/AuthModal";
import { Skeleton } from "../ui/skeleton";
import { DealsProps } from "@/common/propertyCard.interface";

const AboutPage = () => {
  const [activeOption, setActiveOption] = useState(option1_preview);

  const AboutContainerRef = useRef<HTMLDivElement | null>(null);
  const topDivRef = useRef<HTMLDivElement | null>(null);
  const topRightDivRef = useRef<(HTMLDivElement | null)[]>([]);
  const slideDownDelayedRef = useRef<(HTMLDivElement | SVGImageElement | null)[]>([]);
  const slideDowUPDelayedRef = useRef<(HTMLDivElement | SVGImageElement | null)[]>([]);
  const opacityUpDelayedRef = useRef<(HTMLDivElement | null)[]>([]);

  const [deals, setDeals] = useState<DealsProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");

  const animationsTriggered = useRef(false);

  const handleOptionClick = (option: any) => setActiveOption(option);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchAboutData();
      setDeals(response);
      setHasFetched(true);

      // Give GSAP ScrollTrigger a tick to refresh
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    } catch (err) {
      console.error("Failed to fetch deals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animationsTriggered.current) {
          animationsTriggered.current = true;
          fetchData();

          topRightDivRef.current.forEach((div) =>
            div?.classList.add('animatedSlideDown')
          );
          slideDownDelayedRef.current.forEach((div) =>
            div?.classList.add('animatedSlideDownDelayed')
          );
          slideDowUPDelayedRef.current.forEach((div) =>
            div?.classList.add('animatedSlideUpDelayed')
          );
          opacityUpDelayedRef.current.forEach((div) =>
            div?.classList.add('animatedOpacityUpDelayed')
          );

          if (topDivRef.current) {
            topDivRef.current.classList.add('animatedSlideUp');
          }
        }
      },
      { root: null, threshold: 0.1 }
    );

    if (AboutContainerRef.current) {
      observer.observe(AboutContainerRef.current);
    }

    return () => {
      if (AboutContainerRef.current) {
        observer.unobserve(AboutContainerRef.current);
      }
    };
  }, []);

  const handleSignUpModal = () => {
    setIsModalOpen(true);
    setActiveTab("register");
  };

  const gotoToHost = () => {
    const hostUrl = process.env.NEXT_PUBLIC_HOST_URL;
    if (hostUrl) window.open(hostUrl, "_blank");
  };

  return (

    <div className="p-20 max-[1440px]:px-10 max-[435px]:px-3 max-[672px]:px-5 max-[1000px]:pb-10 h-max about-page" ref={AboutContainerRef}>
      <div className="relative flex flex-row max-[935px]:flex-col justify-between items-start max-[935px]:items-center max-[935px]:gap-10 space-x-10 max-[1398px]:space-x-3 h-max">

        <div className="relative" ref={topDivRef}>
          <div className="relative">
            <svg
              viewBox="0 0 681 527"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="about-main-svg"
            >
              <defs>
                <pattern
                  id="bgPattern"
                  patternUnits="objectBoundingBox"
                  width="1"
                  height="1"
                >
                  <image
                    href={activeOption.src}
                    x="0"
                    y="0"
                    width="681"
                    height="527"
                    preserveAspectRatio="xMidYMid slice"
                    className="transition-opacity duration-500 ease-in-out"
                  />

                  <image
                    href={imageOverlay.src}
                    x="50"
                    y="25"
                    preserveAspectRatio="xMidYMid slice"
                    className="opacity-0"
                    ref={(el) => { slideDownDelayedRef.current[1] = el }}
                  />
                  <image
                    href={about_offers_overlay_bottom.src}
                    x="220"
                    y="400"
                    preserveAspectRatio="xMidYMid slice"
                    className="opacity-0"
                    ref={(el) => { slideDowUPDelayedRef.current[0] = el }}
                  />
                </pattern>
              </defs>
              <path
                d="M1 510.5V482L1.00018 28C1.00018 9 2.50018 1 26.5002 1H652C673.2 1 679.5 20.3333 680 30V417C680 428.6 670.667 431.833 666 432H491C475 432 471 442.667 471 448L471 506C471 519.5 468 525 456 525L112 526C85.8334 525.667 30.4 525 18 525C5.6 525 1 520 1 510.5Z"
                fill="url(#bgPattern)"
              />
            </svg>
          </div>

          <div className="right-0 max-[1398px]:right-1 bottom-1 max-[1398px]:bottom-0 z-10 absolute flex space-x-[-20px]">
            <OptionButton
              active={activeOption === option1_preview}
              option={option1}
              onClick={() => handleOptionClick(option1_preview)}
            />
            <OptionButton
              active={activeOption === option2_preview}
              option={option2}
              onClick={() => handleOptionClick(option2_preview)}
            />
            <OptionButton
              active={activeOption === option3_preview}
              option={option3}
              onClick={() => handleOptionClick(option3_preview)}
            />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="relative flex flex-1 justify-center items-center">
            <div className="flex max-[672px]:flex-col justify-between items-start gap-10 max-[1398px]:gap-3 max-[672px]:gap-10 w-full h-max">

              <div  className="flex flex-col justify-between items-center gap-5 bg-primary bg-opacity-25 p-6 border-2 border-primary border-opacity-5 rounded-3xl w-full h-max" ref={(el) => { topRightDivRef.current[0] = el }}>
                <h2 className="pr-28 max-[1398px]:pr-10 max-[1500px]:pr-16 font-normal max-[1618px]:text-[40px] max-[1072px]:text-3xl max-[1398px]:text-4xl max-[798px]:text-4xl text-5xl max-[935px]:text-5xl">A lot can happen with little space.</h2>
                <p className="font-poppins font-normal text-muted text-lg max-[1000px]:text-center description-paragraph-default">Explore our uniquely deigned spaces that offer privacy, comfort,and a taste of SriLanka's rich culture.</p>
                <AboutButton label='Host your property' type={'default'} onClick={gotoToHost} />
              </div>

              <div className="flex flex-col justify-between items-center gap-5 bg-secondary bg-opacity-25 p-6 border-2 border-secondary border-opacity-5 rounded-3xl w-full h-max" ref={(el) => { topRightDivRef.current[1] = el }}>
                <div
                  className="relative bg-cover bg-no-repeat bg-center border rounded-2xl w-full h-[173px] max-[1590px]:h-[150px] min-[1761px]:h-60"
                  style={{ backgroundImage: `url(${about_offers.src})` }}
                >
                  <div className="top-0 left-0 absolute w-full h-full">
                    <Image loading="lazy" src={about_offers_overlay} alt='Serviced apartments offers' className="top-4 right-4 absolute opacity-0" ref={(el) => { slideDownDelayedRef.current[0] = el }} />
                  </div>
                </div>

                <p className="font-poppins font-normal text-primary text-lg text-center description-paragraph-default max">Offer for your first 2 bookings in Serviced apartments</p>
                <AboutButton label='Sign up Now' type={'danger'} onClick={handleSignUpModal} />
              </div>
            </div>
          </div>
          <div>
            <p className="hidden min-[1761px]:block opacity-0 mt-5 font-poppins font-normal text-muted text-lg description-paragraph-default" ref={(el) => { opacityUpDelayedRef.current[0] = el }}>
              Explore our uniquely designed spaces that offer privacy, comfort, and a taste of Sri Lanka’s rich culture. Explore our uniquely designed spaces that offer privacy, comfort.
            </p>
          </div>
        </div>

      </div>

      <p className="min-[1761px]:hidden opacity-0 mt-10 font-poppins font-normal text-muted text-lg text-center description-paragraph-default" ref={(el) => { opacityUpDelayedRef.current[1] = el }}>
        Explore our uniquely designed spaces that offer privacy, comfort, and a taste of Sri Lanka’s rich culture. Explore our uniquely designed spaces that offer privacy, comfort.
      </p>

      <div
        className={`flex-col justify-between items-start w-full h-max max-[1000px]:items-center ${deals.length === 0 && !loading ? "hidden" : "flex"
          }`}
      >
        <div className="relative pt-20">
          <h2 className="title">Most Booked Stays</h2>
          <p className="subtitle">Top Stays Booked in the Past Month</p>
        </div>

        {loading ? (
          <div className="flex justify-center gap-4 px-5 w-full overflow-x-hidden">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className={`
                  m-0 p-1 flex-shrink-0
                  max-[290px]:!basis-full
                  max-[321px]:!basis-[88%]
                  max-[365px]:!basis-[80%]
                  max-[500px]:!basis-[70%]
                  max-[610px]:!basis-[65%]
                  max-[769px]:!basis-[55%]
                  max-[850px]:!basis-[45%]
                  max-[980px]:!basis-[40%]
                  min-[980px]:!basis-[40%]
                  min-[1535px]:!basis-[25%]
                  min-[1720px]:!basis-1/5
                  min-[2000px]:!basis-[18%]
                  lg:!basis-1/3
                  xl:!basis-1/4
                  ${idx > 0 ? "max-[768px]:hidden" : ""}
                `}
              >
                <Skeleton className="bg-gray-200 rounded-xl max-w-[280px] h-[324px]" />
              </div>
            ))}
          </div>
        ) : (
          hasFetched && deals.length > 0 && <DealsList dealsList={deals} />
        )}
      </div>

      <AuthModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} activeTab={activeTab} />
    </div>
  );
};

export default AboutPage;