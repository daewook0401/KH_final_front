import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
registerLocale("ko", ko);
import "react-datepicker/dist/react-datepicker.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import useApi from "../../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const Operatinghours = ({
  setOpenOperatingTime,
  restaurantNo,
  refetchOperating,
}) => {
  const navi = useNavigate();
  const [operatingHoursInfo, setOperatingHoursInfo] = useState(
    [...Array(7)].map(() => ({
      startTime: "09:00",
      endTime: "18:00",
      breakStartTime: "",
      breakEndTime: "",
    }))
  );

  const dayOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const { refetch } = useApi("/api/operatings", { method: "post" }, false);

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
    if (type === "endTime" || (type === "breakEndTime" && info.startTime)) {
      const [sh, sm] = info.startTime.split(":").map(Number);
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

  const updateTime = (time, dayIdx, type) => {
    setOperatingHoursInfo((prev) =>
      prev.map((info, idx) =>
        idx === dayIdx ? { ...info, [type]: toString(info, time, type) } : info
      )
    );
  };

  const handleTime = (info, time, dayIdx, type) => {
    if (!check10Min(time)) return;
    if (
      type === "startTime" &&
      toDate(info.breakStartTime) < time &&
      time < toDate(info.breakEndTime)
    ) {
      alert("시작시각이 브레이크 타임 사이에 있을 수 없습니다.");
      return;
    }
    if (type === "endTime" && toDate(info.breakEndTime) > time) {
      alert("마감시각은 브레이크 종료시각보다 이후여야 합니다.");
      return;
    }
    updateTime(time, dayIdx, type);
  };

  const handleBreak = (info, time, dayIdx, type) => {
    if (!check10Min(time)) return;
    if (type === "breakStartTime" && toDate(info.startTime) > time) {
      alert("브레이크 시작은 영업 시작 이후여야 합니다.");
      return;
    }
    if (type === "breakEndTime" && toDate(info.endTime) < time) {
      alert("브레이크 종료는 영업 종료 이전이어야 합니다.");
      return;
    }
    if (type === "breakStartTime" && toDate(info.breakEndTime) < time) {
      alert("브레이크 시작는 브레이크 종료 이전이어야 합니다.");
      return;
    }
    if (type === "breakEndTime" && toDate(info.breakStartTime) > time) {
      alert("브레이크 종료는 브레이크 시작 이후여야 합니다.");
      return;
    }
    updateTime(time, dayIdx, type);
  };

  const handleAddTime = (day) => {
    setOperatingHoursInfo((prev) =>
      prev.map((info, idx) => {
        if (idx !== day) return info;
        if (!info.startTime && !info.endTime) {
          return { ...info, startTime: "09:00", endTime: "18:00" };
        }
        if (info.breakStartTime && info.breakEndTime) {
          alert("브레이크타임이 이미 설정되어 있습니다.");
          return info;
        }
        return { ...info, breakStartTime: "12:00", breakEndTime: "13:00" };
      })
    );
  };

  const handleClearTime = (day) => {
    setOperatingHoursInfo((prev) =>
      prev.map((info, idx) =>
        idx === day
          ? {
              ...info,
              breakStartTime: "",
              breakEndTime: "",
              ...(info.breakStartTime ? {} : { startTime: "", endTime: "" }),
            }
          : info
      )
    );
  };

  const handleSubmit = () => {
    const update = operatingHoursInfo.map((info, i) => ({
      ...info,
      restaurantNo,
      weekDay: dayOfWeek[i],
    }));
    refetch({ data: update })
      .then(() => {
        alert("운영시간이 등록되었습니다!");
        refetchOperating();
        setOpenOperatingTime(false);
      })
      .catch((err) => {
        console.error(err);
        alert("운영시간 등록에 실패했습니다.");
      });
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000]">
      <div className="flex justify-end mt-[80px] mr-[30px] text-white cursor-pointer z-[1001]">
        <CloseRoundedIcon
          style={{ fontSize: 40 }}
          onClick={() => setOpenOperatingTime(false)}
        />
      </div>

      <div className="w-[1000px] h-[700px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl z-[1000]">
        <div className="w-full h-[8%] mt-[15px] border-b border-[#fdfdfd] flex items-center justify-center">
          <h2 className="text-[24px] font-extrabold text-[#1e2b47] relative after:block after:w-[380px] after:h-[1px] after:bg-[#1e2b47] after:mt-[10px] after:mx-auto">
            운영 시간 및 브레이크타임 설정
          </h2>
        </div>

        <div className="flex flex-col mt-[10px] px-[40px] font-bold h-[70%] overflow-y-auto box-border">
          {operatingHoursInfo.map((info, dayIdx) => (
            <div
              key={dayIdx}
              className="flex items-center justify-center w-full bg-white rounded-xl shadow-sm border border-gray-200 py-5 mb-3 transition hover:shadow-md"
            >
              {/* 요일 + 버튼 */}
              <div className="flex flex-col items-center w-[120px]">
                <div className="text-[15px] font-medium mb-2">
                  {dayOfWeek[dayIdx]}
                </div>
                <div className="flex items-center gap-2">
                  <AddCircleOutlineIcon
                    onClick={() => handleAddTime(dayIdx)}
                    className="cursor-pointer text-[#1e2b47] hover:scale-110 transition"
                    style={{ fontSize: 20 }}
                  />
                  <ClearIcon
                    onClick={() => handleClearTime(dayIdx)}
                    className="cursor-pointer text-[#1e2b47] hover:scale-110 transition"
                    style={{ fontSize: 20 }}
                  />
                </div>
              </div>

              {/* 시간 블록 wrapper */}
              <div className="flex justify-center gap-4 min-w-[500px]">
                {/* 운영 시간 */}
                <div className="flex flex-col border border-gray-200 rounded-md p-3 bg-gray-50 min-w-[220px]">
                  <div className="text-xs font-semibold text-gray-600 mb-2">
                    운영시간
                  </div>
                  <div className="flex items-center gap-2">
                    <DatePicker
                      selected={info.startTime ? toDate(info.startTime) : null}
                      onChange={(time) =>
                        handleTime(info, time, dayIdx, "startTime")
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={10}
                      dateFormat="HH:mm"
                      locale="ko"
                      customInput={
                        <input className="w-[70px] h-[36px] text-center border border-gray-300 rounded-md px-2 cursor-pointer hover:border-[#0551cc] transition" />
                      }
                    />
                    <span className="text-sm font-medium">~</span>
                    <DatePicker
                      selected={info.endTime ? toDate(info.endTime) : null}
                      onChange={(time) =>
                        handleTime(info, time, dayIdx, "endTime")
                      }
                      showTimeSelect
                      showTimeSelectOnly
                      timeIntervals={10}
                      dateFormat="HH:mm"
                      locale="ko"
                      customInput={
                        <input className="w-[70px] h-[36px] text-center border border-gray-300 rounded-md px-2 cursor-pointer hover:border-[#0551cc] transition" />
                      }
                    />
                  </div>
                </div>

                {/* 브레이크 타임 */}
                {info.breakStartTime && info.breakEndTime ? (
                  <div className="flex flex-col border border-yellow-300 rounded-md p-3 bg-yellow-50 min-w-[220px]">
                    <div className="text-xs font-semibold text-yellow-700 mb-2">
                      브레이크타임
                    </div>
                    <div className="flex items-center gap-2">
                      <DatePicker
                        selected={
                          info.breakStartTime
                            ? toDate(info.breakStartTime)
                            : null
                        }
                        onChange={(time) =>
                          handleBreak(info, time, dayIdx, "breakStartTime")
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        dateFormat="HH:mm"
                        locale="ko"
                        customInput={
                          <input className="w-[70px] h-[36px] text-center border border-gray-300 rounded-md px-2 cursor-pointer hover:border-yellow-500 transition" />
                        }
                      />
                      <span className="text-sm font-medium">~</span>
                      <DatePicker
                        selected={
                          info.breakEndTime ? toDate(info.breakEndTime) : null
                        }
                        onChange={(time) =>
                          handleBreak(info, time, dayIdx, "breakEndTime")
                        }
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={10}
                        dateFormat="HH:mm"
                        locale="ko"
                        customInput={
                          <input className="w-[70px] h-[36px] text-center border border-gray-300 rounded-md px-2 cursor-pointer hover:border-yellow-500 transition" />
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div className="min-w-[220px]" />
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="w-full flex justify-center items-center h-[20%]">
          <button
            onClick={handleSubmit}
            className="bg-[#f2b789] text-white border-none rounded-full px-6 py-3 text-[16px] font-semibold cursor-pointer transition hover:bg-[#003f99] shadow-md hover:shadow-lg"
          >
            등록하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Operatinghours;
