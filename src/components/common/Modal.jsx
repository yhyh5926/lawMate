// src/components/common/Modal.jsx
import React, { useEffect, useState } from "react";

const ANIM_MS = 180;

const Modal = ({ isOpen, title, onClose, children }) => {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  // mount/unmount with animation
  useEffect(() => {
    let t;
    if (isOpen) {
      setMounted(true);
      // next tick to trigger transition
      requestAnimationFrame(() => setActive(true));
    } else {
      setActive(false);
      t = setTimeout(() => setMounted(false), ANIM_MS);
    }
    return () => t && clearTimeout(t);
  }, [isOpen]);

  // ESC to close
  useEffect(() => {
    if (!mounted) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mounted, onClose]);

  if (!mounted) return null;

  return (
    <div
      style={{
        ...styles.overlay,
        opacity: active ? 1 : 0,
      }}
      onClick={onClose} // click outside closes
      role="presentation"
    >
      <div
        style={{
          ...styles.modal,
          transform: active
            ? "translateY(0) scale(1)"
            : "translateY(6px) scale(0.98)",
          opacity: active ? 1 : 0,
        }}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
        role="dialog"
        aria-modal="true"
        aria-label={title || "modal"}
      >
        <div style={styles.header}>
          <h3 style={styles.title}>{title}</h3>
          <button onClick={onClose} style={styles.closeBtn} aria-label="close">
            ×
          </button>
        </div>

        <div style={styles.content}>{children}</div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    transition: `opacity ${ANIM_MS}ms ease`,
  },
  modal: {
    backgroundColor: "#fff",
    borderRadius: "12px",
    width: "520px",
    maxWidth: "92vw",
    maxHeight: "86vh",
    overflow: "auto",
    boxShadow: "0 18px 60px rgba(0,0,0,0.25)",
    transition: `transform ${ANIM_MS}ms ease, opacity ${ANIM_MS}ms ease`,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    borderBottom: "1px solid #eef2f7",
  },
  title: { margin: 0, fontSize: "1.05rem", fontWeight: 900 },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "1.4rem",
    cursor: "pointer",
    lineHeight: 1,
  },
  content: { padding: "18px" },
};

export default Modal;
