import { Star } from "lucide-react";
import RatingImg from '@/public/single-page/rating.png'
import Image from "next/image";



const NotRatedYet = () => {
    return (
        <div className="flex flex-col justify-center items-center bg-white p-6">
            <div className="relative flex justify-center items-center w-[100px] h-[100px]">
                <Image
                    src={RatingImg}
                    alt="Not Rated Yet"
                    width={100}
                    height={100}
                    className="brightness-0 absolute opacity-40"
                />
                <Star className="absolute inset-0 m-auto w-10 h-10 text-primary" />
            </div>


            <p className="mt-2 font-semibold text-lg text-primary">Not Rated Yet</p>
            <p className="text-gray-500 text-sm">Be the first to leave a review!</p>
        </div>
    );
};

export default NotRatedYet;
