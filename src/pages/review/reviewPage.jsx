import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import ReviewItem from "../../components/ReviewItem";
import SortSelector from "../../components/SortSelector";
import Pagination from "../../common/Pagination/Pagination";
import MyReview from "../../components/MyReview";

function ReviewPage({ myMemberNo, restaurantNo }) {
  const navigate = useNavigate();

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

  const myReviews = myMemberNo
    ? sortedReviews.filter((r) => r.memberNo === myMemberNo)
    : [];

  const otherReviews = sortedReviews.filter(
    (r) => !myMemberNo || r.memberNo !== myMemberNo
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
    if (!myMemberNo) {
      alert("로그인이 안되어 있습니다. 로그인페이지로 이동합니다.");
      navigate("/login");
    } else {
      navigate(`/reviews/write?restaurantNo=${restaurantNo}`);
    }
  };

  const handleEditReview = (review) => {
    alert(`리뷰 수정: ${review.reviewNo}`);
  };

  const handleDeleteReview = (reviewNo) => {
    alert(`리뷰 삭제: ${reviewNo}`);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6 bg-gray-100 min-h-screen">
      <MyReview
        reviews={myReviews}
        onWriteReview={handleWriteReview}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
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
            <ReviewItem key={review.reviewNo} review={review} />
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
