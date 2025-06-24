import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext";

import ReviewItem from "../../components/ReviewItem";
import SortSelector from "../../components/SortSelector";
import Pagination from "../../common/Pagination/Pagination";
import MyReview from "../../components/MyReview";

function ReviewPage({ restaurantNo }) {
  const navigate = useNavigate();
  const { user } = useUser();

  const [reviews, setReviews] = useState([]);
  const [sortKey, setSortKey] = useState("ratingDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    if (!restaurantNo) return;

    axios
      .get("/api/reviews", { params: { restaurantNo } })
      .then((response) => {
        setReviews(response.data);
      })
      .catch((error) => {
        console.error("리뷰 로딩 실패", error);
      });
  }, [restaurantNo]);

  const sortedReviews = useMemo(() => {
    const sorted = [...reviews];
    const sortMethods = {
      ratingDesc: (a, b) => b.reviewScore - a.reviewScore,
      ratingAsc: (a, b) => a.reviewScore - b.reviewScore,
      dateDesc: (a, b) => new Date(b.createDate) - new Date(a.createDate),
      dateAsc: (a, b) => new Date(a.createDate) - new Date(b.createDate),
    };
    return sorted.sort(sortMethods[sortKey] || (() => 0));
  }, [reviews, sortKey]);

  const myReviews = user
    ? sortedReviews.filter((r) => r.memberNo === user.memberNo)
    : [];

  const otherReviews = sortedReviews.filter(
    (r) => !user || r.memberNo !== user.memberNo
  );

  const validOtherReviews = otherReviews.filter(
    (r) => r && r.reviewNo !== undefined
  );

  const totalItems = validOtherReviews.length;

  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return validOtherReviews.slice(start, start + itemsPerPage);
  }, [validOtherReviews, currentPage]);

  const pageInfo = {
    boardNoPerPage: itemsPerPage,
    totalBoardNo: totalItems,
    pageSize: 5,
  };

  const handleWriteReview = () => {
    if (!user) {
      alert("로그인이 안되어 있습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } else {
      navigate(`/reviews/write?restaurantNo=${restaurantNo}`);
    }
  };

  const handleEditReview = (review) => {
    if (!user) {
      alert("로그인 후 수정이 가능합니다.");
      navigate("/login");
    } else {
      navigate(`/reviews/write?reviewId=${review.reviewNo}&isEditMode=true`);
    }
  };

  const handleDeleteReview = (reviewNo) => {
    if (!user) {
      alert("로그인 후 삭제가 가능합니다.");
      navigate("/login");
    } else {
      const confirmDelete = window.confirm("정말 삭제하시겠습니까?");
      if (confirmDelete) {
        axios
          .delete(`/api/reviews/${reviewNo}`)
          .then(() => {
            alert("리뷰가 삭제되었습니다.");
            setReviews((prevReviews) =>
              prevReviews.filter((review) => review.reviewNo !== reviewNo)
            );
          })
          .catch((error) => {
            alert("리뷰 삭제 실패");
            console.error("리뷰 삭제 오류:", error);
          });
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 bg-gray-100 min-h-screen">
      <MyReview
        reviews={myReviews}
        onWriteReview={handleWriteReview}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />

      {user && (
        <div className="text-center">
          <button
            onClick={handleWriteReview}
            className="mt-4 bg-blue-600 text-white py-2 px-6 rounded-2xl hover:bg-blue-700"
          >
            리뷰 작성하기
          </button>
        </div>
      )}

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
