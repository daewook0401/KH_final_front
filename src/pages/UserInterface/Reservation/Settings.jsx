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
import {
  CloseBtn,
  CountBox,
  DatePickerWrapper,
  DayLabel,
  EnrollButton,
  H2,
  Input,
  Label,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalLabel,
  ModalLeft,
  ModalLeftBottom,
  ModalLeftBottomHeader,
  ModalLeftTop,
  ModalLeftTopContent,
  ModalLeftTopHeader,
  ModalRight,
  ModalRightTopHeader,
  ModalWrapper,
  Select,
  Span,
  Textarea,
  TimeInput,
  TimeRow,
} from "./Settings.styles";

const Settings = () => {
  const [settingsModal, setReservationModal] = useState(true);
  const [interval, setInterval] = useState("30");
  const [reservationTimeInfo, setReservationTimeInfo] = useState(
    [...Array(7)].map(() => ({
      startTime: "09:00",
      endTime: "18:00",
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

  const handleStartTime = (startTime, day) => {
    if (startTime.getMinutes() % 10 === 0) {
      setReservationTimeInfo((prev) =>
        prev.map((info, index) =>
          index === day
            ? {
                ...info,
                startTime: parseDateToTimeString(startTime),
              }
            : info
        )
      );
    } else {
      alert("10분 단위로만 선택할 수 있습니다.");
    }
  };
  const handleEndTime = (endTime, day) => {
    if (endTime.getMinutes() % 10 === 0) {
      setReservationTimeInfo((prev) =>
        prev.map((info, index) =>
          index === day
            ? {
                ...info,
                endTime: parseDateToTimeString(endTime),
              }
            : info
        )
      );
    } else {
      alert("10분 단위로만 선택할 수 있습니다.");
    }
  };

  const handleAddTime = (day) => {
    reservationTimeInfo[day].startTime == "" &&
    reservationTimeInfo[day].endTime == ""
      ? setReservationTimeInfo((prev) =>
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
      : alert("예약 가능한 타임이 이미 설정되어 있습니다.");
  };

  const handleClearTime = (day) => {
    setReservationTimeInfo((prev) =>
      prev.map((info, index) =>
        index === day
          ? {
              ...info,
              startTime: "",
              endTime: "",
            }
          : info
      )
    );
  };

  return (
    <>
      {settingsModal && (
        <ModalWrapper>
          <CloseBtn>
            <CloseRoundedIcon
              style={{ fontSize: "40px" }}
              onClick={() => setReservationModal(false)}
            />
          </CloseBtn>
          <ModalLabel>
            <ModalHeader>
              <H2>예약설정</H2>
            </ModalHeader>
            <ModalContent>
              <ModalLeft>
                <ModalLeftTop>
                  <ModalLeftTopHeader>
                    <FormatListBulletedAddIcon />
                    &nbsp;
                    <span>기본 예약 조건</span>
                  </ModalLeftTopHeader>
                  <ModalLeftTopContent>
                    <CountBox>
                      <Label htmlFor="minPeople">최소인원</Label>
                      <Input id="minPeople" type="number" />
                      <Label htmlFor="maxPeople">최대인원</Label>
                      <Input id="maxPeople" type="number" />
                    </CountBox>
                    <div>
                      <Label htmlFor="reservationInterval">예약 간격</Label>
                      <Select
                        id="reservationInterval"
                        value={interval}
                        onChange={(e) => setInterval(e.target.value)}
                      >
                        <option value="30">30분</option>
                        <option value="60">60분</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="peoplePerTime">
                        한 타임당 받을 인원수
                      </Label>
                      <Input id="peoplePerTime" type="number" />
                    </div>
                  </ModalLeftTopContent>
                </ModalLeftTop>
                <ModalLeftBottom>
                  <ModalLeftBottomHeader>
                    <InfoIcon />
                    &nbsp;
                    <span>예약 관련 설명</span>
                  </ModalLeftBottomHeader>
                  <Textarea name="" id=""></Textarea>
                </ModalLeftBottom>
              </ModalLeft>
              <ModalRight>
                <ModalRightTopHeader>
                  <AccessTimeIcon />
                  &nbsp;
                  <span>요일별 예약 가능한 시간</span>
                </ModalRightTopHeader>
                {reservationTimeInfo.map((info, index) => (
                  <div key={index}>
                    <TimeRow>
                      <DayLabel>{dayOfWeek[index]}</DayLabel>
                      <AddCircleOutlineIcon
                        onClick={() => handleAddTime(index)}
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
                              onChange={(date) => handleStartTime(date, index)}
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
                              onChange={(date) => handleEndTime(date, index)}
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
                    </TimeRow>
                  </div>
                ))}
              </ModalRight>
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
export default Settings;
