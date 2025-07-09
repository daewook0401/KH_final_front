import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
registerLocale("ko", ko);
import "react-datepicker/dist/react-datepicker.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FormatListBulletedAddIcon from "@mui/icons-material/FormatListBulletedAdd";
import InfoIcon from "@mui/icons-material/Info";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import useApi from "../../../hooks/useApi";

const Settings = ({
  setOpenReservationSetting,
  restaurantNo,
  refetchReservation,
}) => {
  const [settingInfo, setSettingInfo] = useState({
    restaurantNo: restaurantNo,
    interval: 30,
    maxNum: 5,
    minNum: 1,
    maxTeamNum: 5,
    description: "",
  });

  const [reservationTimeInfo, setReservationTimeInfo] = useState(
    [...Array(7)].map(() => ({
      reservationStartTime: "09:00",
      reservationEndTime: "18:00",
    }))
  );

  const [dayOfWeek, setDayOfWeek] = useState([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]);

  const { refetch } = useApi("/api/settings", { method: "post" }, false);

  const toDate = (timeStr) => {
    if (!timeStr) return null;
    const [hStr, mStr] = timeStr.split(":");
    let hour = Number(hStr);
    const minute = Number(mStr);
    const d = new Date(2000, 0, 1);
    if (hour >= 24) {
      hour = hour % 24;
    }
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  const toString = (info, time, type) => {
    if (!(time instanceof Date) || isNaN(time)) return "";
    let totalMin = time.getHours() * 60 + time.getMinutes();
    if (type === "endTime" && info.reservationStartTime) {
      const [sh, sm] = info.reservationStartTime.split(":").map(Number);
      const startMin = sh * 60 + sm;
      if (totalMin <= startMin) totalMin += 24 * 60;
    }
    const hour = Math.floor(totalMin / 60);
    const minute = totalMin % 60;
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(
      2,
      "0"
    )}`;
  };

  const check10Min = (time) => {
    if (!time) return false;
    if (time.getMinutes() % 10 !== 0) {
      alert("10분 단위로만 선택할 수 있습니다.");
      return false;
    }
    return true;
  };

  const handleTime = (time, dayIdx, type) => {
    if (!check10Min(time)) return;
    updateTime(time, dayIdx, type);
  };

  const updateTime = (time, dayIdx, type) => {
    setReservationTimeInfo((prev) =>
      prev.map((info, idx) =>
        idx === dayIdx
          ? {
              ...info,
              [type]: toString(info, time, type),
            }
          : info
      )
    );
  };

  const handleAddTime = (day) => {
    reservationTimeInfo[day].reservationStartTime === "" &&
    reservationTimeInfo[day].reservationEndTime === ""
      ? setReservationTimeInfo((prev) =>
          prev.map((info, index) =>
            index === day
              ? {
                  ...info,
                  reservationStartTime: "09:00",
                  reservationEndTime: "18:00",
                }
              : info
          )
        )
      : alert("예약 가능한 타임이 이미 설정되어 있습니다.");
  };

  const handleClearTime = (day) => {
    setReservationTimeInfo((prev) =>
      prev.map((info, index) =>
        index === day
          ? {
              ...info,
              reservationStartTime: "",
              reservationEndTime: "",
            }
          : info
      )
    );
  };

  const handleSubmit = () => {
    const update = reservationTimeInfo.map((info, i) => ({
      ...info,
      restaurantNo: restaurantNo,
      weekDay: dayOfWeek[i],
    }));
    refetch({
      data: {
        reservation: update,
        settingInfo: settingInfo,
      },
    })
      .then(() => {
        alert("예약설정이 등록되었습니다!");
        refetchReservation();
        setOpenReservationSetting(false);
      })
      .catch((err) => {
        console.error(err);
        alert("예약설정 등록에 실패했습니다.");
      });
  };

  return (
    <>
      <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000] flex items-center justify-center">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[1000px] max-h-[90vh] flex flex-col">
          <button
            onClick={() => setOpenReservationSetting(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            <CloseRoundedIcon style={{ fontSize: "32px" }} />
          </button>

          <div className="w-full text-center py-6 px-8">
            <h2 className="text-2xl font-extrabold text-[#1e2b47] relative inline-block">
              예약설정
              <span className="block w-full h-px bg-[#1e2b47] mt-2"></span>
            </h2>
          </div>

          <div className="px-8 flex-1 overflow-y-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* 왼쪽 영역 */}
              <div className="flex-1 flex flex-col gap-6">
                <div>
                  <div className="flex items-center text-lg font-bold mb-3 border-b pb-2 border-gray-300">
                    <FormatListBulletedAddIcon />
                    <span className="ml-2">기본 예약 조건</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          최소인원
                        </label>
                        <input
                          type="number"
                          value={settingInfo.minNum}
                          onChange={(e) =>
                            setSettingInfo((prev) => ({
                              ...prev,
                              minNum: e.target.value,
                            }))
                          }
                          className="w-full border rounded px-2 py-1 text-center focus:outline-none focus:border-blue-600"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700">
                          최대인원
                        </label>
                        <input
                          type="number"
                          value={settingInfo.maxNum}
                          onChange={(e) =>
                            setSettingInfo((prev) => ({
                              ...prev,
                              maxNum: e.target.value,
                            }))
                          }
                          className="w-full border rounded px-2 py-1 text-center focus:outline-none focus:border-blue-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        예약 간격
                      </label>
                      <select
                        value={settingInfo.interval}
                        onChange={(e) =>
                          setSettingInfo((prev) => ({
                            ...prev,
                            interval: e.target.value,
                          }))
                        }
                        className="w-1/2 border rounded px-2 py-1 mt-1 focus:outline-none focus:border-blue-600"
                      >
                        <option value="30">30분</option>
                        <option value="60">60분</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        한 타임당 받을 인원수
                      </label>
                      <input
                        type="number"
                        value={settingInfo.maxTeamNum}
                        onChange={(e) =>
                          setSettingInfo((prev) => ({
                            ...prev,
                            maxTeamNum: e.target.value,
                          }))
                        }
                        className="w-1/2 border rounded px-2 py-1 text-center focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center text-lg font-bold mb-3 border-b pb-2 border-gray-300">
                    <InfoIcon />
                    <span className="ml-2">예약 관련 설명</span>
                  </div>
                  <textarea
                    value={settingInfo.description}
                    onChange={(e) =>
                      setSettingInfo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full border rounded px-2 py-2 h-28 resize-none focus:outline-none focus:border-blue-600"
                  ></textarea>
                </div>
              </div>

              {/* 오른쪽 영역 */}
              <div className="flex-1">
                <div className="flex items-center justify-center text-lg font-bold mb-3 border-b pb-2 border-gray-300">
                  <AccessTimeIcon />
                  <span className="ml-2">요일별 예약 가능한 시간</span>
                </div>

                {reservationTimeInfo.map((info, index) => (
                  <div className="flex items-center gap-2 py-1 min-h-[44px]">
                    <div className="w-[90px] font-medium text-sm text-left">
                      {dayOfWeek[index]}
                    </div>
                    <AddCircleOutlineIcon
                      onClick={() => handleAddTime(index)}
                      style={{
                        cursor: "pointer",
                        fontSize: "20px",
                        color: "#1e2b47",
                      }}
                    />
                    {info.reservationStartTime && info.reservationEndTime && (
                      <div className="flex items-center gap-2 ml-2">
                        <div>
                          <DatePicker
                            selected={
                              info.reservationStartTime
                                ? toDate(info.reservationStartTime)
                                : null
                            }
                            onChange={(time) =>
                              handleTime(time, index, "reservationStartTime")
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            dateFormat="HH:mm"
                            locale="ko"
                            customInput={
                              <input className="w-16 border rounded px-1 py-1 text-center cursor-pointer hover:border-blue-600" />
                            }
                          />
                        </div>
                        <span className="text-sm font-medium">~</span>
                        <div>
                          <DatePicker
                            selected={
                              info.reservationEndTime
                                ? toDate(info.reservationEndTime)
                                : null
                            }
                            onChange={(time) =>
                              handleTime(time, index, "reservationEndTime")
                            }
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={10}
                            dateFormat="HH:mm"
                            locale="ko"
                            customInput={
                              <input className="w-16 border rounded px-1 py-1 text-center cursor-pointer hover:border-blue-600" />
                            }
                          />
                        </div>
                        <ClearIcon
                          onClick={() => handleClearTime(index)}
                          style={{
                            cursor: "pointer",
                            fontSize: "20px",
                            color: "#1e2b47",
                            marginLeft: "5px",
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end px-8 py-4">
            <button
              onClick={handleSubmit}
              className="bg-blue-700 text-white rounded px-4 py-2 hover:bg-blue-800 transition"
            >
              등록하기
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
