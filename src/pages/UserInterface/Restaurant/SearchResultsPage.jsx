import React, { useState, useEffect } from "react";
// 🎨 Link 컴포넌트를 react-router-dom에서 import 합니다.
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import useApi from "../../../hooks/useApi";

// ... getStatusBadge 함수는 이전과 동일 ...
const getStatusBadge = (status) => {
  return (
    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
      활성
    </span>
  );
};

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const [apiUrl, setApiUrl] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const keyword = searchParams.get("query");
  const [inputKeyword, setInputKeyword] = useState(keyword || "");

  const { body: apiData, loading, error } = useApi(apiUrl, {}, !!apiUrl);

  useEffect(() => {
    if (keyword) {
      const params = new URLSearchParams();
      params.append("status2", "Y");
      params.append("keyword2", keyword);
      setApiUrl(`/api/admin/restaurants?${params.toString()}`);
    }
  }, [keyword]);

  useEffect(() => {
    if (apiData) {
      setResults(apiData);
    }
  }, [apiData]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputKeyword.trim()) {
      navigate(`/search-results?query=${inputKeyword}`);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* 상단 검색 섹션 */}
      <div className="bg-sky-100 py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            한눈에 펼쳐보는 맛집 추천
          </h1>
          <p className="mt-2 text-gray-700">
            '<span className="font-semibold text-sky-600">{keyword}</span>'에
            대한 검색 결과입니다.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex items-center max-w-lg mx-auto bg-white rounded-lg shadow-sm p-2 focus-within:ring-2 focus-within:ring-sky-500"
          >
            <input
              type="text"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              placeholder="다시 검색해보세요"
              className="flex-grow w-full px-2 py-2 bg-transparent border-0 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-[#ff5a3c] text-white font-bold px-6 py-2 rounded-md hover:bg-red-600 transition-colors flex-shrink-0"
            >
              검색
            </button>
          </form>
        </div>
      </div>

      {/* 검색 결과 목록 섹션 */}
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl">
        {loading && (
          <div className="text-center text-gray-500 py-10">
            결과를 불러오는 중...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 py-10">
            오류가 발생했습니다: {error.message}
          </div>
        )}
        {!loading && !error && (
          <>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {results.map((resto) => (
                  // 🎨 여기를 수정했습니다: Link 컴포넌트로 카드 전체를 감쌌습니다.
                  <Link
                    to={`/restaurant/${resto.restaurantNo}`}
                    key={resto.restaurantNo}
                  >
                    <div className="bg-white rounded-lg shadow-md overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 h-full">
                      <img
                        src={
                          resto.restaurantImage ||
                          `https://via.placeholder.com/400x300.png/ef4444/ffffff?text=No+Image`
                        }
                        alt={resto.restaurantName}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {resto.restaurantName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {resto.restaurantAddress}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-20">
                <p className="text-lg">검색 결과가 없습니다.</p>
                <p className="text-sm mt-2">다른 키워드로 검색해보세요.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
