import React, { useState } from "react";
import useApi from "../../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const PasswordConfirmModal = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const {header:passwordHeader, body, error, loading, refetch: confirmApi} = useApi('/api/auth/password-confirm', { method: 'post' },false);
  const handleSubmit = () => {
    // TODO: 서버에 비밀번호 검증 요청
    confirmApi({
      data: {"password": password},
    }).then(res => {
      if (res.header.code[0] === 'S'){
        sessionStorage.setItem("passwordConfirm", "true");
        navigate("/edit-profile");
      } else {
        sessionStorage.setItem("passwordConfirm", "false");
        alert("비밀번호 인증 실패");
      }
    }).catch(err =>{
      alert("비밀번호 인증 실패");
      sessionStorage.setItem("passwordConfirm", "false");
    });
  };

  return (
    <>
    <div className="min-h-screen bg-orange-50 flex justify-center items-center">
      <div className="bg-white border border-orange-200 shadow-md rounded-lg w-full max-w-md px-10 py-12 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-6">비밀번호 확인</h2>
        <p className="text-sm text-gray-600 mb-6">
          회원님의 정보를 보호하기 위해 비밀번호를 다시 확인합니다.
        </p>

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-5 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-300"
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 rounded transition"
        >
          확인
        </button>

        <hr className="my-6 border-gray-200" />

        <button
          className="w-full border border-gray-300 text-sm py-2 rounded hover:bg-gray-50 transition"
        >
          개인정보 이용현황
        </button>
      </div>
    </div>
    </>
  );
};

export default PasswordConfirmModal;
