import { useState, useEffect } from "react";
import {
  Header01,
  Header02,
  Header03,
  Header04,
  Header05,
} from "./Header.styles.js";
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
    <>
      <Header01>
        <Header02>
          <img src={logoImage} onClick={handleLogoClick} alt="로고" />
        </Header02>
        <Header03>
          <div></div>
        </Header03>
        <Header04>
          <Header05 onClick={handleAuthClick}>
            {isLoggedIn ? "마이 페이지" : "로그인"}
          </Header05>
        </Header04>
      </Header01>
    </>
  );
};

export default Header;
