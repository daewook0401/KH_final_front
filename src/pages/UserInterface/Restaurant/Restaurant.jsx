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
  const { restaurant_no: restaurantId } = useParams();
  const { auth } = useContext(AuthContext);

  // --- 기존 코드의 모든 상태(State) 변수 ---
  const [buttonType, setButtonType] = useState(3);
  const [restaurantData, setRestaurantData] = useState({
    details: null,
    ratingInfo: null,
    menuItems: [],
  });
  const [openOperatingTime, setOpenOperatingTime] = useState(false);
  const [openReservationSetting, setOpenReservationSetting] = useState(false);
  const [openReservation, setOpenReservation] = useState(false);
  const [isStoreOwner, setIsStoreOwner] = useState(false);
  const [map, setMap] = useState(true);
  const [mapCoords, setMapCoords] = useState(null);

  // --- 메뉴 기능에 필요한 상태(State)만 추가 ---
  const [menuItems, setMenuItems] = useState([]); // 메뉴 목록
  const [menuOwner, setMenuOwner] = useState(false); // 메뉴 수정 권한자 여부
  const [hasMoreMenus, setHasMoreMenus] = useState(false); // 더보기 버튼 표시 여부
  const [menuPage, setMenuPage] = useState(0); // 메뉴 페이지 번호
  const [menuLoading, setMenuLoading] = useState(true); // 메뉴 로딩 상태

  // --- 기존 코드의 모든 useApi 훅 ---
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

  // --- 기존 mockMenuItems 더미 데이터 삭제 ---
  // const mockMenuItems = [ ... ]; // 이 부분을 완전히 삭제합니다.

  // --- 메뉴 데이터 API 호출 기능 추가 ---
  // useEffect(() => {
  //   // 메뉴 데이터만 가져오는 별도의 함수
  //   const fetchMenus = async (page) => {
  //     setMenuLoading(true);
  //     try {
  //       const response = await axios.get(
  //         `/api/restaurants/${restaurantId}/menu?page=${page}&size=5`
  //       );
  //       const { header, body } = response.data;

  //       if (header.code === "S200") {
  //         setMenuItems((prevItems) =>
  //           page === 0 ? body.menus : [...prevItems, ...body.menus]
  //         );
  //         setMenuOwner(body.isOwner); // API 응답의 isOwner를 menuOwner 상태에 저장
  //         setHasMoreMenus(body.hasMore);
  //       }
  //     } catch (err) {
  //       console.error("메뉴 정보를 불러오는 데 실패했습니다:", err);
  //     } finally {
  //       setMenuLoading(false);
  //     }
  //   };

  //   if (restaurantId) {
  //     fetchMenus(0); // 첫 페이지 메뉴 데이터 로드
  //   }
  // }, [restaurantId]);

  // 메뉴 '더보기' 버튼 클릭 핸들러
  const handleLoadMoreMenus = () => {
    const nextPage = menuPage + 1;
    setMenuPage(nextPage);

    const fetchMoreMenus = async () => {
      try {
        const response = await axios.get(
          `/api/restaurants/${restaurantId}/menu?page=${nextPage}&size=5`
        );
        const { header, body } = response.data;
        if (header.code === "S200") {
          setMenuItems((prevItems) => [...prevItems, ...body.menus]);
          setHasMoreMenus(body.hasMore);
        }
      } catch (err) {
        console.error("추가 메뉴 정보를 불러오는 데 실패했습니다:", err);
      }
    };
    fetchMoreMenus();
  };

  // --- 기존 코드의 모든 useEffect 훅 ---
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

  // --- 기존 코드의 모든 핸들러 및 변수 선언 ---
  const handleCopyAddress = () => {
    if (details?.restaurantAddress) {
      navigator.clipboard
        .writeText(details.restaurantAddress)
        .then(() => alert("주소가 복사되었습니다!"));
    }
  };

  const loading = detailsLoading || ratingLoading;
  const error = detailsError || ratingError;

  if (loading)
    return (
      <div className="text-center p-12 text-lg">가게 정보를 불러오는 중...</div>
    );
  if (error)
    return (
      <div className="text-center p-12 text-lg text-red-600">오류: {error}</div>
    );
  if (!details || !ratingInfo || !operatingInfoBd)
    return (
      <div className="text-center p-12">가게 정보를 표시할 수 없습니다.</div>
    );

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
          {/* -- 식당 기본 정보 (기존과 동일) -- */}
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

          {/* -- 가게 설명 (기존과 동일) -- */}
          <section className={cardStyles}>
            <h3 className="mt-0 mb-4 text-[#ff7750] text-xl font-bold">
              가게 설명
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {details.restaurantDescription}
            </p>
          </section>

          {/* --- 메뉴 정보 (기능이 추가된 새로운 코드) --- */}
          <section className={cardStyles}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="mt-0 text-[#ff7750] text-xl font-bold">
                메뉴 정보
              </h2>
              {menuOwner && (
                <button
                  className="bg-gray-200 text-gray-700 py-1.5 px-3 rounded font-bold hover:bg-gray-300"
                  onClick={() => alert("메뉴 수정 기능 구현 예정")}
                >
                  메뉴 수정
                </button>
              )}
            </div>
            <div className="flex flex-col border-t-2 border-gray-100">
              <div className="grid grid-cols-[2fr_1fr_1fr] items-center py-4 px-2.5 border-b border-gray-100 font-bold text-gray-600 bg-gray-50">
                <div>메뉴</div>
                <div className="text-right pr-5">가격</div>
                <div className="text-center">사진</div>
              </div>
              {menuLoading && menuItems.length === 0 && (
                <div className="text-center p-8 text-gray-500">
                  메뉴를 불러오는 중...
                </div>
              )}
              {menuItems.map((item) => (
                <div
                  key={item.menuNo}
                  className="grid grid-cols-[2fr_1fr_1fr] items-center py-4 px-2.5 border-b border-gray-100"
                >
                  <div className="font-bold text-gray-800">{item.menuName}</div>
                  <div className="text-right pr-5 text-gray-600">
                    {item.menuPrice.toLocaleString()}원
                  </div>
                  <div className="flex justify-center items-center h-20">
                    {item.menuPhotoUrl ? (
                      <img
                        src={item.menuPhotoUrl}
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
            {hasMoreMenus && (
              <div className="mt-4 text-center">
                <button
                  onClick={handleLoadMoreMenus}
                  className="w-full bg-[#ff7750] text-white py-2.5 px-4 rounded font-bold hover:bg-[#e66a45] transition-colors"
                >
                  더보기
                </button>
              </div>
            )}
          </section>

          {/* -- 리뷰 영역 (기존과 동일) -- */}
          <ReviewPage restaurantNo={restaurantId} />
        </main>

        <aside className="flex-1">
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
