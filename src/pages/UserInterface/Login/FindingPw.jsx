import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../../../common/Header/Header";
import useApi from "../../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

const FindingPw = () => {
  const navigate = useNavigate();
  const [memberId, setMemberId] = useState("");
  const [email, setEmail]     = useState("");
  const [message, setMessage] = useState(null);
  const { refetch: apiReset } = useApi(
    "/api/email/pw-verify",
    { method: "post", data: { memberId:memberId, memberEmail:email } },
    false
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { header } = await apiReset();
      alert("임시 비밀번호 발급 성공");
      navigate("/")
    } catch {
      setMessage("요청 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Header />
      <motion.div
        className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4"
        variants={fadeIn}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.6 }}
      >
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <h1 className="text-2xl font-bold text-center text-[#ff6b4a]">
            비밀번호 재발급
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                아이디
              </label>
              <input
                value={memberId}
                onChange={(e) => setMemberId(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#ff7a3c] transition-colors"
                placeholder="아이디 입력"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                가입 시 등록한 이메일
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 mt-1 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#ff7a3c] transition-colors"
                placeholder="you@example.com"
              />
            </div>
            <motion.button
              type="submit"
              className="w-full py-2 text-white font-medium bg-gradient-to-r from-[#e65c00] to-[#ff9a3c] rounded-full hover:from-[#ff7a3c] hover:to-[#ffa55c] transition-colors"
              whileTap={{ scale: 0.95 }}
            >
              재발급 요청
            </motion.button>
          </form>

          {message && (
            <motion.div
              className="mt-4 p-4 bg-[#fffbf5] rounded-lg text-center text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default FindingPw;
