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
import Login from "./pages/UserInterface/Login/Login";
import SignUp from "./pages/UserInterface/Login/SignUp";
import InsertReviewPage from "./pages/UserInterface/Review/InsertReviewPage";
import Test from "./pages/UserInterface/Login/test";
import SocialInfo from "./pages/UserInterface/Login/SocialInfo";

import "./api/AxiosInterCeptor";
import PopupCallback from "./pages/UserInterface/Login/PopupCallback";
import MyPageLayout from "./pages/UserInterface/MyPage/MyPageLayout";
import ProfileCard from "./pages/UserInterface/MyPage/ProfileCard";
import ReservationList from "./pages/UserInterface/MyPage/ReservationList";
import ReviewList from "./pages/UserInterface/MyPage/ReviewList";
import FavoriteList from "./pages/UserInterface/MyPage/FavoriteList";
import PasswordConfirmModal from "./pages/UserInterface/MyPage/PasswordConfirmModal";
import Header from "./common/Header/Header";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <AuthProvider>
        <Header/>
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


          

          <Route path="/login" element={<Login />} />
          <Route path="/oauth2/kakao/callback" element={<PopupCallback />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/social-info" element={<SocialInfo />} />
          <Route path="/test" element={<Test />}/>
          <Route path="/mypage" element={<MyPageLayout />}>
            <Route path="profile" element={<ProfileCard />} />
            <Route path="reservations" element={<ReservationList />} />
            <Route path="reviews" element={<ReviewList />} />
            <Route path="favorites" element={<FavoriteList />} />
            <Route path="password-confirm" element={<PasswordConfirmModal/>} />
            {/* <Route path="delete" element={<DeleteAccountPage />} /> */}
          </Route>
        </Routes>

      </AuthProvider>
      <ChattingBtn />
    </>
  );
}

export default App;
