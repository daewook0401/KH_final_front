import ReviewItem from "./ReviewItem";
import ReviewDrive from "./ReviewDrive";

function MyReview({ reviews, onWriteReview, onEditReview, onDeleteReview }) {
  if (reviews.length === 0) {
    return <ReviewDrive onWriteReview={onWriteReview} />;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-xl font-semibold">내 리뷰</h2>
      {reviews.map((review) => (
        <ReviewItem
          key={review.reviewNo}
          review={review}
          isMyReview
          onEdit={onEditReview}
          onDelete={onDeleteReview}
        />
      ))}
    </div>
  );
}

export default MyReview;
