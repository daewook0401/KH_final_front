import { useState } from "react";
import RatingInput from "../../components/InputScore";
import ReviewTextarea from "../../components/InputReviewContent";
import ImageUploader from "../../components/ImageUploader";

function ReviewInsertPage() {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const userName = "홍길동";

  const handleSubmit = (e) => {
    e.preventDefault();
    const review = {
      name: userName,
      rating,
      content,
      images,
      date: new Date().toISOString().split("T")[0],
    };
    console.log("작성된 리뷰:", review);
    alert("리뷰가 등록되었습니다!");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-3xl w-full p-6 space-y-6 bg-gray-200 rounded-lg">
        <h1 className="text-2xl font-bold">리뷰 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <RatingInput value={rating} onChange={setRating} />
          <ImageUploader images={images} setImages={setImages} />
          <ReviewTextarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              className="w-32 bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700"
            >
              리뷰 등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReviewInsertPage;
