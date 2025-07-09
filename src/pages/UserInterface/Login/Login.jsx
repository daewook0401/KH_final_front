import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../../common/Header/Header";
import useApi from "../../../hooks/useApi";
import { idRegex, pwRegex } from "../../../components/Regex";
import { AuthContext } from "../../../provider/AuthContext";

const Login = () => {
  const [formData, setFormData] = useState({ memberId: "", memberPw: "" });
  const [longTimeAuth, setLongTimeAuth] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { refetch: loginApi } = useApi("/api/auth/tokens", { method: "post" }, false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleAgreement = (e) => setLongTimeAuth(e.target.checked);

  const handleLogin = async (e) => {
    e.preventDefault();
    const { memberId, memberPw } = formData;
    try {
      const { header, body } = await loginApi({
        withCredentials: true,
        data: { ...formData, authLogin: longTimeAuth ? "Y" : "N" },
      });
      if (header.code[0] === "S") {
        if (body.items.loginInfo.isActive === "N") {
          alert("비활성화된 계정이거나 정지된 계정입니다.");
          return;
        }
        login(body.items.loginInfo, body.items.tokens, false, longTimeAuth);
        navigate("/");
      } else {
        alert(`로그인 실패: ${header.message}`);
      }
    } catch {
      alert("로그인 중 오류가 발생했습니다.");
    }
  };

  const slideInLeft = { initial: { opacity: 0, x: -50 }, animate: { opacity: 1, x: 0 } };
  const slideInRight = { initial: { opacity: 0, x: 50 }, animate: { opacity: 1, x: 0 } };
  const transition = { duration: 0.6, ease: "easeOut" };

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center min-h-screen bg-gray-50 px-4">
        {/* 왼쪽 이미지 & 태그라인 */}
        <motion.div
          className="flex-shrink-0 w-full md:w-auto md:mr-4"
          {...slideInLeft}
          transition={transition}
        >
          <div className="overflow-hidden rounded-2xl shadow-xl hover:scale-105 transition-transform duration-500">
            <img
              src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=600&h=600&q=80"
              alt="맛있는 음식"
              className="w-80 h-80 object-cover"
            />
          </div>
          <h2 className="mt-4 text-2xl font-semibold text-gray-800 text-center md:text-left">
            맛있는 여정, <span className="text-[#ff7a3c]">지금</span> 시작하세요
          </h2>
        </motion.div>

        {/* 오른쪽 로그인 폼 */}
        <motion.div
          className="w-full md:w-96 bg-white rounded-2xl shadow-lg p-8 space-y-6"
          {...slideInRight}
          transition={transition}
        >
          <h1 className="text-2xl font-bold text-center text-[#ff6b4a]">로그인</h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">아이디</label>
              <input
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border-2 border-gray-300 rounded-md focus:border-[#ff7a3c] focus:outline-none transition-colors cursor-text"
                placeholder="아이디 입력"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">비밀번호</label>
              <input
                type="password"
                name="memberPw"
                value={formData.memberPw}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border-2 border-gray-300 rounded-md focus:border-[#ff7a3c] focus:outline-none transition-colors cursor-text"
                placeholder="비밀번호 입력"
                required
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="keep"
                checked={longTimeAuth}
                onChange={handleAgreement}
                className="h-4 w-4 text-[#ff7a3c] border-gray-300 rounded focus:ring-[#ff7a3c] cursor-pointer"
              />
              <label htmlFor="keep" className="ml-2 text-sm text-gray-600 cursor-pointer">
                로그인 유지
              </label>
            </div>
            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-gradient-to-r from-[#e65c00] to-[#ff9a3c] rounded-md hover:from-[#ff7a3c] hover:to-[#ffa55c] transition-colors cursor-pointer"
            >
              로그인
            </button>
          </form>
          <div className="flex justify-between text-sm text-gray-500">
            <Link to="/finding-id" className="hover:text-[#ff7a3c] transition-colors cursor-pointer">아이디 찾기</Link>
            <Link to="/finding-password" className="hover:text-[#ff7a3c] transition-colors cursor-pointer">비밀번호 찾기</Link>
          </div>
          <p className="text-center text-gray-600 text-sm">
            계정이 없으신가요?{" "}
            <Link to="/sign-up" className="font-semibold text-[#ff6b4a] hover:underline cursor-pointer">
              회원가입
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default Login;
