import { useState, useMemo, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../provider/AuthContext";
import ReviewItem from "../../../components/review/ReviewItem";
import SortSelector from "../../../components/review/SortSelector";
import Pagination from "../../../components/Pagination/Pagination";
import MyReview from "../../../components/review/MyReview";
import useApi from "../../../hooks/useApi";
import InsertReviewPage from "./InsertReviewPage";

function ReviewPage({ restaurantNo }) {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const user = auth.loginInfo;

  const itemsPerPage = 3;
  const [sortKey, setSortKey] = useState("ratingDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const [focusReviewTextarea, setFocusReviewTextarea] = useState(false);

  const {
    body: reviews = [],
    loading,
    error,
    refetch,
  } = useApi(`/api/reviews?restaurantNo=${restaurantNo}`, {}, !!restaurantNo);

  const safeReviews = Array.isArray(reviews) ? reviews : [];
  const myReviews = safeReviews.filter(
    (r) => user && r.memberNo === user.memberNo
  );
  const otherReviews = safeReviews.filter(
    (r) => !user || r.memberNo !== user.memberNo
  );

  const sortedReviews = useMemo(() => {
    switch (sortKey) {
      case "ratingAsc":
        return [...otherReviews].sort((a, b) => a.reviewScore - b.reviewScore);
      case "ratingDesc":
        return [...otherReviews].sort((a, b) => b.reviewScore - a.reviewScore);
      default:
        return otherReviews;
    }
  }, [otherReviews, sortKey]);

  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedReviews.slice(start, start + itemsPerPage);
  }, [sortedReviews, currentPage]);

  const totalItems = otherReviews.length;

  const pageInfo = {
    boardNoPerPage: itemsPerPage,
    totalBoardNo: totalItems,
    pageSize: 5,
  };

  const handleEditReview = (review) => {
    if (!auth.isAuthenticated) {
      alert("로그인 후 수정이 가능합니다.");
      navigate("/login");
    } else {
      navigate(`/reviews/reviewId=${review.reviewNo}`);
    }
  };

  const handleDeleteReview = (reviewNo) => {
    if (!auth.isAuthenticated) {
      alert("로그인 후 삭제가 가능합니다.");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    axios
      .delete(`/api/reviews/${reviewNo}`, {
        headers: {
          Authorization: `Bearer ${auth.tokens.accessToken}`,
        },
      })
      .then(() => {
        alert("리뷰가 삭제되었습니다.");
        refetch();
      })
      .catch((error) => {
        alert("리뷰 삭제 실패");
        console.error("리뷰 삭제 오류:", error);
      });
  };

  const handleWriteReview = () => {
    if (!auth.isAuthenticated) {
      alert("로그인 후 리뷰 작성이 가능합니다.");
      navigate("/login");
      return;
    }
    setFocusReviewTextarea(true);
  };

  useEffect(() => {
    if (focusReviewTextarea) {
      setFocusReviewTextarea(false);
    }
  }, [focusReviewTextarea]);

  return (
    <div className="w-full max-w-[900px] mx-auto bg-gray-50 min-h-screen font-sans space-y-6">
      <MyReview
        reviews={myReviews}
        onWriteReview={handleWriteReview}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />

      <InsertReviewPage
        restaurantId={restaurantNo}
        onSubmitSuccess={() => {
          refetch();
          setCurrentPage(1);
        }}
        focusReviewTextarea={focusReviewTextarea}
      />

      {totalItems === 0 ? (
        <div className="text-center bg-gray-200 rounded text-gray-500 py-10">
          등록된 리뷰가 없습니다.
        </div>
      ) : (
        <>
          <SortSelector
            sortKey={sortKey}
            onChange={(key) => {
              setSortKey(key);
              setCurrentPage(1);
            }}
          />

          {pagedReviews.map((review) => (
            <ReviewItem
              key={review.reviewNo}
              review={review}
              onEdit={() => handleEditReview(review)}
              onDelete={() => handleDeleteReview(review.reviewNo)}
            />
          ))}

          {totalItems > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageInfo={pageInfo}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ReviewPage;
