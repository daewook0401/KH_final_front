import { useState, useEffect, useMemo } from "react";

const options = [
  { value: "ratingDesc", label: "별점 높은순" },
  { value: "ratingAsc", label: "별점 낮은순" },
  { value: "dateDesc", label: "최신순" },
  { value: "dateAsc", label: "오래된순" },
];

function SortSelector({ reviews, onSorted }) {
  const [sortKey, setSortKey] = useState("ratingDesc");

  const sortedReviews = useMemo(() => {
    if (!reviews) return [];
    const sorted = [...reviews];
    switch (sortKey) {
      case "ratingAsc":
        return sorted.sort((a, b) => a.reviewScore - b.reviewScore);
      case "ratingDesc":
        return sorted.sort((a, b) => b.reviewScore - a.reviewScore);
      case "dateDesc":
        return sorted.sort(
          (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
        );
      case "dateAsc":
        return sorted.sort(
          (a, b) => new Date(a.createdDate) - new Date(b.createdDate)
        );
      default:
        return sorted;
    }
  }, [reviews, sortKey]);

  useEffect(() => {
    if (onSorted) {
      onSorted(sortedReviews);
    }
  }, [sortedReviews, onSorted]);

  return (
    <div className="flex gap-2 mb-4">
      {options.map(({ value, label }) => {
        const isActive = sortKey === value;
        return (
          <button
            key={value}
            type="button"
            className={`px-4 py-2 rounded-full border ${
              isActive
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            } transition-colors`}
            onClick={() => setSortKey(value)}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default SortSelector;
