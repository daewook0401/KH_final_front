import { useEffect, useState } from "react";
import Header from "../../../common/Header/Header";
import { nameRegex, nickRegex } from "../../../components/Regex";
import useApi from "../../../hooks/useApi";
import { useNavigate } from "react-router-dom";

const SocialInfo = () => {
  const [formData, setFormData] = useState({
    memberName: "",
    memberNickName: ""
  })
  const [nameError, setNameError] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [isVerifyNickName, setIsVerifyNickName] = useState(false);
  const navigate = useNavigate();
  const { header : nickNameHeader, body : nickNameBody, error : nickNameError, loading : nickNameLoading, refetch:checkNickName } = useApi('/api/member/check-nickname', { method: 'post', data: { memberNickName : formData.memberNickName}}, false);
  const { header : editedHeader, body : editedBody, error : editedError, loading : editedLoading, refetch:editedInfo } = useApi('/api/member/social-update', { method: 'put' }, false);

  useEffect(() => {
    if (formData.memberName && !(nameRegex.test(formData.memberName))) {
      setNameError("이름은 한글이나 영어로 2 ~ 20 필수 입력입니다.");
    } else {
      setNameError("");
    }
  }, [formData]);
  const handleCheckNickname = () => {
    
    if (!formData.memberNickName) {
      return alert("닉네임을 먼저 입력해주세요.");;
    }
    if (!nickRegex.test(formData.memberNickName)){
      alert(
        "닉네임은 2~20자 이내의 한글, 영문, 숫자, '_', '.'만 사용할 수 있습니다."
      );
      return;
    }
    checkNickName().then(({ header }) => {
      if (header.code[0] === "S"){
        alert("사용 가능한 닉네임입니다.");
        setIsVerifyNickName(true);
      } 
      else {
        alert(`이미 사용 중인 닉네임입니다.`);
      }
    })
    .catch(e => {
      const msg = e;
      alert(msg);
    })
  };
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
  const handleEdited = (e) => {
    e.preventDefault();
    if (!(nameRegex.test(formData.memberName))){
      alert("이름을 다시 입력해주세요.");
      return;
    }
    if (!isVerifyNickName){
      alert("닉네임 중복확인을 해주세요.");
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
    } else {
      submissionData.append("memberProFiles", "NULL");
    }
    editedInfo({
      data: submissionData,
    }).then((res) => {
      const { header } = res;
      if (header.code[0] === "S") {
        alert("소셜 회원가입 완료되었습니다. 메인 페이지로 이동합니다.");
        navigate("/");
      } else {
        alert(`소셜 회원가입 실패: ErrorCode ${header.code}`);
      }
    }).catch((err) =>{
      alert(err);
    })
  };
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-white py-12 px-4">
        <div className="w-full max-w-md p-8 space-y-6 bg-white border border-gray-200 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-center text-red-500">
            회원정보 추가입력
          </h1>
          <form onSubmit={handleEdited} className="space-y-4">
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

            <button
              type="submit"
              className="w-full py-3 font-bold text-white bg-red-500 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              입력하기
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default SocialInfo;