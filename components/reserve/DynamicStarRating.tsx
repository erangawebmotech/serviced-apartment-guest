import React from "react";
import { FaStar, FaRegStar } from "react-icons/fa";
import { StarRatingProps } from "@/common/interfaces";

interface DynamicStarRatingProps extends Omit<StarRatingProps, "rating"> {
    rating: number;
    onRatingChange?: (rating: number) => void;
}

const DynamicStarRating: React.FC<DynamicStarRatingProps> = ({
    rating,
    maxStars = 5,
    className = "",
    size = 20,
    onRatingChange
}) => {
    const handleRating = (index: number) => {
        if (onRatingChange) onRatingChange(index);
    };

    return (
        <div className={`flex space-x-1 ${className}`}>
            {Array.from({ length: maxStars }, (_, i) => {
                const index = i + 1;
                return index <= rating ? (
                    <FaStar
                        key={index}
                        className={`cursor-pointer ${!className ? "text-[#F2994A]" : ""}`}
                        size={size}
                        onClick={() => handleRating(index)}
                    />
                ) : (
                    <FaRegStar
                        key={index}
                        className={`cursor-pointer ${!className ? "text-[#F2994A]" : ""}`}
                        size={size}
                        onClick={() => handleRating(index)}
                    />
                );
            })}
        </div>
    );
};

export default DynamicStarRating;
