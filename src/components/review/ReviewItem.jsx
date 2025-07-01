import ImageGallery from "./ImageGallery";
import RatingStars from "../RatingStars";

function ReviewItem({ review, isMyReview = false, onEdit, onDelete }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow p-5 space-y-3">
      <div className="flex justify-between items-center">
        <div className="font-medium text-gray-900">{review.memberNickname}</div>
        <div className="text-sm text-gray-500">
          {new Date(review.createDate).toLocaleDateString()}
        </div>
      </div>

      <RatingStars value={review.reviewScore} />

      <ImageGallery images={review.reviewPhotos} />

      <p className="text-gray-700">{review.reviewContent}</p>

      {isMyReview && (
        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={() => onEdit?.(review)}
            className="text-sm text-blue-600 hover:underline"
          >
            수정
          </button>
          <button
            onClick={() => onDelete?.(review.reviewNo)}
            className="text-sm text-red-500 hover:underline"
          >
            삭제
          </button>
        </div>
      )}
    </div>
  );
}

export default ReviewItem;
