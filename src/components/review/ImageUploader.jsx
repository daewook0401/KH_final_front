import { useRef, useState } from "react";

const ImageUploader = ({ images, setImages }) => {
  const inputRef = useRef(null);
  const scrollRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...urls]);
  };

  const handleButtonClick = () => {
    inputRef.current.click();
  };

  const handleDelete = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const startDrag = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeft(scrollRef.current.scrollLeft);
  };

  const stopDrag = () => setIsDragging(false);

  const onDrag = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.2;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        onMouseDown={startDrag}
        onMouseLeave={stopDrag}
        onMouseUp={stopDrag}
        onMouseMove={onDrag}
        className="overflow-x-auto flex gap-2 pr-14 no-scrollbar rounded-xl shadow-md bg-white cursor-grab active:cursor-grabbing select-none"
      >
        {images.length === 0 && (
          <div className="text-gray-400 italic py-6 px-4 w-full text-center">
            업로드된 이미지가 없습니다.
          </div>
        )}

        {images.map((src, i) => (
          <div key={i} className="relative w-32 h-32 flex-shrink-0">
            <img
              src={src}
              draggable={false}
              alt={`uploaded-${i}`}
              className="w-full h-full object-fill rounded bg-gray-100"
            />
            <button
              type="button"
              onClick={() => handleDelete(i)}
              className="absolute top-1 right-1 bg-gray-200 bg-opacity-40 rounded-full w-5 h-5 flex items-center justify-center text-black text-sm leading-none hover:text-gray-800"
              aria-label="이미지 삭제"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        ref={inputRef}
        className="hidden"
      />

      <button
        type="button"
        onClick={handleButtonClick}
        className="absolute right-2 bottom-2 w-10 h-10 rounded-full bg-sky-300 hover:bg-sky-500 text-white shadow flex items-center justify-center transition"
        aria-label="이미지 업로드"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>
    </div>
  );
};

export default ImageUploader;
