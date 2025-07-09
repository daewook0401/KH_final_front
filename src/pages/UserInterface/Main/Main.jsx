import React, { useState } from "react";
import { FiMapPin } from "react-icons/fi";
// useNavigate 훅을 import 합니다.
import { useNavigate } from "react-router-dom";
import Header from "../../../common/Header/Header";
import defaultImage from "/src/assets/rog.png";
import useApi from "../../../hooks/useApi";

// 설정: 화면에 표시할 카테고리 목록
const DISPLAY_CATEGORIES = ["한식", "중식", "일식", "양식"];

// 설정: 상단에 표시할 전체 카테고리 버튼 목록 나중에 지원 예정
const ALL_CATEGORIES = [];

/**
 * [UI 담당] 카테고리별 맛집 리스트 섹션을 화면에 그리는 컴포넌트
 */
const CategorySection = ({ title, restaurants, loading, error }) => {
  const navigate = useNavigate();
  const goToRestaurantDetail = (restaurantNo) =>
    navigate(`/restaurant/${restaurantNo}`);

  if (loading)
    return (
      <div className="p-4">
        <strong>{title}</strong> 맛집 목록을 불러오는 중...
      </div>
    );
  if (error)
    return (
      <div className="p-4 text-red-500">
        <strong>{title}</strong> 목록 로딩 실패: {error}
      </div>
    );

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">
        <div className="flex justify-between items-center">
          <span>{title}</span>
        </div>
        <div className="text-[25px] text-[#fc742f] text-sm">추천맛집</div>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        {restaurants?.map(({ name, imageUrl, restaurant_no }) => (
          <article
            key={restaurant_no}
            onClick={() => goToRestaurantDetail(restaurant_no)}
            className="border border-gray-200 rounded-lg overflow-hidden text-center bg-white transition-shadow duration-200 ease-in-out hover:shadow-lg cursor-pointer"
          >
            <img
              src={imageUrl}
              alt={name}
              onError={(e) => (e.target.src = defaultImage)}
              className="w-full aspect-[4/3] object-cover"
            />
            <p className="py-3 px-2 font-medium">{name}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

/**
 * [데이터 호출 담당] 특정 카테고리의 데이터를 useApi로 호출하고, CategorySection을 렌더링하는 컴포넌트
 */
const CategoryRestaurants = ({ categoryName }) => {
  // 2. useApi 훅을 사용하여 API 호출 및 상태 관리
  const { body, loading, error } = useApi(
    `/api/restaurants/category/${categoryName}`
  );
  React.useEffect(() => {
    // body가 null이 아닐 때만 (즉, 응답이 왔을 때만) 로그를 찍습니다.
    if (body) {
      console.log(`[${categoryName}] 카테고리 API 실제 응답 데이터:`, body);
    }
  }, [body, categoryName]);
  // 3. 백엔드 데이터 키(restaurantNo)를 프론트엔드 키(restaurant_no)로 변경

  // 4. 상태와 데이터를 UI 담당 컴포넌트로 전달
  return (
    <CategorySection
      title={categoryName}
      restaurants={body} // mappedRestaurants 대신 body를 직접 전달
      loading={loading}
      error={error}
    />
  );
};

/**
 * 메인 페이지 전체를 구성하는 최상위 컴포넌트
 */
const Main = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate(); // 🎨 1. useNavigate 훅을 호출합니다.

  /**
   * 🎨 2. 검색 폼 제출 시 SearchResultsPage로 이동시키는 함수
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    // 검색어가 비어있지 않을 때만 이동합니다.
    if (keyword.trim()) {
      navigate(`/search-results?query=${keyword}`);
    } else {
      alert("검색어를 입력해주세요.");
    }
  };

  return (
    <>
      <div className="max-w-[960px] mx-auto py-8 px-4">
        {/* 상단 검색 섹션 */}
        {/* bg-gradient-to-br from-[#ffa868] to-[#ffaa6b]이 너무 강해 이미지와 유사한 색으로 변경 */}
        <section className="bg-[#fec89a] text-white text-center py-10 px-5 rounded-xl">
          <h1 className="mb-6 text-2xl md:text-[1.6rem] font-bold leading-tight text-gray-800">
            한눈에 펼쳐보는 맛집 추천
          </h1>
          <form
            onSubmit={handleSubmit}
            className="mx-auto mb-6 flex w-full max-w-sm overflow-hidden rounded-full bg-white shadow"
          >
            <span className="flex items-center pl-4 pr-2 text-gray-400">
              <FiMapPin size={18} />
            </span>
            <input
              placeholder="검색어 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="flex-1 w-full bg-transparent border-none py-3 text-[0.95rem] text-gray-800 placeholder:text-gray-400 focus:outline-none"
            />
            <button
              type="submit"
              className="cursor-pointer border-none bg-[#ff5a3c] px-6 font-semibold text-white transition-colors hover:bg-red-600"
            >
              검색
            </button>
          </form>
          <div className="flex flex-wrap gap-2 justify-center">
            {ALL_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="cursor-pointer rounded-full bg-white py-1.5 px-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-orange-50"
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <br />

        {/* 카테고리별 맛집 목록 */}
        {DISPLAY_CATEGORIES.map((category) => (
          <CategoryRestaurants key={category} categoryName={category} />
        ))}
      </div>
    </>
  );
};

export default Main;
