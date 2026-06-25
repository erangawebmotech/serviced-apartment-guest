import { StarRatingProps } from '@/common/interfaces';
import React from 'react';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarRating: React.FC<StarRatingProps> = ({ rating, maxStars = 5, className = '', size }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxStars; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(<FaStar key={i} className={`${!className ? 'text-[#F2994A]' : ''}`} size={size ? size : ''} />);
      } else if (i - rating < 1) {
        stars.push(<FaStarHalfAlt key={i} className={`${!className ? 'text-[#F2994A]' : ''}`} size={size ? size : ''} />);
      } else {
        stars.push(<FaRegStar key={i} className={`${!className ? 'text-[#F2994A]' : ''}`} size={size ? size : ''} />);
      }
    }
    return stars;
  };

  return <div className={`flex space-x-1 ${className}`}>{renderStars()}</div>;
};

export default StarRating;
