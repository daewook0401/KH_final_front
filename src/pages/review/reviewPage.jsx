import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../../context/UserContext"; // UserContext 추가

import ReviewItem from "../../components/ReviewItem";
import SortSelector from "../../components/SortSelector";
import Pagination from "../../common/Pagination/Pagination";
import MyReview from "../../components/MyReview";

function ReviewPage({ restaurantNo }) {
  const navigate = useNavigate();
  const { user } = useUser(); // 로그인된 사용자 정보 받아오기

  const [reviews, setReviews] = useState([]);
  const [sortKey, setSortKey] = useState("ratingDesc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  // 리뷰 데이터 불러오기
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

  // 리뷰 정렬 처리
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

  // 마이리뷰 필터링
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

  // 페이징 처리
  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return validOtherReviews.slice(start, start + itemsPerPage);
  }, [validOtherReviews, currentPage]);

  const pageInfo = {
    boardNoPerPage: itemsPerPage,
    totalBoardNo: totalItems,
    pageSize: 5,
  };

  // 리뷰 작성 페이지로 이동
  const handleWriteReview = () => {
    if (!user) {
      alert("로그인이 안되어 있습니다. 로그인 페이지로 이동합니다.");
      navigate("/login");
    } else {
      navigate(`/reviews/write?restaurantNo=${restaurantNo}`);
    }
  };

  // 리뷰 수정 페이지로 이동
  const handleEditReview = (review) => {
    if (!user) {
      alert("로그인 후 수정이 가능합니다.");
      navigate("/login");
    } else {
      navigate(`/reviews/edit?reviewId=${review.reviewNo}`);
    }
  };

  // 리뷰 삭제
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
            // 삭제 후 다시 데이터 불러오기
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
      {/* 마이리뷰 */}
      <MyReview
        reviews={myReviews}
        onWriteReview={handleWriteReview}
        onEditReview={handleEditReview}
        onDeleteReview={handleDeleteReview}
      />

      {/* 마이리뷰 밑에 작성하기 버튼 */}
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

      {/* 리뷰가 없을 때 */}
      {totalItems === 0 ? (
        <div className="text-center bg-gray-200 rounded text-gray-500 py-10">
          등록된 리뷰가 없습니다.
        </div>
      ) : (
        <>
          {/* 정렬 */}
          <SortSelector
            sortKey={sortKey}
            onChange={(key) => {
              setSortKey(key);
              setCurrentPage(1);
            }}
          />

          {/* 리뷰 리스트 */}
          {pagedReviews.map((review) => (
            <ReviewItem
              key={review.reviewNo}
              review={review}
              onEdit={() => handleEditReview(review)}
              onDelete={() => handleDeleteReview(review.reviewNo)}
            />
          ))}

          {/* 페이징 */}
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
