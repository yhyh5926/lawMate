import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ChatBubble from "../../components/chat/ChatBubble";
import ChatInputBox from "../../components/chat/ChatInputBox";
import { useChat } from "../../hooks/useChat";
import { useAuth } from "../../hooks/useAuth";
import { getChatRooms, deleteChatRoom } from "../../api/chatApi";

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return date.toLocaleTimeString("ko-KR", { hour: "2-digit", minute: "2-digit" });
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
};

const ChatRoomPage = () => {
  const [searchParams] = useSearchParams();
  const roomNo = Number(searchParams.get("roomNo"));
  const navigate = useNavigate();
  const { user } = useAuth();
  const bottomRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const currentRoom = rooms.find((r) => r.roomNo === roomNo);
  const targetRole = currentRoom
    ? Number(currentRoom.memberNo1) === Number(user?.memberId)
      ? "LAWYER"
      : "PERSONAL"
    : null;

  const { messages, connected, loading, sendMessage } = useChat(roomNo);

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
    if (!window.confirm("정말 이 채팅방을 삭제하시겠습니까?\n대화 내용이 모두 삭제됩니다.")) return;
    try {
      await deleteChatRoom(targetRoomNo);
      const updated = rooms.filter((r) => r.roomNo !== targetRoomNo);
      setRooms(updated);
      // 현재 보고 있는 방을 삭제했으면 다른 방으로 이동
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
    return <div style={{ textAlign: "center", padding: "60px", color: "#aaa" }}>잘못된 접근입니다.</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh", maxWidth: "1100px", margin: "0 auto", background: "#fff", border: "1px solid #E8ECF0" }}>
      
      {/* ── 왼쪽 채팅목록 사이드바 ── */}
      <div style={{ width: "300px", borderRight: "1px solid #E8ECF0", display: "flex", flexDirection: "column", flexShrink: 0 }}>
        <div style={{ padding: "20px 16px 12px", borderBottom: "1px solid #E8ECF0" }}>
          <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "800", color: "#1A1A2E" }}>메시지</h2>
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {rooms.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 16px", color: "#aaa", fontSize: "13px" }}>대화가 없습니다</div>
          ) : (
            rooms.map((room) => (
              <div
                key={room.roomNo}
                onClick={() => navigate(`/chat/room?roomNo=${room.roomNo}`)}
                style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 16px", cursor: "pointer",
                  background: room.roomNo === roomNo ? "#F0F4FF" : "#fff",
                  borderLeft: room.roomNo === roomNo ? "3px solid #1A6DFF" : "3px solid transparent",
                  transition: "background 0.15s", position: "relative",
                }}
                onMouseEnter={(e) => {
                  if (room.roomNo !== roomNo) e.currentTarget.style.background = "#F7F9FB";
                  e.currentTarget.querySelector(".room-delete-btn").style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = room.roomNo === roomNo ? "#F0F4FF" : "#fff";
                  e.currentTarget.querySelector(".room-delete-btn").style.opacity = "0";
                }}
              >
                {/* 아바타 */}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{
                    width: "44px", height: "44px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #1A6DFF, #4A90D9)", color: "#fff",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: "700", fontSize: "18px",
                  }}>
                    {room.targetName?.[0] ?? "?"}
                  </div>
                  {room.unreadCount > 0 && (
                    <span style={{
                      position: "absolute", top: "-4px", right: "-4px", background: "#FF3B30",
                      color: "#fff", borderRadius: "10px", fontSize: "10px", fontWeight: "700",
                      minWidth: "16px", height: "16px", display: "flex", alignItems: "center",
                      justifyContent: "center", padding: "0 3px", border: "2px solid #fff",
                    }}>
                      {room.unreadCount > 99 ? "99+" : room.unreadCount}
                    </span>
                  )}
                </div>

                {/* 텍스트 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                    <span style={{ fontWeight: "700", fontSize: "14px", color: "#1A1A2E" }}>
                      {room.targetName}
                      {room.targetRole === "LAWYER" && (
                        <span style={{ marginLeft: "5px", fontSize: "10px", background: "#E8F0FF", color: "#1A6DFF", padding: "1px 5px", borderRadius: "4px" }}>
                          변호사
                        </span>
                      )}
                    </span>
                    <span style={{ fontSize: "11px", color: "#aaa" }}>{formatTime(room.lastMessageAt)}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "12px", color: "#888", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {room.lastMessage || "대화를 시작해보세요"}
                  </p>
                </div>

                {/* 삭제 버튼 - 호버 시 나타남 */}
                <button
                  className="room-delete-btn"
                  onClick={(e) => handleDelete(e, room.roomNo)}
                  style={{
                    opacity: "0", transition: "opacity 0.2s",
                    background: "none", border: "none", cursor: "pointer",
                    color: "#FF3B30", fontSize: "16px", padding: "4px",
                    borderRadius: "6px", flexShrink: 0,
                  }}
                  title="채팅방 삭제"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── 오른쪽 채팅창 ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* 헤더 */}
        <div style={{
          display: "flex", alignItems: "center", gap: "12px",
          padding: "14px 20px", borderBottom: "1px solid #E8ECF0",
          background: "#fff", position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: "700", fontSize: "16px", color: "#1A1A2E" }}>
              {currentRoom?.targetName ?? "채팅 상담"}
              {currentRoom?.targetRole === "LAWYER" && (
                <span style={{ marginLeft: "8px", fontSize: "12px", background: "#E8F0FF", color: "#1A6DFF", padding: "2px 8px", borderRadius: "6px" }}>
                  변호사
                </span>
              )}
            </div>
            <div style={{ fontSize: "12px", color: connected ? "#34C759" : "#FF9500", display: "flex", alignItems: "center", gap: "4px" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: connected ? "#34C759" : "#FF9500", display: "inline-block" }} />
              {connected ? "연결됨" : "연결 중..."}
            </div>
          </div>
        </div>

        {/* 메시지 목록 */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px", background: "#F7F9FB", display: "flex", flexDirection: "column" }}>
          {loading ? (
            <div style={{ textAlign: "center", color: "#aaa", marginTop: "60px" }}>메시지 불러오는 중...</div>
          ) : messages.length === 0 ? (
            <div style={{ textAlign: "center", color: "#aaa", marginTop: "60px" }}>
              <div style={{ fontSize: "36px", marginBottom: "12px" }}>👋</div>
              <p>대화를 시작해보세요</p>
            </div>
          ) : !user ? (
            <div style={{ textAlign: "center", color: "#aaa", marginTop: "60px" }}>로딩 중...</div>
          ) : (
            messages.map((msg, idx) => (
              <ChatBubble
                key={msg.msgNo ?? idx}
                message={msg}
                myNo={user?.memberId}
                targetRole={targetRole}
                targetMemberNo={currentRoom?.memberNo2}
              />
            ))
          )}
          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        <ChatInputBox onSend={sendMessage} disabled={!connected} roomNo={roomNo} />
      </div>
    </div>
  );
};

export default ChatRoomPage;