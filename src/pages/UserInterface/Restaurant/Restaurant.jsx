import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
  const stars = [];
  const ratingValue = Number(averageRating) || 0;

  return (
    <div className="flex items-center mb-4">
      <RatingStars value={ratingValue} />
      <span className="ml-2.5 font-bold text-gray-600">
        {ratingValue.toFixed(1)}점 ({reviewCount}명의 평가)
      </span>
    </div>
  );
};

const Restaurant = () => {
  const { restaurantId } = useParams();
  const [buttonType, setButtonType] = useState(3);
  const [restaurantData, setRestaurantData] = useState({
    details: null,
    ratingInfo: null,
    menuItems: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openOperatingTime, setOpenOperatingTime] = useState(false);
  const [openReservationSetting, setOpenReservationSetting] = useState(false);
  const [openReservation, setOpenReservation] = useState(false);
  const { auth } = useContext(AuthContext);
  const [isStoreOwner, setIsStoreOwner] = useState(false);

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
  console.log(reservationSettingBd.items.reservation);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        const fetchDetails = async () => {
          const mockDetailsResponse = {
            header: { code: "S101", message: "식당 상세 조회 성공" },
            body: {
              items: [
                {
                  restaurantName: "감성 타코",
                  restaurantAddress: "서울시 강남구 테헤란로 427",
                  restaurantDescription:
                    "신선한 재료로 만드는 정통 멕시칸 요리를 즐길 수 있는 곳입니다. 다양한 타코와 파히타가 준비되어 있습니다.",
                  restaurantMainPhoto:
                    "https://via.placeholder.com/600x400/cccccc/808080?text=대표+사진",
                  restaurantCuisineType: ["멕시칸", "타코", "퓨전"],
                  restaurantMapX: "37.504547",
                  restaurantMapZ: "127.048963",
                },
              ],
            },
          };
          if (mockDetailsResponse.header.code !== "S101") {
            throw new Error(mockDetailsResponse.header.message);
          }
          return mockDetailsResponse.body.items[0];
        };

        const fetchRating = async () => {
          const mockRatingResponse = {
            header: { code: "S102", message: "별점 정보 조회 성공" },
            body: {
              averageRating: 4.5,
              reviewCount: 125,
            },
          };
          if (mockRatingResponse.header.code !== "S102") {
            throw new Error(mockRatingResponse.header.message);
          }
          return mockRatingResponse.body;
        };

        const fetchMenu = async () => {
          const mockMenuResponse = {
            header: { code: "S103", message: "메뉴 정보 조회 성공" },
            body: {
              items: [
                {
                  menuId: 1,
                  menuName: "감성 그릴드 파히타",
                  menuPrice: 38000,
                  menuImageUrl:
                    "https://via.placeholder.com/150/cccccc/808080?text=음식+사진",
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
                    "https://via.placeholder.com/150/cccccc/808080?text=음식+사진",
                },
                {
                  menuId: 4,
                  menuName: "애플망고 에이드",
                  menuPrice: 6500,
                  menuImageUrl:
                    "https://via.placeholder.com/150/cccccc/808080?text=음식+사진",
                },
              ],
            },
          };
          if (mockMenuResponse.header.code !== "S103") {
            throw new Error(mockMenuResponse.header.message);
          }
          return mockMenuResponse.body.items;
        };

        const [details, ratingInfo, menuItems] = await Promise.all([
          fetchDetails(),
          fetchRating(),
          fetchMenu(),
        ]);

        setRestaurantData({ details, ratingInfo, menuItems });
      } catch (err) {
        setError(err.message || "데이터를 불러오는 중 오류가 발생했습니다.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [restaurantId]);

  const handleCopyAddress = () => {
    if (restaurantData.details?.restaurantAddress) {
      navigator.clipboard
        .writeText(restaurantData.details.restaurantAddress)
        .then(() => alert("주소가 복사되었습니다!"));
    }
  };

  if (loading) {
    return <div className="text-center p-12 text-lg">로딩 중...</div>;
  }
  if (error) {
    return (
      <div className="text-center p-12 text-lg text-red-600">오류: {error}</div>
    );
  }
  if (!restaurantData.details || !restaurantData.ratingInfo) {
    return (
      <div className="text-center p-12">가게 정보를 표시할 수 없습니다.</div>
    );
  }

  const { details, ratingInfo, menuItems } = restaurantData;
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
          <section className={cardStyles}>
            <img
              src={details.restaurantMainPhoto}
              alt={`${details.restaurantName} 대표 사진`}
              className="w-full h-[300px] object-cover rounded-lg bg-gray-200 mb-5"
            />
            <div>
              <p className="text-gray-500 text-sm m-0">
                {details.restaurantCuisineType?.join(", ")}
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

          <section className={cardStyles}>
            <h3 className="mt-0 mb-4 text-[#ff7750] text-xl font-bold">
              가게 설명
            </h3>
            <p className="text-gray-600 leading-relaxed">
              {details.restaurantDescription}
            </p>
          </section>

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
              {menuItems.map((item) => (
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
          <ReviewPage restaurantNo={restaurantId} />
        </main>

        <aside className="flex-1">
          {details?.restaurantMapX && details?.restaurantMapZ ? (
            <KakaoMap
              lat={details.restaurantMapX}
              lng={details.restaurantMapZ}
              name={details.restaurantName}
            />
          ) : (
            <div className="w-full h-[300px] bg-gray-200 flex justify-center items-center text-gray-500 rounded-lg text-lg">
              위치 정보가 없어 지도를 표시할 수 없습니다.
            </div>
          )}
          <div className="text-sm text-gray-600 mt-2">
            클릭시 카카오맵에서 해당 위치를 확인할 수 있습니다.
          </div>

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
