import { useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./provider/AuthContext";
import Main from "./pages/UserInterface/Main/Main";
import Reservation from "./pages/UserInterface/Reservation/Reservation";
import Settings from "./pages/UserInterface/Reservation/Settings";
import Restaurant from "./pages/UserInterface/Restaurant/Restaurant";
import RestaurantInsert from "./pages/UserInterface/Restaurant/RestaurantInsert";
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
import MyPageLayout from "./pages/UserInterface/MyPage/MyPageLayout";
import ProfileCard from "./pages/UserInterface/MyPage/ProfileCard";
import ReservationList from "./pages/UserInterface/MyPage/ReservationList";
import ReviewList from "./pages/UserInterface/MyPage/ReviewList";
import FavoriteList from "./pages/UserInterface/MyPage/FavoriteList";
import PasswordConfirmModal from "./pages/UserInterface/MyPage/PasswordConfirmModal";
import SocialInfo from "./pages/UserInterface/Login/SocialInfo";
import AdminReservation from "./pages/AdminInterface/AdminReservation/AdminReservation";
import MyRestaurant from "./pages/UserInterface/MyPage/MyRestaurant";
import AdminUserManagement from "./pages/AdminInterface/AdminMember/AdminUserManagement";
import AdminRestaurantPage from "./pages/AdminInterface/AdminRestaurant/AdminRestaurantPage";
import EditProfilePage from "./pages/UserInterface/MyPage/EditProfilePage";
import SearchResultsPage from "./pages/UserInterface/Restaurant/SearchResultsPage";
import FindingId from "./pages/UserInterface/Login/FindingId";
import FindingPw from "./pages/UserInterface/Login/FindingPw";
import MemberDelete from "./pages/UserInterface/MyPage/MemberDelete";

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
            <Route path="/search-results" element={<SearchResultsPage />} />
            <Route path="/operatinghours" element={<Operatinghours />} />
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/settings" element={<Settings />} />

            <Route path="/login" element={<Login />} />
            <Route path="/oauth2/kakao/callback" element={<PopupCallback />} />
            <Route path="/sign-up" element={<SignUp />} />

            <Route path="/test" element={<Test />} />

            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/social-info" element={<SocialInfo />} />
            <Route path="/test" element={<Test />} />
            <Route path="mypage" element={<MyPageLayout />}>
              <Route path="profile" element={<ProfileCard />} />
              <Route path="reservations" element={<ReservationList />} />
              <Route path="reviews" element={<ReviewList />} />
              <Route path="favorites" element={<FavoriteList />} />
              <Route path="restaurant" element={<MyRestaurant />} />
              
            </Route>
            <Route
              path="/password-confirm"
              element={<PasswordConfirmModal />}
            />
            <Route path="/user-delete" element={<MemberDelete />} />
            <Route path="/edit-profile" element={<EditProfilePage />} />
          </Route>

          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="main" element={<AdminMain />} />
              <Route path="users" element={<AdminUserManagement />} />
              <Route path="chatting" element={<AdminChatPage />} />
              <Route path="restaurants" element={<AdminRestaurantPage />} />
              <Route path="reservations" element={<AdminReservation />} />
            </Route>
          </Route>

          <Route path="/oauth2/kakao/callback" element={<PopupCallback />} />
          <Route path="/finding-id" element={<FindingId />} />
          <Route path="/finding-password" element={<FindingPw />} />

        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;
