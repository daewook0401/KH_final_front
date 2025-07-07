import React from "react";

const ReviewList = () => {
  const reviews = [{ place: "광화문 본점", comment: "맛있었어요!", rating: 4.5 }];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">리뷰 내역</h2>
      {reviews.map((r, idx) => (
        <div key={idx} className="border-b py-4">
          <p className="font-medium">{r.place}</p>
          <p className="text-gray-600">{r.comment}</p>
          <p className="text-yellow-500">⭐ {r.rating}</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
