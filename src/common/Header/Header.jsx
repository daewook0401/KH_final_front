import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "/src/assets/rog.png";
import { AuthContext } from "../../provider/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);
  const handleLogoClick = () => navigate("/");
  const handleAuthClick = () =>
    auth.isAuthenticated ? navigate("/mypage") : navigate("/login");
  const handleLogoutClick = () =>
    auth.isAuthenticated ? logout() : navigate("/sign-up");

  // '가게 등록' 버튼 클릭 시 동작하는 핸들러 추가
  const handleRegisterClick = () => {
    navigate("/restaurant-insert");
  };

  // 공통으로 사용할 버튼 스타일
  const buttonStyle =
    "mr-[30px] cursor-pointer text-white font-semibold hover:text-gray-200 transition-colors";

  return (
    <header className="bg-[rgba(255,89,0,0.8)] h-20">
      {/* 중앙 고정 컨테이너 */}
      <div
        className="h-full mx-auto flex items-center justify-between
                      w-full max-w-6xl min-w-[320px] px-5"
      >
        {/* 로고 */}
        <div className="flex items-center">
          <img
            src={logoImage}
            alt="로고"
            className="h-16 w-16 cursor-pointer"
            onClick={handleLogoClick}
          />
        </div>

        {/* 버튼 영역 */}
        <div className="flex items-center space-x-8 text-white font-semibold">
          <div
            className="cursor-pointer hover:text-gray-200 transition-colors"
            onClick={handleAuthClick}
          >
            {auth.isAuthenticated
              ? auth.loginInfo?.memberRole === "ROLE_ADMIN"
                ? "관리자 페이지"
                : "마이 페이지"
              : "로그인"}
          </div>
          <div
            className="cursor-pointer hover:text-gray-200 transition-colors"
            onClick={handleLogoutClick}
          >
            {auth.isAuthenticated ? "로그아웃" : "회원가입"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
