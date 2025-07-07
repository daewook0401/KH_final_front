import React from "react";

const FavoriteList = () => {
  const favorites = [{ name: "서북면옥", location: "서울 강남구" }];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">즐겨찾기</h2>
      {favorites.map((item, i) => (
        <div key={i} className="flex justify-between items-center border-b py-4">
          <div>
            <p className="font-medium">{item.name}</p>
            <p className="text-gray-500 text-sm">{item.location}</p>
          </div>
          <button className="text-red-500 hover:underline">❤️ 해제</button>
        </div>
      ))}
    </div>
  );
};

export default FavoriteList;
