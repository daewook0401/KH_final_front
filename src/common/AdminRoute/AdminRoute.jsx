import { Navigate, Outlet } from "react-router-dom";
import AuthContext from "../../provider/AuthContext";
import { useContext } from "react";
const AdminRoute = () => {
  const { auth } = useContext(AuthContext);

  if (auth.loginInfo.memberRole != "ROLE_ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
