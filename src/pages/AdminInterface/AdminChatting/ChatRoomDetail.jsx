import { useEffect, useState, useRef, useContext } from "react";
import useWebSocket from "react-use-websocket";
import AuthContext from "../../../provider/AuthContext";
import axios from "axios";

const ChatRoomDetail = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesRef = useRef(null);
  const { auth } = useContext(AuthContext);
  const accessToken = auth?.tokens?.accessToken;

  useEffect(() => {
    if (room) {
      axios
        .get(`/api/chatting/${room.roomNo}`)
        .then((res) => setMessages(res.data.body.items))
        .catch((err) => console.error("메시지 불러오기 실패", err));
    }
  }, [room]);

  const socketUrl = room.roomNo
    ? `ws://localhost:8080/ws/chat/${room.roomNo}?token=${accessToken}`
    : null;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("관리자 웹소켓 연결됨"),
      shouldReconnect: () => true,
      reconnectAttempts: 3,
      reconnectInterval: 5000,
    }
  );

  useEffect(() => {
    if (lastJsonMessage) {
      setMessages((prev) => {
        const isDuplicate = prev.some(
          (msg) =>
            msg.content === lastJsonMessage.content &&
            msg.createDate === lastJsonMessage.createDate
        );
        if (!isDuplicate) {
          return [...prev, lastJsonMessage];
        } else {
          return prev;
        }
      });
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!content.trim() || readyState !== WebSocket.OPEN) return;

    const msg = {
      content,
      roomNo: room.roomNo,
    };

    sendJsonMessage(msg);
    setContent("");
  };

  return (
    <div className="flex flex-col w-full max-w-screen-md mx-auto bg-gray-900 rounded-xl shadow-lg overflow-hidden h-[1000px]">
      {/* 헤더 */}
      <div className="px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold text-lg shadow">
        {room.memberNickname} 님과의 대화 (관리자)
      </div>

      {/* 메시지 목록 */}
      <div
        ref={messagesRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-800 space-y-2"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.mine ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`px-3 py-2 rounded-2xl max-w-[70%] text-sm shadow break-words ${
                msg.mine
                  ? "bg-gray-700 text-white"
                  : "bg-gray-600 text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="flex items-center border-t border-gray-700 bg-gray-800 px-3 py-2">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-gray-700 border border-gray-600 rounded-full px-3 py-1 text-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={handleSend}
          disabled={readyState !== WebSocket.OPEN}
          className={`ml-2 px-4 py-1.5 rounded-full font-medium transition ${
            readyState !== WebSocket.OPEN
              ? "bg-gray-500 cursor-not-allowed text-gray-400"
              : "bg-gray-700 text-white hover:bg-gray-600"
          }`}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
