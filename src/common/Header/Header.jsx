import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "/src/assets/rog.png";

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogoClick = () => {
    navigate("/");
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      navigate("/mypage");
    } else {
      navigate("/login");
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
      <div>
        <div
          onClick={handleAuthClick}
          className="mr-[30px] cursor-pointer text-white font-semibold hover:text-gray-200 transition-colors"
        >
          {isLoggedIn ? "마이 페이지" : "로그인"}
        </div>
      </div>
    </header>
  );
};

export default Header;
