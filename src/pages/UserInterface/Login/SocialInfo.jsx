
const SocialInfo = () => {
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
export default SocialInfo;