import React, { useEffect } from "react";
import "../../styles/main/NoticeModal.css";

export default function NoticeModal({ notice, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!notice) return null;

  return (
    <div
      className="nm-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="nm-modal" onClick={(e) => e.stopPropagation()}>
        <header className="nm-header">
          <div className="nm-header-left">
            <span className="nm-label">공지사항</span>
            <h2 className="nm-title">{notice.title}</h2>
            <p className="nm-meta">
              {notice.name && <span>{notice.name}</span>}
              {notice.name && notice.createdAt && (
                <span className="nm-dot">·</span>
              )}
              {notice.createdAt && <span>{notice.createdAt}</span>}
            </p>
          </div>
          <button className="nm-close-btn" onClick={onClose} aria-label="닫기">
            ✕
          </button>
        </header>
        <div className="nm-divider" />
        <div className="nm-body">{notice.content ?? "내용이 없습니다."}</div>
      </div>
    </div>
  );
}
