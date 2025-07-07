import React from "react";

const ReservationList = () => {
  const dummyData = [
    { name: "하루 본점", date: "2025-07-06", people: "2명" },
    { name: "진미평양냉면", date: "2025-07-08", people: "3명" },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">예약 내역</h2>
      <ul className="space-y-4">
        {dummyData.map((item, i) => (
          <li key={i} className="border-b pb-4">
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm text-gray-500">{item.date} / {item.people}</p>
            <button className="mt-2 text-red-500 hover:underline">예약 취소</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationList;
