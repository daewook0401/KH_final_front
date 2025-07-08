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

import {
  ModalWrapper,
  CloseBtn,
  ModalLabel,
  ModalHeader,
  ModalContent,
  TimeRow,
  DayLabel,
  TimeInput,
  TimeWrapper,
  BreakTimeRow,
  EnrollButton,
  DatePickerWrapper,
  Span,
  H2,
  ModalFooter,
} from "./OperatinghoursStyles";

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
  const {
    header,
    body,
    error: error,
    loading,
    refetch,
  } = useApi(
    "/api/operatings",
    {
      method: "post",
    },
    false
  );

  // ────────────────────────────────────────────────────────────────────────────
  /* 
    1. 문자열 => Date 변환
    endTime이 26:00 뭐 이런식으로 저장되어있으면 -24시간 한 뒤 date로 변환
    2. Date => 문자열 변환
    endTime이 startTime보다 작으면 +24한 뒤  문자열 변환
   */

  const toDate = (timeStr) => {
    if (!timeStr) return null;

    const [hStr, mStr] = timeStr.split(":");
    let hour = Number(hStr); // 26
    const minute = Number(mStr); // 00

    const d = new Date(2000, 0, 1);
    if (hour >= 24) {
      hour = hour % 24; // 26 ➜ 2
    }
    d.setHours(hour, minute, 0, 0);
    return d;
  };

  const toString = (info, time, type) => {
    if (!(time instanceof Date) || isNaN(time)) return "";
    //  Date -> 분단위
    let totalMin = time.getHours() * 60 + time.getMinutes();
    //  endTime이 startTime 보다 앞이면 +24 h
    if (type === "endTime" || (type === "breakEndTime" && info.startTime)) {
      const [sh, sm] = info.startTime.split(":").map(Number);
      const startMin = sh * 60 + sm;
      if (totalMin <= startMin) totalMin += 24 * 60;
    }
    //  분 => "HH:mm"
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

  // 공통 업데이트 함수
  const updateTime = (time, dayIdx, type) => {
    setOperatingHoursInfo((prev) =>
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

  // 영업 시간
  const handleTime = (time, dayIdx, type) => {
    if (!check10Min(time)) return;
    updateTime(time, dayIdx, type);
  };

  // 브레이크 타임
  const handleBreak = (info, time, dayIdx, type) => {
    if (!check10Min(time)) return;

    if (type === "breakStartTime" && toDate(info.startTime) > time) {
      alert("브레이크 시작은 영업 시작 이후여야 합니다.");
      return;
    }
    if (type === "breakEndTime" && toDate(info.endTime) > time) {
      alert("브레이크 종료는 영업 종료 이전이어야 합니다.");
      return;
    }
    updateTime(time, dayIdx, type);
  };

  // 기본/브레이크 시간 추가
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
      restaurantNo: restaurantNo,
      weekDay: dayOfWeek[i],
    }));
    console.log(update);
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

  // ──────────────────────────────────────────────────────────────────────
  return (
    <ModalWrapper>
      <CloseBtn>
        <CloseRoundedIcon
          style={{ fontSize: 40 }}
          onClick={() => setOpenOperatingTime(false)}
        />
      </CloseBtn>
      <ModalLabel>
        <ModalHeader>
          <H2>운영 시간 및 브레이크타임 설정</H2>
        </ModalHeader>
        <ModalContent>
          <TimeWrapper>
            {operatingHoursInfo.map((info, dayIdx) => (
              <div key={dayIdx}>
                <TimeRow>
                  <DayLabel>{dayOfWeek[dayIdx]}</DayLabel>
                  <AddCircleOutlineIcon
                    onClick={() => handleAddTime(dayIdx)}
                    style={{
                      cursor: "pointer",
                      marginTop: 5,
                      fontSize: 20,
                      color: "#1e2b47",
                    }}
                  />

                  {/* 영업시간 */}
                  {info.startTime && info.endTime && (
                    <DatePickerWrapper>
                      <div>
                        <DatePicker
                          selected={
                            info.startTime ? toDate(info.startTime) : null
                          }
                          onChange={(time) =>
                            handleTime(time, dayIdx, "startTime")
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={10}
                          dateFormat="HH:mm"
                          locale="ko"
                          customInput={<TimeInput />}
                        />
                      </div>
                      <Span>~</Span>
                      <div>
                        <DatePicker
                          selected={info.endTime ? toDate(info.endTime) : null}
                          onChange={(time) =>
                            handleTime(time, dayIdx, "endTime")
                          }
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={10}
                          dateFormat="HH:mm"
                          locale="ko"
                          customInput={<TimeInput />}
                        />
                      </div>
                      <ClearIcon
                        onClick={() => handleClearTime(dayIdx)}
                        style={{
                          cursor: "pointer",
                          marginLeft: 15,
                          marginTop: 5,
                          fontSize: 20,
                          color: "#1e2b47",
                        }}
                      />
                    </DatePickerWrapper>
                  )}

                  {/* 브레이크타임 */}
                  {info.breakStartTime && info.breakEndTime && (
                    <BreakTimeRow>
                      <div>
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
                          customInput={<TimeInput />}
                        />
                      </div>
                      <Span>~</Span>
                      <div>
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
                          customInput={<TimeInput />}
                        />
                      </div>
                      <ClearIcon
                        onClick={() => handleClearTime(dayIdx)}
                        style={{
                          cursor: "pointer",
                          marginLeft: 20,
                          marginTop: 5,
                          fontSize: 20,
                          color: "#1e2b47",
                        }}
                      />
                    </BreakTimeRow>
                  )}
                </TimeRow>
              </div>
            ))}
          </TimeWrapper>
        </ModalContent>
        <ModalFooter>
          <EnrollButton onClick={handleSubmit}>등록하기</EnrollButton>
        </ModalFooter>
      </ModalLabel>
    </ModalWrapper>
  );
};

export default Operatinghours;
