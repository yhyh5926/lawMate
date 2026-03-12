import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatBubble from "../../components/chat/ChatBubble";
import ChatInputBox from "../../components/chat/ChatInputBox";
import { useChat } from "../../hooks/useChat";
import { useAuthStore } from "../../store/authStore";
import { getChatRooms, deleteChatRoom } from "../../api/chatApi";
import "../../styles/chat/ChatRoomPage.css";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0)
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
};

const ChatRoomPage = () => {
  const [searchParams] = useSearchParams();
  const roomNo = Number(searchParams.get("roomNo"));
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const bottomRef = useRef(null);

  const [rooms, setRooms] = useState([]);

  const currentRoom = rooms.find((r) => r.roomNo === roomNo);
  const targetRole = !user
    ? null
    : user.role === "LAWYER"
      ? "PERSONAL"
      : "LAWYER";

  const {
    messages,
    connected,
    loading,
    sendMessage,
    updateMessage,
    deleteMessage,
  } = useChat(roomNo);

  useEffect(() => {
    getChatRooms()
      .then((res) => setRooms(res.data.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDelete = async (e, targetRoomNo) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "정말 이 채팅방을 삭제하시겠습니까?\n대화 내용이 모두 삭제됩니다.",
      )
    )
      return;
    try {
      await deleteChatRoom(targetRoomNo);
      const updated = rooms.filter((r) => r.roomNo !== targetRoomNo);
      setRooms(updated);
      if (targetRoomNo === roomNo) {
        if (updated.length > 0) {
          navigate(`/chat/room?roomNo=${updated[0].roomNo}`);
        } else {
          navigate("/chat/list");
        }
      }
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  if (!roomNo) {
    return <div className="chat-error-view">잘못된 접근입니다.</div>;
  }

  return (
    <div className="chat-page-container">
      {/* ── 왼쪽 채팅방 목록 사이드바 ── */}
      <aside className="chat-sidebar">
        <div className="sidebar-header">
          <h2 className="sidebar-title">메시지</h2>
        </div>
        <div className="sidebar-scroll-area">
          {rooms.length === 0 ? (
            <div className="sidebar-empty">대화가 없습니다</div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.roomNo}
                className={`sidebar-room-item ${room.roomNo === roomNo ? "active" : ""}`}
                onClick={() => navigate(`/chat/room?roomNo=${room.roomNo}`)}
              >
                <div className="sidebar-room-avatar">
                  {room.targetName?.[0] ?? "?"}
                  {room.unreadCount > 0 && (
                    <span className="sidebar-unread-badge">
                      {room.unreadCount > 99 ? "99+" : room.unreadCount}
                    </span>
                  )}
                </div>

                <div className="sidebar-room-info">
                  <div className="info-top">
                    <span className="room-name-text">
                      {room.targetName}
                      {room.targetRole === "LAWYER" && (
                        <span className="lawyer-tag">변호사</span>
                      )}
                    </span>
                    <span className="room-time-text">
                      {formatTime(room.lastMessageAt)}
                    </span>
                  </div>
                  <p className="room-preview-text">
                    {room.lastMessage || "대화를 시작해보세요"}
                  </p>
                </div>

                <button
                  className="sidebar-delete-btn"
                  onClick={(e) => handleDelete(e, room.roomNo)}
                  title="채팅방 삭제"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* ── 오른쪽 채팅창 ── */}
      <main className="chat-main-content">
        <header className="chat-main-header">
          <div className="header-info">
            <div className="target-title">
              {currentRoom?.targetName ?? "채팅 상담"}
              {currentRoom?.targetRole === "LAWYER" && (
                <span className="lawyer-badge-lg">변호사</span>
              )}
            </div>
            <div
              className={`status-indicator ${connected ? "online" : "offline"}`}
            >
              <span className="status-dot" />
              {connected ? "연결됨" : "연결 중..."}
            </div>
          </div>
        </header>

        {/* 메시지 영역 */}
        <section className="chat-message-area">
          {loading || !user || !targetRole ? (
            <div className="area-loading">메시지 불러오는 중...</div>
          ) : messages.length === 0 ? (
            <div className="area-empty">
              <div className="wave-icon">👋</div>
              <p>대화를 시작해보세요</p>
            </div>
          ) : (
            messages.map((msg, idx) => (
              <ChatBubble
                key={msg.msgNo ?? idx}
                message={msg}
                myNo={user?.memberId}
                targetRole={targetRole}
                targetMemberNo={currentRoom?.memberNo2}
                onDelete={deleteMessage}
                onUpdate={updateMessage}
              />
            ))
          )}
          <div ref={bottomRef} />
        </section>

        <ChatInputBox
          onSend={sendMessage}
          disabled={!connected}
          roomNo={roomNo}
        />
      </main>
    </div>
  );
};

export default ChatRoomPage;
