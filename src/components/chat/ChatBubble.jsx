import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/chat/ChatBubble.css";

const ChatBubble = ({
  message,
  myNo,
  targetRole,
  targetMemberNo,
  onDelete,
  onUpdate,
}) => {
  const isMine = Number(message.senderNo) === Number(myNo);
  const [showPopup, setShowPopup] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(message.content);
  const menuBtnRef = useRef(null);
  const navigate = useNavigate();

  const time = message.sentAt
    ? new Date(message.sentAt).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const canEdit =
    isMine &&
    (message.type === "TEXT" || !message.type) &&
    message.sentAt &&
    Date.now() - new Date(message.sentAt) < 30 * 60 * 1000;

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
    console.log("삭제 시도 msgNo:", msgNo);
    console.log("message 전체:", message);
    if (onDelete) await onDelete(msgNo);
    setShowMenu(false);
  };

  const handleEdit = async () => {
    if (!editText.trim()) return;
    const msgNo = message.msgNo || message.msgId;
    if (onUpdate) await onUpdate(msgNo, editText.trim());
    setEditing(false);
  };

  const renderMenu = () => {
    if (!isMine || isDeleted) return null;
    return (
      <div className="menu-wrapper">
        <button
          ref={menuBtnRef}
          onClick={handleMenuOpen}
          className="menu-btn-trigger"
        >
          ...
        </button>
        {showMenu && (
          <>
            <div className="menu-overlay" onClick={() => setShowMenu(false)} />
            <div
              className="menu-dropdown"
              style={{ top: menuPos.top, left: menuPos.left }}
            >
              {canEdit ? (
                <button
                  className="menu-item"
                  onClick={() => {
                    setEditing(true);
                    setShowMenu(false);
                  }}
                >
                  수정
                </button>
              ) : (
                (message.type === "TEXT" || !message.type) && (
                  <button className="menu-item disabled" disabled>
                    수정 불가
                  </button>
                )
              )}
              <button className="menu-item delete" onClick={handleDelete}>
                삭제
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderContent = () => {
    if (isDeleted) {
      return (
        <span className={`content-deleted ${isMine ? "mine" : ""}`}>
          삭제된 메시지입니다
        </span>
      );
    }

    if (message.type === "IMAGE") {
      return (
        <div className="content-image-wrapper">
          <img
            src={message.fileUrl}
            alt="첨부이미지"
            className="content-image"
            onClick={() => setImageModal(true)}
          />
          {imageModal && (
            <div className="modal-overlay" onClick={() => setImageModal(false)}>
              <img
                src={message.fileUrl}
                alt="첨부이미지"
                className="modal-image"
                onClick={(e) => e.stopPropagation()}
              />
              <div
                className="modal-actions"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  className="btn-download"
                  onClick={() =>
                    handleDownload(message.fileUrl, message.content)
                  }
                >
                  다운로드
                </button>
                <button
                  className="btn-close"
                  onClick={() => setImageModal(false)}
                >
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
        <span
          className={`content-file ${isMine ? "mine" : ""}`}
          onClick={() => handleDownload(message.fileUrl, message.content)}
        >
          {message.content}
        </span>
      );
    }

    if (editing) {
      return (
        <div className="edit-mode-container">
          <textarea
            className="edit-textarea"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            rows={2}
          />
          <div className="edit-actions">
            <button className="btn-save" onClick={handleEdit}>
              저장
            </button>
            <button
              className="btn-cancel"
              onClick={() => {
                setEditing(false);
                setEditText(message.content);
              }}
            >
              취소
            </button>
          </div>
        </div>
      );
    }

    return (
      <span className="content-text">
        {message.content}
        {isEdited && (
          <span
            className={`edited-tag ${isMine ? "mine" : ""}`}
            style={{ opacity: 1, color: isMine ? "#cce0ff" : "#666", fontSize: "11px" }}
          >
            수정됨
          </span>
        )}
      </span>
    );
  };

  return (
    <div className={`bubble-row ${isMine ? "mine" : "other"}`}>
      {!isMine && (
        <div className="avatar-wrapper">
          <div
            className="avatar-circle"
            onClick={() => setShowPopup(!showPopup)}
          >
            {message.senderName ? message.senderName[0] : "?"}
          </div>
          {showPopup && (
            <>
              <div
                className="popup-overlay"
                onClick={() => setShowPopup(false)}
              />
              <div className="profile-popup">
                <div className="popup-header">
                  <div className="popup-avatar">
                    {message.senderName ? message.senderName[0] : "?"}
                  </div>
                  <div className="popup-info">
                    <div className="popup-name">{message.senderName}</div>
                    <span className={`role-badge ${targetRole}`}>
                      {targetRole === "LAWYER" ? "변호사" : "일반회원"}
                    </span>
                  </div>
                </div>
               {targetRole === "LAWYER" && (
                  <button className="btn-profile-view" onClick={goToProfile}>
                    프로필 보기
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      )}

      <div className={`message-container ${isMine ? "mine" : "other"}`}>
        {!isMine && <span className="sender-name">{message.senderName}</span>}

        <div className={`bubble-content-row ${isMine ? "mine" : "other"}`}>
          {!isDeleted && renderMenu()}
          <div
            className={`bubble-box ${isMine ? "mine" : "other"} ${message.type === "IMAGE" ? "type-image" : ""} ${isDeleted ? "deleted" : ""}`}
          >
            {renderContent()}
          </div>
          <div className={`status-container ${isMine ? "mine" : "other"}`}>
            {isMine && (
              <span className="read-status">
                {message.readYn === "Y" ? "읽음" : ""}
              </span>
            )}
            <span className="sent-time">{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
