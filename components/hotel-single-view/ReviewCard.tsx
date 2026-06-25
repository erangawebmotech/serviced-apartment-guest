import Image, { StaticImageData } from "next/image";
import StarRating from "./StartsRating";
import { useState } from "react";


type ReviewCardProps = {
    name: string;
    date: any;
    review: string;
    rating: number;
    avatar: StaticImageData;
};

const ReviewCard = ({ name, date, review, rating, avatar }: ReviewCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };
    return (
        <div className="flex flex-col gap-4 shadow-sm p-6 border max-[500px]:border-2 rounded-lg">
            <div className="flex justify-start items-start gap-4">

                <Image
                    src={avatar}
                    alt="Avatar"
                    width={45}
                    height={45}
                    className="rounded-full"
                />

                <div className="flex flex-col">
                    <h3 className="font-semibold text-sm">{name}</h3>

                    <div className="flex">
                        <StarRating rating={rating} />
                    </div>


                </div>
            </div>

            <div className="flex flex-col gap-1">
                <p className="hidden font-medium text-sm">
                    We are so happy with the hotel location and the hospitality.
                </p>
                <p className="text-gray-500 text-sm">
                    {isExpanded || review.length <= 255
                        ? review
                        : `${review.slice(0, 255)}...`}
                    {review.length > 255 && (
                        <button
                            onClick={toggleExpand}
                            className="ml-2 text-secondary hover:underline"
                        >
                            {isExpanded ? "see less" : "see more"}
                        </button>
                    )}
                </p>
            </div>


            <p className="mt-auto text-gray-400 text-xs">Posted on <span className="text-black">{date}</span></p>
        </div>
    );
};

export default ReviewCard;
