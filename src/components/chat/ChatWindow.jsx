// src/components/chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import '../../styles/chat/ChatWindow.css';

// ★ 방별 테스트용 가짜 메시지
const MOCK_MESSAGES = {
  // 일반회원(user1) ↔ 박변호 변호사
  room1: [
    { id: '1', text: '안녕하세요, 전세 사기 관련 상담 가능하신가요?', senderId: 'user1', senderName: '김의뢰', timestamp: Date.now() - 300000 },
    { id: '2', text: '네, 가능합니다. 상세 내용을 말씀해주세요.', senderId: 'lawyer1', senderName: '박변호 변호사', timestamp: Date.now() - 240000 },
    { id: '3', text: '보증금 5천만원인데 집주인이 연락이 안 됩니다.', senderId: 'user1', senderName: '김의뢰', timestamp: Date.now() - 180000 },
    { id: '4', text: '네, 서류 확인해보겠습니다.', senderId: 'lawyer1', senderName: '박변호 변호사', timestamp: Date.now() - 60000 },
  ],
  // 일반회원(user1) ↔ 이변호 변호사
  room2: [
    { id: '1', text: '이혼 소송 절차가 궁금합니다.', senderId: 'user1', senderName: '김의뢰', timestamp: Date.now() - 7200000 },
    { id: '2', text: '다음 주 화요일에 상담 가능합니다.', senderId: 'lawyer2', senderName: '이변호 변호사', timestamp: Date.now() - 3600000 },
  ],
  // 변호사(lawyer1) ↔ 김의뢰
  room3: [
    { id: '1', text: '전세 사기 관련 상담 부탁드립니다.', senderId: 'user1', senderName: '김의뢰', timestamp: Date.now() - 120000 },
    { id: '2', text: '어떤 상황이신지 자세히 알려주세요.', senderId: 'lawyer1', senderName: '박변호', timestamp: Date.now() - 60000 },
  ],
  // 변호사(lawyer1) ↔ 이의뢰
  room4: [
    { id: '1', text: '계약서 검토 부탁드려요.', senderId: 'user2', senderName: '이의뢰', timestamp: Date.now() - 7200000 },
    { id: '2', text: '파일 보내주시면 확인하겠습니다.', senderId: 'lawyer1', senderName: '박변호', timestamp: Date.now() - 3600000 },
  ],
  // 변호사(lawyer1) ↔ 박의뢰
  room5: [
    { id: '1', text: '합의금 관련 문의드립니다.', senderId: 'user3', senderName: '박의뢰', timestamp: Date.now() - 172800000 },
    { id: '2', text: '상대측 제안을 먼저 확인해봐야 합니다.', senderId: 'lawyer1', senderName: '박변호', timestamp: Date.now() - 90000000 },
    { id: '3', text: '감사합니다. 답변 확인했습니다.', senderId: 'user3', senderName: '박의뢰', timestamp: Date.now() - 86400000 },
  ],
};

const ChatWindow = ({ roomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    const mockMsgs = MOCK_MESSAGES[roomId] || [];
    setMessages([...mockMsgs]);
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    const trimmed = inputText.trim();
    if (!trimmed || !roomId) return;

    const newMsg = {
      id: String(Date.now()),
      text: trimmed,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    inputRef.current?.focus();

    // ★ 자동 답장 (1.5초 후) - 시연용
    setTimeout(() => {
      const autoReply = {
        id: String(Date.now() + 1),
        text: '확인했습니다. 잠시만 기다려주세요.',
        senderId: 'bot',
        senderName: '상대방',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, autoReply]);
    }, 1500);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const shouldShowDateDivider = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    return new Date(currentMsg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일`;
  };

  if (!roomId) {
    return (
      <div className="chat-window empty">
        <div className="chat-window-empty-message">
          <span className="chat-window-empty-icon">💬</span>
          <p>채팅방을 선택해주세요</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-window">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <div className="chat-no-messages">
            <p>아직 메시지가 없습니다.</p>
            <p>첫 메시지를 보내보세요!</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <React.Fragment key={msg.id}>
              {shouldShowDateDivider(msg, messages[index - 1]) && (
                <div className="chat-date-divider">
                  <span>{formatDate(msg.timestamp)}</span>
                </div>
              )}
              <MessageBubble
                message={msg}
                isMine={msg.senderId === currentUser.id}
              />
            </React.Fragment>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <textarea
          ref={inputRef}
          className="chat-input"
          placeholder="메시지를 입력하세요..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />
        <button
          className="chat-send-btn"
          onClick={handleSend}
          disabled={!inputText.trim()}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
