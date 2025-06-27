import { useState, useEffect, useRef, useContext } from "react";
import useApi from "../../../hooks/useApi";
import InputScore from "../../../components/review/InputScore";
import ImageUploader from "../../../components/review/ImageUploader";
import InputReviewContent from "../../../components/review/InputReviewContent";
import AuthContext from "../../../provider/AuthContext";
import { useNavigate } from "react-router-dom";
function InsertReviewPage({
  restaurantId,
  onSubmitSuccess,
  focusReviewTextarea,
}) {
  const [score, setScore] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [memberNickname, setMemberNickname] = useState("");
  const [accessToken, setAccessToken] = useState("");

  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const reviewTextareaRef = useRef(null);

  useEffect(() => {
    setAccessToken(sessionStorage.getItem("accessToken"));
    setMemberNickname(sessionStorage.getItem("memberNickname"));
  }, []);

  useEffect(() => {
    if (focusReviewTextarea && reviewTextareaRef.current) {
      reviewTextareaRef.current.focus();
    }
  }, [focusReviewTextarea]);

  const {
    loading,
    error,
    refetch: postReview,
  } = useApi(
    "/api/reviews",
    { method: "post", auth: true, immediate: false },
    false
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!auth.isAuthenticated) {
      alert("로그인 후 리뷰 등록이 가능합니다.");
      navigate("/login");
      return;
    }
    const formData = new FormData();
    formData.append("restaurantNo", restaurantId);
    formData.append("reviewScore", score);
    formData.append("reviewContent", content);
    formData.append("memberNickname", memberNickname);
    images.forEach((img) => formData.append("images", img));

    postReview({
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(() => {
        alert("리뷰가 등록되었습니다!");
        setScore(0);
        setContent("");
        setImages([]);
        onSubmitSuccess?.();
      })
      .catch(() => {
        alert("리뷰 작성 중 오류가 발생했습니다.");
      });
  };

  return (
    <div className="flex bg-gray-100">
      <div className="max-w-5xl w-full p-6 space-y-6 bg-gray-200 rounded-lg">
        <h1 className="text-2xl font-bold">리뷰 작성</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputScore value={score} onChange={setScore} />
          <ImageUploader images={images} setImages={setImages} />
          <InputReviewContent
            ref={reviewTextareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-32 bg-blue-600 text-white py-2 rounded-2xl hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "등록 중..." : "리뷰 등록"}
            </button>
          </div>
          {error && (
            <p className="text-red-500">
              오류가 발생했습니다. 다시 시도해주세요.
            </p>
          )}
        </form>
      </div>
    </div>
  );
}

export default InsertReviewPage;
