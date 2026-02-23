// src/components/chat/MessageBubble.jsx
import React from 'react';
import '../../styles/chat/MessageBubble.css';

const MessageBubble = ({ message, isMine }) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const period = hours < 12 ? '오전' : '오후';
    const displayHour = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    return `${period} ${displayHour}:${minutes}`;
  };

  return (
    <div className={`message-bubble-wrapper ${isMine ? 'mine' : 'other'}`}>
      {!isMine && (
        <div className="message-profile">
          <div className="message-avatar">
            {message.senderName?.charAt(0) || '?'}
          </div>
          <span className="message-sender-name">{message.senderName}</span>
        </div>
      )}

      <div className="message-content-row">
        {isMine && (
          <span className="message-time">{formatTime(message.timestamp)}</span>
        )}

        <div className={`message-bubble ${isMine ? 'mine' : 'other'}`}>
          <p className="message-text">{message.text}</p>
        </div>

        {!isMine && (
          <span className="message-time">{formatTime(message.timestamp)}</span>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
