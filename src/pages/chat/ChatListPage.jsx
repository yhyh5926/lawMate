import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getChatRooms, deleteChatRoom } from "../../api/chatApi";
import "../../styles/chat/ChatListPage.css";

const ChatListPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const res = await getChatRooms();
      setRooms(res.data.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, roomNo) => {
    e.stopPropagation();
    if (
      !window.confirm(
        "정말 이 채팅방을 삭제하시겠습니까?\n대화 내용이 모두 삭제됩니다.",
      )
    )
      return;
    try {
      await deleteChatRoom(roomNo);
      setRooms((prev) => prev.filter((r) => r.roomNo !== roomNo));
    } catch (e) {
      alert("삭제 중 오류가 발생했습니다.");
    }
  };

  const formatTime = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays === 0)
      return date.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      });
    else if (diffDays === 1) return "어제";
    else if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
  };

  return (
    <div className="chat-list-container">
      <header className="chat-list-header">
        <h1 className="chat-list-title">메시지</h1>
        <p className="chat-list-subtitle">총 {rooms.length}개의 대화</p>
      </header>

      {loading ? (
        <div className="chat-list-loading">불러오는 중...</div>
      ) : rooms.length === 0 ? (
        <div className="chat-list-empty">
          <div className="empty-icon">💬</div>
          <p className="empty-text">아직 대화가 없습니다</p>
          <p className="empty-subtext">
            변호사 프로필에서 1:1 채팅을 시작해보세요
          </p>
        </div>
      ) : (
        <div className="chat-rooms-wrapper">
          {rooms.map((room) => (
            <div
              key={room.roomNo}
              className="chat-room-item"
              onClick={() => navigate(`/chat/room?roomNo=${room.roomNo}`)}
            >
              {/* 아바타 섹션 */}
              <div className="room-avatar">
                {room.targetName?.[0] ?? "?"}
                {room.unreadCount > 0 && (
                  <span className="unread-badge">
                    {room.unreadCount > 99 ? "99+" : room.unreadCount}
                  </span>
                )}
              </div>

              {/* 정보 섹션 */}
              <div className="room-info">
                <div className="room-info-top">
                  <span
                    className={`room-name ${room.unreadCount > 0 ? "unread" : ""}`}
                  >
                    {room.targetName}
                    {room.targetRole === "LAWYER" && (
                      <span className="lawyer-badge">변호사</span>
                    )}
                  </span>
                  <span className="room-time">
                    {formatTime(room.lastMessageAt)}
                  </span>
                </div>
                <p
                  className={`room-last-msg ${room.unreadCount > 0 ? "unread" : ""}`}
                >
                  {room.lastMessage || "대화를 시작해보세요"}
                </p>
              </div>

              {/* 삭제 버튼 */}
              <button
                className="room-delete-btn"
                onClick={(e) => handleDelete(e, room.roomNo)}
                title="채팅방 삭제"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatListPage;
