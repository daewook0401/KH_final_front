import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

const SignUp = () => {
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
  const [isVerificationSent, setIsVerificationSent] = useState(false); // 인증번호 발송 여부
  const [verificationCode, setVerificationCode] = useState(""); // 사용자가 입력한 인증번호
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 최종 인증 여부
  const [timer, setTimer] = useState(180); // 타이머 (3분)
  const API_URL = window.ENV?.API_URL;
  // const { header, body, error, loading } = useApi('/api');
  const {
    header: idHeader,
    body: idBody,
    error: idError,
    loading: idLoading,
    refetch: checkId,
  } = useApi(
    "/api/member/check-id",
    { method: "post", data: { memberId: formData.memberId } },
    false
  );
  const {
    header: nickNameHeader,
    body: nickNameBody,
    error: nickNameError,
    loading: nickNameLoading,
    refetch: checkNickName,
  } = useApi(
    "/api/member/check-nickname",
    { method: "post", data: { memberNickName: formData.memberNickName } },
    false
  );
  const {
    header: emailHeader,
    body: emailBody,
    error: emailError,
    loading: emailLoading,
    refetch: sendVerifyCode,
  } = useApi(
    "/api/email/verify-email",
    { method: "post", data: { memberEmail: formData.memberEmail } },
    false
  );
  const {
    header: verifyHeader,
    body: verifyBody,
    error: verifyError,
    loading: verifyLoading,
    refetch: checkVerifyCode,
  } = useApi(
    "/api/email/check-verifycode",
    {
      method: "post",
      data: { email: formData.memberEmail, verifyCode: verificationCode },
    },
    false
  );
  const {
    header: signupHeader,
    body: signupBody,
    error: signupError,
    loading: signupLoading,
    refetch: signup,
  } = useApi("/api/member", { method: "post" }, false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!pwRegex.test(formData.memberPw) && formData.memberPw) {
      setPasswordError(
        "비밀번호는 대소문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다."
      );
    } else if (
      formData.confirmPassword &&
      formData.memberPw !== formData.confirmPassword
    ) {
      setPasswordError("비밀번호가 일치하지 않습니다.");
    } else {
      setPasswordError("");
    }
    if (formData.memberName && !nameRegex.test(formData.memberName)) {
      setNameError("이름은 한글이나 영어로 2 ~ 20 필수 입력입니다.");
    } else {
      setNameError("");
    }
  }, [formData]);
  useInterval(
    () => {
      setTimer((prev) => {
        if (prev <= 1) {
          // 만료 처리
          setIsVerificationSent(false);
          alert("인증 시간이 만료되었습니다. 다시 시도해주세요.");
          return 0;
        }
        return prev - 1;
      });
    },
    // delay: 조건이 충족될 때만 1000ms, 아니면 멈춤
    isVerificationSent && !isEmailVerified && timer > 0 ? 1000 : null
  );
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.memberEmail) {
      alert("이메일을 먼저 입력해주세요.");
      return;
    }
    if (!emailRegex.test(formData.memberEmail)) {
      return alert("유효한 이메일 주소를 입력해주세요.");
    }
    sendVerifyCode();
    alert("인증 코드 발송하였습니다.");
    setIsVerificationSent(true);
    setIsEmailVerified(false); // 재전송 시 인증 상태 초기화
    setTimer(180); // 타이머 초기화
  };

  // ----- 추가된 부분 4: 인증번호 확인 핸들러 -----
  const handleConfirmVerification = () => {
    if (!verificationCode) {
      alert("인증번호를 입력해주세요.");
      return;
    }
    checkVerifyCode()
      .then(({ header }) => {
        if (header.code[0] === "S") {
          console.log(header);
          alert(`${header.message}`);
          setIsEmailVerified(true);
        } else {
          console.log(header);
          alert(`${header.message}`);
          setIsEmailVerified(false);
        }
      })
      .catch((e) => {
        setIsEmailVerified(false);
        const msg = e;
        alert(msg);
      });
  };

  const handleSignup = (e) => {
    e.preventDefault();
    if (!isVerifyId) {
      alert("아이디 중복확인을 해주세요.");
      return;
    }
    if (!pwRegex.test(formData.memberPw)) {
      alert("비밀번호를 확인해주세요.");
      return;
    }
    if (!nameRegex.test(formData.memberName)) {
      alert("이름을 다시 입력해주세요.");
      return;
    }
    if (!isVerifyNickName) {
      alert("닉네임 중복확인을 해주세요.");
      return;
    }
    if (!isEmailVerified) {
      alert("이메일 인증을 완료해주세요.");
      return;
    }
    if (!agreed) {
      alert("이용약관에 동의해주세요.");
      return;
    }
    const submissionData = new FormData();
    for (const key in formData) {
      if (key !== "confirmPassword") {
        submissionData.append(key, formData[key]);
      }
    }
    if (profileImage) {
      submissionData.append("memberProFiles", profileImage);
    }
    signup({
      data: submissionData,
    })
      .then((res) => {
        const { header } = res;
        if (header.code[0] === "S") {
          alert("회원가입이 완료 되었습니다. 로그인 페이지로 이동합니다.");
          navigate("/login");
        } else {
          alert(`회원가입 실패: ErrorCode ${header.code}`);
        }
      })
      .catch((err) => {
        alert(err);
      });
  };

  const handleCheckId = () => {
    const id = formData.memberId.trim();
    if (!formData.memberId) {
      return alert("아이디를 먼저 입력해주세요.");
    }
    if (!idRegex.test(id)) {
      return alert(
        "아이디는 소문자 영문과 숫자를 포함하여 4~20자 이내여야 합니다. 숫자만으로는 구성할 수 없습니다."
      );
    }
    checkId()
      .then(({ header }) => {
        if (header.code[0] === "S") {
          alert("사용 가능한 아이디입니다.");
          setIsVerifyId(true);
        } else {
          alert(`이미 사용 중인 아이디 입니다.`);
        }
      })
      .catch((e) => {
        const msg = e;
        alert(msg);
      });
  };

  const handleCheckNickname = () => {
    if (!formData.memberNickName) {
      return alert("닉네임을 먼저 입력해주세요.");
    }
    if (!nickRegex.test(formData.memberNickName)) {
      alert(
        "닉네임은 2~20자 이내의 한글, 영문, 숫자, '_', '.'만 사용할 수 있습니다."
      );
      return;
    }
    checkNickName()
      .then(({ header }) => {
        if (header.code[0] === "S") {
          alert("사용 가능한 닉네임입니다.");
          setIsVerifyNickName(true);
        } else {
          alert(`이미 사용 중인 닉네임입니다.`);
        }
      })
      .catch((e) => {
        const msg = e;
        alert(msg);
      });
  };

  // 타이머 포맷팅 함수 (예: 180 -> 03:00)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // if(loading){
  //   return <p>로딩 페이지</p>
  // }
  // if(error){
  //   return <p>Error 페이지</p>
  // }
  return (
    <>
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-white py-12 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-red-500">
            회원가입
          </h1>
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700">
                프로필 사진 (선택)
              </label>
              <div className="mt-2 flex items-center space-x-4">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="프로필 미리보기"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg
                      className="h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </div>
                <label
                  htmlFor="profile-image-upload"
                  className="cursor-pointer px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  사진 변경
                </label>
                <input
                  id="profile-image-upload"
                  name="profile-image-upload"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="id"
                className="block text-sm font-bold text-gray-700"
              >
                아이디
              </label>
              <div className="flex space-x-2 mt-1">
                <input
                  type="text"
                  name="memberId"
                  id="memberId"
                  value={formData.memberId}
                  onChange={handleChange}
                  required
                  className="flex-grow px-3 py-2 bg-white border-2 border-black focus:outline-none rounded-md"
                />
                <button
                  type="button"
                  onClick={handleCheckId}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md whitespace-nowrap"
                >
                  중복 확인
                </button>
              </div>
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
                name="memberPw"
                id="memberPw"
                value={formData.memberPw}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 bg-white border-2 border-black focus:outline-none rounded-md"
              />
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-bold text-gray-700"
              >
                비밀번호 확인
              </label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 bg-white border-2 border-black focus:outline-none rounded-md"
              />
              {passwordError && (
                <p className="mt-1 text-xs text-red-500">{passwordError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-gray-700"
              >
                이름
              </label>
              <input
                type="text"
                name="memberName"
                id="memberName"
                value={formData.memberName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 mt-1 bg-white border-2 border-black focus:outline-none rounded-md"
              />
              {nameError && (
                <p className="mt-1 text-xs text-red-500">{nameError}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="nickname"
                className="block text-sm font-bold text-gray-700"
              >
                닉네임
              </label>
              <div className="flex space-x-2 mt-1">
                <input
                  type="text"
                  name="memberNickName"
                  id="memberNickName"
                  value={formData.memberNickName}
                  onChange={handleChange}
                  required
                  className="flex-grow px-3 py-2 bg-white border-2 border-black focus:outline-none rounded-md"
                />
                <button
                  type="button"
                  onClick={handleCheckNickname}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md whitespace-nowrap"
                >
                  중복 확인
                </button>
              </div>
            </div>

            {/* ----- 수정된 이메일 입력 UI ----- */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-gray-700"
              >
                이메일
              </label>
              <div className="flex space-x-2 mt-1">
                <input
                  type="email"
                  name="memberEmail"
                  id="memberEmail"
                  value={formData.memberEmail}
                  onChange={handleChange}
                  required
                  disabled={isVerificationSent} // 인증번호 발송 후 수정 불가
                  className="flex-grow px-3 py-2 bg-white border-2 border-black focus:outline-none rounded-md disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={handleSendVerification}
                  disabled={isEmailVerified}
                  className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md whitespace-nowrap disabled:bg-gray-400"
                >
                  {isVerificationSent ? "재전송" : "인증"}
                </button>
              </div>
            </div>
            {isVerificationSent && !isEmailVerified && (
              <div>
                <label
                  htmlFor="verificationCode"
                  className="block text-sm font-bold text-gray-700"
                >
                  인증번호
                </label>
                <div className="flex space-x-2 mt-1">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      id="verificationCode"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      placeholder="인증번호 6자리를 입력하세요"
                      className="w-full px-3 py-2 bg-white border-2 border-black focus:outline-none rounded-md"
                    />
                    <span className="absolute inset-y-0 right-3 flex items-center text-sm text-red-500">
                      {formatTime(timer)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleConfirmVerification}
                    className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 rounded-md whitespace-nowrap"
                  >
                    확인
                  </button>
                </div>
              </div>
            )}
            {isEmailVerified && (
              <p className="text-sm text-green-600 font-bold">
                ✓ 이메일 인증이 완료되었습니다.
              </p>
            )}
            <div className="flex items-center pt-2">
              <input
                type="checkbox"
                id="agreement"
                checked={agreed}
                onChange={handleAgreementChange}
                className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label
                htmlFor="agreement"
                className="ml-2 block text-sm text-gray-900"
              >
                (필수) 이용약관 및 개인정보 처리방침에 동의합니다.
              </label>
            </div>

            <button
              type="submit"
              disabled={!agreed}
              className="w-full py-3 font-bold text-white bg-red-500 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              가입하기
            </button>
          </form>

          <div className="text-sm text-center">
            <p>
              이미 계정이 있으신가요?{" "}
              <Link
                to="/login"
                className="font-bold text-red-500 hover:underline"
              >
                로그인 하러가기
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
