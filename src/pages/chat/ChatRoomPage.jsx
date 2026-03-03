import React, { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInputBox from '../../components/chat/ChatInputBox';
import { useChat } from '../../hooks/useChat';
import { useAuth } from '../../hooks/useAuth';

const ChatRoomPage = () => {
  const [searchParams] = useSearchParams();
  const roomNo = Number(searchParams.get('roomNo'));
  const navigate = useNavigate();
  const { user } = useAuth();
  const bottomRef = useRef(null);

  const { messages, connected, loading, sendMessage } = useChat(roomNo);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!roomNo) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: '#aaa' }}>
        잘못된 접근입니다.
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh',
      maxWidth: '760px', margin: '0 auto', background: '#fff',
      borderLeft: '1px solid #E8ECF0', borderRight: '1px solid #E8ECF0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 20px', borderBottom: '1px solid #E8ECF0', background: '#fff',
        position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={() => navigate('/chat/list.do')}
          style={{ background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '20px', padding: '4px', color: '#1A1A2E' }}>←</button>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#1A1A2E' }}>
            채팅 상담
          </div>
          <div style={{ fontSize: '12px', color: connected ? '#34C759' : '#FF9500',
            display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%',
              background: connected ? '#34C759' : '#FF9500', display: 'inline-block' }} />
            {connected ? '연결됨' : '연결 중...'}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 16px',
        background: '#F7F9FB', display: 'flex', flexDirection: 'column' }}>
        {loading ? (
          <div style={{ textAlign: 'center', color: '#aaa', marginTop: '60px' }}>
            메시지 불러오는 중...
          </div>
        ) : messages.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#aaa', marginTop: '60px' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>👋</div>
            <p>대화를 시작해보세요</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <ChatBubble key={msg.msgNo ?? idx} message={msg} myNo={user?.memberId} />
          ))
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInputBox onSend={sendMessage} disabled={!connected} />
    </div>
  );
};

export default ChatRoomPage;