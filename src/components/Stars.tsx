import { TiStarFullOutline, TiStarOutline } from "react-icons/ti";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useState } from "react";

interface StarsProps {
  stars: number;
  onChange: (stars: number) => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export function Stars({
  stars,
  onChange,
  disabled = false,
  isLoading = false,
}: StarsProps) {
  const [hoveredStars, setHoveredStars] = useState(0);

  function handleStarClick(index: number) {
    if (!disabled) {
      onChange(index + 1);
    }
  }

  function handleMouseEnter(index: number) {
    if (!disabled) {
      setHoveredStars(index + 1);
    }
  }

  function handleMouseLeave() {
    if (!disabled) {
      setHoveredStars(0);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {isLoading && (
        <AiOutlineLoading3Quarters className="animate-spin text-gray-400 text-xl" />
      )}
      <div
        className="flex items-center gap-1 text-2xl"
        onMouseLeave={handleMouseLeave}
        aria-label="Star rating"
      >
        {Array.from({ length: 5 }, (_, index) => {
          const isFilled =
            (hoveredStars > 0 && index < hoveredStars) ||
            (hoveredStars === 0 && index < stars);

          const StarIcon = isFilled ? TiStarFullOutline : TiStarOutline;

          return (
            <StarIcon
              key={index}
              onClick={() => handleStarClick(index)}
              onMouseEnter={() => handleMouseEnter(index)}
              aria-hidden="true"
              className={
                disabled
                  ? "text-gray-400 cursor-not-allowed"
                  : isFilled
                  ? "text-yellow-400 cursor-pointer"
                  : "text-gray-400 cursor-pointer"
              }
            />
          );
        })}
      </div>
    </div>
  );
}

export default Stars;
