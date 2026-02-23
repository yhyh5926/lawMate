// src/pages/chat/ChatPage.jsx
import { useParams, useNavigate } from 'react-router-dom';
import ChatWindow from '../../components/chat/ChatWindow';
import '../../styles/chat/ChatPage.css';

// ★ 테스트용 가짜 유저
const currentUser = { id: 'user1', name: '원석' };

// ★ 테스트용 가짜 채팅방 목록
const MOCK_ROOMS = [
  {
    id: 'room1',
    otherUserName: '김변호사',
    lastMessage: '안녕하세요, 상담 관련 문의드립니다.',
    lastTimestamp: Date.now() - 60000,
  },
  {
    id: 'room2',
    otherUserName: '이변호사',
    lastMessage: '네, 확인해보겠습니다.',
    lastTimestamp: Date.now() - 3600000,
  },
  {
    id: 'room3',
    otherUserName: '박변호사',
    lastMessage: '내일 오전에 통화 가능하신가요?',
    lastTimestamp: Date.now() - 86400000,
  },
];

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const handleRoomClick = (id) => {
    navigate(`/chat/${id}`);
  };

  // 시간 포맷 (목록용)
  const formatListTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    if (isToday) {
      const hours = date.getHours();
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const period = hours < 12 ? '오전' : '오후';
      const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
      return `${period} ${displayHour}:${minutes}`;
    }

    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return '어제';
    }

    return `${date.getMonth() + 1}월 ${date.getDate()}일`;
  };

  return (
    <div className="chat-page">
      {/* 채팅방 목록 (왼쪽) */}
      <aside className="chat-room-list">
        <div className="chat-room-list-header">
          <h2>채팅</h2>
        </div>

        <div className="chat-room-list-body">
          {MOCK_ROOMS.map((room) => (
            <div
              key={room.id}
              className={`chat-room-item ${roomId === room.id ? 'active' : ''}`}
              onClick={() => handleRoomClick(room.id)}
            >
              <div className="chat-room-avatar">
                {room.otherUserName.charAt(0)}
              </div>
              <div className="chat-room-info">
                <div className="chat-room-top-row">
                  <span className="chat-room-name">{room.otherUserName}</span>
                  <span className="chat-room-time">
                    {formatListTime(room.lastTimestamp)}
                  </span>
                </div>
                <p className="chat-room-last-message">{room.lastMessage}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* 채팅창 (오른쪽) */}
      <main className="chat-main">
        {roomId ? (
          <>
            <div className="chat-main-header">
              <button
                className="chat-back-btn"
                onClick={() => navigate('/chat')}
              >
                ←
              </button>
              <h3>
                {MOCK_ROOMS.find((r) => r.id === roomId)?.otherUserName || '채팅'}
              </h3>
            </div>
            <ChatWindow roomId={roomId} currentUser={currentUser} />
          </>
        ) : (
          <ChatWindow roomId={null} currentUser={currentUser} />
        )}
      </main>
    </div>
  );
};

export default ChatPage;
