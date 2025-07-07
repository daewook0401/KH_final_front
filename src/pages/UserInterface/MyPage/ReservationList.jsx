import React from "react";
import useApi from "../../../hooks/useApi";

const ReservationList = () => {
  const {
    header: myReservationHd,
    body: myReservationBd,
    refetch: myReservation,
  } = useApi("/api/reservation/check", {
    method: "get",
    params: {
      restaurantNo: "2",
    },
  });

  console.log(myReservationHd, myReservationBd);

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">예약 내역</h2>
      <ul className="space-y-4">
        {myReservationBd?.items?.length > 0 && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
            <h4 className="text-lg font-bold text-gray-700 mb-3">
              내 예약 정보
            </h4>
            {myReservationBd.items.map((item) => (
              <div
                key={item.reservationNo}
                className="mb-3 border-b last:border-none pb-2"
              >
                <p className="text-gray-700 font-medium">
                  예약 날짜:{" "}
                  <span className="font-bold">{item.reserveDay}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  예약 시간:{" "}
                  <span className="font-bold">{item.reserveTime}</span>
                </p>
                <p className="text-gray-700 font-medium">
                  인원:{" "}
                  <span className="font-bold">{item.numberOfGuests}명</span>
                </p>
                <p className="text-gray-700 font-medium">
                  예약 상태:{" "}
                  <span className="font-bold">
                    {item.status ? item.status : "확인 중"}
                  </span>
                </p>

                <button
                  onClick={() => handleCancelReservation(item.reservationNo)}
                  className="mt-2 px-3 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition"
                >
                  예약 취소
                </button>
              </div>
            ))}
          </div>
        )}
      </ul>
    </div>
  );
};

export default ReservationList;
