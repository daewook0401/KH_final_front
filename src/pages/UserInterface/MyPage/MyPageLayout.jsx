import { Outlet, useLocation, useNavigate } from "react-router-dom";
import ProfileCard from "./ProfileCard";

const navItems = [

  { label: "예약 내역", path: "/mypage/reservations" },
  { label: "리뷰 내역", path: "/mypage/reviews" },
  { label: "즐겨찾기", path: "/mypage/favorites" },
  { label: "회원 탈퇴", path: "/mypage/delete" },
];

const MyPageLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleNavClick = (path) => () => {
    navigate(path);
  };
  const handleEditClick = () => {
    navigate("/password-confirm");
  };
  return (
    <div className="min-h-screen bg-orange-50 flex">
      {/* 사이드 네비게이션 */}
      <aside className="w-60 bg-white border-r px-6 py-10">
        <h2 className="text-xl font-bold text-orange-500 mb-6">나의 NomNom</h2>
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
      <main className="flex-1 p-10 space-y-6">
        {/* 항상 상단에 표시될 프로필 카드 */}
        <ProfileCard onEditClick={handleEditClick} />

        {/* 페이지별 라우팅 영역 */}
        <Outlet />
      </main>
    </div>
  );
};

export default MyPageLayout;
