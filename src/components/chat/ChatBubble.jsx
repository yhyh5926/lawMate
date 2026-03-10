import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const ChatBubble = ({ message, myNo, targetRole, targetMemberNo, onDelete, onUpdate }) => {
  // 내가 보낸 메시지인지 여부
  const isMine = Number(message.senderNo) === Number(myNo);
  console.log("senderNo:", message.senderNo, "myNo:", myNo, "isMine:", isMine);

  const [showPopup, setShowPopup] = useState(false);   // 프로필 팝업
  const [imageModal, setImageModal] = useState(false);  // 이미지 전체화면
  const [showMenu, setShowMenu] = useState(false);      // 수정/삭제 메뉴
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 }); // 메뉴 위치
  const [editing, setEditing] = useState(false);        // 수정 모드
  const [editText, setEditText] = useState(message.content); // 수정 중인 텍스트
  const menuBtnRef = useRef(null);
  const navigate = useNavigate();

  // 메시지 전송 시각 포맷 (HH:MM)
  const time = message.sentAt
    ? new Date(message.sentAt).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  // 수정 가능 여부: 내 메시지 + 텍스트 타입 + 30분 이내
  const canEdit =
    isMine &&
    (message.type === "TEXT" || !message.type) &&
    message.sentAt &&
    Date.now() - new Date(message.sentAt) < 30 * 60 * 1000;

  // 삭제된 메시지 여부 (soft delete)
  const isDeleted = message.deletedYn === "Y";

  // 수정된 메시지 여부
  const isEdited = message.editedYn === "Y";

  // 변호사 프로필 페이지로 이동
  const goToProfile = () => {
    if (targetRole === "LAWYER") navigate("/lawyer/detail/" + targetMemberNo);
    setShowPopup(false);
  };

  // 파일/이미지 다운로드
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

  // 수정/삭제 메뉴 버튼 위치 계산 (화면 아래 공간 부족 시 위로 표시)
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

  // 삭제: useChat의 deleteMessage를 통해 DB soft delete + WebSocket 브로드캐스트
  const handleDelete = async () => {
    if (!window.confirm("메시지를 삭제하시겠습니까?")) return;
    const msgNo = message.msgNo || message.msgId;
    if (onDelete) await onDelete(msgNo);
    setShowMenu(false);
  };

  // 수정: useChat의 updateMessage를 통해 DB 업데이트 + WebSocket 브로드캐스트
  const handleEdit = async () => {
    if (!editText.trim()) return;
    const msgNo = message.msgNo || message.msgId;
    if (onUpdate) await onUpdate(msgNo, editText.trim());
    setEditing(false);
  };

  // 수정/삭제 메뉴 렌더링 (내 메시지 + 삭제 안 된 경우에만)
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
            {/* 메뉴 외부 클릭 시 닫기 */}
            <div
              onClick={() => setShowMenu(false)}
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 999 }}
            />
            <div
              style={{
                position: "fixed", top: menuPos.top, left: menuPos.left,
                background: "#fff", borderRadius: "10px",
                boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                border: "1px solid #E8ECF0", zIndex: 1000,
                overflow: "hidden", minWidth: "90px",
              }}
            >
              {/* 30분 이내면 수정 버튼, 초과면 비활성화 */}
              {canEdit ? (
                <button
                  onClick={() => { setEditing(true); setShowMenu(false); }}
                  style={{ display: "block", width: "100%", padding: "10px 16px", background: "none", border: "none", textAlign: "left", fontSize: "13px", cursor: "pointer", color: "#1A1A2E" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#F7F9FB"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "none"}
                >
                  수정
                </button>
              ) : (message.type === "TEXT" || !message.type) && (
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

  // 메시지 내용 렌더링
  const renderContent = () => {
    // 삭제된 메시지: 흐린 이탤릭체로 표시
    if (isDeleted) {
      return (
        <span style={{ color: isMine ? "rgba(255,255,255,0.5)" : "#aaa", fontStyle: "italic", fontSize: "13px" }}>
          삭제된 메시지입니다
        </span>
      );
    }

    // 이미지 메시지: 클릭 시 전체화면 모달
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
            <div
              onClick={() => setImageModal(false)}
              style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }}
            >
              <img
                src={message.fileUrl}
                alt="첨부이미지"
                onClick={(e) => e.stopPropagation()}
                style={{ maxWidth: "90vw", maxHeight: "80vh", borderRadius: "12px", boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
              />
              <div style={{ display: "flex", gap: "12px" }} onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleDownload(message.fileUrl, message.content)}
                  style={{ padding: "10px 24px", background: "#1A6DFF", color: "#fff", borderRadius: "8px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
                >
                  다운로드
                </button>
                <button
                  onClick={() => setImageModal(false)}
                  style={{ padding: "10px 24px", background: "#fff", color: "#333", border: "none", borderRadius: "8px", fontSize: "14px", fontWeight: "600", cursor: "pointer" }}
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    // 파일 메시지: 클릭 시 다운로드
    if (message.type === "FILE") {
      return (
        <span
          onClick={() => handleDownload(message.fileUrl, message.content)}
          style={{ color: isMine ? "#cce0ff" : "#1A6DFF", textDecoration: "underline", cursor: "pointer" }}
        >
          {message.content}
        </span>
      );
    }

    // 수정 모드: textarea + 저장/취소 버튼
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
            <button
              onClick={handleEdit}
              style={{ padding: "4px 12px", background: "#1A6DFF", color: "#fff", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
            >
              저장
            </button>
            <button
              onClick={() => { setEditing(false); setEditText(message.content); }}
              style={{ padding: "4px 12px", background: "#eee", color: "#333", border: "none", borderRadius: "6px", fontSize: "12px", cursor: "pointer" }}
            >
              취소
            </button>
          </div>
        </div>
      );
    }

    // 일반 텍스트 메시지: 수정됐으면 "수정됨" 표시
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
    <div
      style={{
        display: "flex",
        // 내 메시지면 오른쪽, 상대방이면 왼쪽 정렬
        flexDirection: isMine ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      {/* 상대방 아바타 + 프로필 팝업 (내 메시지엔 표시 안 함) */}
      {!isMine && (
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowPopup(!showPopup)}
            style={{
              width: "36px", height: "36px", borderRadius: "8px",
              background: "#4A90D9", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: "700", fontSize: "14px", flexShrink: 0,
              cursor: "pointer", boxShadow: "0 2px 6px rgba(74,144,217,0.3)",
            }}
          >
            {message.senderName ? message.senderName[0] : "?"}
          </div>

          {showPopup && (
            <div>
              <div
                onClick={() => setShowPopup(false)}
                style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 99 }}
              />
              <div
                style={{
                  position: "absolute", left: "44px", bottom: "0",
                  background: "#fff", borderRadius: "14px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  padding: "16px", minWidth: "180px", zIndex: 100,
                  border: "1px solid #E8ECF0",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                  <div
                    style={{
                      width: "44px", height: "44px", borderRadius: "10px",
                      background: "linear-gradient(135deg, #1A6DFF, #4A90D9)",
                      color: "#fff", display: "flex", alignItems: "center",
                      justifyContent: "center", fontWeight: "700", fontSize: "18px",
                    }}
                  >
                    {message.senderName ? message.senderName[0] : "?"}
                  </div>
                  <div>
                    <div style={{ fontWeight: "700", fontSize: "14px", color: "#1A1A2E" }}>
                      {message.senderName}
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        background: targetRole === "LAWYER" ? "#E8F0FF" : "#F0F4F8",
                        color: targetRole === "LAWYER" ? "#1A6DFF" : "#666",
                        padding: "2px 7px", borderRadius: "4px", fontWeight: "600",
                      }}
                    >
                      {targetRole === "LAWYER" ? "변호사" : "일반회원"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={goToProfile}
                  style={{ width: "100%", padding: "8px", background: "#1A6DFF", color: "#fff", border: "none", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  프로필 보기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex", flexDirection: "column",
          alignItems: isMine ? "flex-end" : "flex-start",
          maxWidth: "65%",
        }}
      >
        {/* 상대방 이름 (내 메시지엔 표시 안 함) */}
        {!isMine && (
          <span style={{ fontSize: "12px", color: "#888", marginBottom: "4px", fontWeight: "600" }}>
            {message.senderName}
          </span>
        )}

        <div
          style={{
            display: "flex", alignItems: "flex-end", gap: "6px",
            flexDirection: isMine ? "row-reverse" : "row",
          }}
        >
          {/* 삭제된 메시지엔 메뉴 안 보임 */}
          {!isDeleted && renderMenu()}

          {/* 말풍선 */}
          <div
            style={{
              padding: message.type === "IMAGE" ? "6px" : "10px 14px",
              borderRadius: isMine ? "18px 4px 18px 18px" : "4px 18px 18px 18px",
              // 삭제된 메시지는 흐린 배경
              background: isDeleted
                ? (isMine ? "rgba(26,109,255,0.3)" : "#E8ECF0")
                : (isMine ? "#1A6DFF" : "#F0F2F5"),
              color: isMine ? "#fff" : "#1A1A2E",
              fontSize: "14px", lineHeight: "1.5",
              wordBreak: "break-word",
              boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
            }}
          >
            {renderContent()}
          </div>

          {/* 읽음 표시 + 시각 */}
          <div
            style={{
              display: "flex", flexDirection: "column",
              alignItems: isMine ? "flex-end" : "flex-start", gap: "2px",
            }}
          >
            {isMine && (
              <span style={{ fontSize: "10px", color: message.readYn === "Y" ? "#1A6DFF" : "#bbb" }}>
                {message.readYn === "Y" ? "읽음" : ""}
              </span>
            )}
            <span style={{ fontSize: "11px", color: "#aaa", whiteSpace: "nowrap" }}>
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;