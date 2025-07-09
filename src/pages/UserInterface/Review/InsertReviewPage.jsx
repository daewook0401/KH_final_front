import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  forwardRef,
} from "react";
import useApi from "../../../hooks/useApi";
import InputScore from "../../../components/review/InputScore";
import ImageUploader from "../../../components/review/ImageUploader";
import InputReviewContent from "../../../components/review/InputReviewContent";
import BillVerification from "../../../components/review/BillVerification";
import { AuthContext } from "../../../provider/AuthContext";
import { useNavigate } from "react-router-dom";

const InsertReviewPage = forwardRef(function InsertReviewPage(
  {
    restaurantNo: propRestaurantNo,
    onSubmitSuccess,
    editReview = null,
    cancelEdit,
  },
  ref
) {
  const restaurantNo = propRestaurantNo || 1;

  const [score, setScore] = useState(0);
  const [content, setContent] = useState("");
  const [images, setImages] = useState([]);
  const [billImage, setBillImage] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [error, setError] = useState(null);

  const reviewTextareaRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    refetch: submitReviewApi,
    loading: submitLoading,
    error: submitError,
  } = useApi(
    "/api/reviews", // 수정: URL 고정
    {
      method: editReview ? "put" : "post",
    },
    false
  );

  useEffect(() => {
    if (editReview) {
      setScore(editReview.reviewScore);
      setContent(editReview.reviewContent ?? "");
      setImages([]);
      setBillImage(editReview.billPhotoUrl || null);
    } else {
      setScore(0);
      setContent("");
      setImages([]);
      setBillImage(null);
    }
  }, [editReview]);

  const requireLogin = (callback) => {
    if (!auth.isAuthenticated) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    callback();
  };

  const handleVerificationSuccess = (imageFileOrUrl) => {
    setBillImage(imageFileOrUrl);
    setShowBillModal(false);
  };

  const handleFinalSubmit = () => {
    if (!score) {
      alert("별점을 입력해주세요.");
      return;
    }

    if (!editReview && !billImage) {
      alert("영수증 인증이 필요합니다.");
      return;
    }

    setError(null);

    const formData = new FormData();

    // 수정: reviewNo 포함
    const reviewDTO = {
      reviewNo: editReview?.reviewNo || null,
      restaurantNo,
      reviewScore: score,
      reviewContent: content,
      billPass: "Y",
    };

    formData.append(
      "review",
      new Blob([JSON.stringify(reviewDTO)], { type: "application/json" })
    );

    images.forEach((image) => {
      if (image.type === "new") {
        formData.append("photos", image.file);
      }
    });

    if (billImage && typeof billImage !== "string") {
      formData.append("billPhoto", billImage);
    }

    submitReviewApi({ data: formData })
      .then(() => {
        alert(editReview ? "리뷰가 수정되었습니다!" : "리뷰가 등록되었습니다!");
        setScore(0);
        setContent("");
        setImages([]);
        setBillImage(null);
        cancelEdit?.();
        onSubmitSuccess?.();
      })
      .catch((err) => {
        console.error("리뷰 제출 오류:", err);
        setError("리뷰 작성 중 문제가 발생했습니다.");
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    requireLogin(handleFinalSubmit);
  };

  const handleCancelEdit = () => {
    setScore(0);
    setContent("");
    setImages([]);
    setBillImage(null);
    cancelEdit?.();
  };

  return (
    <div ref={ref} tabIndex={-1} className="flex overflow-x-hidden bg-gray-100">
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

          <div className="flex justify-end items-center space-x-3 mt-4">
            {billImage && !editReview && (
              <span className="text-green-600 text-2xl font-bold select-none">
                ✓
              </span>
            )}

            {!editReview ? (
              <button
                type="button"
                className="bg-blue-500 text-white py-2 px-4 rounded-2xl hover:bg-blue-600"
                onClick={() => {
                  requireLogin(() => setShowBillModal(true));
                }}
              >
                영수증 인증
              </button>
            ) : (
              <button
                type="button"
                className="w-32 text-gray-700 bg-white border border-gray-300 py-2 rounded-2xl hover:bg-gray-100"
                onClick={handleCancelEdit}
              >
                취소
              </button>
            )}

            <button
              type="submit"
              disabled={submitLoading}
              className="w-32 bg-orange-500 text-white py-2 rounded-2xl hover:bg-orange-600 disabled:opacity-50"
            >
              {submitLoading
                ? "처리 중..."
                : editReview
                ? "수정 완료"
                : "리뷰 등록"}
            </button>
          </div>

          {error && <p className="text-red-500">{error}</p>}
          {submitError && <p className="text-red-500">{submitError.message}</p>}
        </form>
      </div>

      <BillVerification
        isOpen={showBillModal}
        onClose={() => setShowBillModal(false)}
        onVerified={handleVerificationSuccess}
      />
    </div>
  );
});

export default InsertReviewPage;
