import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../provider/AuthContext";
import { useContext } from "react";
const AdminRoute = () => {
  const { auth } = useContext(AuthContext);
  console.log("AdminRoute 상태:", auth);

  // if (auth.loginInfo.memberRole != "ROLE_ADMIN") {
  //   console.log("관리자 권한이 없거나 인증되지 않았습니다.");
  //   return <Navigate to="/" replace />;
  // }

  return <Outlet />;
};

export default AdminRoute;
