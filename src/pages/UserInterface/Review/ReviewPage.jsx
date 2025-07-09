import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../provider/AuthContext";
import ReviewItem from "../../../components/review/ReviewItem";
import SortSelector from "../../../components/review/SortSelector";
import Pagination from "../../../components/Pagination/Pagination";
import MyReview from "../../../components/review/MyReview";
import InsertReviewPage from "./InsertReviewPage";
import useApi from "../../../hooks/useApi";

function ReviewPage({ restaurantNo }) {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const user = auth.loginInfo;
  const isAdmin = user?.roles?.includes("ROLE_ADMIN");

  const itemsPerPage = 3;
  const myItemsPerPage = 1;

  const [currentPage, setCurrentPage] = useState(1);
  const [myReviewPage, setMyReviewPage] = useState(1);
  const [editReview, setEditReview] = useState(null);
  const [sortedReviews, setSortedReviews] = useState([]);

  const { body, error, loading, refetch } = useApi(
    `/api/restaurants/${restaurantNo}/reviews`
  );

  const { refetch: deleteReview } = useApi(
    `/api/restaurants/${restaurantNo}/reviews`,
    { method: "delete" },
    false
  );

  const reviews = useMemo(() => {
    return Array.isArray(body?.items?.reviews) ? body.items.reviews : [];
  }, [body]);

  const myReviews = useMemo(() => {
    return reviews.filter((r) => user && r.memberNo === user.memberNo);
  }, [reviews, user]);

  const myPagedReviews = useMemo(() => {
    const start = (myReviewPage - 1) * myItemsPerPage;
    return myReviews.slice(start, start + myItemsPerPage);
  }, [myReviews, myReviewPage]);

  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedReviews.slice(start, start + itemsPerPage);
  }, [sortedReviews, currentPage]);

  useEffect(() => {
    setSortedReviews(reviews);
  }, [reviews]);

  const scrollToInsertReview = () => {
    const el = document.getElementById("insert-review");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleEditReview = (review) => {
    if (!auth.isAuthenticated) {
      alert("로그인 후 수정이 가능합니다.");
      navigate("/login");
      return;
    }
    setEditReview(review);
    scrollToInsertReview();
  };

  const cancelEdit = () => {
    setEditReview(null);
  };

  const handleDeleteReview = (reviewNo) => {
    if (!auth.isAuthenticated) {
      alert("로그인 후 삭제가 가능합니다.");
      navigate("/login");
      return;
    }

    const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
    if (!confirmDelete) return;

    deleteReview({
      url: `/api/restaurants/${restaurantNo}/reviews/${reviewNo}`,
    })
      .then(() => {
        alert("리뷰가 삭제되었습니다.");
        setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
        setMyReviewPage(1);
        refetch();
      })
      .catch(() => {
        alert("리뷰 삭제 실패");
      });
  };

  const handleWriteReview = () => {
    if (!auth.isAuthenticated) {
      alert("로그인 후 리뷰 작성이 가능합니다.");
      navigate("/login");
      return;
    }
    scrollToInsertReview();
    setEditReview(null);
  };

  return (
    <div
      id="review-page-top"
      className="w-full max-w-[900px] mx-auto bg-gray-50 min-h-screen font-sans space-y-6"
    >
      <MyReview
        reviews={myPagedReviews}
        onWriteReview={handleWriteReview}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />

      {myReviews.length > myItemsPerPage && (
        <Pagination
          currentPage={myReviewPage}
          setCurrentPage={setMyReviewPage}
          pageInfo={{
            boardNoPerPage: myItemsPerPage,
            totalBoardNo: myReviews.length,
            pageSize: 5,
          }}
        />
      )}

      <InsertReviewPage
        id="insert-review"
        restaurantNo={restaurantNo}
        editReview={editReview}
        cancelEdit={cancelEdit}
        onSubmitSuccess={() => {
          setEditReview(null);
          setCurrentPage(1);
          setMyReviewPage(1);
          refetch();
        }}
      />

      {loading ? (
        <div className="text-center text-gray-500">불러오는 중...</div>
      ) : reviews.length === 0 ? (
        <div className="text-center bg-gray-200 rounded text-gray-500 py-10">
          등록된 리뷰가 없습니다.
        </div>
      ) : error ? (
        <div className="text-center bg-gray-200 rounded text-red-500 py-10">
          리뷰를 불러오지 못했습니다.
        </div>
      ) : (
        <>
          <SortSelector
            reviews={reviews}
            onSorted={(sorted) => {
              setSortedReviews(sorted);
              setCurrentPage(1);
            }}
          />

          {pagedReviews.map((review) => (
            <ReviewItem
              key={review.reviewNo}
              review={review}
              isMyReview={
                user && (review.memberNo === user.memberNo || isAdmin)
              }
              onEdit={handleEditReview}
              onDelete={handleDeleteReview}
            />
          ))}

          {reviews.length > itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pageInfo={{
                boardNoPerPage: itemsPerPage,
                totalBoardNo: reviews.length,
                pageSize: 5,
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

export default ReviewPage;
