import React, { useState, useEffect } from "react";
// 🎨 Link 컴포넌트를 react-router-dom에서 import 합니다.
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import { motion } from "framer-motion";
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
    <div className="min-h-screen bg-white">
      {/* 상단 검색 섹션 (오렌지 그라데이션 + 모션) */}
      <motion.div
        className="py-12 px-4 bg-gradient-to-r from-[#e65c00]/90 to-[#ff9a3c]/90 backdrop-blur-sm"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-white">
            한눈에 펼쳐보는 맛집 추천
          </h1>
          <p className="mt-2 text-orange-100">
            '<span className="font-semibold">{keyword}</span>'에 대한 검색 결과입니다.
          </p>

          <form
            onSubmit={handleSearch}
            className="mt-6 flex items-center max-w-lg mx-auto bg-white rounded-full shadow-lg overflow-hidden focus-within:ring-2 focus-within:ring-orange-300"
          >
            <input
              type="text"
              value={inputKeyword}
              onChange={(e) => setInputKeyword(e.target.value)}
              placeholder="다시 검색해보세요"
              className="flex-grow px-4 py-3 bg-transparent focus:outline-none text-gray-700"
            />
            <button
              type="submit"
              className="bg-white text-[#e65c00] font-bold px-6 py-3 rounded-full hover:bg-orange-50 transition"
            >
              검색
            </button>
          </form>
        </div>
      </motion.div>

      {/* 검색 결과 목록 섹션 */}
      <div className="container mx-auto p-6 max-w-6xl">
        {loading && (
          <div className="text-center text-gray-400 py-20">
            결과를 불러오는 중...
          </div>
        )}
        {error && (
          <div className="text-center text-red-500 py-20">
            오류가 발생했습니다: {error.message}
          </div>
        )}
        {!loading && !error && (
          <>
            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {results.map((resto) => (
                  <Link
                    to={`/restaurant/${resto.restaurantNo}`}
                    key={resto.restaurantNo}
                    className="group"
                  >
                    <motion.div
                      className="bg-white rounded-2xl shadow-lg overflow-hidden transform h-full flex flex-col"
                      whileHover={{ scale: 1.03 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <div className="h-48 relative">
                        <img
                          src={
                            resto.restaurantImage ||
                            `https://via.placeholder.com/400x300.png/ef4444/ffffff?text=No+Image`
                          }
                          alt={resto.restaurantName}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {getStatusBadge(resto.status)}
                        </div>
                      </div>
                      <div className="p-4 flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {resto.restaurantName}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 truncate">
                          {resto.restaurantAddress}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-40">
                <p className="text-xl font-light">검색 결과가 없습니다.</p>
                <p className="mt-2">다른 키워드로 검색해보세요.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchResultsPage;
