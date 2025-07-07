import React from "react";

const EditProfileForm = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-6">기본 정보 관리</h2>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium">이름</label>
          <input className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">이메일</label>
          <input className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm font-medium">닉네임</label>
          <input className="w-full border rounded px-3 py-2" />
        </div>
        <button className="w-full mt-6 bg-blue-600 text-white py-2 rounded">수정하기</button>
      </form>
    </div>
  );
};

export default EditProfileForm;