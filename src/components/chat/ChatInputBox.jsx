import React, { useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";

/**
 * ChatInputBox - 메시지 입력창 + 파일 첨부
 * @param {function} onSend - (content, type, fileUrl) => void
 * @param {boolean} disabled - WebSocket 연결 여부
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
      const res = await axiosInstance.post(`/attachment/upload?roomNo=${roomNo}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "8px",
        padding: "12px 16px",
        borderTop: "1px solid #E8ECF0",
        background: "#fff",
      }}
    >
      {/* 파일 첨부 버튼 */}
      <button
        onClick={() => fileRef.current?.click()}
        disabled={disabled || uploading}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "1.5px solid #D0D8E4",
          background: "#F7F9FB",
          cursor: "pointer",
          fontSize: "18px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
        }}
        title="파일 첨부"
      >
        {uploading ? "⏳" : "📎"}
      </button>
      <input
        ref={fileRef}
        type="file"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      {/* 텍스트 입력 */}
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={
          disabled ? "연결 중..." : "메시지를 입력하세요 (Enter 전송)"
        }
        disabled={disabled}
        rows={1}
        style={{
          flex: 1,
          padding: "10px 14px",
          borderRadius: "20px",
          border: "1.5px solid #D0D8E4",
          fontSize: "14px",
          resize: "none",
          outline: "none",
          lineHeight: "1.5",
          background: disabled ? "#F5F5F5" : "#fff",
          transition: "border-color 0.2s",
          maxHeight: "100px",
          overflowY: "auto",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#1A6DFF")}
        onBlur={(e) => (e.target.style.borderColor = "#D0D8E4")}
      />

      {/* 전송 버튼 */}
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          border: "none",
          background: disabled || !text.trim() ? "#D0D8E4" : "#1A6DFF",
          color: "#fff",
          cursor: disabled || !text.trim() ? "default" : "pointer",
          fontSize: "16px",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.2s",
        }}
        title="전송"
      >
        ➤
      </button>
    </div>
  );
};

export default ChatInputBox;
