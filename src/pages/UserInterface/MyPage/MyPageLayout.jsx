import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";
import { useContext, useState, useEffect } from "react";
import AuthContext from "../../../provider/AuthContext";


const navItems = [
  { label: "예약 내역", path: "/mypage/reservations" },
  { label: "리뷰 내역", path: "/mypage/reviews" },
  { label: "즐겨찾기", path: "/mypage/favorites" },
  { label: "회원 탈퇴", path: "/mypage/delete" },
];

const MyPageLayout = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(true);  
  const [navItems, setNavItems] = useState([
    { label: "예약 내역", path: "/mypage/reservations" },
    { label: "리뷰 내역", path: "/mypage/reviews" },
    { label: "즐겨찾기", path: "/mypage/favorites" },
    { label: "회원 탈퇴", path: "/mypage/delete" },
  ]);

  useEffect(() => {
    if (!!!auth.isAuthenticated) {
      alert("로그인이 필요합니다");
      navigate("/");
    }
    if (auth?.loginInfo.isStoreOwner == "Y") {
      setNavItems((prev) => [
        ...prev,
        { label: "내 가게 설정", path: "/mypage/restaurant" },
      ]);
    }
  }, []);
  const handleNavClick = (path) => () => {
    navigate(path);
  };
  const handleEditClick = () => {
    navigate("/password-confirm");
  };

  const handleCancel = () => {
    setShowPasswordConfirm(false);
    setShowEditProfile(false);
  };
  return (
    // 1) 화면 전체를 flex 컨테이너로, 중앙 정렬
    <div className="min-h-screen bg-orange-50 flex justify-center">
      {/* 2) 최대 너비와 최소 너비 설정, 내부에 사이드바+메인 */}
      <div className="w-full max-w-6xl min-w-[320px] flex">
        {/* 사이드 네비게이션 */}
        <aside className="w-60 bg-white border-r px-6 py-10">
          <h2 className="text-xl font-bold text-orange-500 mb-6">
            나의 NomNom
          </h2>
          <nav className="space-y-3 text-sm text-gray-700">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={handleNavClick(item.path)}
                className={`w-full text-left block py-2 px-3 rounded hover:bg-orange-100 transition ${
                  location.pathname === item.path
                    ? "bg-orange-200 font-semibold text-orange-800"
                    : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* 메인 영역 */}
        <main className="flex-1 p-10">
          <ProfileCard onEditClick={handleEditClick} />
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MyPageLayout;
