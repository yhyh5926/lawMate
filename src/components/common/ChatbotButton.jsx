import React, { useState, useRef, useEffect } from "react";
import "../../styles/common/ChatbotButton.css";

const WELCOME =
  "안녕하세요! LawMate 법률 도우미입니다. 궁금한 법률 내용을 물어보세요.";

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([{ from: "bot", text: WELCOME }]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  /* 새 메시지 올 때마다 스크롤 하단 이동 */
  useEffect(() => {
    if (isOpen) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  /* 열릴 때 input 포커스 */
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 120);
  }, [isOpen]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { from: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/chatbot/ask", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ question: text }),
      });

      // SSE 스트리밍 읽기
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";

      // 빈 bot 메시지 먼저 추가 (스트리밍용)
      setMessages((prev) => [...prev, { from: "bot", text: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        reply += chunk;

        // 마지막 bot 메시지를 실시간으로 업데이트
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = { from: "bot", text: reply };
          return next;
        });
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── 채팅 패널 ── */}
      <div
        className={`cb-panel ${isOpen ? "cb-panel--open" : ""}`}
        role="dialog"
        aria-label="법률 도우미 챗봇"
      >
        <header className="cb-panel-header">
          <div className="cb-panel-header-left">
            <div className="cb-bot-avatar">⚖️</div>
            <div>
              <p className="cb-panel-title">법률 도우미</p>
              <p className="cb-panel-status">
                <span className="cb-status-dot" />
                온라인
              </p>
            </div>
          </div>
          <button
            className="cb-close-btn"
            onClick={() => setIsOpen(false)}
            aria-label="닫기"
          >
            ✕
          </button>
        </header>

        <div className="cb-messages">
          {messages.map((msg, i) => (
            <div key={i} className={`cb-msg-wrap cb-msg-wrap--${msg.from}`}>
              {msg.from === "bot" && <div className="cb-msg-avatar">⚖️</div>}
              <div className={`cb-bubble cb-bubble--${msg.from}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="cb-msg-wrap cb-msg-wrap--bot">
              <div className="cb-msg-avatar">⚖️</div>
              <div className="cb-bubble cb-bubble--bot cb-typing">
                <span />
                <span />
                <span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <footer className="cb-input-area">
          <textarea
            ref={inputRef}
            className="cb-input"
            placeholder="법률 질문을 입력하세요..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button
            className="cb-send-btn"
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            aria-label="전송"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </footer>
      </div>

      {/* ── FAB 버튼 ── */}
      <button
        className={`cb-fab ${isOpen ? "cb-fab--open" : ""}`}
        onClick={() => setIsOpen((v) => !v)}
        aria-label="법률 도우미 열기"
      >
        <span className="cb-fab-icon cb-fab-icon--chat">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="cb-fab-icon cb-fab-icon--close">✕</span>
        <span className="cb-fab-label">법률 도우미</span>
      </button>

      {/* 패널 열릴 때 모바일 오버레이 */}
      {isOpen && (
        <div className="cb-overlay" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}
