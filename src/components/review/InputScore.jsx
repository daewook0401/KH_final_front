import RatingStars from "../RatingStars";
import { useState, useRef } from "react";
import ScoreSelect from "./SelectScore";

const InputScore = ({ value, onChange }) => {
  const [hover, setHover] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  const calculateRating = (clientX) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const relative = Math.max(0, Math.min(1, x / rect.width));
    const rawRating = Math.round(relative * 10) / 2;
    return rawRating < 0.5 ? 0.5 : rawRating;
  };

  const handleMouseMove = (e) => {
    const rating = calculateRating(e.clientX);
    if (isDragging) {
      onChange(rating);
    } else {
      setHover(rating);
    }
  };

  const handleMouseLeave = () => {
    setHover(null);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };

  const handleClick = (e) => {
    const rating = calculateRating(e.clientX);
    onChange(rating);
    setHover(null);
  };

  const handleSelectChange = (e) => {
    onChange(parseFloat(e.target.value));
  };

  return (
    <div>
      <div className="flex items-center gap-4">
        <div
          ref={containerRef}
          className="relative w-[130px] h-6 cursor-pointer"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
        >
          <RatingStars value={hover !== null ? hover : value} max={5} />
        </div>

        <ScoreSelect value={value} onChange={onChange} />
      </div>
    </div>
  );
};

export default InputScore;
