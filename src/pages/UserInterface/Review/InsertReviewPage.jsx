import { useState, useEffect, useRef, useContext } from "react";
import useApi from "../../../hooks/useApi";
import InputScore from "../../../components/review/InputScore";
import ImageUploader from "../../../components/review/ImageUploader";
import InputReviewContent from "../../../components/review/InputReviewContent";
import { AuthContext } from "../../../provider/AuthContext";
import { useNavigate } from "react-router-dom";

function InsertReviewPage({
  restaurantId,
  onSubmitSuccess,
  focusReviewTextarea,
  editReview = null,
  cancelEdit,
}) {
  const [score, setScore] = useState(0);
  const [content, setContent] = useState("");

  const [images, setImages] = useState([]);
  const reviewTextareaRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const memberNickname = sessionStorage.getItem("memberNickname");
  const accessToken = sessionStorage.getItem("accessToken");

  const {
    loading,
    error,
    refetch: submitReview,
  } = useApi(
    editReview ? `/api/reviews/${editReview.reviewNo}` : "/api/reviews",
    {
      method: editReview ? "put" : "post",
      auth: true,
      immediate: false,
    },
    false
  );

  useEffect(() => {
    if (editReview) {
      setScore(editReview.reviewScore);
      setContent(editReview.reviewContent);

      if (editReview.photos && editReview.photos.length > 0) {
        const existingImages = editReview.photos.map((photo) => ({
          type: "existing",
          url: photo.reviewPhotoUrl,
        }));
        setImages(existingImages);
      } else {
        setImages([]);
      }
    }
  }, [editReview]);

  useEffect(() => {
    if (focusReviewTextarea && reviewTextareaRef.current) {
      reviewTextareaRef.current.focus();
      window.scrollTo({
        top: reviewTextareaRef.current.offsetTop - 100,
        behavior: "smooth",
      });
    }
  }, [focusReviewTextarea]);

  const requireLogin = (callback) => {
    if (!auth.isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
    } else {
      callback();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    requireLogin(() => {
      const formData = new FormData();
      formData.append("restaurantNo", restaurantId);
      formData.append("reviewScore", score);
      formData.append("reviewContent", content);
      formData.append("memberNickname", memberNickname);

      images.forEach((image) => {
        if (image.type === "new") {
          formData.append("images", image.file);
        }
      });

      submitReview({
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      })
        .then(() => {
          alert(
            editReview ? "리뷰가 수정되었습니다!" : "리뷰가 등록되었습니다!"
          );
          setScore(0);
          setContent("");
          setImages([]);
          cancelEdit?.();
          onSubmitSuccess?.();
        })
        .catch((err) => {
          console.error("리뷰 제출 오류:", err.response?.data || err.message);
          alert("리뷰 작성 중 문제가 발생했습니다.");
        });
    });
  };

  return (
    <div className="flex overflow-x-hidden bg-gray-100">
      <div className="max-w-[850px] w-full p-6 space-y-6 bg-gray-200 rounded-lg">
        <h1 className="text-2xl font-bold">
          {editReview ? "리뷰 수정" : "리뷰 작성"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputScore value={score} onChange={setScore} />
          <ImageUploader images={images} setImages={setImages} />
          <InputReviewContent
            ref={reviewTextareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <div className="flex justify-start">
            {editReview && (
              <button
                type="button"
                className="w-32 text-gray-700 bg-white border border-gray-300 py-2 rounded-2xl hover:bg-gray-100"
                onClick={cancelEdit}
              >
                취소
              </button>
            )}
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="w-32 bg-orange-500 text-white py-2 rounded-2xl hover:bg-orange-600 disabled:opacity-50"
            >
              {loading ? "처리 중..." : editReview ? "수정 완료" : "리뷰 등록"}
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
