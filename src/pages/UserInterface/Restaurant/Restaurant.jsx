import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import defaultImage from "../../../assets/rog.png";
import KakaoMap from "./KakaoMap";
import RatingStars from "../../../components/RatingStars";
import ReviewPage from "../Review/ReviewPage";
import Reservation from "../Reservation/Reservation";
import Operatinghours from "../Operatinghours/Operatinghours";
import Settings from "../Reservation/Settings";
import useApi from "../../../hooks/useApi";
import { useContext } from "react";
import AuthContext from "../../../provider/AuthContext";
import axios from "axios";

const StarRating = ({ averageRating, reviewCount }) => {
  const ratingValue = Number(averageRating) || 0;
  return (
    <div className="flex items-center mb-4">
      <RatingStars value={ratingValue} />
      <span className="ml-2.5 font-bold text-gray-600">
        {ratingValue.toFixed(1)}점 ({reviewCount || 0}명의 평가)
      </span>
    </div>
  );
};

/**
 * 식당 상세 페이지 전체를 구성하는 메인 컴포넌트
 */
const Restaurant = () => {
  // URL 파라미터에서 식당 ID를 가져옵니다.
  const { restaurant_no: restaurantId } = useParams();
  const [restaurantData, setRestaurantData] = useState({
    details: null,
    ratingInfo: null,
    menuItems: [],
  });
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  const [openReservation, setOpenReservation] = useState(false);
  const { auth } = useContext(AuthContext);
  const [isStoreOwner, setIsStoreOwner] = useState(false);
  const [map, setMap] = useState(true);

  // useApi 훅을 사용하여 식당 상세 정보와 별점 정보를 각각 API로 호출합니다.
  const {
    body: details,
    loading: detailsLoading,
    error: detailsError,
  } = useApi(`/api/restaurants/${restaurantId}`);

  const {
    body: ratingInfo,
    loading: ratingLoading,
    error: ratingError,
  } = useApi(`/api/restaurants/${restaurantId}/rating`);

  const { body: operatingInfoBd, refetch: refetchOperating } = useApi(
    "/api/operatings",
    {
      method: "get",
      params: { restaurantNo: restaurantId },
    }
  );

  const { body: reservationSettingBd, refetch: refetchReservation } = useApi(
    "/api/settings/byRestaurantNo",
    { method: "get", params: { restaurantNo: restaurantId } }
  );

  // 카카오맵 좌표를 저장할 state
  const [mapCoords, setMapCoords] = useState(null);

  // 메뉴 정보는 요청대로 더미 데이터로 유지합니다.
  const mockMenuItems = [
    {
      menuId: 1,
      menuName: "감성 그릴드 파히타",
      menuPrice: 38000,
      menuImageUrl:
        "https://via.placeholder.com/150/cccccc/808080?text=메뉴+사진1",
    },
    {
      menuId: 2,
      menuName: "까르니따스 치즈 타코",
      menuPrice: 12000,
      menuImageUrl: null,
    },
    {
      menuId: 3,
      menuName: "과카몰리 나초",
      menuPrice: 9000,
      menuImageUrl:
        "https://via.placeholder.com/150/cccccc/808080?text=메뉴+사진2",
    },
  ];

  // 주소를 좌표로 변환하기 위한 useEffect 훅
  useEffect(() => {
    if (details && details.restaurantAddress) {
      if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
        if (map === true) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(
            details.restaurantAddress,
            (result, status) => {
              if (status === window.kakao.maps.services.Status.OK) {
                const coords = { lat: result[0].y, lng: result[0].x };
                setMapCoords(coords);
                setMap(false);
              } else {
                console.error(
                  "주소로 좌표를 찾지 못했습니다:",
                  details.restaurantAddress
                );
                setMapCoords(null);
                setMap(false);
              }
            }
          );
        }
      }
    }
  });

  useEffect(() => {
    if (auth?.loginInfo?.isStoreOwner === "Y") {
      setIsStoreOwner(true);
    }
  });

  // 주소 복사 핸들러
  const handleCopyAddress = () => {
    if (details?.restaurantAddress) {
      navigator.clipboard
        .writeText(details.restaurantAddress)
        .then(() => alert("주소가 복사되었습니다!"));
    }
  };

  // 로딩 및 에러 상태를 종합적으로 관리
  const loading = detailsLoading || ratingLoading;
  const error = detailsError || ratingError;

  if (loading) {
    return (
      <div className="text-center p-12 text-lg">가게 정보를 불러오는 중...</div>
    );
  }
  if (error) {
    return (
      <div className="text-center p-12 text-lg text-red-600">오류: {error}</div>
    );
  }
  if (!details || !ratingInfo) {
    return (
      <div className="text-center p-12">가게 정보를 표시할 수 없습니다.</div>
    );
  }

  const cardStyles = "bg-white p-6 border border-gray-200 rounded-lg shadow-sm";
  const dayOrder = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const sortedItems = [...operatingInfoBd.items].sort(
    (a, b) => dayOrder.indexOf(a.weekDay) - dayOrder.indexOf(b.weekDay)
  );
  console.log(
    "details : ",
    details,
    "isStoreOwner : ",
    isStoreOwner,
    "operatingInfoBd : ",
    operatingInfoBd,
    "reservationSettingBd : ",
    reservationSettingBd
  );
  return (
    <>
      {openReservation && (
        <Reservation
          setOpenReservation={setOpenReservation}
          restaurantId={restaurantId}
        />
      )}

      <div className="flex max-w-[1200px] my-5 mx-auto p-5 gap-5 font-sans bg-gray-50">
        <main className="flex-[3] flex flex-col gap-8">
          {/* -- 식당 기본 정보 -- */}
          <section className={cardStyles}>
            <img
              src={details.restaurantMainPhoto || defaultImage}
              alt={`${details.restaurantName} 대표 사진`}
              className="w-full h-[300px] object-cover rounded-lg bg-gray-200 mb-5"
            />
            <div>
              <p className="text-gray-500 text-sm m-0">
                {details.restaurantCuisineType?.split(",").join(", ")}
              </p>
              <div className="flex items-center justify-between mb-2">
                <h1 className="mt-1 text-3xl font-bold text-gray-800">
                  {details.restaurantName}
                </h1>

                <div className="flex gap-2">
                  {!isStoreOwner &&
                    operatingInfoBd &&
                    (reservationSettingBd?.items?.reservation || []).length >
                      0 &&
                    reservationSettingBd?.items?.settingInfo && (
                      <button
                        onClick={() => setOpenReservation(true)}
                        className="bg-[#ff7750] text-white py-1.5 px-3 rounded font-bold hover:bg-[#e66a45]"
                      >
                        예약하기
                      </button>
                    )}
                </div>
              </div>
              <StarRating
                averageRating={ratingInfo.averageRating}
                reviewCount={ratingInfo.reviewCount}
              />
              <div className="flex items-center gap-2 bg-gray-100 p-2.5 rounded">
                <span>{details.restaurantAddress}</span>
                <button
                  onClick={handleCopyAddress}
                  className="bg-[#ff7750] text-white py-1.5 px-3 rounded cursor-pointer font-bold transition-colors hover:bg-[#e66a45]"
                >
                  주소 복사
                </button>
              </div>
              {operatingInfoBd && operatingInfoBd.items.length > 0 && (
                <div className="mt-3 p-4 bg-gray-100 rounded shadow-sm">
                  <h4 className="text-base font-semibold text-gray-700 mb-2">
                    운영 시간
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    {sortedItems.map((item, idx) => {
                      const dayMap = {
                        Monday: "월",
                        Tuesday: "화",
                        Wednesday: "수",
                        Thursday: "목",
                        Friday: "금",
                        Saturday: "토",
                        Sunday: "일",
                      };
                      const dayKor = dayMap[item.weekDay] || item.weekDay;

                      return (
                        <li key={idx}>
                          <span className="font-medium">{dayKor}</span>{" "}
                          {item.startTime} ~ {item.endTime}
                          {item.breakStartTime && item.breakEndTime && (
                            <span className="ml-2 text-gray-500">
                              (브레이크 {item.breakStartTime} ~{" "}
                              {item.breakEndTime})
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          </section>

          {/* -- 가게 설명 -- */}
          <section className={cardStyles}>
            <h3 className="mt-0 mb-4 text-[#ff7750] text-xl font-bold">
              가게 설명
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {details.restaurantDescription}
            </p>
          </section>

          {/* -- 메뉴 정보 (더미 데이터) -- */}
          <section className={cardStyles}>
            <h2 className="mt-0 mb-4 text-[#ff7750] text-xl font-bold">
              메뉴 정보
            </h2>
            <div className="flex flex-col border-t-2 border-gray-100">
              <div className="grid grid-cols-[2fr_1fr_1fr] items-center py-4 px-2.5 border-b border-gray-100 font-bold text-gray-600 bg-gray-50">
                <div>메뉴</div>
                <div className="text-right pr-5">가격</div>
                <div className="text-center">사진</div>
              </div>
              {mockMenuItems.map((item) => (
                <div
                  key={item.menuId}
                  className="grid grid-cols-[2fr_1fr_1fr] items-center py-4 px-2.5 border-b border-gray-100"
                >
                  <div className="font-bold text-gray-800">{item.menuName}</div>
                  <div className="text-right pr-5 text-gray-600">
                    {item.menuPrice.toLocaleString()}원
                  </div>
                  <div className="flex justify-center items-center h-20">
                    {item.menuImageUrl ? (
                      <img
                        src={item.menuImageUrl}
                        alt={item.menuName}
                        className="max-w-full max-h-full object-cover rounded"
                      />
                    ) : (
                      <div className="text-gray-400 text-sm text-center w-full">
                        사진 없음
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* -- 리뷰 영역 (수정 안 함) -- */}
          <ReviewPage restaurantNo={restaurantId} />
        </main>

        <aside className="flex-1">
          {/* 카카오맵: 변환된 좌표(mapCoords)가 있을 때만 렌더링 */}
          {mapCoords ? (
            <KakaoMap
              lat={mapCoords.lat}
              lng={mapCoords.lng}
              name={details.restaurantName}
            />
          ) : (
            <div className="w-full h-[300px] bg-gray-200 flex justify-center items-center text-gray-500 rounded-lg text-lg">
              지도 정보를 불러오는 중...
            </div>
          )}
          <div className="text-sm text-gray-600 mt-2">
            클릭시 카카오맵에서 해당 위치를 확인할 수 있습니다.
          </div>
        </aside>
      </div>
    </>
  );
};

export default Restaurant;
