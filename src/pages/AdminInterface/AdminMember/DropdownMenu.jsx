// DropdownMenu.jsx
import React, { useEffect } from "react";
import ReactDOM from "react-dom";

export default function DropdownMenu({ anchorRect, onClose, children }) {
  // ESC 키로 닫기
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // 메뉴 위치 계산
  const style = {
    position: "absolute",
    top: anchorRect.bottom + window.scrollY + 4,   // 버튼 아래 4px 띄우기
    left: anchorRect.right + window.scrollX - 160, // 메뉴 너비(160px)에 맞춰서 정렬
    width: 160,
    zIndex: 1000,
  };

  return ReactDOM.createPortal(
    <div
      className="bg-white border rounded-md shadow-lg overflow-hidden"
      style={style}
    >
      {children}
    </div>,
    document.body
  );
}
