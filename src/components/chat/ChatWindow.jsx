// src/components/chat/ChatWindow.jsx
import React, { useState, useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import '../../styles/chat/ChatWindow.css';

// ★ 방별 테스트용 가짜 메시지
const MOCK_MESSAGES = {
  room1: [
    { id: '1', text: '안녕하세요, 상담 관련 문의드립니다.', senderId: 'user1', senderName: '원석', timestamp: Date.now() - 120000 },
    { id: '2', text: '네, 어떤 내용인가요?', senderId: 'lawyer1', senderName: '김변호사', timestamp: Date.now() - 60000 },
  ],
  room2: [
    { id: '1', text: '계약서 검토 부탁드려도 될까요?', senderId: 'user1', senderName: '원석', timestamp: Date.now() - 7200000 },
    { id: '2', text: '네, 확인해보겠습니다.', senderId: 'lawyer2', senderName: '이변호사', timestamp: Date.now() - 3600000 },
  ],
  room3: [
    { id: '1', text: '상담 일정 조율하고 싶습니다.', senderId: 'user1', senderName: '원석', timestamp: Date.now() - 172800000 },
    { id: '2', text: '내일 오전에 통화 가능하신가요?', senderId: 'lawyer3', senderName: '박변호사', timestamp: Date.now() - 86400000 },
  ],
};

const ChatWindow = ({ roomId, currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 방 바뀌면 해당 방의 가짜 메시지 로드
  useEffect(() => {
    if (!roomId) return;
    const mockMsgs = MOCK_MESSAGES[roomId] || [];
    setMessages([...mockMsgs]);
  }, [roomId]);

  // 메시지 추가될 때 자동 스크롤
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 메시지 전송 (로컬 state에만 추가)
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

  // Enter로 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // 날짜 구분선
  const shouldShowDateDivider = (currentMsg, prevMsg) => {
    if (!prevMsg) return true;
    return new Date(currentMsg.timestamp).toDateString() !== new Date(prevMsg.timestamp).toDateString();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}요일`;
  };

  // 방 미선택 시
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
      {/* 메시지 영역 */}
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

      {/* 입력 영역 */}
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
