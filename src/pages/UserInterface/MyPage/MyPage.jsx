import React, { useState } from "react";
import ProfileCard from "./ProfileCard";
import EditProfilePanel from "./EditProfilePanel";
import ReservationList from "./ReservationList";
import ReviewList from "./ReviewList";
import FavoriteList from "./FavoriteList";
import AccountDeleteSection from "./AccountDeleteSection";

const MyPage = () => {
  const [showEditPanel, setShowEditPanel] = useState(false);

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 space-y-10">
      <ProfileCard onEditClick={() => setShowEditPanel(true)} />
      {showEditPanel && <EditProfilePanel onClose={() => setShowEditPanel(false)} />}
      <ReservationList />
      <ReviewList />
      <FavoriteList />
      <AccountDeleteSection />
    </div>
  );
};

export default MyPage;
