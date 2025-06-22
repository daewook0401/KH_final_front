import { useState, useMemo } from "react";
import ReviewItem from "../../components/ReviewItem";
import SortSelector from "../../components/SortSelector";
import img1 from "../../assets/images/장어.jpg";

const dummyReviews = [
  {
    id: 1,
    name: "김철수",
    rating: 5,
    date: "2025-06-20",
    images: [img1, img1, img1, img1, img1],
    content: "아주 만족스럽습니다. 추천해요!",
  },
  {
    id: 2,
    name: "이영희",
    rating: 3,
    date: "2025-06-21",
    images: [img1, img1],
    content: "보통이에요. 나쁘진 않지만 아쉽네요.",
  },
  {
    id: 3,
    name: "박지성",
    rating: 4.5,
    date: "2025-06-22",
    images: [img1],
    content: "거의 완벽하지만 조금 아쉬운 점도 있어요.",
  },
];

function ReviewPage() {
  const [sortKey, setSortKey] = useState("ratingDesc");

  const sortedReviews = useMemo(() => {
    const sorted = [...dummyReviews];
    switch (sortKey) {
      case "ratingDesc":
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case "ratingAsc":
        sorted.sort((a, b) => a.rating - b.rating);
        break;
      case "dateDesc":
        sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "dateAsc":
        sorted.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      default:
        break;
    }
    return sorted;
  }, [sortKey]);

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-1">
      <SortSelector sortKey={sortKey} onChange={setSortKey} />

      {sortedReviews.map((review) => (
        <ReviewItem key={review.id} review={review} />
      ))}
    </div>
  );
}

export default ReviewPage;
