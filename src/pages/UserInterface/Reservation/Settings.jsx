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
/* 	
  private String restaurantNo;
	private int timeInterval;
	private int maxNum;
	private int minNum;
	private int maxTeamNum;
	private String description;
	 */

const Settings = ({ restaurantNo }) => {
  const [settingsModal, setReservationModal] = useState(true);
  const [settingInfo, setSettingInfo] = useState({
    restaurantNo: "23",
    interval: 30,
    maxNum: 5,
    minNum: 1,
    maxTeamNum: 5,
    description: "",
  });
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

  const { header, body, error, loading, refetch } = useApi(
    "/api/settings",
    {
      method: "post",
    },
    false
  );

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
    let totalMin = time.getHours() * 60 + time.getMinutes();
    if (type === "endTime" && info.startTime) {
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

  const handleSubmit = () => {
    const update = reservationTimeInfo.map((info, i) => ({
      ...info,
      restaurantNo: "23",
      weekDay: dayOfWeek[i],
    }));
    console.log(update, settingInfo);
    refetch({
      data: {
        reservation: update,
        settingInfo: settingInfo,
      },
    });
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
                      <Input
                        id="minPeople"
                        type="number"
                        value={settingInfo.minNum}
                        onChange={(e) =>
                          setSettingInfo((prev) => ({
                            ...prev,
                            minNum: e.target.value,
                          }))
                        }
                      />
                      <Label htmlFor="maxPeople">최대인원</Label>
                      <Input
                        id="maxPeople"
                        type="number"
                        value={settingInfo.maxNum}
                        onChange={(e) =>
                          setSettingInfo((prev) => ({
                            ...prev,
                            maxNum: e.target.value,
                          }))
                        }
                      />
                    </CountBox>
                    <div>
                      <Label htmlFor="reservationInterval">예약 간격</Label>
                      <Select
                        id="reservationInterval"
                        value={settingInfo.interval}
                        onChange={(e) =>
                          setSettingInfo((prev) => ({
                            ...prev,
                            interval: e.target.value,
                          }))
                        }
                      >
                        <option value="30">30분</option>
                        <option value="60">60분</option>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="peoplePerTime">
                        한 타임당 받을 인원수
                      </Label>
                      <Input
                        id="peoplePerTime"
                        type="number"
                        value={settingInfo.maxTeamNum}
                        onChange={(e) =>
                          setSettingInfo((prev) => ({
                            ...prev,
                            maxTeamNum: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </ModalLeftTopContent>
                </ModalLeftTop>
                <ModalLeftBottom>
                  <ModalLeftBottomHeader>
                    <InfoIcon />
                    &nbsp;
                    <span>예약 관련 설명</span>
                  </ModalLeftBottomHeader>
                  <Textarea
                    value={settingInfo.description}
                    onChange={(e) =>
                      setSettingInfo((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  ></Textarea>
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
                              selected={
                                info.startTime ? toDate(info.startTime) : null
                              }
                              onChange={(time) =>
                                handleTime(time, index, "startTime")
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
                                info.endTime ? toDate(info.endTime) : null
                              }
                              onChange={(time) =>
                                handleTime(time, index, "endTime")
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
                    </TimeRow>
                  </div>
                ))}
              </ModalRight>
            </ModalContent>
            <ModalFooter>
              <EnrollButton onClick={handleSubmit}>등록하기</EnrollButton>
            </ModalFooter>
          </ModalLabel>
        </ModalWrapper>
      )}
    </>
  );
};
export default Settings;
