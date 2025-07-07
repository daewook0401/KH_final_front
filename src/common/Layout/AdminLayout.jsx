import { Outlet } from "react-router-dom";
import AdminHeader from "../Header/AdminHeader";

export default function AdminLayout() {
  return (
    <>
      <AdminHeader />
      <Outlet /> {/* 여기서 각 페이지 컴포넌트가 렌더링됨 */}
    </>
  );
}
