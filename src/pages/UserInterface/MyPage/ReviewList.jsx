import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../../../components/Pagination/Pagination";

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(`/api/reviews/my?page=${currentPage}`)
      .then((res) => {
        const reviewData = res.data?.body?.items?.reviews;
        const pageInformation = res.data?.body?.items?.pageInfo;

        setReviews(Array.isArray(reviewData) ? reviewData : []);
        setPageInfo(pageInformation || null);
      })
      .catch((err) => {
        setError("리뷰를 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [currentPage]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">내 리뷰 내역</h2>

      {loading && <p>로딩중...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && reviews.length === 0 && (
        <p>등록된 리뷰가 없습니다.</p>
      )}

      {!loading &&
        !error &&
        reviews.map((r, idx) => (
          <div key={idx} className="border-b py-4">
            <p className="font-medium">{r.restaurantName}</p>
            <p className="text-gray-600">{r.reviewContent}</p>
            <p className="text-yellow-500">⭐ {r.reviewScore}</p>
            <p className="text-sm text-gray-400">{formatDate(r.createDate)}</p>
          </div>
        ))}

      {pageInfo && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          pageInfo={pageInfo}
        />
      )}
    </div>
  );
};

export default ReviewList;
