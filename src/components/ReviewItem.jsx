import ImageGallery from "./ImageGallery";
import RatingStars from "./RatingStars";
function ReviewItem({ review }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-3">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-lg">{review.name}</div>
        <div className="text-sm text-gray-500">{review.date}</div>
      </div>

      <RatingStars value={review.rating} />

      <ImageGallery images={review.images} />

      <p className="text-gray-700">{review.content}</p>
    </div>
  );
}

export default ReviewItem;
