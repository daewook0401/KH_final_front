import React, { useState, useMemo } from "react";
import useApi from "../../../hooks/useApi";
import Pagination from "../../../components/Pagination/Pagination";

export default function ReviewAdmin() {
  const itemsPerPage = 5;

  const [filters, setFilters] = useState({
    memberId: "",
    memberNickname: "",
    restaurantName: "",
    reviewScore: "",
    isActive: "",
  });

  const [currentPage, setCurrentPage] = useState(1);

  const { body, loading, error, refetch } = useApi("/api/admin/reviews");
  const { refetch: patchToggle } = useApi(
    "/api/admin/reviews",
    { method: "patch" },
    false
  );

  const reviews = useMemo(() => {
    if (!body?.items || !Array.isArray(body.items.reviews)) return [];
    return body.items.reviews.map((item) => ({
      ...item,
      isActive: item.isActive === "Y",
    }));
  }, [body]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      return (
        (filters.memberId === "" || r.memberId.includes(filters.memberId)) &&
        (filters.memberNickname === "" ||
          r.memberNickname.includes(filters.memberNickname)) &&
        (filters.restaurantName === "" ||
          r.restaurantName.includes(filters.restaurantName)) &&
        (filters.reviewScore === "" ||
          r.reviewScore === Number(filters.reviewScore)) &&
        (filters.isActive === "" ||
          (filters.isActive === "Y" && r.isActive) ||
          (filters.isActive === "N" && !r.isActive))
      );
    });
  }, [reviews, filters]);

  const pagedReviews = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredReviews.slice(start, start + itemsPerPage);
  }, [filteredReviews, currentPage]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const toggleActive = (reviewNo, currentIsActive) => {
    const newIsActive = currentIsActive ? "N" : "Y";

    // 여기를 query → params로 변경했습니다.
    patchToggle({ params: { reviewNo, isActive: newIsActive } })
      .then(() => refetch())
      .catch(() => alert("상태 변경 실패"));
  };

  return (
    <div className="max-w-7xl mx-auto p-6 font-sans">
      <header className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">리뷰 관리</h1>
      </header>

      <section className="flex flex-wrap gap-4 mb-6">
        <input
          type="text"
          name="memberId"
          placeholder="회원 ID 검색"
          className="border border-gray-300 rounded px-3 py-2"
          value={filters.memberId}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="memberNickname"
          placeholder="닉네임 검색"
          className="border border-gray-300 rounded px-3 py-2"
          value={filters.memberNickname}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="restaurantName"
          placeholder="음식점 이름 검색"
          className="border border-gray-300 rounded px-3 py-2"
          value={filters.restaurantName}
          onChange={handleFilterChange}
        />
        <select
          name="reviewScore"
          className="border border-gray-300 rounded px-3 py-2"
          value={filters.reviewScore}
          onChange={handleFilterChange}
        >
          <option value="">별점 전체</option>
          {[5, 4, 3, 2, 1].map((score) => (
            <option key={score} value={score}>
              {score}점
            </option>
          ))}
        </select>
        <select
          name="isActive"
          className="border border-gray-300 rounded px-3 py-2"
          value={filters.isActive}
          onChange={handleFilterChange}
        >
          <option value="">활성화 여부</option>
          <option value="Y">활성</option>
          <option value="N">비활성</option>
        </select>
      </section>

      <section>
        {loading ? (
          <div className="text-center py-10 text-gray-500">불러오는 중...</div>
        ) : error ? (
          <div className="text-center py-10 text-red-500">
            에러가 발생했습니다.
          </div>
        ) : (
          <>
            <table className="min-w-full border border-gray-300 divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm text-gray-700">
                    회원 ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm text-gray-700">
                    닉네임
                  </th>
                  <th className="px-4 py-2 text-left text-sm text-gray-700">
                    음식점 이름
                  </th>
                  <th className="px-4 py-2 text-center text-sm text-gray-700">
                    별점
                  </th>
                  <th className="px-4 py-2 text-center text-sm text-gray-700">
                    작성 시간
                  </th>
                  <th className="px-4 py-2 text-left text-sm text-gray-700">
                    리뷰 내용
                  </th>
                  <th className="px-4 py-2 text-center text-sm text-gray-700">
                    활성화
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedReviews.length > 0 ? (
                  pagedReviews.map((r) => (
                    <tr key={r.reviewNo}>
                      <td className="px-4 py-3">{r.memberId}</td>
                      <td className="px-4 py-3">{r.memberNickname}</td>
                      <td className="px-4 py-3">{r.restaurantName}</td>
                      <td className="px-4 py-3 text-center">{r.reviewScore}</td>
                      <td className="px-4 py-3 text-center">{r.createDate}</td>
                      <td
                        className="px-4 py-3 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap"
                        title={r.reviewContent}
                      >
                        {r.reviewContent}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <label className="inline-flex relative items-center cursor-pointer">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={r.isActive}
                            onChange={() =>
                              toggleActive(r.reviewNo, r.isActive)
                            }
                          />
                          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                        </label>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-10 text-gray-500">
                      조회된 리뷰가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {filteredReviews.length > itemsPerPage && (
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  pageInfo={{
                    boardNoPerPage: itemsPerPage,
                    totalBoardNo: filteredReviews.length,
                    pageSize: 5,
                  }}
                />
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
