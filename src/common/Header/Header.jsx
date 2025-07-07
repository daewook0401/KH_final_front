import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "/src/assets/rog.png";
import { AuthContext } from "../../provider/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  const handleLogoClick = () => {
    navigate("/");
  };

  // '마이페이지' 또는 '로그인' 버튼 클릭 시 동작
  const handleAuthClick = () => {
    if (auth.isAuthenticated) {
      navigate("/mypage");
    } else {
      navigate("/login");
    }
  };

  // '로그아웃' 또는 '회원가입' 버튼 클릭 시 동작
  const handleLogoutClick = () => {
    if (auth.isAuthenticated) {
      logout(); // 로그아웃 처리
    } else {
      navigate("/sign-up");
    }
  };

  // '가게 등록' 버튼 클릭 시 동작하는 핸들러 추가
  const handleRegisterClick = () => {
    navigate("/restaurant-insert");
  };

  // 공통으로 사용할 버튼 스타일
  const buttonStyle =
    "mr-[30px] cursor-pointer text-white font-semibold hover:text-gray-200 transition-colors";

  return (
    <header className="flex items-center justify-between h-20 bg-[rgba(255,89,0,0.8)]">
      <div className="flex h-full items-center ml-5">
        <img
          src={logoImage}
          onClick={handleLogoClick}
          alt="로고"
          className="cursor-pointer flex h-20 w-20"
        />
      </div>

      {/* --- 이 부분이 버튼들을 렌더링하는 핵심 로직입니다 --- */}
      <div className="button-area flex items-center space-x-4">
        {auth.isAuthenticated ? (
          // 로그인 했을 때 보여줄 버튼 3개
          <>
            <div onClick={handleRegisterClick} className={buttonStyle}>
              가게 등록
            </div>
            <div onClick={handleAuthClick} className={buttonStyle}>
              마이페이지
            </div>
            <div onClick={handleLogoutClick} className={buttonStyle}>
              로그아웃
            </div>
          </>
        ) : (
          // 로그인 안 했을 때 보여줄 버튼 2개
          <>
            <div onClick={handleAuthClick} className={buttonStyle}>
              로그인
            </div>
            <div onClick={handleLogoutClick} className={buttonStyle}>
              회원가입
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
