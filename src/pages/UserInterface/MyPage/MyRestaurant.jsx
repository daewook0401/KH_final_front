import { useContext, useState } from "react";
import AuthContext from "../../../provider/AuthContext";
import useApi from "../../../hooks/useApi";
import axios from "axios";
import { useEffect } from "react";
import Operatinghours from "../Operatinghours/Operatinghours";
import Settings from "../Reservation/Settings";

const MyRestaurant = () => {
  const { auth } = useContext(AuthContext);
  const [myRestaurant, setMyRestaurant] = useState(null);
  const [openOperatingTime, setOpenOperatingTime] = useState(false);
  const [openReservationSetting, setOpenReservationSetting] = useState(false);

  useEffect(() => {
    axios
      .get("/api/settings/restaurant")
      .then((res) => {
        console.log("왜안찍힘??", res);
        setMyRestaurant(res.data.body.items);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const { body: operatingInfoBd, refetch: refetchOperating } = useApi(
    "/api/operatings/memberNo",
    { method: "get" }
  );

  const { body: reservationSettingBd, refetch: refetchReservation } = useApi(
    "/api/settings/byMemberNo",
    { method: "get" }
  );

  const handleDeleteOperatingTime = () => {
    axios
      .delete("/api/operatings", {
        params: { restaurantNo: myRestaurant.restaurantNo },
      })
      .then((res) => {
        console.log(res);
        alert("운영시간 삭제되었습니다!");
        refetchOperating();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDeleteReservationSetting = () => {
    axios
      .delete("/api/settings", {
        params: { restaurantNo: myRestaurant.restaurantNo },
      })
      .then((res) => {
        console.log(res);
        alert("예약설정 삭제되었습니다!");
        refetchReservation();
        refetchOperating();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleAddOperatingTime = () => {
    setOpenOperatingTime(true);
  };
  const handleAddReservationSetting = () => {
    setOpenReservationSetting(true);
  };

  console.log(
    "운영시간정보 :",
    operatingInfoBd,
    "예약설정정보",
    reservationSettingBd
  );
  const weekInfo = [
    { key: "Monday", label: "월" },
    { key: "Tuesday", label: "화" },
    { key: "Wednesday", label: "수" },
    { key: "Thursday", label: "목" },
    { key: "Friday", label: "금" },
    { key: "Saturday", label: "토" },
    { key: "Sunday", label: "일" },
  ];

  /* 영업시간 배열 ⇒ { Monday: {...}, Tuesday: {...}, ... }  맵으로 변환 */
  const operatingMap = Object.fromEntries(
    (operatingInfoBd?.items || []).map((it) => [it.weekDay, it])
  );

  const root = reservationSettingBd?.items || {}; // ← 배열 아님!
  const reservationArr = root.reservation || [];
  const settingInfo = root.settingInfo || {};
  const reservationMap = Object.fromEntries(
    reservationArr.map((r) => [r.weekDay, r])
  );

  const hasOperating = (operatingInfoBd?.items || []).length > 0;
  const hasReservation =
    (reservationSettingBd?.items?.reservation || []).length > 0 &&
    reservationSettingBd?.items?.settingInfo;

  return (
    <>
      {openOperatingTime && (
        <Operatinghours
          setOpenOperatingTime={setOpenOperatingTime}
          restaurantNo={myRestaurant.restaurantNo}
          refetchOperating={refetchOperating}
        />
      )}
      {openReservationSetting && (
        <Settings
          setOpenReservationSetting={setOpenReservationSetting}
          restaurantNo={myRestaurant.restaurantNo}
          refetchReservation={refetchReservation}
        />
      )}
      <section className="p-6 space-y-6">
        <article className="border rounded-lg shadow-sm p-6 bg-white">
          <h2 className="text-xl font-bold mb-4">
            {myRestaurant?.restaurantName || "이름 미등록"}
          </h2>
          <ul className="space-y-1 text-sm">
            <li>
              <strong>주소:</strong>{" "}
              {myRestaurant?.restaurantAddress || "주소 미등록"}
            </li>
            <li>
              <strong>전화:</strong>{" "}
              {myRestaurant?.restaurantPhoneNumber || "전화번호 미등록"}
            </li>
            <li>
              <strong>설명:</strong>{" "}
              {myRestaurant?.restaurantDescription || "-"}
            </li>
          </ul>
        </article>
        <article className="border rounded-lg shadow-sm p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">운영 시간</h3>
            <div className="space-x-2">
              <button
                onClick={handleAddOperatingTime}
                disabled={hasOperating}
                className={`px-3 py-1 text-xs rounded
                  ${
                    hasOperating
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
              >
                운영시간 등록
              </button>
              <button
                onClick={() => {
                  if (hasReservation) {
                    alert(
                      "먼저 예약 설정을 삭제해야 운영 시간을 삭제할 수 있습니다."
                    );
                    return;
                  }
                  handleDeleteOperatingTime();
                }}
                disabled={hasReservation}
                className={`px-3 py-1 text-xs rounded
              ${
                hasReservation
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-red-500 text-white"
              }`}
              >
                운영시간 삭제
              </button>
            </div>
          </div>
          {weekInfo.map(({ key, label }) => {
            const info = operatingMap[key];
            if (!info) return null; // 해당 요일 데이터가 없으면 건너뜀

            /* 24:00 이상 처리 */
            const endDisp =
              +info.endTime.split(":")[0] >= 24
                ? `${String(+info.endTime.split(":")[0] - 24).padStart(
                    2,
                    "0"
                  )}:${info.endTime.split(":")[1]}`
                : info.endTime;

            return (
              <div key={info.operatingHoursNo} className="py-1 flex text-sm">
                <span className="w-10 font-semibold">{label}</span>
                <span>
                  {info.startTime} ~ {endDisp}
                  {info.breakStartTime && info.breakEndTime && (
                    <span className="text-gray-500 ml-2">
                      (브레이크 {info.breakStartTime} ~ {info.breakEndTime})
                    </span>
                  )}
                </span>
              </div>
            );
          })}
        </article>
        {/*  ───────────── ④ 예약-설정 출력 ───────────── */}
        <article className="border rounded-lg shadow-sm p-4 bg-white">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold">예약 설정</h3>
            <div className="space-x-2">
              {/* 등록 버튼 */}
              <button
                onClick={() => {
                  if (!hasOperating) {
                    alert("운영 시간이 없으면 예약 설정을 등록할 수 없습니다.");
                    return;
                  }
                  handleAddReservationSetting();
                }}
                disabled={!hasOperating || hasReservation}
                className={`px-3 py-1 text-xs rounded
                  ${
                    !hasOperating || hasReservation
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
              >
                예약설정 등록
              </button>

              {/* 삭제 버튼 */}
              <button
                onClick={handleDeleteReservationSetting}
                disabled={!hasReservation}
                className={`px-3 py-1 text-xs rounded ${
                  hasReservation
                    ? "bg-red-500 text-white"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                예약설정 삭제
              </button>
            </div>
          </div>

          {/* ─── 본문 ─── */}
          {hasReservation ? (
            <>
              {/* 요일별 시간표 */}
              <div>
                {weekInfo.map(({ key, label }) => {
                  const r = reservationMap[key];
                  return (
                    <div key={key} className="flex py-1 text-sm items-center">
                      <span className="w-10 font-semibold">{label}</span>
                      <span>
                        {r
                          ? `${r.reservationStartTime} ~ ${r.reservationEndTime}`
                          : "~"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 기본 설정(인터벌 등) */}
              <div className="mt-3 text-xs text-gray-600 leading-5 space-y-0.5">
                <p className="font-semibold">기본 설정</p>
                <p>· 예약 간격: {settingInfo.interval}분</p>
                <p>· 최소 인원: {settingInfo.minNum}명</p>
                <p>· 최대 인원: {settingInfo.maxNum}명</p>
                <p>· 한 타임당 최대 팀 수: {settingInfo.maxTeamNum}팀</p>
                {settingInfo.description && (
                  <p>· 메모: {settingInfo.description}</p>
                )}
              </div>
            </>
          ) : (
            /* 존재하지 않을 때 문구 */
            <p className="text-gray-500 text-sm">
              예약설정이 존재하지 않습니다.
            </p>
          )}
        </article>
      </section>
    </>
  );
};
export default MyRestaurant;
