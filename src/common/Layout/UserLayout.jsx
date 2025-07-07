import { Outlet } from "react-router-dom";
import Header from "../Header/Header";
import ChattingBtn from "../../pages/UserInterface/Chatting/ChattingBtn";

export default function UserLayout() {
  return (
    <>
      <Header />
      <Outlet /> {/* 여기서 각 페이지 컴포넌트가 렌더링됨 */}
      <ChattingBtn />
    </>
  );
}
