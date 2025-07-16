import { useNavigate } from "react-router-dom";
import logoImage from "/src/assets/rog.png";

const AdminHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="flex items-center justify-between h-20 bg-gray-800 px-6 shadow-md">
      {/* 왼쪽: 로고 + 메뉴 */}
      <div className="flex items-center space-x-8">
        <img
          src={logoImage}
          onClick={() => navigate("/admin/users")}
          alt="로고"
          className="cursor-pointer h-14 w-14"
        />
        <div
          onClick={() => navigate("/admin/users")}
          className="text-white font-medium hover:text-orange-400 cursor-pointer transition"
        >
          회원관리
        </div>
        <div
          onClick={() => navigate("/admin/restaurants")}
          className="text-white font-medium hover:text-orange-400 cursor-pointer transition"
        >
          맛집관리
        </div>
        <div
          onClick={() => navigate("/admin/reviews")}
          className="text-white font-medium hover:text-orange-400 cursor-pointer transition"
        >
          리뷰관리
        </div>
        <div
          onClick={() => navigate("/admin/reservations")}
          className="text-white font-medium hover:text-orange-400 cursor-pointer transition"
        >
          예약관리
        </div>
        <div
          onClick={() => navigate("/admin/chatting")}
          className="text-white font-medium hover:text-orange-400 cursor-pointer transition"
        >
          채팅관리
        </div>
      </div>

      {/* 오른쪽: 메인페이지로 이동 */}
      <div
        onClick={() => navigate("/")}
        className="text-white font-medium hover:text-orange-400 cursor-pointer transition"
      >
        메인페이지로 이동
      </div>
    </header>
  );
};

export default AdminHeader;
