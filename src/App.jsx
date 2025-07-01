import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./provider/AuthContext";
import Main from "./pages/UserInterface/Main/Main";
import Openinghours from "./pages/UserInterface/Openinghours/Openinghours";
import Reservation from "./pages/UserInterface/Reservation/Reservation";
import Settings from "./pages/UserInterface/Reservation/Settings";
import ChattingBtn from "./pages/UserInterface/Chatting/ChattingBtn";
import Restaurant from "./pages/UserInterface/Restaurant/Restaurant";
import RestaurantInsert from "./pages/UserInterface/Restaurant/RestaurantInsert";
import MyPage from "./pages/UserInterface/MyPage/MyPage";
import Login from "./pages/UserInterface/Login/Login";
import SignUp from "./pages/UserInterface/Login/SignUp";
import InsertReviewPage from "./pages/UserInterface/Review/InsertReviewPage";
import Test from "./pages/UserInterface/Login/test";
import "./api/AxiosInterCeptor";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/restaurant/:restaurant_no" element={<Restaurant />} />
          <Route path="/restaurant-insert" element={<RestaurantInsert />} />
          <Route
            path="/reviews/:restaurant_no"
            element={<InsertReviewPage />}
          />
          <Route path="/openinghours" element={<Openinghours />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/mypage" element={<MyPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/test" element={<Test />}/>
        </Routes>
      </AuthProvider>
      <ChattingBtn />
    </>
  );
}

export default App;
