import React, { useEffect, useRef } from 'react'; // useContext 임시 제거
import { useNavigate, useSearchParams } from 'react-router-dom';
import ChatBubble from '../../components/chat/ChatBubble';
import ChatInputBox from '../../components/chat/ChatInputBox';
import { useChat } from '../../hooks/useChat';
// import { AuthContext } from '../../context/AuthContext';

const ChatRoomPage = () => {
  const [searchParams] = useSearchParams();
  const roomNo = Number(searchParams.get('roomNo'));
  const navigate = useNavigate();
  // const { user } = useContext(AuthContext);
  const user = { memberNo: 1, name: '테스트유저' }; // 임시
  const bottomRef = useRef(null);

  const { messages, connected, loading, sendMessage } = useChat(roomNo);

  // 새 메시지 오면 자동 스크롤
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
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        maxWidth: '760px',
        margin: '0 auto',
        background: '#fff',
        borderLeft: '1px solid #E8ECF0',
        borderRight: '1px solid #E8ECF0',
      }}
    >
      {/* 상단 헤더 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '14px 20px',
          borderBottom: '1px solid #E8ECF0',
          background: '#fff',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >
        <button
          onClick={() => navigate('/chat/list.do')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '20px',
            padding: '4px',
            color: '#1A1A2E',
          }}
        >
          ←
        </button>

        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: '700', fontSize: '16px', color: '#1A1A2E' }}>
            {messages[0]?.senderNo !== user?.memberNo
              ? messages[0]?.senderName
              : '채팅'}
          </div>
          <div
            style={{
              fontSize: '12px',
              color: connected ? '#34C759' : '#FF9500',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: connected ? '#34C759' : '#FF9500',
                display: 'inline-block',
              }}
            />
            {connected ? '연결됨' : '연결 중...'}
          </div>
        </div>
      </div>

      {/* 메시지 목록 */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 16px',
          background: '#F7F9FB',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
          <>
            {messages.map((msg, idx) => (
              <ChatBubble key={msg.msgNo ?? idx} message={msg} myNo={user?.memberNo} />
            ))}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* 입력창 */}
      <ChatInputBox onSend={sendMessage} disabled={!connected} />
    </div>
  );
};

export default ChatRoomPage;
