import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useEffect, useRef, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import DealCard from "../weekend-deals/DealCard";
import { Rating } from "@/common/types";

const Deals = ({ discountList, discountRecent }: { discountList: any[]; discountRecent: any[] }) => {
  const [discountsRecent, setDiscountsRecent] = useState<any[]>([]);

  const autoplay = useRef(
    Autoplay({ delay: 3000, stopOnInteraction: true })
  );

  useEffect(() => {
    setDiscountsRecent(discountRecent);
  }, [discountList, discountRecent])

  return (
    <div className="relative flex flex-col items-center max-[769px]:p-5 px-10 w-full" >
      <Carousel
        plugins={[autoplay.current]}
        onMouseEnter={autoplay.current.stop}
        onMouseLeave={autoplay.current.reset}
        className="w-full max-w-full">
        <CarouselContent className="-ml-1">
          {discountsRecent.map((deal: any, index) => (
            <CarouselItem key={index}
              className={`
              m-0
              p-0
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
              flex-shrink-0 
              transition-transform ease-out duration-300
            `}
            >
              <div className="p-1">
                <DealCard
                  offer={deal?.discount}
                  option1={deal.images.find((img: any) => img.isCover)?.file?.mediumPath}
                  slug={deal?.slug}
                  id={deal?.id}
                  option2={deal.images.find((img: any) => !img.isCover)?.file?.mediumPath}
                  name={deal.name}
                  address={`${deal.location?.city?.name || 'undefined'}, ${deal.location?.province?.name || 'undefined'}`}
                  favorite={false}
                  rating={deal.summaryReview.averageReviews as Rating}
                  type={deal?.propertyType?.type || 'hotel'}
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="max-[769px]:hidden -top-20 max-[495px]:!top-0 right-20 max-[527px]:!right-10 md:right-14 absolute flex gap-8 w-2" >
          <CarouselPrevious className="bg-primary p-6 max-[425px]:p-5 rounded-xl max-[425px]:rounded-lg text-white" />
          <CarouselNext className="bg-primary p-6 max-[425px]:p-5 rounded-xl max-[425px]:rounded-lg text-white" />
        </div>
      </Carousel>

    </div>
  );
};

export default Deals;
