import { useState } from "react";
import Calendars from "../../../components/Calendar/Calendar";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
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
const Reservation = () => {
  const [reservationModal, setReservationModal] = useState(true);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCount, setSelectedCount] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const [people, setPeople] = useState(7);
  const [times, setTimes] = useState([
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
  ]);

  return (
    <>
      {reservationModal && (
        <ModalWrapper>
          <CloseBtn>
            <CloseRoundedIcon
              style={{ fontSize: "40px" }}
              onClick={() => setReservationModal(false)}
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
                <Calendars
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
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
                  {[...Array(people)].map((_, index) => (
                    <CountBox
                      key={index}
                      isSelected={selectedCount === index + 1}
                      onClick={() => setSelectedCount(index + 1)}
                    >
                      {index + 1}명
                    </CountBox>
                  ))}
                </ModalRightTop>
                <ModalRightBottom>
                  <ModalRightBottomHeader>
                    <AccessTimeIcon />
                    <span>시간을 선택해 주세요</span>
                    &nbsp;
                    {selectedTime ? `(${selectedTime})` : ""}
                  </ModalRightBottomHeader>
                  {times.map((time, index) => (
                    <TimeBox
                      key={index}
                      isSelected={selectedTime === time}
                      onClick={() => setSelectedTime(time)}
                    >
                      {time}
                    </TimeBox>
                  ))}
                </ModalRightBottom>
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
export default Reservation;
