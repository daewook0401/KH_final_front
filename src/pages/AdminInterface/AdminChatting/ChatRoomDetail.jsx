import { useEffect, useState, useRef, useContext } from "react";
import useWebSocket from "react-use-websocket";
import AuthContext from "../../../provider/AuthContext";
import axios from "axios";

const ChatRoomDetail = ({ room }) => {
  const [messages, setMessages] = useState([]);
  const [content, setContent] = useState("");
  const messagesRef = useRef(null);
  const apiUrl = window.ENV?.API_URL || "http://localhost:80";
  const { auth } = useContext(AuthContext);
  const accessToken = auth?.tokens?.accessToken;

  // 과거 메시지 로딩
  useEffect(() => {
    if (room) {
      axios
        .get(`${apiUrl}/api/chatting/${room.roomNo}`)
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
      onOpen: () => console.log(" 관리자 웹소켓 연결됨"),
      shouldReconnect: () => true,
      reconnectAttempts: 3,
      reconnectInterval: 5000,
    }
  );

  // 새 메시지 도착 시 추가
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

  // 스크롤 맨 아래로 자동 이동
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
    <div className="flex flex-col flex-1">
      {/* 헤더 */}
      <div className="px-4 py-3 border-b bg-orange-400 text-white font-bold">
        {room.memberNickname}님과의 대화
      </div>

      {/* 메시지 목록 */}
      <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`mb-2 flex ${
              msg.mine ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs text-sm ${
                msg.mine
                  ? "bg-orange-400 text-white"
                  : "bg-white border border-gray-300 text-gray-800"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      {/* 입력 영역 */}
      <div className="flex items-center border-t bg-white p-3">
        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border border-gray-300 rounded-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          placeholder="메시지를 입력하세요..."
        />
        <button
          onClick={handleSend}
          disabled={readyState !== WebSocket.OPEN}
          className={`ml-2 px-4 py-2 rounded-full transition ${
            readyState !== WebSocket.OPEN
              ? "bg-gray-300 cursor-not-allowed text-gray-500"
              : "bg-orange-400 text-white hover:bg-orange-500"
          }`}
        >
          보내기
        </button>
      </div>
    </div>
  );
};

export default ChatRoomDetail;
