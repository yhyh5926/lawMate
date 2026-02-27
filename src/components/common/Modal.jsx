// vs코드
// 파일 위치: src/components/common/Modal.jsx
// 설명: 페이지 이동 없이 공지사항 상세 확인, 확인/취소 알림창 등에 사용되는 공용 레이어 팝업

import React from "react";

const Modal = ({ isOpen, title, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn}>X</button>
        </div>
        <div style={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex", justifyContent: "center", alignItems: "center",
    zIndex: 9999,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "8px",
    width: "400px",
    maxWidth: "90%",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "16px 20px",
    borderBottom: "1px solid #eee",
  },
  title: { margin: 0, fontSize: "1.1rem" },
  closeBtn: {
    background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer",
  },
  content: { padding: "20px" },
};

export default Modal;