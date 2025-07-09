import React, { useState, useEffect } from "react";
import axios from "../../../api/AxiosInterCeptor";
import useApi from "../../../hooks/useApi";

/**
 * 상태 코드에 따라 다른 스타일의 배지를 반환하는 헬퍼 함수
 */
const getStatusBadge = (status) => {
  switch (status) {
    case "Y":
      return (
        <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
          활성
        </span>
      );
    case "N":
      return (
        <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
          승인 대기
        </span>
      );
    case "I":
      return (
        <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">
          비활성
        </span>
      );
    case "R":
      return (
        <span className="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">
          거부됨
        </span>
      );
    case "C":
      return (
        <span className="px-2 py-1 text-xs font-semibold text-purple-800 bg-purple-100 rounded-full">
          취소됨
        </span>
      );
    default:
      return (
        <span className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 rounded-full">
          알 수 없음
        </span>
      );
  }
};

/**
 * 관리자용 맛집 관리 페이지 컴포넌트
 */
const AdminRestaurantPage = () => {
  // --- 상태 관리 (State) ---
  // 1. 맛집 목록을 관리할 컴포넌트 자체의 독립적인 상태를 만듭니다.
  const [restaurants, setRestaurants] = useState([]);

  const [keywordInput, setKeywordInput] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedKeyword, setAppliedKeyword] = useState("");
  const [apiUrl, setApiUrl] = useState("/api/admin/restaurants");

  // 2. useApi는 이제 '최초 데이터 로딩'용으로만 사용하고, 데이터는 initialData로 받습니다.
  const { body: initialData, loading, error } = useApi(apiUrl, {}, true);

  // --- 데이터 로딩 (useEffect) ---
  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter) {
      params.append("status2", statusFilter);
    }
    if (appliedKeyword) {
      params.append("keyword2", appliedKeyword);
    }
    const queryString = params.toString();
    setApiUrl(`/api/admin/restaurants?${queryString}`);
  }, [statusFilter, appliedKeyword]);

  // 3. useApi가 최초 데이터를 가져오면, 우리 자체 상태인 'restaurants'에 복사합니다.
  useEffect(() => {
    if (initialData) {
      setRestaurants(initialData);
    }
  }, [initialData]);

  // --- 이벤트 핸들러 ---
  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedKeyword(keywordInput);
  };

  const handleStatusUpdate = async (restaurantNo, newStatus) => {
    try {
      await axios.patch(`/api/admin/restaurants/${restaurantNo}/status`, {
        status: newStatus,
      });

      alert("상태가 성공적으로 변경되었습니다.");

      const params = new URLSearchParams();
      if (statusFilter) {
        params.append("status2", statusFilter);
      }
      if (appliedKeyword) {
        params.append("keyword2", appliedKeyword);
      }
      const res = await axios.get(
        `/api/admin/restaurants?${params.toString()}`
      );

      // 4. 이제 에러 없이 우리가 만든 setRestaurants 함수를 사용합니다.
      setRestaurants(res.data.body);
    } catch (err) {
      console.error("상태 변경/재조회 실패:", err);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* 페이지 헤더 */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          맛집 관리
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          새로 등록된 맛집을 관리하고 상태를 변경할 수 있습니다.
        </p>
      </div>

      {/* 필터 및 검색 바 */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <div className="w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">전체 상태</option>
              <option value="N">승인 대기</option>
              <option value="Y">활성</option>
              <option value="I">비활성</option>
              <option value="R">거부</option>
              <option value="C">취소</option>
            </select>
          </div>
          <div className="flex-grow w-full sm:w-auto">
            <input
              type="text"
              placeholder="가게 이름으로 검색"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          <div className="w-full sm:w-auto">
            <button
              type="submit"
              className="w-full sm:w-auto bg-[#ff5a3c] text-white font-bold py-2 px-6 rounded-md hover:bg-red-600 transition-colors"
            >
              검색
            </button>
          </div>
        </form>
      </div>

      {/* 맛집 목록 테이블 */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  번호
                </th>
                <th scope="col" className="px-6 py-3">
                  상호명
                </th>
                <th scope="col" className="px-6 py-3">
                  주소
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  현재 상태
                </th>
                <th scope="col" className="px-6 py-3 text-center">
                  상태 변경
                </th>
              </tr>
            </thead>
            <tbody>
              {loading && restaurants.length === 0 ? ( // 로딩은 최초에만 보여주도록 조건 수정
                <tr>
                  <td colSpan="5" className="text-center p-8">
                    로딩 중...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="5" className="text-center p-8 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : !restaurants || restaurants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center p-8">
                    조회된 맛집이 없습니다.
                  </td>
                </tr>
              ) : (
                restaurants.map((resto, index) => (
                  <tr
                    key={resto.restaurantNo}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {resto.restaurantName}
                    </th>
                    <td className="px-6 py-4">{resto.restaurantAddress}</td>
                    <td className="px-6 py-4 text-center">
                      {getStatusBadge(resto.isActive)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <select
                        value={resto.isActive}
                        onChange={(e) =>
                          handleStatusUpdate(resto.restaurantNo, e.target.value)
                        }
                        className="p-1 border border-gray-300 rounded-md text-xs focus:outline-none focus:ring-1 focus:ring-orange-500"
                      >
                        <option value="N">승인 대기</option>
                        <option value="Y">활성</option>
                        <option value="I">비활성</option>
                        <option value="R">거부</option>
                        <option value="C">취소</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminRestaurantPage;
