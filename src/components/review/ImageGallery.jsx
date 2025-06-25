import { useState } from "react";
import ImageModal from "./ImageModal";

function ImageGallery({ images = [] }) {
  const [expanded, setExpanded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(null);

  const toShow = expanded ? images : images.slice(0, 4);
  const remaining = images.length - 4;

  const openModal = (idx) => setCurrentIndex(idx);
  const closeModal = () => setCurrentIndex(null);
  const handlePrev = () =>
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  const handleNext = () =>
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : prev));

  const isFlexLayout = toShow.length <= 2;

  return (
    <>
      <div className="max-w-4xl mx-auto">
        <div
          className={
            isFlexLayout
              ? "flex justify-center gap-4 flex-wrap"
              : `grid gap-2 ${
                  toShow.length === 3 ? "grid-cols-3" : "grid-cols-4"
                }`
          }
        >
          {toShow.map((src, idx) => {
            const isOverlaySlot = !expanded && idx === 3 && images.length > 4;

            return (
              <div
                key={idx}
                className={`relative overflow-hidden rounded-lg aspect-square cursor-pointer ${
                  isFlexLayout
                    ? toShow.length === 1
                      ? "w-[360px]"
                      : "w-[300px]"
                    : "w-full"
                }`}
                onClick={() =>
                  !isOverlaySlot && openModal(expanded ? idx : idx)
                }
              >
                <img
                  src={src}
                  alt={`img-${idx}`}
                  className={`object-cover w-full h-full transition-transform duration-200 ${
                    isOverlaySlot ? "blur-sm brightness-50" : "hover:scale-105"
                  }`}
                />
                {isOverlaySlot && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpanded(true);
                    }}
                    className="absolute inset-0 flex items-center justify-center text-white text-2xl font-semibold"
                  >
                    +{remaining}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <ImageModal
        images={images}
        currentIndex={currentIndex}
        onClose={closeModal}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </>
  );
}

export default ImageGallery;
