import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "/src/assets/rog.png";
import { AuthContext } from "../../provider/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { auth, logout } = useContext(AuthContext);

  const handleLogoClick = () => navigate("/");
  const handleAuthClick = () =>
    auth.isAuthenticated
      ? auth.loginInfo.memberRole !== "ROLE_ADMIN"
        ? navigate("/mypage")
        : navigate("/admin/main")
      : navigate("/login");
  const handleLogoutClick = () =>
    auth.isAuthenticated ? logout() : navigate("/sign-up");
  const handleRegisterClick = () => navigate("/restaurant-insert");

  const linkBase =
    "relative px-4 py-2 font-medium text-sm text-white transition-colors cursor-pointer";
  const underline =
    "after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-full after:bg-[#ff7a3c] after:scale-x-0 after:origin-left after:transition-transform";

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#e65c00]/90 to-[#ff9a3c]/90 backdrop-blur-sm shadow-lg">
      <div className="max-w-6xl mx-auto flex items-center justify-between h-20 px-6">
        {/* 로고 */}
        <img
          src={logoImage}
          alt="NomNom 로고"
          className="h-12 w-12 cursor-pointer rounded-full transition-transform duration-300 hover:rotate-12 hover:scale-110"
          onClick={handleLogoClick}
        />

        {/* 네비게이션 버튼 */}
        <nav className="flex items-center space-x-6">
          {auth.isAuthenticated && (
            <button
              onClick={handleRegisterClick}
              className={`${linkBase} ${underline} hover:text-[#ffd08c] hover:after:scale-x-100`}
            >
              가게 등록
            </button>
          )}
          <button
            onClick={handleAuthClick}
            className={`${linkBase} ${underline} hover:text-[#ffd08c] hover:after:scale-x-100`}
          >
            {auth.isAuthenticated
              ? auth.loginInfo?.memberRole === "ROLE_ADMIN"
                ? "관리자 페이지"
                : "마이 페이지"
              : "로그인"}
          </button>
          <button
            onClick={handleLogoutClick}
            className={`${linkBase} ${underline} hover:text-[#ffd08c] hover:after:scale-x-100`}
          >
            {auth.isAuthenticated ? "로그아웃" : "회원가입"}
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
