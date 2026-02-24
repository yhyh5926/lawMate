import React from 'react';

/**
 * ChatBubble - 말풍선 메시지 컴포넌트
 * @param {object} message - { senderNo, senderName, content, type, fileUrl, sentAt, readYn }
 * @param {number} myNo - 현재 로그인 사용자 memberNo
 */
const ChatBubble = ({ message, myNo }) => {
  const isMine = message.senderNo === myNo;
  const time = new Date(message.sentAt).toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMine ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: '8px',
        marginBottom: '12px',
      }}
    >
      {/* 상대방 아바타 */}
      {!isMine && (
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: '#4A90D9',
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '14px',
            flexShrink: 0,
          }}
        >
          {message.senderName?.[0] ?? '?'}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isMine ? 'flex-end' : 'flex-start',
          maxWidth: '65%',
        }}
      >
        {/* 상대방 이름 */}
        {!isMine && (
          <span
            style={{ fontSize: '12px', color: '#888', marginBottom: '4px', fontWeight: '600' }}
          >
            {message.senderName}
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', flexDirection: isMine ? 'row-reverse' : 'row' }}>
          {/* 말풍선 */}
          <div
            style={{
              padding: '10px 14px',
              borderRadius: isMine ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
              background: isMine ? '#1A6DFF' : '#F0F2F5',
              color: isMine ? '#fff' : '#1A1A2E',
              fontSize: '14px',
              lineHeight: '1.5',
              wordBreak: 'break-word',
              boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
            }}
          >
            {message.type === 'FILE' || message.type === 'IMAGE' ? (
              <a
                href={message.fileUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: isMine ? '#cce0ff' : '#1A6DFF', textDecoration: 'underline' }}
              >
                {message.type === 'IMAGE' ? (
                  <img
                    src={message.fileUrl}
                    alt="첨부이미지"
                    style={{ maxWidth: '200px', borderRadius: '8px' }}
                  />
                ) : (
                  `📎 ${message.content}`
                )}
              </a>
            ) : (
              message.content
            )}
          </div>

          {/* 시간 + 읽음 */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: isMine ? 'flex-end' : 'flex-start',
              gap: '2px',
            }}
          >
            {isMine && (
              <span style={{ fontSize: '10px', color: message.readYn === 'Y' ? '#1A6DFF' : '#bbb' }}>
                {message.readYn === 'Y' ? '읽음' : ''}
              </span>
            )}
            <span style={{ fontSize: '11px', color: '#aaa', whiteSpace: 'nowrap' }}>{time}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
