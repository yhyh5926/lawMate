import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { deleteChatMsg, updateChatMsg } from "../../api/chatApi";

const ChatBubble = ({ message, myNo, targetRole, targetMemberNo, onDelete, onUpdate }) => {
  const isMine = message.senderNo === myNo;
  const [showPopup, setShowPopup] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const menuBtnRef = useRef(null);
  const navigate = useNavigate();

  const time = message.sentAt
    ? new Date(message.sentAt).toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" })
    : "";

  // 30분 이내인지 체크
  const canEdit = isMine &&
    (message.type === "TEXT" || !message.type) &&
    message.sentAt &&
    (Date.now() - new Date(message.sentAt)) < 30 * 60 * 1000;

  const isDeleted = message.deletedYn === "Y";
  const isEdited = message.editedYn === "Y";

  const goToProfile = () => {
    if (targetRole === "LAWYER") navigate("/lawyer/detail/" + targetMemberNo);
    setShowPopup(false);
  };

  const handleDownload = async (url, filename) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename || "download";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl);
    } catch (e) {
      alert("다운로드에 실패했습니다.");
    }
  };

  const handleMenuOpen = () => {
    if (menuBtnRef.current) {
      const rect = menuBtnRef.current.getBoundingClientRect();
      const menuHeight = 80;
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < menuHeight) {
        setMenuPos({ top: rect.top - menuHeight, left: rect.right - 90 });
      } else {
        setMenuPos({ top: rect.bottom + 4, left: rect.right - 90 });
      }
    }
    setShowMenu((prev) => !prev);
  };

  const handleDelete = async () => {
    if (!window.confirm("메시지를 삭제하시겠습니까?")) return;
    const msgNo = message.msgNo || message.msgId;
    try {
      await deleteChatMsg(msgNo);
    } catch (e) {
      alert("삭제에 실패했습니다.");
      setShowMenu(false);
      return;
    }
    // UI에서 제거 대신 deletedYn 변경
    if (onDelete) onDelete(msgNo);
    setShowMenu(false);
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    const msgNo = message.msgNo || message.msgId;
    try {
      await updateChatMsg(msgNo, editText.trim());
    } catch (e) {
      alert("수정에 실패했습니다.");
      return;
    }
    if (onUpdate) onUpdate(msgNo, editText.trim());
    setEditing(false);
  };

  const renderMenu = () => {
    if (!isMine || isDeleted) return null;
    return (
      <div style={{ position: "relative" }}>
        <button
          ref={menuBtnRef}
          onClick={handleMenuOpen}
          style={{
            background: "none", border: "none", cursor: "pointer",
            color: "#aaa", fontSize: "16px", padding: "2px 6px",
            borderRadius: "4px", lineHeight: 1, letterSpacing: "1px",
          }}
        >
          ...
        </button>
        {showMenu && (
          <>
            <div onClick={() => setShowMenu(false)}
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }} />
            <div style={{
              position: "fixed", top: menuPos.top, left: menuPos.left,
              background: "#fff", borderRadius: "10px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
              border: "1px solid #E8ECF0", zIndex: 1000,
              overflow: "hidden", minWidth: "90px",
            }}>
              {canEdit && (
                <button
                  onClick={() => { setEditing(true); setShowMenu(false); }}
                  style={{ display: "block", width: "100%", padding: "10px 16px", background: "none", border: "none", textAlign: "left", fontSize: "13px", cursor: "pointer", color: "#1A1A2E" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F7F9FB"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  수정
                </button>
              )}
              {!canEdit && (message.type === "TEXT" || !message.type) && (
                <button
                  disabled
                  style={{ display: "block", width: "100%", padding: "10px 16px", background: "none", border: "none", textAlign: "left", fontSize: "13px", cursor: "not-allowed", color: "#ccc" }}
                >
                  수정 불가
                </button>
              )}
              <button
                onClick={handleDelete}
                style={{ display: "block", width: "100%", padding: "10px 16px", background: "none", border: "none", textAlign: "left", fontSize: "13px", cursor: "pointer", color: "#FF3B30" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#FFF0F0"}
                onMouseLeave={(e) => e.currentTarget.style.background = "none"}
              >
                삭제
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    // 삭제된 메시지
    if (isDeleted) {
      return (
        <span style={{ color: isMine ? "rgba(255,255,255,0.5)" : "#aaa", fontStyle: "italic", fontSize: "13px" }}>
          삭제된 메시지입니다
        </span>
      );
    }

    if (message.type === "IMAGE") {
      return (
        <div>
          <img
            src={message.fileUrl}
            alt="첨부이미지"
            onClick={() => setImageModal(true)}
            style={{ maxWidth: "200px", borderRadius: "8px", cursor: "pointer", display: "block" }}
          />
          {imageModal && (
            <div onClick={() => setImageModal(false)}
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}>
              <img src={message.fileUrl} alt="첨부이미지" onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }} />
              <div style={{ display: "flex", gap: "12px" }} onClick={(e) => e.stopPropagation()}>
                <button onClick={() => handleDownload(message.fileUrl, message.content)}
                  style={{ padding: "10px 24px", background: "#1A6DFF", color: "#fff", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  다운로드
                </button>
                <button onClick={() => setImageModal(false)}
                  style={{ padding: "10px 24px", background: "#fff", color: "#333", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}>
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (message.type === "FILE") {
      return (
        <span onClick={() => handleDownload(message.fileUrl, message.content)}
          style={{ color: isMine ? "#cce0ff" : "#1A6DFF", textDecoration: "underline", cursor: "pointer" }}>
          {message.content}
        </span>
      );
    }

    if (editing) {
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <textarea
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px", resize: "none", minWidth: "150px" }}
            rows={2}
          />
          <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
            <button onClick={handleEdit}
              style={{ padding: "4px 12px", background: "#1A6DFF", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
              저장
            </button>
            <button onClick={() => { setEditing(false); setEditText(message.content); }}
              style={{ padding: "4px 12px", background: "#eee", color: "#333", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}>
              취소
            </button>
          </div>
        </div>
      );
    }

    return (
      <span>
        {message.content}
        {isEdited && (
          <span style={{ fontSize: "10px", color: isMine ? "rgba(255,255,255,0.6)" : "#aaa", marginLeft: "6px" }}>
            수정됨
          </span>
        )}
      </span>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: isMine ? "row-reverse" : "row", alignItems: "flex-end", gap: "8px", marginBottom: "12px" }}>
      {!isMine && (
        <div style={{ position: "relative" }}>
          <div onClick={() => setShowPopup(!showPopup)}
            style={{ width: "36px", height: "36px", borderRadius: "8px", background: "#4A90D9", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "14px", flexShrink: 0, cursor: "pointer", boxShadow: "0 2px 6px rgba(74,144,217,0.3)" }}>
            {message.senderName ? message.senderName[0] : "?"}
          </div>
          {showPopup && (
            <div>
              <div onClick={() => setShowPopup(false)}
                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }} />
              <div style={{ position: "absolute", left: "44px", bottom: "0", background: "#fff", borderRadius: "14px", boxShadow: "0 8px 24px rgba(0,0,0,0.15)", padding: "16px", minWidth: "180px", zIndex: 100, border: "1px solid #E8ECF0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: "linear-gradient(135deg, #1A6DFF, #4A90D9)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "700", fontSize: "18px" }}>
                    {message.senderName ? message.senderName[0] : "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#1A1A2E" }}>{message.senderName}</div>
                    <span style={{ fontSize: "11px", background: targetRole === "LAWYER" ? "#E8F0FF" : "#F0F4F8", color: targetRole === "LAWYER" ? "#1A6DFF" : "#666", padding: "2px 7px", borderRadius: "4px", fontWeight: "600" }}>
                      {targetRole === "LAWYER" ? "변호사" : "일반회원"}
                    </span>
                  </div>
                </div>
                <button onClick={goToProfile}
                  style={{ width: "100%", padding: "8px", background: "#1A6DFF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}>
                  프로필 보기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start", maxWidth: "65%" }}>
        {!isMine && (
          <span style={{ fontSize: "12px", color: "#888", marginBottom: "4px", fontWeight: "600" }}>
            {message.senderName}
          </span>
        )}
        <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", flexDirection: isMine ? "row-reverse" : "row" }}>
          {!isDeleted && renderMenu()}
          <div style={{
            padding: message.type === "IMAGE" ? "6px" : "10px 14px",
            borderRadius: isMine ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
            background: isDeleted
              ? (isMine ? "rgba(26,109,255,0.3)" : "#E8ECF0")
              : (isMine ? "#1A6DFF" : "#F0F2F5"),
            color: isMine ? "#fff" : "#1A1A2E",
            fontSize: "14px",
            lineHeight: "1.5",
            wordBreak: "break-word",
            boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
          }}>
            {renderContent()}
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: isMine ? "flex-end" : "flex-start", gap: "2px" }}>
            {isMine && (
              <span style={{ fontSize: "10px", color: message.readYn === "Y" ? "#1A6DFF" : "#bbb" }}>
                {message.readYn === "Y" ? "읽음" : ""}
              </span>
            )}
            <span style={{ fontSize: "11px", color: "#aaa", whiteSpace: "nowrap" }}>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;