import React, { useEffect, useState } from 'react'
import StarRating from './StartsRating'
import { Progress } from "@/components/ui/progress";
import ReviewCard from './ReviewCard';
import userImage from '@/public/shared/defaultUser.png'
import { useLenis } from "lenis/react";
import ReviewDialog from './ReviewDialog';
import { Button } from '../ui/button';
import Autoplay from "embla-carousel-autoplay"
import RatingImg from '@/public/single-page/rating.png'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import ReviewsDialogMobile from './ReviewsDialogMobile';
import NotRatedYet from '../common/NotRatedYet';
import Image from 'next/image';


const formatDateDuration = (dateString: string | number | Date) => {
    const now: any = new Date();
    const date: any = new Date(dateString);
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 3600 * 24));

    if (diffInDays < 1) {
        return 'today';
    } else if (diffInDays === 1) {
        return 'yesterday';
    } else if (diffInDays <= 7) {
        return `${diffInDays} days ago`;
    } else {

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}



const SinglePropertyReviews = ({ ratings }: { ratings: any }) => {
    const [openModal, setOpenModal] = useState<boolean>(false);
    const lenis = useLenis();


    function formatText(text: string): string {
        return text
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, (char) => char.toUpperCase());
    }

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    )

    useEffect(() => {
        if (openModal) {
            lenis?.stop();
            document.body.style.overflow = "hidden";
        } else {
            lenis?.start();
            document.body.style.overflow = "";
        }
    }, [openModal, lenis]);


    return (
        <>
            {ratings?.data?.totalRating > 0 ? (
                <div className="pt-10 max-[500px]:pt-0 font-poppins">
                    <h2 className="mb-4 font-semibold text-lg">Reviews</h2>

                    <div className="flex max-[1000px]:flex-col max-[1000px]:items-center max-[1000px]:gap-10 max-[645px]:gap-8 w-full">
                        <div className="flex flex-col justify-center items-center pr-5 border-r max-[1000px]:border-none w-max">
                            {
                                ratings.data?.averageRating >= 5 ? (
                                    <div className="relative flex justify-center items-center w-[200px] h-[200px]">
                                        <Image
                                            src={RatingImg}
                                            alt="Not Rated Yet"
                                            width={200}
                                            height={200}
                                            className="absolute"
                                        />
                                        <div className="max-[500px]:font-normal max-[645px]:text-8xl text-9xl">{ratings.data?.averageRating || 0}</div>
                                    </div>
                                ) : (
                                    <div className="max-[500px]:font-normal max-[645px]:text-8xl text-9xl">{ratings.data?.averageRating || 0}</div>
                                )
                            }

                            <div className="max-[645px]:text-sm text-base">
                                {ratings.data?.totalRating || 0} Review
                                {`${ratings.data?.totalRating > 1 ? 's' : ''}`}
                            </div>

                            <StarRating rating={ratings.data?.averageRating || 0} size={24} />
                        </div>

                        <div className="space-y-3 p-4 max-[714px]:p-0 w-full">
                            {ratings.data?.categoryRatings?.map((rating: any, index: any) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="w-40 max-[410px]:w-44 max-[500px]:font-medium text-gray-700 max-[645px]:text-xs text-sm">
                                        {formatText(rating?.ratingCategoryName)}
                                    </span>
                                    <div className="mx-3 max-[410px]:ml-0 w-full">
                                        <Progress value={rating.ratingCount} className="bg-gray-200 h-2 max-[645px]:h-1" />
                                    </div>
                                    <span className="text-gray-700 max-[645px]:text-xs text-sm">{rating.ratingCount}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='min-[1000px]:hidden mt-10 w-full overflow-hidden'>
                        <Carousel
                            plugins={[plugin.current]}
                            className="w-full"
                            onMouseEnter={plugin.current.stop}
                            onMouseLeave={plugin.current.reset}
                        >
                            <CarouselContent>
                                {ratings.data?.reviews?.map((review: any, index: any) => (
                                    <div key={index} className='min-w-full'>
                                        <CarouselItem key={index}>
                                            <ReviewCard
                                                name={`${review?.user?.firstName || ''} ${review?.user?.lastName || ''}`}
                                                date={formatDateDuration(review?.createdAt || '')}
                                                review={review?.reviewText || ''}
                                                rating={review?.average || 0}
                                                avatar={review?.user?.file?.smallPath || userImage}
                                            />
                                        </CarouselItem>

                                    </div>
                                ))}

                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>

                    </div>

                    <div className="gap-6 mx-auto mt-10 w-full">
                        <div className='max-[1000px]:hidden gap-6 grid grid-cols-1 md:grid-cols-2'>
                            {ratings.data?.reviews?.map((review: any, index: any) => (
                                <div key={index}>
                                    <ReviewCard
                                        name={`${review?.user?.firstName || ''} ${review?.user?.lastName || ''}`}
                                        date={formatDateDuration(review?.createdAt || '')}
                                        review={review?.reviewText || ''}
                                        rating={review?.average || 0}
                                        avatar={review?.user?.file?.smallPath || userImage}
                                    />
                                </div>
                            ))}
                        </div>


                        {ratings?.pagination?.totalCount > 0 && (
                            <div className="max-[1000px]:hidden flex items-start col-span-1 md:col-span-2 mt-5 text-center">
                                <Button
                                    className="bg-transparent hover:bg-gray-50 shadow-sm px-4 py-2 border rounded-lg w-1/6 min-w-max font-medium text-gray-700 text-sm"
                                    onClick={() => setOpenModal(true)}
                                    size="lg"
                                >
                                    See all {ratings?.pagination?.totalCount} Reviews
                                </Button>
                            </div>
                        )}
                        {ratings?.pagination?.totalCount > 0 && (
                            <ReviewsDialogMobile ratings={ratings} />
                        )}
                    </div>

                    <ReviewDialog isOpen={openModal} onOpenChange={setOpenModal} reviews={ratings} />
                </div>
            ) : (
                <span className="block shadow-sm mt-5 rounded-lg overflow-hidden font-poppins">
                    <NotRatedYet />
                </span>
            )}

        </>
    )
}

export default SinglePropertyReviews