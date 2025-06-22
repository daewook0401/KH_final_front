import React from "react";

function ImageModal({ images, currentIndex, onClose, onPrev, onNext }) {
  if (currentIndex === null || !images || images.length === 0) return null;

  const isFirst = currentIndex === 0;
  const isLast = currentIndex === images.length - 1;

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="relative max-w-4xl w-full px-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 좌우 텍스트 화살표 */}
        {!isFirst && (
          <button
            onClick={onPrev}
            className="fixed left-0 top-1/2 -translate-y-1/2 text-white text-4xl px-6 py-2 hover:text-gray-300  bg-opacity-30"
          >
            &lt;
          </button>
        )}

        <img
          src={images[currentIndex]}
          alt={`img-${currentIndex}`}
          className="rounded-xl w-full max-h-[80vh] object-contain"
        />

        {!isLast && (
          <button
            onClick={onNext}
            className="fixed right-0 top-1/2 -translate-y-1/2 text-white text-4xl px-6 py-2 hover:text-gray-300 bg-opacity-30"
          >
            &gt;
          </button>
        )}
      </div>
    </div>
  );
}

export default ImageModal;
