import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ReviewForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className="w-full rounded-lg shadow-none font-poppins">
      <h2 className="text-lg font-normal mb-4">Your Rating</h2>

      <div className="flex gap-1 mb-6">
        {Array.from({ length: 5 }).map((_, index) => (
          <button
            key={index}
            type="button"
            onMouseEnter={() => setHover(index + 1)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(index + 1)}
            className="focus:outline-none"
          >
            <Star
              size={24}
              className={cn(
                index < (hover || rating)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              )}
            />
          </button>
        ))}
      </div>

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Name
        </label>
        <input
          type="text"
          id="name"
          placeholder="Enter Your Name"
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-200"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          placeholder="Enter Your Email"
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-200"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="review" className="block text-sm font-medium mb-1">
          Your Review
        </label>
        <textarea
          id="review"
          rows={4}
          placeholder="Enter Your Review"
          className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring focus:ring-gray-200"
        />
      </div>

      <div>
        <button
          type="submit"
          className="w-2/5 bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-950 transition"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ReviewForm;
