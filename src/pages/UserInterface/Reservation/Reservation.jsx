import { useState, useEffect, useContext } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PersonIcon from "@mui/icons-material/Person";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import AuthContext from "../../../provider/AuthContext";
import classNames from "classnames";

const Reservation = ({ setOpenReservation, restaurantId }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCount, setSelectedCount] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [minPeople, setMinPeople] = useState(1);
  const [maxPeople, setMaxPeople] = useState(5);
  const [times, setTimes] = useState({});
  const { auth } = useContext(AuthContext);

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    axios
      .get(`/api/reservation/info`, {
        params: { restaurantNo: restaurantId },
      })
      .then((res) => {
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
          reserveDay: formatDate(selectedDate),
        },
      })
      .then((res) => {
        if (res.data.header.code[0] !== "S") {
          setTimes({});
        }
        setTimes(res.data.body.items.resultMap);
      })
      .catch(console.error);
  }, [restaurantId, selectedDate]);

  const handleSubmit = () => {
    axios
      .post("/api/reservation", {
        restaurantNo: restaurantId,
        reserveDay: formatDate(selectedDate),
        numberOfGuests: selectedCount,
        reserveTime: selectedTime,
      })
      .then(() => {
        alert("예약이 등록되었습니다!");
        setOpenReservation(false);
      })
      .catch(console.error);
  };

  const dateHandler = (date) => {
    setSelectedDate(date);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/50 z-[1000]">
      <div className="flex justify-end mt-20 mr-8 text-white cursor-pointer z-[1001]">
        <CloseRoundedIcon
          style={{ fontSize: "40px" }}
          onClick={() => setOpenReservation(false)}
        />
      </div>
      <div className="w-[1000px] h-[700px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-lg flex flex-col">
        <div className="w-full h-[8%] mt-4 flex items-center justify-center border-b border-[#f0f0f0]">
          <h2 className="text-[24px] font-extrabold text-[#1e2b47] text-center relative font-[Pretendard,sans-serif] after:content-[''] after:block after:w-[900px] after:h-[1px] after:bg-[#1e2b47] after:mt-2.5 after:mx-auto">
            예약하기
          </h2>
        </div>
        <div className="flex font-bold h-[82%]">
          <div className="w-1/2 h-full flex flex-col items-center mt-5">
            <div className="w-[70%] flex items-center justify-center text-[20px] font-bold mb-5 p-2.5 border-b border-[#ccc]">
              <CalendarMonthIcon />
              &nbsp;
              <div className="flex items-center justify-center text-[20px] font-bold">
                {selectedDate.getMonth() + 1}.{selectedDate.getDate()}&nbsp;(
                {selectedDate
                  .toLocaleDateString("ko-KR", { weekday: "long" })
                  .slice(0, 1)}
                )
              </div>
            </div>
            <Calendar value={selectedDate} onChange={dateHandler} />
          </div>
          <div className="w-1/2 h-full flex flex-col items-center justify-center mt-5">
            <div className="w-[80%] h-[40%]">
              <div className="w-full flex items-center justify-center text-[20px] font-bold mb-5 p-2.5 border-b border-[#ccc]">
                <PersonIcon />
                <span>인원을 선택해 주세요</span>
                &nbsp;
                {selectedCount ? `(${selectedCount}명)` : ""}
              </div>
              {[...Array(maxPeople - minPeople + 1)].map((_, index) => {
                const count = minPeople + index;
                return (
                  <button
                    key={count}
                    onClick={() => setSelectedCount(count)}
                    className={classNames(
                      "w-[70px] h-[40px] m-1.5 border border-[#ccc] rounded-lg cursor-pointer transition-all duration-200",
                      {
                        "bg-[#00a859] text-white font-bold":
                          selectedCount === count,
                        "bg-white text-black font-medium hover:bg-[#f0f0f0]":
                          selectedCount !== count,
                      }
                    )}
                  >
                    {count}명
                  </button>
                );
              })}
            </div>
            <div className="w-[80%] h-[60%]">
              <div className="w-full flex items-center justify-center text-[20px] font-bold mb-5 p-2.5 border-b border-[#ccc]">
                <AccessTimeIcon />
                <span>시간을 선택해 주세요</span>
                &nbsp;
                {selectedTime ? `(${selectedTime})` : ""}
              </div>
              {Object.keys(times)
                .sort((a, b) => {
                  const toMinutes = (t) => {
                    const [h, m] = t.split(":").map(Number);
                    return h * 60 + m;
                  };
                  return toMinutes(a) - toMinutes(b);
                })
                .map((time, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      if (times[time]) setSelectedTime(time);
                    }}
                    className={classNames(
                      "w-[70px] h-[40px] m-1.5 border border-[#ccc] rounded-lg cursor-pointer transition-all duration-200",
                      {
                        "bg-[#00a859] text-white font-bold":
                          selectedTime === time,
                        "bg-white text-black font-medium hover:bg-[#f0f0f0] opacity-50 cursor-not-allowed":
                          !times[time],
                      }
                    )}
                    disabled={!times[time]}
                  >
                    {time}
                  </button>
                ))}
            </div>
          </div>
        </div>
        <div className="w-full h-[10%] flex justify-end items-center pr-8">
          <button
            onClick={handleSubmit}
            className="bg-[#0551cc] text-white border-none rounded px-4 py-2 text-[16px] cursor-pointer hover:bg-[#003da5]"
          >
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reservation;
