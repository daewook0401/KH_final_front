import { useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import useApi from "../../../hooks/useApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect } from "react";
import axios from "axios";
import AuthContext from "../../../provider/AuthContext";
import { useContext } from "react";
import {
  CloseBtn,
  CountBox,
  EnrollButton,
  GetTime,
  H2,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalLabel,
  ModalLeft,
  ModalLeftHeader,
  ModalRight,
  ModalRightBottom,
  ModalRightBottomHeader,
  ModalRightTop,
  ModalRightTopHeader,
  ModalWrapper,
  TimeBox,
} from "./ReservationStyles";
const Reservation = ({ setOpenReservation, restaurantId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCount, setSelectedCount] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [minPeople, setMinPeople] = useState(null); // 예시값
  const [maxPeople, setMaxPeople] = useState(null);
  const [times, setTimes] = useState({});
  const { auth } = useContext(AuthContext);
  const accessToken = auth?.tokens?.accessToken;
  const apiUrl = window.ENV?.API_URL || "http://localhost:80";

  useEffect(() => {
    axios
      .get(`${apiUrl}/api/reservation/info`, {
        params: { restaurantNo: restaurantId },
      })
      .then((res) => {
        console.log("result :", res.data);
        setMinPeople(res.data.body.items.minNum);
        setMaxPeople(res.data.body.items.maxNum);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    axios
      .get("/api/reservation", {
        params: {
          restaurantNo: restaurantId,
          reserveDay: selectedDate.toISOString().slice(0, 10),
        },
      })
      .then((res) => {
        console.log("예약 가능한 시간들 :", res.data);
        setTimes(res.data.body.items.resultMap);
      })
      .catch(console.error);
  }, [restaurantId, selectedDate]);

  // const {
  //   header: reservationInfoHd,
  //   body: reservationInfoBd,
  //   refetch: avilable,
  //   error,
  //   loading,
  // } = useApi("/api/reservation/info", {
  //   method: "get",
  //   params: {
  //     restaurantNo: restaurantNo,
  //   },
  // });

  // const {
  //   header: avilableTimeHd,
  //   body: avilableTimeBd,
  //   refetch: avilableTime,
  // } = useApi("/api/reservation", {
  //   method: "get",
  //   params: {
  //     restaurantNo: restaurantNo,
  //     reserveDay: selectedDate.toISOString().slice(0, 10),
  //   },
  // });

  const handleSubmit = () => {
    axios
      .post("/api/reservation", {
        restaurantNo: restaurantId,
        reserveDay: selectedDate.toISOString().slice(0, 10),
        numberOfGuests: selectedCount,
        reserveTime: selectedTime,
      })
      .then((res) => {
        console.log(res);
        alert("예약이 등록되었습니다!");
        setOpenReservation(false);
      })
      .catch(console.error);
  };

  const dateHandler = (date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <ModalWrapper>
        <CloseBtn>
          <CloseRoundedIcon
            style={{ fontSize: "40px" }}
            onClick={() => setOpenReservation(false)}
          />
        </CloseBtn>
        <ModalLabel>
          <ModalHeader>
            <H2>예약하기</H2>
          </ModalHeader>
          <ModalContent>
            <ModalLeft>
              <ModalLeftHeader>
                <CalendarMonthIcon />
                &nbsp;
                <GetTime>
                  {selectedDate.getMonth() + 1}.{selectedDate.getDate()}
                  &nbsp;(
                  {selectedDate
                    .toLocaleDateString("ko-KR", {
                      weekday: "long",
                    })
                    .slice(0, 1)}
                  )
                </GetTime>
              </ModalLeftHeader>
              <Calendar
                value={selectedDate}
                onChange={(date) => dateHandler(date)}
              />
            </ModalLeft>
            <ModalRight>
              <ModalRightTop>
                <ModalRightTopHeader>
                  <PersonIcon />
                  <span>인원을 선택해 주세요</span>
                  &nbsp;
                  {selectedCount ? `(${selectedCount}명)` : ""}
                </ModalRightTopHeader>
                {[...Array(maxPeople - minPeople + 1)].map((_, index) => {
                  const count = minPeople + index;
                  return (
                    <CountBox
                      key={count}
                      isSelected={selectedCount === count}
                      onClick={() => setSelectedCount(count)}
                    >
                      {count}명
                    </CountBox>
                  );
                })}
              </ModalRightTop>
              <ModalRightBottom>
                <ModalRightBottomHeader>
                  <AccessTimeIcon />
                  <span>시간을 선택해 주세요</span>
                  &nbsp;
                  {selectedTime ? `(${selectedTime})` : ""}
                </ModalRightBottomHeader>
                {Object.keys(times)
                  .sort((a, b) => {
                    // "09:30" => 9 * 60 + 30 = 570
                    const toMinutes = (t) => {
                      const [h, m] = t.split(":").map(Number);
                      return h * 60 + m;
                    };
                    return toMinutes(a) - toMinutes(b);
                  })
                  .map((time, index) => (
                    <TimeBox
                      key={index}
                      isSelected={selectedTime === time}
                      onClick={() => {
                        if (times[time]) setSelectedTime(time);
                      }}
                      style={{
                        opacity: times[time] ? 1 : 0.5,
                        cursor: times[time] ? "pointer" : "not-allowed",
                      }}
                    >
                      {time}
                    </TimeBox>
                  ))}
              </ModalRightBottom>
            </ModalRight>
          </ModalContent>
          <ModalFooter>
            <EnrollButton onClick={handleSubmit}>예약하기</EnrollButton>
          </ModalFooter>
        </ModalLabel>
      </ModalWrapper>
    </>
  );
};
export default Reservation;
