const ChatRoomList = ({ rooms, setSelectRoom, selectedRoom }) => {
  return (
    <div className="w-72 bg-white shadow-md overflow-y-auto border-r border-gray-200">
      <div className="p-4 border-b font-bold text-lg">채팅방 목록</div>
      {rooms.map((room) => (
        <div
          key={room.roomNo}
          className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
            selectedRoom?.roomNo === room.roomNo ? "bg-gray-100" : ""
          }`}
          onClick={() => setSelectRoom(room)}
        >
          <div className="font-medium">{room.memberNickname}</div>
          <div className="text-sm text-gray-500 truncate">{room.content}</div>
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
