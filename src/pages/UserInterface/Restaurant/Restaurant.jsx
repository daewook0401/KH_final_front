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
  const [buttonType, setButtonType] = useState(3);
  const [restaurantData, setRestaurantData] = useState({
    details: null,
    ratingInfo: null,
    menuItems: [],
  });
  //const [loading, setLoading] = useState(true);
  //const [error, setError] = useState(null);
  const [openOperatingTime, setOpenOperatingTime] = useState(false);
  const [openReservationSetting, setOpenReservationSetting] = useState(false);
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

  const {
    header: operatingInfoHd,
    body: operatingInfoBd,
    refetch: operatingInfo,
  } = useApi("/api/operatings", {
    method: "get",
    params: {
      restaurantNo: "2",
    },
  });

  const {
    header: myReservationHd,
    body: myReservationBd,
    refetch: myReservation,
  } = useApi("/api/reservation/check", {
    method: "get",
    params: {
      restaurantNo: "2",
    },
  });

  const {
    header: reservationSettingHd,
    body: reservationSettingBd,
    refetch: reservationSetting,
  } = useApi("/api/settings", {
    method: "get",
    params: {
      restaurantNo: "2",
    },
  });

  const hasOperatingInfo = operatingInfoBd && operatingInfoBd.items.length > 0;
  const hasReservationSetting =
    reservationSettingBd && reservationSettingBd.items.settingInfo;
  const handleDeleteOperatingTime = () => {
    axios
      .delete("/api/reservation", {
        params: {
          reservationNo: "2",
        },
        headers: {
          Authorization: `Bearer ${auth?.tokens?.accessToken}`,
        },
      })
      .then((res) => {
        console.log(res);
        alert("운영시간 삭제되었습니다!");
        operatingInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteReservationSetting = () => {
    axios
      .delete("/api/settings", {
        params: {
          reservationNo: "2",
        },
        headers: {
          Authorization: `Bearer ${auth?.tokens?.accessToken}`,
        },
      })
      .then((res) => {
        console.log(res);
        alert("예약설정 삭제되었습니다!");
        reservationSetting();
        operatingInfo();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancelReservation = (reservationNo) => {
    axios
      .delete("/api/reservation", {
        params: {
          reservationNo: reservationNo,
        },
        headers: {
          Authorization: `Bearer ${auth?.tokens?.accessToken}`,
        },
      })
      .then((res) => {
        console.log(res);
        alert("예약이 취소되었습니다.");
        myReservation();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  console.log(reservationSettingHd, reservationSettingBd);

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

  return (
    <>
      {openOperatingTime && (
        <Operatinghours setOpenOperatingTime={setOpenOperatingTime} />
      )}
      {openReservation && (
        <Reservation
          setOpenReservation={setOpenReservation}
          refetchMyReservation={myReservation}
        />
      )}
      {openReservationSetting && (
        <Settings setOpenReservationSetting={setOpenReservationSetting} />
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
                  {isStoreOwner && (
                    <>
                      {/* 운영시간 버튼 */}
                      {!hasOperatingInfo ? (
                        <button
                          onClick={() => setOpenOperatingTime(true)}
                          className="bg-[#ff7750] text-white py-1.5 px-3 rounded font-bold hover:bg-[#e66a45]"
                        >
                          운영시간 등록
                        </button>
                      ) : (
                        // 운영시간 삭제 버튼: 예약설정 없을 때만 표시
                        !hasReservationSetting && (
                          <button
                            onClick={handleDeleteOperatingTime}
                            className="bg-red-500 text-white py-1.5 px-3 rounded font-bold hover:bg-red-600"
                          >
                            운영시간 삭제
                          </button>
                        )
                      )}

                      {/* 예약설정 버튼 */}
                      {hasOperatingInfo && (
                        <>
                          {!hasReservationSetting ? (
                            <button
                              onClick={() => setOpenReservationSetting(true)}
                              className="bg-[#ff7750] text-white py-1.5 px-3 rounded font-bold hover:bg-[#e66a45]"
                            >
                              예약설정 등록
                            </button>
                          ) : (
                            <button
                              onClick={handleDeleteReservationSetting}
                              className="bg-red-500 text-white py-1.5 px-3 rounded font-bold hover:bg-red-600"
                            >
                              예약설정 삭제
                            </button>
                          )}
                        </>
                      )}
                    </>
                  )}

                  {!isStoreOwner &&
                    hasOperatingInfo &&
                    hasReservationSetting && (
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
                    {operatingInfoBd.items.map((item, idx) => {
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

                      const endTimeDisplay =
                        item.endTime >= "24:00"
                          ? `${parseInt(item.endTime.split(":")[0], 10) - 24}:${
                              item.endTime.split(":")[1]
                            }`
                          : item.endTime;

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
          {/*<ReviewPage restaurantNo={restaurantId} />*/}
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
          {myReservationBd?.items?.length > 0 && (
            <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-bold text-gray-700 mb-3">
                내 예약 정보
              </h4>
              {myReservationBd.items.map((item) => (
                <div
                  key={item.reservationNo}
                  className="mb-3 border-b last:border-none pb-2"
                >
                  <p className="text-gray-700 font-medium">
                    예약 날짜:{" "}
                    <span className="font-bold">{item.reserveDay}</span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    예약 시간:{" "}
                    <span className="font-bold">{item.reserveTime}</span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    인원:{" "}
                    <span className="font-bold">{item.numberOfGuests}명</span>
                  </p>
                  <p className="text-gray-700 font-medium">
                    예약 상태:{" "}
                    <span className="font-bold">
                      {item.status ? item.status : "확인 중"}
                    </span>
                  </p>

                  <button
                    onClick={() => handleCancelReservation(item.reservationNo)}
                    className="mt-2 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                  >
                    예약 취소
                  </button>
                </div>
              ))}
            </div>
          )}
          {reservationSettingBd?.items && isStoreOwner && (
            <div className="mt-6 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
              <h4 className="text-lg font-bold text-gray-700 mb-3">
                예약 설정 정보
              </h4>

              {reservationSettingBd.items.settingInfo && (
                <div className="mb-4 text-sm text-gray-700 space-y-1">
                  <p>
                    <strong>설명:</strong>{" "}
                    {reservationSettingBd.items.settingInfo.description}
                  </p>
                  <p>
                    <strong>예약 인원:</strong>{" "}
                    {reservationSettingBd.items.settingInfo.minNum}명 ~{" "}
                    {reservationSettingBd.items.settingInfo.maxNum}명
                  </p>
                  <p>
                    <strong>최대 팀 수:</strong>{" "}
                    {reservationSettingBd.items.settingInfo.maxTeamNum}팀
                  </p>
                  <p>
                    <strong>예약 간격:</strong>{" "}
                    {reservationSettingBd.items.settingInfo.interval}분
                  </p>
                </div>
              )}

              {reservationSettingBd.items.reservation && isStoreOwner && (
                <div className="text-sm text-gray-700">
                  <h5 className="font-semibold mb-1">요일별 예약 가능 시간</h5>
                  <ul className="space-y-1">
                    {reservationSettingBd.items.reservation.map((item, idx) => {
                      const dayMap = {
                        Monday: "월",
                        Tuesday: "화",
                        Wednesday: "수",
                        Thursday: "목",
                        Friday: "금",
                        Saturday: "토",
                        Sunday: "일",
                      };
                      return (
                        <li key={idx}>
                          <span className="font-medium">
                            {dayMap[item.weekDay] || item.weekDay}
                          </span>
                          : {item.reservationStartTime} ~{" "}
                          {item.reservationEndTime}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}
        </aside>
      </div>
    </>
  );
};

export default Restaurant;
