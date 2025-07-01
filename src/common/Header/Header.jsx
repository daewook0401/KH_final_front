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

  const handleAuthClick = () => {
    if (auth.isAuthenticated) {
      navigate("/mypage");
    } else {
      navigate("/login");
    }
  };
  const handleLogoutClick = () => {
    if (auth.isAuthenticated) {
      logout();
    } else {
      navigate("/sign-up");
    }
  };

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
      <div>
        <div></div>
      </div>
      <div className="button-area flex items-center space-x-4">
        <div>
          <div
            onClick={handleAuthClick}
            className="mr-[30px] cursor-pointer text-white font-semibold hover:text-gray-200 transition-colors"
          >
            {auth.isAuthenticated ? "마이 페이지" : "로그인"}
          </div>
        </div>
        <div>
          <div
            onClick={handleLogoutClick}
            className="mr-[30px] cursor-pointer text-white font-semibold hover:text-gray-200 transition-colors"
          >
            {auth.isAuthenticated ? "로그아웃" : "회원가입"}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
