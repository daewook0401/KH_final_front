import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "../../../common/Header/Header";
import useInterval from "../../../hooks/useInterval";
import useApi from "../../../hooks/useApi";
import {
  idRegex,
  nickRegex,
  emailRegex,
  pwRegex,
  nameRegex,
} from "../../../components/Regex";
import { AuthContext } from "../../../provider/AuthContext";

const SignUp = () => {
  // ──────────── 상태 & 훅 (기존 그대로) ────────────
  const [formData, setFormData] = useState({
    memberId: "",
    memberPw: "",
    confirmPassword: "",
    memberName: "",
    memberNickName: "",
    memberEmail: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isVerifyId, setIsVerifyId] = useState(false);
  const [isVerifyNickName, setIsVerifyNickName] = useState(false);
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [timer, setTimer] = useState(180);

  const {
    refetch: checkId,
    header: idHeader,
  } = useApi("/api/member/check-id", { method: "post", data: { memberId: formData.memberId } }, false);
  const {
    refetch: checkNickName,
    header: nickNameHeader,
  } = useApi("/api/member/check-nickname", { method: "post", data: { memberNickName: formData.memberNickName } }, false);
  const {
    refetch: sendVerifyCode,
  } = useApi("/api/email/verify-email", { method: "post", data: { memberEmail: formData.memberEmail } }, false);
  const {
    refetch: checkVerifyCode,
  } = useApi("/api/email/check-verifycode", {
    method: "post",
    data: { email: formData.memberEmail, verifyCode: verificationCode },
  }, false);
  const {
    refetch: signup,
  } = useApi("/api/member", { method: "post" }, false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  // ──────────── 유효성 검사 이펙트 ────────────
  useEffect(() => {
    if (!pwRegex.test(formData.memberPw) && formData.memberPw) {
      setPasswordError("비밀번호는 대소문자·숫자·특수문자 3가지 이상을 포함해야 합니다.");
    } else if (
      formData.confirmPassword &&
      formData.memberPw !== formData.confirmPassword
    ) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
    if (formData.memberName && !nameRegex.test(formData.memberName)) {
      setNameError("이름은 한글/영문 2~20자여야 합니다.");
    } else {
      setNameError("");
    }
  }, [formData]);

  // ──────────── 이메일 인증 타이머 ────────────
  useInterval(
    () => {
      setTimer((t) => {
        if (t <= 1) {
          setIsVerificationSent(false);
          alert("인증 시간이 만료되었습니다.");
          return 0;
        }
        return t - 1;
      });
    },
    isVerificationSent && !isEmailVerified && timer > 0 ? 1000 : null
  );

  // ──────────── 핸들러 (기존 그대로) ────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  const handleAgreementChange = (e) => {
    setAgreed(e.target.checked);
  };
  const handleSendVerification = () => {
    if (!formData.memberEmail) return alert("이메일 먼저 입력해주세요.");
    sendVerifyCode();
    setIsVerificationSent(true);
    setIsEmailVerified(false);
    setTimer(180);
  };
  const handleConfirmVerification = () => {
    if (!verificationCode) return alert("인증번호 입력해주세요.");
    checkVerifyCode()
      .then(({ header }) => {
        if (header.code[0] === "S") setIsEmailVerified(true);
        else setIsEmailVerified(false);
        alert(header.message);
      })
      .catch((e) => alert(e));
  };
  const handleCheckId = () => {
    if (!formData.memberId) return alert("아이디 먼저 입력해주세요.");
    checkId().then(({ header }) => {
      if (header.code[0] === "S") setIsVerifyId(true);
      alert(header.message);
    });
  };
  const handleCheckNickname = () => {
    if (!formData.memberNickName) return alert("닉네임 먼저 입력해주세요.");
    checkNickName().then(({ header }) => {
      if (header.code[0] === "S") setIsVerifyNickName(true);
      alert(header.message);
    });
  };
  const handleSignup = (e) => {
    e.preventDefault();
    // validation...
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => k !== "confirmPassword" && data.append(k, v));
    data.append("memberProFiles", profileImage || "NULL");
    signup({ data })
      .then(({ header }) => {
        alert(header.message);
        if (header.code[0] === "S") navigate("/login");
      })
      .catch((e) => alert(e));
  };

  const formatTime = (sec) => {
    const m = String(Math.floor(sec / 60)).padStart(2, "0");
    const s = String(sec % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  // ──────────── 모션 설정 ────────────
  const leftAnim = { initial: { opacity: 0, x: -60 }, animate: { opacity: 1, x: 0 } };
  const rightAnim = { initial: { opacity: 0, x: 60 }, animate: { opacity: 1, x: 0 } };
  const trans     = { duration: 0.6, ease: "easeOut" };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-2">
        {/* 이미지 + 슬로건: 폼과 딱 붙이고 동일한 높이로 맞춤 */}
        <motion.div
          className="relative flex-shrink-0 w-auto md:mr-2"
          style={{ height: "600px" }} // 폼 높이에 맞춰주세요
          {...leftAnim}
          transition={trans}
        >
          <img
            src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&h=800&q=80"
            alt="감각적인 음식"
            className="w-auto h-full object-cover rounded-3xl shadow-2xl"
          />
          {/* 이미지 안쪽 하단에 슬로건 */}
          <div className="absolute bottom-4 left-4 bg-black/30 backdrop-blur-sm px-4 py-2 rounded-lg">
            <h2 className="text-xl font-bold text-white">
              당신의 <span className="text-[#ff7a3c]">맛집</span> 여정
            </h2>
            <p className="text-sm text-gray-100 mt-1">
              다양한 맛집을 한곳에, 손쉽게 만나보세요!
            </p>
          </div>
        </motion.div>

        {/* 우측 회원가입 폼 (간격 축소) */}
        <motion.div
          className="w-full md:w-96 bg-white rounded-2xl shadow-lg p-6 space-y-4"
          {...rightAnim}
          transition={trans}
        >
          <h1 className="text-xl font-bold text-center text-[#ff6b4a]">
            회원가입
          </h1>
          <form onSubmit={handleSignup} className="space-y-3">
            {/* 프로필 사진 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                프로필 사진 (선택)
              </label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="미리보기"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-gray-400">
                      <span className="text-2xl">+</span>
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-image-upload"
                  className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
                >
                  사진 변경
                </label>
                <input
                  id="profile-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            {/* 아이디 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                아이디
              </label>
              <div className="flex space-x-2 mt-1">
                <input
                  name="memberId"
                  value={formData.memberId}
                  onChange={handleChange}
                  className="flex-grow px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#ff7a3c] transition-colors"
                  placeholder="아이디 입력"
                />
                <button
                  type="button"
                  onClick={handleCheckId}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition"
                >
                  중복확인
                </button>
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                비밀번호
              </label>
              <input
                type="password"
                name="memberPw"
                value={formData.memberPw}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#ff7a3c] transition-colors"
                placeholder="비밀번호 입력"
              />
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#ff7a3c] transition-colors"
                placeholder="다시 입력"
              />
              {passwordError && (
                <p className="mt-1 text-xs text-red-500">{passwordError}</p>
              )}
            </div>

            {/* 이름 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                이름
              </label>
              <input
                name="memberName"
                value={formData.memberName}
                onChange={handleChange}
                className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#ff7a3c] transition-colors"
                placeholder="이름 입력"
              />
              {nameError && (
                <p className="mt-1 text-xs text-red-500">{nameError}</p>
              )}
            </div>

            {/* 닉네임 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                닉네임
              </label>
              <div className="flex space-x-2 mt-1">
                <input
                  name="memberNickName"
                  value={formData.memberNickName}
                  onChange={handleChange}
                  className="flex-grow px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#ff7a3c] transition-colors"
                  placeholder="닉네임 입력"
                />
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition"
                >
                  중복확인
                </button>
              </div>
            </div>

            {/* 이메일 & 인증 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700">
                이메일
              </label>
              <div className="flex space-x-2 mt-1">
                <input
                  name="memberEmail"
                  value={formData.memberEmail}
                  onChange={handleChange}
                  disabled={isVerificationSent}
                  className="flex-grow px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#ff7a3c] transition-colors disabled:bg-gray-100"
                  placeholder="이메일 입력"
                />
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={isEmailVerified}
                  className="px-4 py-2 bg-[#ff6b4a] hover:bg-[#e65c00] text-white rounded-md font-medium transition disabled:bg-gray-400"
                >
                  {isVerificationSent ? "재전송" : "인증"}
                </button>
              </div>
            </div>
            {isVerificationSent && !isEmailVerified && (
              <div>
                <label className="block text-sm font-semibold text-gray-700">
                  인증번호
                </label>
                <div className="flex space-x-2 mt-1">
                  <div className="relative flex-grow">
                    <input
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:border-[#ff7a3c] transition-colors"
                      placeholder="6자리 입력"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-red-500">
                      {formatTime(timer)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmVerification}
                    className="px-4 py-2 bg-[#ff6b4a] hover:bg-[#e65c00] text-white rounded-md font-medium transition"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            {isEmailVerified && (
              <p className="text-sm text-green-600 font-semibold">
                이메일 인증 완료 ✓
              </p>
            )}

            {/* 약관 동의 */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={agreed}
                onChange={handleAgreementChange}
                className="h-4 w-4 text-[#ff6b4a] border-gray-300 rounded focus:ring-[#ff6b4a]"
              />
              <label className="text-sm text-gray-700 cursor-pointer">
                (필수) 이용약관 및 개인정보처리방침 동의
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreed}
              className="w-full py-2 text-white font-bold bg-gradient-to-r from-[#e65c00] to-[#ff9a3c] rounded-full hover:from-[#ff7a3c] hover:to-[#ffa55c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              가입하기
            </button>
          </form>
          <p className="text-center text-xs text-gray-600">
            이미 계정이 있으신가요?{" "}
            <Link to="/login" className="text-[#ff6b4a] font-semibold hover:underline">
              로그인
            </Link>
          </p>
        </motion.div>
      </div>
    </>
  );
};

export default SignUp;
