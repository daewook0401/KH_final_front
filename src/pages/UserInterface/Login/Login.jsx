import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../../common/Header/Header"; // 이 컴포넌트는 사용자 환경에 맞게 있어야 합니다.

const Login = () => {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/auth/member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, password }),
      });

      if (response.ok) {
        alert("로그인 성공!");
        navigate("/");
      } else {
        const errorData = await response.json();
        alert(
          `로그인 실패: ${
            errorData.message || "아이디 또는 비밀번호를 확인하세요."
          }`
        );
      }
    } catch (error) {
      console.error("로그인 요청 중 오류 발생:", error);
      alert("로그인 중 문제가 발생했습니다. 나중에 다시 시도해주세요.");
    }
  };

  const handleSocialLogin = (provider) => {
    alert(
      `${provider} 로그인은 현재 데모 상태입니다. 실제 구현 시에는 해당 소셜 로그인 API를 사용해야 합니다.`
    );
  };

  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-white px-4">
        <div className="w-full max-w-sm p-8 space-y-4 bg-white border border-gray-200 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-red-500">
            로그인
          </h1>

          <div className="space-y-2">
            <button
              onClick={() => handleSocialLogin("kakao")}
              className="w-full py-3 font-bold text-black bg-yellow-400 rounded-md"
            >
              카카오 로그인
            </button>
            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full py-3 font-bold text-white bg-blue-500 rounded-md"
            >
              구글 로그인
            </button>
          </div>

          <div className="my-4"></div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label
                htmlFor="id"
                className="block text-sm font-bold text-gray-700"
              >
                아이디
              </label>
              <input
                type="text"
                id="id"
                value={id}
                onChange={(e) => setId(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white border-2 border-black focus:outline-none rounded-md"
                required
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-gray-700"
              >
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 mt-1 bg-white border-2 border-black focus:outline-none rounded-md"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-red-500 hover:bg-red-700 rounded-md"
            >
              로그인
            </button>
          </form>

          {/* ----- 추가된 부분 시작 ----- */}
          <div className="space-y-4 text-sm text-center">
            {/* 아이디/비밀번호 찾기 링크 */}
            <div>
              <Link to="/finding-id" className="text-gray-600 hover:underline">
                아이디 찾기
              </Link>
              <span className="mx-2 text-gray-300">|</span>
              <Link
                to="/finding-password"
                className="text-gray-600 hover:underline"
              >
                비밀번호 찾기
              </Link>
            </div>

            {/* 회원가입 링크 */}
            <div>
              <p>
                계정이 없으신가요?{" "}
                <Link
                  to="/sign-up"
                  className="font-bold text-red-500 hover:underline"
                >
                  회원가입 하러가기
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
