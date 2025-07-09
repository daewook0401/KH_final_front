import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../../../common/Header/Header";
import useApi from "../../../hooks/useApi";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -20 },
};

const FindingId = () => {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const { refetch: apiFindId } = useApi(
    "/api/member/find-id",
    { method: "post", data: { email } },
    false
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { body } = await apiFindId();
      setResult(body.items.memberId);
    } catch {
      setResult("찾을 수 없습니다.");
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
            아이디 찾기
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
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
              확인
            </motion.button>
          </form>

          {result && (
            <motion.div
              className="mt-4 p-4 bg-[#fffbf5] rounded-lg text-center text-gray-800"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              찾은 아이디: <span className="font-semibold">{result}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default FindingId;
