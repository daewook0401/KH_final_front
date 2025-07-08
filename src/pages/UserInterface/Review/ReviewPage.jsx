import { useState, useEffect, useMemo, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../provider/AuthContext";
import ReviewItem from "../../../components/review/ReviewItem";
import SortSelector from "../../../components/review/SortSelector";
import Pagination from "../../../components/Pagination/Pagination";
import MyReview from "../../../components/review/MyReview";
import InsertReviewPage from "./InsertReviewPage";

function ReviewPage({ restaurantNo }) {
  const navigate = useNavigate();
  const { auth } = useContext(AuthContext);
  const user = auth.loginInfo;
  const roles = user?.roles || [];
  const isAdmin = roles.includes("ROLE_ADMIN");

  const itemsPerPage = 3;
  const myItemsPerPage = 1;

  const [reviews, setReviews] = useState([]);
  const [sortedReviews, setSortedReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [myReviewPage, setMyReviewPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editReview, setEditReview] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`/api/restaurants/${restaurantNo}/reviews?page=${currentPage}`)
      .then((res) => {
        console.log("리뷰 API 응답 데이터:", res.data);
        const reviewData = res.data?.body?.items?.reviews;
        setReviews(Array.isArray(reviewData) ? reviewData : []);
      })
      .catch((err) => {
        console.error("리뷰를 불러오는 중 오류가 발생했습니다.", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [restaurantNo, currentPage]);

  const safeReviews = Array.isArray(reviews) ? reviews : [];

  const myReviews = safeReviews.filter(
    (r) => user && r.memberNo === user.memberNo
  );

  const myPagedReviews = useMemo(() => {
    const start = (myReviewPage - 1) * myItemsPerPage;
    return myReviews.slice(start, start + myItemsPerPage);
  }, [myReviews, myReviewPage]);

  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedReviews.slice(start, start + itemsPerPage);
  }, [sortedReviews, currentPage]);

  const totalItems = safeReviews.length;
  const pageInfo = {
    boardNoPerPage: itemsPerPage,
    totalBoardNo: totalItems,
    pageSize: 5,
  };

  const handleEditReview = (review) => {
    if (!auth.isAuthenticated) {
      alert("로그인 후 수정이 가능합니다.");
      navigate("/login");
      return;
    }
    setEditReview(review);
    const el = document.getElementById("insert-review");
    if (el) el.scrollIntoView({ behavior: "smooth" });
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

    axios
      .delete(`/api/restaurants/${restaurantNo}/reviews/${reviewNo}`, {
        headers: {
          Authorization: `Bearer ${auth.tokens.accessToken}`,
        },
      })
      .then(() => {
        alert("리뷰가 삭제되었습니다.");
        const nextPage = currentPage > 1 ? currentPage - 1 : 1;

        return axios
          .get(
            `/api/restaurants/${restaurantNo}/reviews?page=${nextPage}&_=${Date.now()}`
          )
          .then((res) => {
            const reviewData = res.data?.body?.items?.reviews;
            setReviews(Array.isArray(reviewData) ? reviewData : []);
            setCurrentPage(nextPage);
            setMyReviewPage(1);
          });
      })
      .catch((error) => {
        console.error("리뷰 삭제 오류:", error);
        alert("리뷰 삭제 실패");
      });
  };

  const handleWriteReview = () => {
    if (!auth.isAuthenticated) {
      alert("로그인 후 리뷰 작성이 가능합니다.");
      navigate("/login");
      return;
    }

    const el = document.getElementById("insert-review");
    if (el) el.scrollIntoView({ behavior: "smooth" });

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
          axios
            .get(`/api/restaurants/${restaurantNo}/reviews?page=${currentPage}`)
            .then((res) => {
              const reviewData = res.data?.body?.items?.reviews;
              setReviews(Array.isArray(reviewData) ? reviewData : []);
              setCurrentPage(1);
              setMyReviewPage(1);
            })
            .catch((err) => {
              console.error("리뷰 새로고침 실패:", err);
            });
        }}
      />

      {loading ? (
        <div className="text-center text-gray-500">불러오는 중...</div>
      ) : totalItems === 0 ? (
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
