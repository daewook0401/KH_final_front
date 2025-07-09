import React, { useState, useEffect } from "react";
import { FiMapPin } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../../common/Header/Header";
import defaultImage from "/src/assets/rog.png";
import useApi from "../../../hooks/useApi";

const DISPLAY_CATEGORIES = ["한식", "중식", "일식", "양식"];
const ALL_CATEGORIES = [];

const fadeSlideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const CategorySection = ({ title, restaurants, loading, error }) => {
  const navigate = useNavigate();

  if (loading)
    return <p className="py-8 text-center text-gray-500">{title} 로딩 중…</p>;
  if (error)
    return <p className="py-8 text-center text-red-400">{title} 실패: {error}</p>;

  return (
    <motion.section
      className="mb-12"
      variants={fadeSlideUp}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className="flex items-center justify-between mb-6">
        <span className="text-2xl font-semibold text-gray-800">{title}</span>
        <span className="text-sm font-medium text-[#ff7a3c]">추천 맛집(자동화 배포완)</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {restaurants.map(({ restaurant_no, name, imageUrl }) => (
          <motion.div
            key={restaurant_no}
            onClick={() => navigate(`/restaurant/${restaurant_no}`)}
            className="group relative rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow duration-300 cursor-pointer bg-white"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <img
              src={imageUrl}
              alt={name}
              onError={(e) => (e.target.src = defaultImage)}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-white/30 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <span className="px-4 py-2 bg-[#ff7a3c] text-white rounded-full font-medium">
                자세히 보기
              </span>
            </div>
            <p className="mt-3 px-4 pb-4 text-lg font-medium text-gray-800">{name}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

const CategoryRestaurants = ({ categoryName }) => {
  const { body, loading, error } = useApi(
    `/api/restaurants/category/${categoryName}`
  );
  return (
    <CategorySection
      title={categoryName}
      restaurants={body || []}
      loading={loading}
      error={error}
    />
  );
};

const Main = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();
    if (keyword.trim()) navigate(`/search-results?query=${keyword}`);
    else alert("검색어를 입력해주세요.");
  };

  return (
    <>
      <div className="px-4 py-10 max-w-6xl mx-auto">
        {/* 검색 섹션 */}
        <motion.section
          className="relative rounded-2xl bg-gradient-to-br from-[#e65c00] to-[#ff9a3c] p-8 mb-16 overflow-hidden"
          variants={fadeSlideUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.8 }}
        >
          <div className="absolute -top-8 -left-8 w-36 h-36 bg-white/20 rounded-full animate-pulse" />
          <div className="absolute -bottom-8 -right-8 w-52 h-52 bg-white/10 rounded-full" />

          <h1 className="relative text-3xl md:text-4xl font-bold text-white mb-6">
            한눈에 펼쳐보는 맛집 추천
          </h1>
          <form
            onSubmit={onSubmit}
            className="relative flex max-w-md mx-auto bg-white rounded-full shadow-lg overflow-hidden"
          >
            <span className="flex items-center pl-4 text-gray-400">
              <FiMapPin size={20} />
            </span>
            <input
              type="text"
              className="flex-1 py-3 px-4 text-gray-700 placeholder-gray-400 focus:outline-none"
              placeholder="검색어 입력"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <motion.button
              type="submit"
              className="px-6 bg-[#ff7a3c] hover:bg-[#e65c00] text-white font-semibold rounded-full transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              검색
            </motion.button>
          </form>
          {ALL_CATEGORIES.length > 0 && (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {ALL_CATEGORIES.map((cat) => (
                <motion.button
                  key={cat}
                  className="px-3 py-1 bg-white text-gray-700 rounded-full text-sm hover:bg-white/80 transition"
                  whileHover={{ scale: 1.05 }}
                >
                  {cat}
                </motion.button>
              ))}
            </div>
          )}
        </motion.section>

        {/* 카테고리별 맛집 */}
        {DISPLAY_CATEGORIES.map((cat) => (
          <CategoryRestaurants key={cat} categoryName={cat} />
        ))}
      </div>
    </>
  );
};

export default Main;
