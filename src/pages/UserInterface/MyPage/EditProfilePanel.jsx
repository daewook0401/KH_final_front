import React, { useState } from "react";

const EditProfilePanel = ({ onClose }) => {
  const [nickname, setNickname] = useState("");

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">개인정보 수정</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">닉네임 변경</label>
          <div className="flex gap-2 mt-1">
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="flex-1 border rounded px-3 py-2"
            />
            <button className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition">중복 확인</button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium">비밀번호 변경</label>
          <input type="password" placeholder="기존 비밀번호" className="w-full mt-1 border rounded px-3 py-2 mb-2" />
          <input type="password" placeholder="새 비밀번호" className="w-full border rounded px-3 py-2 mb-2" />
          <input type="text" placeholder="이메일 인증 코드" className="w-full border rounded px-3 py-2 mb-2" />
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
            이메일 인증 요청
          </button>
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
      >
        닫기
      </button>
    </div>
  );
};

export default EditProfilePanel;
