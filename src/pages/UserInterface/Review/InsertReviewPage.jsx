import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputScore from "../../../components/review/InputScore";
import ReviewTextarea from "../../../components/review/InputReviewContent";
import ImageUploader from "../../../components/review/ImageUploader";

function InsertReviewPage({ restaurantNo }) {
  const navigate = useNavigate();

  const [score, setScore] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [memberNickname, setMemberNickname] = useState("");
  const [accessToken, setAccessToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken");
    const storedNickname = localStorage.getItem("memberNickname");

    setAccessToken(storedToken);
    setMemberNickname(storedNickname);
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("restaurantNo", restaurantNo);
    formData.append("reviewScore", score);
    formData.append("reviewContent", content);
    formData.append("memberNickname", memberNickname);
    images.forEach((img, idx) => {
      formData.append("images", img);
    });

    axios
      .post("/api/reviews", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("리뷰가 등록되었습니다!");
        navigate(`/reviews/restaurantNo=${restaurantNo}`);
      })
      .catch((err) => {
        console.error(err);
        alert("리뷰 작성 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="max-w-3xl w-full p-6 space-y-6 bg-gray-200 rounded-lg">
        <h1 className="text-2xl font-bold">리뷰 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputScore value={score} onChange={setScore} />
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

export default InsertReviewPage;
