import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../../hooks/useApi";
import { nameRegex, nickRegex, emailRegex, pwRegex } from "../../../components/Regex";

const EditProfile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    memberId: "",
    memberName: "",
    memberNickName: "",
    memberEmail: "",
    memberPw: "",
    confirmPassword: "",
  });

  const [originalData, setOriginalData] = useState({
    memberNickName: "",
    memberEmail: "",
    memberSelfie: "",
  });

  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isVerifyNickName, setIsVerifyNickName] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [timer, setTimer] = useState(180);

  const { loading, refetch: loadUserInfo } = useApi("/api/member/mypage-info", { method: "post" });
  const { refetch: checkNickName } = useApi("/api/member/check-nickname", { method: "post", data: { memberNickName: formData.memberNickName } }, false);
  const { refetch: sendVerifyCode } = useApi("/api/email/editprofile-verify", { method: "post", data: { memberEmail: formData.memberEmail } }, false);
  const { refetch: checkVerifyCode } = useApi("/api/email/check-verifycode", { method: "post", data: { email: formData.memberEmail, verifyCode: verificationCode } }, false);
  const { refetch: updateProfile } = useApi("/api/member/update", { method: "put" }, false);
  if(sessionStorage.getItem("passwordConfirm") !=="true"){
    alert("비밀번호 인증이 필요합니다.");
    navigate("/");
  }
  useEffect(() => {
    loadUserInfo().then((res) => {
      const { items } = res.body;
      setFormData((prev) => ({
        ...prev,
        memberId: items.memberId,
        memberName: items.memberName,
        memberNickName: items.memberNickName,
        memberEmail: items.memberEmail,
      }));
      setOriginalData({
        memberNickName: items.memberNickName,
        memberEmail: items.memberEmail,
        memberSelfie: items.memberSelfie,
      });
      if (items.memberSelfie === "NULL"){
        setImagePreview("https://kh-final-nomnom.s3.ap-northeast-2.amazonaws.com/36bfbb13-14bc-4bcd-994e-9bc4dcf65ba8_free-icon-restrict-photography-15263161.png");
      } else {
        setImagePreview(items.memberSelfie);
      }
    });
  }, []);

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

  const handleCheckNickname = () => {
    if (!formData.memberNickName || !nickRegex.test(formData.memberNickName)) {
      return alert("닉네임을 다시 확인해주세요.");
    }
    checkNickName().then(({ header }) => {
      if (header.code[0] === "S") {
        alert("사용 가능한 닉네임입니다.");
        setIsVerifyNickName(true);
      } else {
        alert("이미 사용 중인 닉네임입니다.");
      }
    });
  };

  const handleSendVerification = () => {
    sendVerifyCode();
    alert("인증 코드가 발송되었습니다.");
    setIsVerificationSent(true);
    setIsEmailVerified(false);
    setTimer(180);
  };

  const handleConfirmVerification = () => {
    checkVerifyCode().then(({ header }) => {
      if (header.code[0] === "S") {
        alert("이메일 인증이 완료되었습니다.");
        setIsEmailVerified(true);
      } else {
        alert("인증번호가 올바르지 않습니다.");
      }
    });
  };

  const needsEmailVerification = () => {
    return (
      formData.memberNickName !== originalData.memberNickName ||
      formData.memberPw ||
      profileImage
    );
  };

  const handleSave = () => {
    if (
      formData.memberNickName !== originalData.memberNickName &&
      !isVerifyNickName
    ) {
      return alert("닉네임을 변경한 경우 중복 확인을 해주세요.");
    }

    if (formData.memberPw && formData.memberPw !== formData.confirmPassword) {
      return alert("비밀번호가 일치하지 않습니다.");
    }

    if (needsEmailVerification() && !isEmailVerified) {
      return alert("변경 사항이 있으므로 이메일 인증이 필요합니다.");
    }

    const submissionData = new FormData();
    for (const key in formData) {
      if (formData[key]) {
        submissionData.append(key, formData[key]);
      }
    }
    if (profileImage) {
      submissionData.append("memberProFiles", profileImage);
    }

    updateProfile({ data: submissionData }).then(({ header }) => {
      if (header.code[0] === "S") {
        alert("개인정보가 수정되었습니다. 메인 페이지로 이동합니다.");
        navigate("/");
      } else {
        alert("수정에 실패했습니다.");
      }
    });
  };

  useEffect(() => {
    if (!isVerificationSent || isEmailVerified || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setIsVerificationSent(false);
          alert("인증 시간이 만료되었습니다.");
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isVerificationSent, timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  if(loading){
    return <p>로딩 중</p>
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-orange-50 py-12 px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white border border-orange-200 rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-center text-orange-500">개인정보 수정</h1>

        {/* 프로필 이미지 */}
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
            )}
          </div>
          <label htmlFor="image-upload" className="cursor-pointer text-sm text-orange-500 border px-3 py-1 rounded border-orange-300">
            이미지 변경
          </label>
          <input
            type="file"
            id="image-upload"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </div>

        {/* 아이디 */}
        <div>
          <label className="block text-sm text-gray-700">아이디</label>
          <input
            value={formData.memberId}
            disabled
            className="w-full px-3 py-2 bg-gray-100 text-gray-500 border border-gray-300 rounded"
          />
        </div>

        {/* 이름 */}
        <div>
          <label className="block text-sm text-gray-700">이름</label>
          <input
            value={formData.memberName}
            disabled
            className="w-full px-3 py-2 bg-gray-100 text-gray-500 border border-gray-300 rounded"
          />
        </div>

        {/* 닉네임 */}
        <div>
          <label className="block text-sm text-gray-700">닉네임</label>
          <div className="flex gap-2">
            <input
              name="memberNickName"
              value={formData.memberNickName}
              onChange={handleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleCheckNickname}
              className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded"
            >
              중복 확인
            </button>
          </div>
        </div>
        {/* 닉네임 */}
        <div>
          <label className="block text-sm text-gray-700">이메일</label>
          <div className="flex gap-2">
          <input
            value={formData.memberEmail}
            disabled
            className="flex-1 px-3 py-2 bg-gray-100 text-gray-500 border border-gray-300 rounded"
          />
            <button
            onClick={handleSendVerification}
            className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded"
          >
          인증 요청
          </button>
          </div>
        </div>

        {/* 인증번호 입력 */}
        {isVerificationSent && (
          <div className="flex gap-2 mt-2">
            <input
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증번호"
              className="flex-1 px-3 py-2 border border-gray-300 rounded"
            />
            <button
              onClick={handleConfirmVerification}
              className="px-3 py-2 bg-orange-600 text-white rounded"
            >
              확인
            </button>
            <span className="text-sm text-orange-500 mt-2">{formatTime(timer)}</span>
          </div>
        )}

        {/* 비밀번호 */}
        <div>
          <label className="block text-sm text-gray-700">새 비밀번호</label>
          <input
            type="password"
            name="memberPw"
            value={formData.memberPw}
            onChange={handleChange}
            placeholder="변경 시에만 입력"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700">비밀번호 확인</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-4 py-3 font-bold text-white bg-orange-500 rounded hover:bg-orange-600"
        >
          정보 변경
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
