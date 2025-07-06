import React from "react";
import useApi from "../../../hooks/useApi";

const ProfileCard = ({ onEditClick }) => {
  const {header, body, error, loading, refetch: profileApi} = useApi('/api/member/mypage-info', { method: 'post' });
  
  if(loading){
    return <p>로딩 중</p>
  }
  return (
    
    <div className="bg-white shadow rounded-lg p-6 flex items-center gap-6">
      <img
        src={body.items.memberSelfie}
        alt="프로필"
        className="w-24 h-24 rounded-full object-cover"
      />
      <div className="flex-1">
        <p className="text-lg font-semibold">{body.items.memberName}</p>
        <p className="text-gray-500">{body.items.memberEmail}</p>
        <p className="text-gray-500">{body.items.memberNickName}</p>
      </div>
      <button
        onClick={onEditClick}
        className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition"
      >
        개인정보 수정
      </button>
    </div>
  );
};

export default ProfileCard;
