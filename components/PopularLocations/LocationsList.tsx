import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Rating } from "@/common/types";
import DealCard from "../weekend-deals/DealCard";
import { useEffect, useRef } from "react";

const LocationsList = ({ locations }: { locations: any[] }) => {
  const discoverLocationsRef = useRef<HTMLDivElement | null>(null);
  const slideUpRef = useRef<(HTMLDivElement | null)[]>([]);
  const slideUpDelayedRef = useRef<(HTMLDivElement | null)[]>([]);

  const animationsTriggered = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          animationsTriggered.current = true;

          slideUpRef.current.forEach((div) => {
            div?.classList.add("animatedSlideUp");
          });

          slideUpDelayedRef.current.forEach((div) => {
            div?.classList.add("animatedChildSlideUpDelayed");
          });
        } else {
          // Reset animation classes when Carousel goes out of view
          slideUpRef.current.forEach((div) => div?.classList.remove("animatedSlideUp"));
          slideUpDelayedRef.current.forEach((div) => div?.classList.remove("animatedChildSlideUpDelayed"));
          animationsTriggered.current = false;
        }
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (discoverLocationsRef.current) {
      observer.observe(discoverLocationsRef.current);
    }

    return () => {
      if (discoverLocationsRef.current) {
        observer.unobserve(discoverLocationsRef.current);
      }
    };
  }, [locations]);
  
  return (
    <>
      {locations?.length > 0 && (
        <div
          className="relative flex flex-col items-center max-[768px]:p-0 px-10 w-screen"
          ref={discoverLocationsRef}
        >
          <Carousel className="w-full max-w-full">
            <CarouselContent className="-ml-1">
              {locations.map((deal, index) => (
                <CarouselItem
                  key={index}
                  className={`
                          m-0 p-0
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
                          lg:!basis-1/3 xl:!basis-1/4 
                          flex-shrink-0 
                          transition-transform ease-out duration-300
                        `}
                >
                  <div
                    className="opacity-0 p-1"
                    ref={(el) => {
                      slideUpRef.current[index] = el;
                    }}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <DealCard
                      option1={deal.images.find((img:any) => img.isCover)?.file?.mediumPath }
                      slug={deal?.slug}
                      id={deal?.id}
                      option2={deal.images.find((img:any) => !img.isCover)?.file?.mediumPath }
                      name={deal.name}
                      address={`${deal.location.city.name}, ${deal.location.province.name}`}
                      favorite={false}
                      rating={deal.summaryReview.averageReviews as Rating}
                      type={deal?.propertyType?.type || 'hotel'}      
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            <div
              className="max-[769px]:hidden -top-8 sm:right-10 md:right-20 absolute flex gap-8 opacity-0 w-2"
              ref={(el) => {
                slideUpDelayedRef.current[0] = el;
              }}
            >
              <CarouselPrevious className="bg-primary p-6 rounded-xl text-white" />
              <CarouselNext className="bg-primary p-6 rounded-xl text-white" />
            </div>
          </Carousel>
        </div>
      )}
    </>
  );
};

export default LocationsList;
