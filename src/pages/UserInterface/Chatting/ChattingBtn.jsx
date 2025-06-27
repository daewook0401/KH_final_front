import { useState } from "react";
import HelpIcon from "@mui/icons-material/Help";
import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import Chatting from "./Chatting";
const ChattingBtn = () => {
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <>
      <Chatting chatOpen={chatOpen} setChatOpen={setChatOpen} />

      <div>
        <HelpIcon
          style={{
            fontSize: "80px",
            color: "#1e2b47",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            cursor: "pointer",
            display: chatOpen ? "none" : "block",
          }}
          onClick={() => setChatOpen(true)}
        />
        <ExpandCircleDownIcon
          style={{
            fontSize: "80px",
            color: "#1e2b47",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            cursor: "pointer",
            display: chatOpen ? "block" : "none",
          }}
          onClick={() => setChatOpen(false)}
        />
      </div>
    </>
  );
};
export default ChattingBtn;
