import { useContext, useState, useRef, useEffect } from "react";
import AuthContext from "../../../provider/AuthContext";
import useWebSocket, { ReadyState } from "react-use-websocket";
import axios from "axios";

const ChattingBtn = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const { auth } = useContext(AuthContext);
  const accessToken = auth?.tokens?.accessToken;
  const [messages, setMessages] = useState([]);
  const [roomNo, setRoomNo] = useState("");
  const [content, setContent] = useState("");
  const API = window.ENV?.API_URL || "http://localhost:8080";
  const socket = window.ENV?.SOCKET_URL || "ws://localhost:8080";
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chatOpen) {
      axios
        .get(`${API}/api/chatting/roomNo`)
        .then((response) => {
          setRoomNo(response.data.body.items.roomNo);
        })
        .catch((err) => console.error("채팅방 조회 실패", err));
    }
  }, [chatOpen]);

  useEffect(() => {
    if (roomNo) {
      axios
        .get(`${API}/api/chatting/${roomNo}`)
        .then((res) => {
          setMessages(res.data.body.items);
        })
        .catch((err) => console.error("이전 메시지 불러오기 실패", err));
    }
  }, [roomNo]);

  const socketUrl = roomNo
    ? `${socket}/ws/chat/${roomNo}?token=${accessToken}`
    : null;

  const { sendJsonMessage, lastJsonMessage, readyState } = useWebSocket(
    socketUrl,
    {
      onOpen: () => console.log("웹 소켓 연결 성공"),
      onClose: () => console.log("웹 소켓 연결 종료"),
      shouldReconnect: () => true,
      reconnectAttempts: 3,
      reconnectInterval: 5000,
    }
  );

  useEffect(() => {
    if (lastJsonMessage) {
      setMessages((prev) => [...prev, lastJsonMessage]);
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!content.trim() || readyState !== WebSocket.OPEN) {
      console.warn("메시지를 보낼 수 없습니다. WebSocket 상태:", readyState);
      return;
    }
    const message = {
      content: content,
      roomNo: roomNo,
    };
    sendJsonMessage(message);
    setContent("");
  };

  return (
    <>
      {chatOpen && (
        <div className="fixed bottom-28 right-8 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden z-[1000] border border-orange-400">
          {/* Header */}
          <div className="px-4 py-3 bg-orange-400 text-white flex justify-between items-center">
            <h2 className="text-lg font-semibold">관리자와 채팅</h2>
            <button
              onClick={() => setChatOpen(false)}
              className="text-white text-xl font-bold hover:text-gray-200"
            >
              ×
            </button>
          </div>

          {/* Chat Content */}
          <div className="flex-1 p-3 overflow-y-auto bg-white">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`mb-2 flex ${
                  msg.mine ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-2xl max-w-xs text-sm ${
                    msg.mine
                      ? "bg-orange-400 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {/* Dummy div for scroll */}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-gray-50 flex items-center border-t border-gray-200">
            <input
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="메시지를 입력하세요..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-400"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <button
              onClick={handleSendMessage}
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
      )}

      {/* Floating Button */}
      <button
        onClick={() => setChatOpen(true)}
        className={`fixed bottom-6 right-6 w-16 h-16 rounded-full bg-orange-400 text-white text-3xl shadow-lg hover:bg-orange-500 transition ${
          chatOpen ? "hidden" : ""
        }`}
      >
        💬
      </button>
    </>
  );
};

export default ChattingBtn;
