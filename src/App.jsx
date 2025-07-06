import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./provider/AuthContext";
import Main from "./pages/UserInterface/Main/Main";
import Reservation from "./pages/UserInterface/Reservation/Reservation";
import Settings from "./pages/UserInterface/Reservation/Settings";
import Restaurant from "./pages/UserInterface/Restaurant/Restaurant";
import RestaurantInsert from "./pages/UserInterface/Restaurant/RestaurantInsert";
import MyPage from "./pages/UserInterface/MyPage/MyPage";
import Login from "./pages/UserInterface/Login/Login";
import SignUp from "./pages/UserInterface/Login/SignUp";
import InsertReviewPage from "./pages/UserInterface/Review/InsertReviewPage";
import Operatinghours from "./pages/UserInterface/Operatinghours/Operatinghours";
import Test from "./pages/UserInterface/Login/test";

import "./api/AxiosInterCeptor";
import PopupCallback from "./pages/UserInterface/Login/PopupCallback";
import AdminChatting from "./pages/AdminInterface/AdminChatting/AdminChatting";
import AdminRoute from "./common/AdminRoute/AdminRoute";
import AdminMain from "./pages/AdminInterface/Main/AdminMain";
import UserLayout from "./common/Layout/UserLayout";
import AdminLayout from "./common/Layout/AdminLayout";
import AdminChatPage from "./pages/AdminInterface/AdminChatting/AdminChatting";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <Routes>
          <Route element={<UserLayout />}>
            <Route path="/" element={<Main />} />
            <Route path="/restaurant/:restaurant_no" element={<Restaurant />} />
            <Route path="/restaurant-insert" element={<RestaurantInsert />} />
            <Route
              path="/reviews/:restaurant_no"
              element={<InsertReviewPage />}
            />
            <Route path="/operatinghours" element={<Operatinghours />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/mypage" element={<MyPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/oauth2/kakao/callback" element={<PopupCallback />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route path="/test" element={<Test />} />

            <Route path="/adminChatting" element={<AdminChatting />} />
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="main" element={<AdminMain />} />
              <Route path="chatting" element={<AdminChatPage />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
