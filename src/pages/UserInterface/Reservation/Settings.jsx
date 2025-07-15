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

  const [dayOfWeek] = useState([
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
    if (hour >= 24) hour = hour % 24;
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
        idx === dayIdx ? { ...info, [type]: toString(info, time, type) } : info
      )
    );
  };

  const handleAddTime = (day) => {
    if (
      reservationTimeInfo[day].reservationStartTime === "" &&
      reservationTimeInfo[day].reservationEndTime === ""
    ) {
      setReservationTimeInfo((prev) =>
        prev.map((info, index) =>
          index === day
            ? {
                ...info,
                reservationStartTime: "09:00",
                reservationEndTime: "18:00",
              }
            : info
        )
      );
    } else {
      alert("예약 가능한 타임이 이미 설정되어 있습니다.");
    }
  };

  const handleClearTime = (day) => {
    setReservationTimeInfo((prev) =>
      prev.map((info, index) =>
        index === day
          ? { ...info, reservationStartTime: "", reservationEndTime: "" }
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
      data: { reservation: update, settingInfo },
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
    <div className="fixed inset-0 bg-black/50 z-[1000] flex justify-center items-center">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[950px] max-h-[95vh] flex flex-col overflow-hidden">
        <button
          onClick={() => setOpenReservationSetting(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <CloseRoundedIcon style={{ fontSize: "32px" }} />
        </button>

        <div className="px-8 py-6 border-b">
          <h2 className="text-2xl font-bold text-[#1e2b47] text-center">
            예약설정
          </h2>
        </div>

        <div className="p-8 flex-1 overflow-y-auto bg-gray-50">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* 왼쪽 */}
            <div className="flex-1 bg-white rounded-xl shadow p-6 space-y-5">
              <div>
                <div className="flex items-center text-lg font-semibold mb-3 border-b pb-2">
                  <FormatListBulletedAddIcon />
                  <span className="ml-2">기본 예약 조건</span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600">
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
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-600">
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
                        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
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
                      className="w-full border rounded-lg px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-blue-200"
                    >
                      <option value="30">30분</option>
                      <option value="60">60분</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600">
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
                      className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center text-lg font-semibold mb-3 border-b pb-2">
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
                  className="w-full border rounded-lg px-3 py-3 h-28 resize-none focus:outline-none focus:ring focus:ring-blue-200"
                  placeholder="설명을 입력하세요..."
                ></textarea>
              </div>
            </div>

            {/* 오른쪽 */}
            <div className="flex-1 bg-white rounded-xl shadow p-6">
              <div className="flex items-center text-lg font-semibold mb-4 border-b pb-2">
                <AccessTimeIcon />
                <span className="ml-2">요일별 예약 시간</span>
              </div>

              {reservationTimeInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-2 py-2">
                  <div className="w-[80px] font-medium text-sm">
                    {dayOfWeek[index]}
                  </div>
                  <AddCircleOutlineIcon
                    onClick={() => handleAddTime(index)}
                    className="cursor-pointer text-orange-600 hover:text-orange-800 transition"
                  />
                  {info.reservationStartTime && info.reservationEndTime && (
                    <div className="flex items-center gap-2 ml-2">
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
                          <input className="w-16 border rounded-md px-1 py-1 text-center cursor-pointer focus:outline-none hover:border-blue-500" />
                        }
                      />
                      <span className="text-sm font-medium">~</span>
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
                          <input className="w-16 border rounded-md px-1 py-1 text-center cursor-pointer focus:outline-none hover:border-blue-500" />
                        }
                      />
                      <ClearIcon
                        onClick={() => handleClearTime(index)}
                        className="cursor-pointer text-gray-500 hover:text-red-500 transition ml-1"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t bg-white p-4 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-orange-500 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-600 transition shadow"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
