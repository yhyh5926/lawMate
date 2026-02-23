// src/pages/chat/ChatPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAuthStore from '../../zustand/auth_store';
import ChatWindow from '../../components/chat/ChatWindow';
import '../../styles/chat/ChatPage.css';

// ★ 역할별 가짜 채팅방 목록
const MOCK_ROOMS_BY_ROLE = {
  // 일반회원 → 내가 상담 중인 변호사들
  USER: [
    {
      id: 'room1',
      otherUserName: '박변호 변호사',
      lastMessage: '네, 서류 확인해보겠습니다.',
      lastTimestamp: Date.now() - 60000,
    },
    {
      id: 'room2',
      otherUserName: '이변호 변호사',
      lastMessage: '다음 주 화요일에 상담 가능합니다.',
      lastTimestamp: Date.now() - 3600000,
    },
  ],
  // 변호사 → 나에게 상담 요청한 고객들
  LAWYER: [
    {
      id: 'room3',
      otherUserName: '김의뢰 (의뢰인)',
      lastMessage: '전세 사기 관련 상담 부탁드립니다.',
      lastTimestamp: Date.now() - 120000,
    },
    {
      id: 'room4',
      otherUserName: '이의뢰 (의뢰인)',
      lastMessage: '계약서 검토 부탁드려요.',
      lastTimestamp: Date.now() - 7200000,
    },
    {
      id: 'room5',
      otherUserName: '박의뢰 (의뢰인)',
      lastMessage: '감사합니다. 답변 확인했습니다.',
      lastTimestamp: Date.now() - 86400000,
    },
  ],
  // 관리자 → 전체 채팅 현황 모니터링
  ADMIN: [
    {
      id: 'room1',
      otherUserName: '김의뢰 ↔ 박변호',
      lastMessage: '네, 서류 확인해보겠습니다.',
      lastTimestamp: Date.now() - 60000,
    },
    {
      id: 'room3',
      otherUserName: '김의뢰 ↔ 이변호',
      lastMessage: '전세 사기 관련 상담 부탁드립니다.',
      lastTimestamp: Date.now() - 120000,
    },
    {
      id: 'room4',
      otherUserName: '이의뢰 ↔ 박변호',
      lastMessage: '계약서 검토 부탁드려요.',
      lastTimestamp: Date.now() - 7200000,
    },
  ],
};

const ChatPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, logout, loginAs } = useAuthStore();

  const handleRoomClick = (id) => {
    navigate(`/chat/${id}`);
  };

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

  // ═══════════════════════════════════
  // 비로그인 → 차단 화면
  // ═══════════════════════════════════
  if (!user) {
    return (
      <div className="chat-page">
        <div className="chat-blocked">
          <div className="chat-blocked-content">
            <span className="chat-blocked-icon">🔒</span>
            <h2>로그인이 필요합니다</h2>
            <p>채팅 기능은 로그인 후 이용할 수 있습니다.</p>
            <button
              className="chat-login-btn"
              onClick={() => navigate('/login')}
            >
              로그인하러 가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════
  // 로그인됨 → 역할에 맞는 채팅방 표시
  // ═══════════════════════════════════
  const currentUser = {
    id: String(user.id),
    name: user.name,
  };

  // 역할에 맞는 채팅방 목록 가져오기
  const chatRooms = MOCK_ROOMS_BY_ROLE[user.role] || [];

  // 역할별 헤더 설명
  const roleLabel = {
    USER: '일반회원',
    LAWYER: '변호사',
    ADMIN: '관리자',
  };

  const roleDescription = {
    USER: '상담 중인 변호사',
    LAWYER: '나의 상담 의뢰인',
    ADMIN: '전체 채팅 현황',
  };

  return (
    <div className="chat-page">
      {/* 채팅방 목록 (왼쪽) */}
      <aside className="chat-room-list">
        <div className="chat-room-list-header">
          <h2>채팅</h2>
          <span className="chat-user-badge">
            {roleLabel[user.role]}
          </span>
        </div>

        <div className="chat-room-list-description">
          {roleDescription[user.role]}
        </div>

        <div className="chat-room-list-body">
          {chatRooms.length === 0 ? (
            <div className="chat-room-list-empty">
              <p>참여 중인 채팅방이 없습니다.</p>
            </div>
          ) : (
            chatRooms.map((room) => (
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
            ))
          )}
        </div>

        {/* ★ 테스트용 역할 전환 바 (나중에 삭제) */}
        <div className="chat-test-bar">
          <span>테스트:</span>
          <button onClick={() => loginAs('USER')}>일반</button>
          <button onClick={() => loginAs('LAWYER')}>변호사</button>
          <button onClick={() => loginAs('ADMIN')}>관리자</button>
          <button onClick={logout}>로그아웃</button>
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
                {chatRooms.find((r) => r.id === roomId)?.otherUserName || '채팅'}
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
