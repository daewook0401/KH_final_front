import React from "react";

const ProfileCard = ({ onEditClick }) => {
  return (
    <div className="bg-white shadow rounded-lg p-6 flex items-center gap-6">
      <img
        src="/images/profile-default.png"
        alt="프로필"
        className="w-24 h-24 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="text-lg font-semibold">김대욱</p>
        <p className="text-gray-500">test@example.com</p>
        <p className="text-gray-500">닉네임: 시발좋은카카오</p>
      </div>
      <button
        onClick={onEditClick}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
      >
        개인정보 수정
      </button>
    </div>
  );
};

export default ProfileCard;
