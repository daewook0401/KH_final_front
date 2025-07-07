import { useState, useMemo, useContext, useEffect } from "react";
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
  const [sortKey, setSortKey] = useState("ratingDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`/restaurants/${restaurantNo}/reviews?page=${currentPage}`)
      .then((res) => {
        console.log("리뷰 받아옴:", res.data);
        setReviews(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error("리뷰 요청 실패:", err);
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
      .delete(`/restaurants/${restaurantNo}/reviews/${reviewNo}`, {
        headers: {
          Authorization: `Bearer ${auth.tokens.accessToken}`,
        },
      })
      .then(() => {
        alert("리뷰가 삭제되었습니다.");
        return axios.get(
          `/restaurants/${restaurantNo}/reviews?page=${currentPage}`
        );
      })
      .then((res) => {
        setReviews(Array.isArray(res.data) ? res.data : []);
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

    const el = document.getElementById("review-page-top");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      id="review-page-top"
      className="w-full max-w-[900px] mx-auto bg-gray-50 min-h-screen font-sans space-y-6"
    >
      <MyReview
        reviews={myReviews}
        onWriteReview={handleWriteReview}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />

      <InsertReviewPage
        id="insert-review"
        restaurantNo={restaurantNo}
        onSubmitSuccess={() => {
          axios
            .get(`/restaurants/${restaurantNo}/reviews?page=${currentPage}`)
            .then((res) => {
              setReviews(Array.isArray(res.data) ? res.data : []);
              setCurrentPage(1);
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
