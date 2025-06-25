import { useRef } from "react";

const MAX_LENGTH = 200;

const InputReviewContent = ({ value, onChange }) => {
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    if (e.target.value.length <= MAX_LENGTH) {
      onChange(e);
    }
  };

  return (
    <div className="relative w-full">
      <textarea
        ref={textareaRef}
        className="w-full rounded-lg p-2 resize-none shadow-md bg-white"
        placeholder="리뷰 내용을 입력하세요"
        rows={5}
        value={value}
        onChange={handleChange}
        style={{ border: "none" }}
      />
      <div
        className="absolute bottom-2 right-3 text-sm text-gray-400 pointer-events-none select-none"
        style={{ userSelect: "none" }}
      >
        {value.length} / {MAX_LENGTH}
      </div>
    </div>
  );
};

export default InputReviewContent;
