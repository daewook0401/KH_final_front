// AdminChatPage.jsx
import { useEffect, useState } from "react";
import ChatRoomList from "./ChatRoomList";
import ChatRoomDetail from "./ChatRoomDetail.jsx";
import axios from "axios";

const AdminChatPage = () => {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const apiUrl = window.ENV?.API_URL || "http://localhost:80";

  useEffect(() => {
    // 채팅방 목록 불러오기
    axios
      .get(`${apiUrl}/api/chatting/admin/list`)
      .then((res) => {
        console.log(res.data.body.items);
        setRooms(res.data.body.items); // 예: [{roomNo: "1", userName: "홍길동", lastMessage: "..."}]
      })
      .catch((err) => console.error("채팅방 목록 불러오기 실패", err));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 왼쪽 채팅방 리스트 */}
      <ChatRoomList
        rooms={rooms}
        setSelectRoom={setSelectedRoom}
        selectedRoom={selectedRoom}
      />

      {/* 오른쪽 채팅방 상세 */}
      <div className="flex-1 flex flex-col">
        {selectedRoom ? (
          <ChatRoomDetail room={selectedRoom} />
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-lg">
            채팅방을 선택해주세요
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminChatPage;
