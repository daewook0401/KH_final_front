import { useState } from "react";
import RatingStars from "../RatingStars";

const SelectScore = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [...Array(10)].map((_, i) => (i + 1) * 0.5);

  return (
    <div className="relative inline-block text-left bg-white">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="border px-2 py-1 rounded flex items-center gap-2 text-sm"
      >
        <RatingStars value={value} max={5} />
        <span>{value}점</span>
        <span
          className={`inline-block w-3 h-3 border-l-2 border-b-2 border-gray-700 transform transition-transform ${
            isOpen ? "rotate-45" : "-rotate-45"
          }`}
          style={{ marginLeft: 4 }}
        />
      </button>

      {isOpen && (
        <ul className="absolute z-10 mt-1 w-48 bg-white border rounded shadow whitespace-nowrap">
          {options.map((opt) => (
            <li
              key={opt}
              onClick={(e) => {
                e.preventDefault();
                onChange(opt);
                setIsOpen(false);
              }}
              className="px-2 py-1 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
            >
              <RatingStars value={opt} max={5} />
              <span className="text-sm">{opt}점</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectScore;
