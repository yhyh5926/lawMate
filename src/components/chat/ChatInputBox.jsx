import React, { useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/chat/ChatInputBox.css";

/**
 * ChatInputBox - 메시지 입력창 + 파일 첨부
 * @param {function} onSend - (content, type, fileUrl) => void
 * @param {boolean} disabled - WebSocket 연결 여부
 * @param {string|number} roomNo - 채팅방 번호
 */
const ChatInputBox = ({ onSend, disabled, roomNo }) => {
  const [text, setText] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed, "TEXT", null);
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await axiosInstance.post(
        `/attachment/upload?roomNo=${roomNo}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      const { fileUrl, originalName } = res.data.data;
      const isImage = file.type.startsWith("image/");
      onSend(originalName, isImage ? "IMAGE" : "FILE", fileUrl);
    } catch (err) {
      alert("파일 업로드 실패");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="chat-input-wrapper">
      {/* 파일 첨부 버튼 */}
      <button
        className={`chat-attach-btn ${uploading ? "is-loading" : ""}`}
        onClick={() => fileRef.current?.click()}
        disabled={disabled || uploading}
        title="파일 첨부"
      >
        {uploading ? "⏳" : "📎"}
      </button>
      <input
        ref={fileRef}
        type="file"
        className="chat-hidden-file"
        onChange={handleFileChange}
      />

      {/* 텍스트 입력 구역 */}
      <textarea
        className="chat-input-field"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          disabled ? "연결 중..." : "메시지를 입력하세요 (Enter 전송)"
        }
        disabled={disabled}
        rows={1}
      />

      {/* 전송 버튼 */}
      <button
        className="chat-send-btn"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        title="전송"
      >
        ➤
      </button>
    </div>
  );
};

export default ChatInputBox;
