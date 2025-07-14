import React, { useContext, useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileCard from "./ProfileCard";
import AuthContext from "../../../provider/AuthContext";

const baseNav = [
  { label: "예약 내역", path: "/mypage/reservations" },
  { label: "리뷰 내역", path: "/mypage/reviews" },
  { label: "즐겨찾기", path: "/mypage/favorites" },
  { label: "회원 탈퇴", path: "/mypage/delete" },
];

const containerAnim = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

const itemHover = { scale: 1.03, backgroundColor: "#FFE8D6" };

const MyPageLayout = () => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const [navItems, setNavItems] = useState(baseNav);

  useEffect(() => {
    if (!auth.isAuthenticated) {
      alert("로그인이 필요합니다");
      navigate("/");
    }
    if (auth.loginInfo?.isStoreOwner === "Y") {
      setNavItems((prev) => [
        ...prev,
        { label: "내 가게 설정", path: "/mypage/restaurant" },
      ]);
    }
  }, []);

  const handleNavClick = (path) => () => {
    if (path === "/mypage/delete") {
      if (window.confirm("정말 탈퇴하시겠습니까?")) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };
  const handleEditClick = () => {
    if (sessionStorage.getItem("socialLoginState") === "true"){
      sessionStorage.setItem("passwordConfirm", "true");
      navigate("/edit-profile");
    } else {
      navigate("/password-confirm");
    }
  }
  return (
    <motion.div
      className="min-h-screen bg-gray-50 flex justify-center"
      variants={containerAnim}
      initial="initial"
      animate="animate"
      transition={{ duration: 0.6 }}
    >
      <div className="w-full max-w-6xl flex bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* 사이드바 */}
        <aside className="w-56 bg-white p-6 border-r">
          <h2 className="text-2xl font-bold text-[#ff6b4a] mb-8">
            나의 NomNom
          </h2>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.path;
              return (
                <motion.button
                  key={item.path}
                  onClick={handleNavClick(item.path)}
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    active
                      ? "bg-[#ffedd8] text-[#e65c00]"
                      : "text-gray-700 hover:text-[#e65c00]"
                  }`}
                  whileHover={itemHover}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {item.label}
                </motion.button>
              );
            })}
          </nav>
        </aside>

        {/* 메인 */}
        <main className="flex-1 p-8">
          <motion.div
            variants={containerAnim}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <ProfileCard onEditClick={handleEditClick} />
          </motion.div>
          <motion.div
            variants={containerAnim}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-6"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </motion.div>
  );
};

export default MyPageLayout;
