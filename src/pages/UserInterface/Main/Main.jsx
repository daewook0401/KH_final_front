import React, { useState } from "react";
import { FiMapPin } from "react-icons/fi";
// useNavigate 훅을 import 합니다.
import { useNavigate } from "react-router-dom";
import Header from "../../../common/Header/Header";
import defaultImage from "/src/assets/rog.png";

const CATEGORIES = ["한식", "중식", "일식", "양식", "분식", "디저트"];

// 더미 데이터의 키를 'restaurant_no'로 변경
const koreanRestaurants = [
  {
    name: "하쿠 본점",
    imageUrl: "/src/assets/rog1.png",
    restaurant_no: "1", // 키 변경
  },
  {
    name: "평양옥 본점",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "2", // 키 변경
  },
  {
    name: "진미평양냉면",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "3", // 키 변경
  },
  {
    name: "광화문 본점",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "4", // 키 변경
  },
  {
    name: "서북면옥",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "5", // 키 변경
  },
  {
    name: "하쿠쿠 본점",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "6", // 키 변경
  },
];

const chineseRestaurants = [
  {
    name: "중화반점",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "7", // 키 변경
  },
  {
    name: "북경반점",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "8", // 키 변경
  },
  {
    name: "상해반점",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "9", // 키 변경
  },
  {
    name: "광동반점",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "10", // 키 변경
  },
  {
    name: "광동반점",
    imageUrl: "/src/assets/rog.png",
    restaurant_no: "11", // 키 변경
  },
];

const handleImageError = (e) => {
  e.target.src = defaultImage;
};

const CategorySection = ({ title, restaurants }) => {
  // useNavigate 훅을 초기화합니다.
  const navigate = useNavigate();

  // 클릭 시 해당 음식점 상세 페이지로 이동하는 함수
  const goToRestaurantDetail = (restaurantNo) => {
    navigate(`/restaurant/${restaurantNo}`);
  };

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-4">
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <button className="cursor-pointer text-sm font-bold text-gray-800 hover:text-gray-500 text-[25px]">
            더보기
          </button>
        </div>
        <div className="text-sm text-[#fc742f] text-[25px]">추천맛집</div>
      </h2>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-4">
        {/* map에서 restaurant_no도 함께 구조 분해 할당으로 가져옵니다. */}
        {restaurants.slice(0, 5).map(({ name, imageUrl, restaurant_no }) => (
          <article
            // key는 고유한 값인 restaurant_no로 변경하는 것이 좋습니다.
            key={restaurant_no}
            className="border border-gray-200 rounded-lg overflow-hidden text-center bg-white transition-shadow duration-200 ease-in-out hover:shadow-lg cursor-pointer"
            // article 태그에 onClick 이벤트를 추가합니다.
            onClick={() => goToRestaurantDetail(restaurant_no)}
          >
            <img
              src={imageUrl || defaultImage}
              alt={name}
              onError={handleImageError}
              className="w-full aspect-[4/3] object-cover"
            />
            <p className="py-3 px-2 font-medium">{name}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

const Main = () => {
  const [keyword, setKeyword] = useState("");
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("검색어:", keyword);
    setKeyword("");
  };

  return (
    <>
      <Header />
      <div className="max-w-[960px] mx-auto py-8 px-4 bg-[#fde4d7]">
        <section className="bg-gradient-to-br from-[#ffa868] to-[#ffaa6b] text-white text-center py-10 px-5 rounded-xl">
          <h1 className="mb-6 text-[1.6rem] font-bold leading-tight">
            한눈에 펼쳐보는 서울 맛집 추천
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm mx-auto mb-6 bg-white rounded-full overflow-hidden"
          >
            <span className="flex items-center px-3 text-[#ff7750]">
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
              className="bg-[#ff5a3c] text-white px-6 font-semibold border-none cursor-pointer"
            >
              검색
            </button>
          </form>

          <div className="flex flex-wrap gap-2 justify-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="border-none bg-white text-gray-700 py-1.5 px-3.5 rounded-full text-sm cursor-pointer transition-colors duration-150 hover:bg-[#ffe2d1]"
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        <br />
        <CategorySection title="한식" restaurants={koreanRestaurants} />
        <CategorySection title="중식" restaurants={chineseRestaurants} />
      </div>
    </>
  );
};

export default Main;
