import React from "react";

const AccountDeleteSection = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4 text-red-600">회원 탈퇴</h2>
      <p className="text-gray-700 mb-4">탈퇴 시 모든 정보가 삭제됩니다. 정말로 진행하시겠습니까?</p>
      <input type="password" placeholder="비밀번호 확인" className="w-full mb-3 border px-3 py-2 rounded" />
      <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
        탈퇴하기
      </button>
    </div>
  );
};

export default AccountDeleteSection;
