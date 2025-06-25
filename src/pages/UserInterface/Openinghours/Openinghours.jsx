import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ko } from "date-fns/locale";
registerLocale("ko", ko);
import "react-datepicker/dist/react-datepicker.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ClearIcon from "@mui/icons-material/Clear";
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
} from "./Openinghours.styles";

const Openinghours = ({ restaurantNo }) => {
  const [openingHoursModal, setOpeningHoursModal] = useState(true);
  const [openingHoursInfo, setOpeningHoursInfo] = useState(
    [...Array(7)].map(() => ({
      startTime: "09:00",
      endTime: "18:00",
      breakStartTime: "",
      breakEndTime: "",
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

  const parseTimeStringToDate = (timeStr) =>
    new Date(`1970-01-01T${timeStr}:00`);

  const parseDateToTimeString = (date) => {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const handleTime = (time, day, type) => {
    if (time.getMinutes() % 10 === 0) {
      setOpeningHoursInfo((prev) =>
        prev.map((info, index) =>
          index === day
            ? {
                ...info,
                [type]: parseDateToTimeString(time),
              }
            : info
        )
      );
    } else {
      alert("10분 단위로만 선택할 수 있습니다.");
    }
  };

  const handleBreakStartTime = (info, breakStartTime, day) => {
    if (breakStartTime.getMinutes() % 10 !== 0) {
      alert("10분 단위로만 선택할 수 있습니다.");
      return;
    }
    if (breakStartTime < parseTimeStringToDate(info.startTime)) {
      alert("브레이크 시작 시간은 영업 시작 시간 이후여야 합니다.");
      return;
    }
    setOpeningHoursInfo((prev) =>
      prev.map((info, index) =>
        index === day
          ? {
              ...info,
              breakStartTime: parseDateToTimeString(breakStartTime),
            }
          : info
      )
    );
  };

  const handleBreakEndTime = (info, breakEndTime, day) => {
    if (breakEndTime.getMinutes() % 10 !== 0) {
      alert("10분 단위로만 선택할 수 있습니다.");
      return;
    }
    if (breakEndTime > parseTimeStringToDate(info.endTime)) {
      alert("브레이크 종료 시간은 영업 종료 시간 이전이어야 합니다.");
      return;
    }
    setOpeningHoursInfo((prev) =>
      prev.map((info, index) =>
        index === day
          ? {
              ...info,
              breakEndTime: parseDateToTimeString(breakEndTime),
            }
          : info
      )
    );
  };

  const handleAddBreakTime = (day) => {
    openingHoursInfo[day].startTime == "" && openingHoursInfo[day].endTime == ""
      ? setOpeningHoursInfo((prev) =>
          prev.map((info, index) =>
            index === day
              ? {
                  ...info,
                  startTime: "09:00",
                  endTime: "18:00",
                }
              : info
          )
        )
      : setOpeningHoursInfo((prev) =>
          prev.map((info, index) =>
            index === day
              ? {
                  ...info,
                  breakStartTime: "12:00",
                  breakEndTime: "13:00",
                }
              : info
          )
        );
    openingHoursInfo[day].breakStartTime != "" &&
    openingHoursInfo[day].breakEndTime != ""
      ? alert("브레이크타임이 이미 설정되어 있습니다.")
      : null;
  };

  const handleClearTime = (day) => {
    setOpeningHoursInfo((prev) =>
      prev.map((info, index) =>
        index === day
          ? {
              ...info,
              startTime: "",
              endTime: "",
              breakStartTime: "",
              breakEndTime: "",
            }
          : info
      )
    );
  };

  const handleClearBreakTime = (day) => {
    setOpeningHoursInfo((prev) =>
      prev.map((info, index) =>
        index === day
          ? {
              ...info,
              breakStartTime: "",
              breakEndTime: "",
            }
          : info
      )
    );
  };

  return (
    <>
      {openingHoursModal && (
        <ModalWrapper>
          <CloseBtn>
            <CloseRoundedIcon
              style={{ fontSize: "40px" }}
              onClick={() => setOpeningHoursModal(false)}
            />
          </CloseBtn>
          <ModalLabel>
            <ModalHeader>
              <H2>운영 시간 및 브레이크타임 설정</H2>
            </ModalHeader>
            <ModalContent>
              <TimeWrapper>
                {openingHoursInfo.map((info, index) => (
                  <div key={index}>
                    <TimeRow>
                      <DayLabel>{dayOfWeek[index]}</DayLabel>
                      <AddCircleOutlineIcon
                        onClick={() => handleAddBreakTime(index)}
                        style={{
                          cursor: "pointer",
                          marginTop: "5px",
                          fontSize: "20px",
                          color: "#1e2b47",
                        }}
                      />
                      {info.startTime && info.endTime && (
                        <DatePickerWrapper>
                          <div>
                            <DatePicker
                              selected={parseTimeStringToDate(info.startTime)}
                              onChange={(date) =>
                                handleTime(date, index, "startTime")
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
                              selected={parseTimeStringToDate(info.endTime)}
                              onChange={(date) =>
                                handleTime(date, index, "endTime")
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
                            onClick={() => handleClearTime(index)}
                            style={{
                              cursor: "pointer",
                              marginLeft: "15px",
                              marginTop: "5px",
                              fontSize: "20px",
                              color: "#1e2b47",
                            }}
                          />
                        </DatePickerWrapper>
                      )}

                      {info.breakStartTime && info.breakEndTime && (
                        <BreakTimeRow>
                          <div>
                            <DatePicker
                              selected={parseTimeStringToDate(
                                info.breakStartTime
                              )}
                              onChange={(date) =>
                                handleBreakStartTime(info, date, index)
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
                              selected={parseTimeStringToDate(
                                info.breakEndTime
                              )}
                              onChange={(date) =>
                                handleBreakEndTime(info, date, index)
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
                            onClick={() => handleClearBreakTime(index)}
                            style={{
                              cursor: "pointer",
                              marginLeft: "20px",
                              marginTop: "5px",
                              fontSize: "20px",
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
              <EnrollButton>등록하기</EnrollButton>
            </ModalFooter>
          </ModalLabel>
        </ModalWrapper>
      )}
    </>
  );
};

export default Openinghours;
