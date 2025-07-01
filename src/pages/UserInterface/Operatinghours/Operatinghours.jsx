import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
registerLocale("ko", ko);
import "react-datepicker/dist/react-datepicker.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
import useApi from "../../../hooks/useApi";
import dayjs from "dayjs";
import "dayjs/locale/ko";

dayjs.locale("ko");

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
} from "./operatingHoursStyles";

const Operatinghours = ({ restaurantNo }) => {
  const [operatingHoursModal, setOperatingHoursModal] = useState(true);
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
  const { header, body, error, loading, refetch } = useApi(
    "/api/operatings",
    {
      method: "post",
    },
    false
  );

  // ────────────────────────────────────────────────────────────────────────────
  // 문자열 ↔ dayjs ↔ Date 변환 유틸 (빈 문자열 안전 처리 포함)
  // ────────────────────────────────────────────────────────────────────────────
  const strToDay = (s) => {
    if (!s) return null;
    const parsed = dayjs(`1970-01-01 ${s}`, "YYYY-MM-DD HH:mm");
    if (!parsed.isValid()) {
      console.warn(`Invalid time format for input: ${s}`);
      return null;
    }
    return parsed;
  };

  const dayToStr = (d, isEndTime = false, startTime = null) => {
    if (!d || !d.isValid()) return "";
    if (isEndTime && startTime) {
      const start = strToDay(startTime);
      if (start && d.isBefore(start)) {
        // endTime이 startTime보다 앞서면 24시간 추가
        const hours = d.hour() + 24;
        const minutes = d.minute();
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      }
    }
    return d.format("HH:mm");
  };

  const dayToDate = (d) => (d && d.isValid() ? d.toDate() : null);
  const dateToDay = (d) => (d ? dayjs(d) : null);

  const check10Min = (time) => {
    if (!time || time.minute() % 10 !== 0) {
      alert("10분 단위로만 선택할 수 있습니다.");
      return false;
    }
    return true;
  };

  // 공통 업데이트 함수
  const updateTime = (day, field, d) => {
    setOperatingHoursInfo((prev) =>
      prev.map((info, idx) =>
        idx === day
          ? {
              ...info,
              [field]: dayToStr(
                d,
                field === "endTime" || field === "breakEndTime",
                field === "endTime" ? info.startTime : info.breakStartTime
              ),
            }
          : info
      )
    );
  };

  // 영업 시간 선택
  const handleTime = (dateObj, day, field) => {
    const d = dateToDay(dateObj);
    if (!check10Min(d)) return;

    if (field === "endTime") {
      const start = strToDay(operatingHoursInfo[day].startTime);
      if (start && d && d.isBefore(start)) {
        // endTime이 startTime보다 앞서면 24시간 추가
        updateTime(day, field, d.add(1, "day"));
      } else {
        updateTime(day, field, d);
      }
    } else {
      updateTime(day, field, d);
    }
  };

  // 브레이크 타임 선택
  const handleBreak = (info, dateObj, day, field) => {
    const d = dateToDay(dateObj);
    if (!check10Min(d)) return;

    const start = strToDay(info.startTime);
    const end = strToDay(info.endTime);

    if (field === "breakStartTime" && d.isBefore(start)) {
      alert("브레이크 시작은 영업 시작 이후여야 합니다.");
      return;
    }
    if (field === "breakEndTime" && d.isAfter(end)) {
      alert("브레이크 종료는 영업 종료 이전이어야 합니다.");
      return;
    }

    if (field === "breakEndTime") {
      const breakStart = strToDay(info.breakStartTime) || start;
      let adjustedEnd = d;
      if (adjustedEnd.isBefore(breakStart)) {
        adjustedEnd = adjustedEnd.add(1, "day");
      }
      updateTime(day, field, adjustedEnd);
    } else {
      updateTime(day, field, d);
    }
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
      restaurantNo: "8",
      weekDay: dayOfWeek[i],
    }));
    console.log(update);
    refetch({ data: update });
  };

  // ──────────────────────────────────────────────────────────────────────
  return (
    operatingHoursModal && (
      <ModalWrapper>
        <CloseBtn>
          <CloseRoundedIcon
            style={{ fontSize: 40 }}
            onClick={() => setOperatingHoursModal(false)}
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
                              info.startTime
                                ? dayToDate(strToDay(info.startTime))
                                : null
                            }
                            onChange={(d) => handleTime(d, dayIdx, "startTime")}
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
                              info.endTime
                                ? dayToDate(strToDay(info.endTime))
                                : null
                            }
                            onChange={(d) => handleTime(d, dayIdx, "endTime")}
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
                                ? dayToDate(strToDay(info.breakStartTime))
                                : null
                            }
                            onChange={(d) =>
                              handleBreak(info, d, dayIdx, "breakStartTime")
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
                              info.breakEndTime
                                ? dayToDate(strToDay(info.breakEndTime))
                                : null
                            }
                            onChange={(d) =>
                              handleBreak(info, d, dayIdx, "breakEndTime")
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
    )
  );
};

export default Operatinghours;
