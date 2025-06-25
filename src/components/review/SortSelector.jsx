const options = [
  { value: "ratingDesc", label: "별점 높은순" },
  { value: "ratingAsc", label: "별점 낮은순" },
  { value: "dateDesc", label: "최신순" },
  { value: "dateAsc", label: "오래된순" },
];

function SortSelector({ sortKey, onChange }) {
  return (
    <div className="flex gap-2 mb-4">
      {options.map(({ value, label }) => {
        const isActive = sortKey === value;
        return (
          <button
            key={value}
            className={`px-4 py-2 rounded-full border ${
              isActive
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
            } transition-colors`}
            onClick={() => onChange(value)}
            type="button"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}

export default SortSelector;
