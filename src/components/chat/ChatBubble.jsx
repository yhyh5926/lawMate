import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatBubble = ({ message, myNo, targetRole, targetMemberNo }) => {
  const isMine = message.senderNo === myNo;
  const [showPopup, setShowPopup] = useState(false);
  const [imageModal, setImageModal] = useState(false);
  const navigate = useNavigate();

  const time = message.sentAt
    ? new Date(message.sentAt).toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const goToProfile = () => {
    if (targetRole === "LAWYER") {
      navigate("/lawyer/detail/" + targetMemberNo);
    }
    setShowPopup(false);
  };

  const renderContent = () => {
    if (message.type === "IMAGE") {
      return (
        <div>
          <img
            src={message.fileUrl}
            alt="첨부이미지"
            onClick={() => setImageModal(true)}
            style={{
              maxWidth: "200px",
              borderRadius: "8px",
              cursor: "pointer",
              display: "block",
            }}
          />
          {imageModal && (
            <div
              onClick={() => setImageModal(false)}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(0,0,0,0.75)",
                zIndex: 999,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <img
                src={message.fileUrl}
                alt="첨부이미지"
                onClick={(e) => e.stopPropagation()}
                style={{
                  maxWidth: "90vw",
                  maxHeight: "80vh",
                  borderRadius: "12px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                }}
              />
              <div
                style={{ display: "flex", gap: "12px" }}
                onClick={(e) => e.stopPropagation()}
              >
                <a
                  href={message.fileUrl}
                  download={message.content}
                  style={{
                    padding: "10px 24px",
                    background: "#1A6DFF",
                    color: "#fff",
                    borderRadius: "8px",
                    textDecoration: "none",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  다운로드
                </a>
                <button
                  onClick={() => setImageModal(false)}
                  style={{
                    padding: "10px 24px",
                    background: "#fff",
                    color: "#333",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "14px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  닫기
                </button>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (message.type === "FILE") {
      return (
        <a
          href={message.fileUrl}
          download={message.content}
          style={{
            color: isMine ? "#cce0ff" : "#1A6DFF",
            textDecoration: "underline",
          }}
        >
          {message.content}
        </a>
      );
    }

    return <span>{message.content}</span>;
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: isMine ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: "8px",
        marginBottom: "12px",
      }}
    >
      {!isMine && (
        <div style={{ position: "relative" }}>
          <div
            onClick={() => setShowPopup(!showPopup)}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "8px",
              background: "#4A90D9",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: "14px",
              flexShrink: 0,
              cursor: "pointer",
              boxShadow: "0 2px 6px rgba(74,144,217,0.3)",
            }}
          >
            {message.senderName ? message.senderName[0] : "?"}
          </div>

          {showPopup && (
            <div>
              <div
                onClick={() => setShowPopup(false)}
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 99,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "44px",
                  bottom: "0",
                  background: "#fff",
                  borderRadius: "14px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  padding: "16px",
                  minWidth: "180px",
                  zIndex: 100,
                  border: "1px solid #E8ECF0",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg, #1A6DFF, #4A90D9)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    {message.senderName ? message.senderName[0] : "?"}
                  </div>
                  <div>
                    <div
                      style={{
                        fontWeight: "700",
                        fontSize: "14px",
                        color: "#1A1A2E",
                      }}
                    >
                      {message.senderName}
                    </div>
                    <span
                      style={{
                        fontSize: "11px",
                        background:
                          targetRole === "LAWYER" ? "#E8F0FF" : "#F0F4F8",
                        color: targetRole === "LAWYER" ? "#1A6DFF" : "#666",
                        padding: "2px 7px",
                        borderRadius: "4px",
                        fontWeight: "600",
                      }}
                    >
                      {targetRole === "LAWYER" ? "변호사" : "일반회원"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={goToProfile}
                  style={{
                    width: "100%",
                    padding: "8px",
                    background: "#1A6DFF",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: "600",
                    cursor: "pointer",
                  }}
                >
                  프로필 보기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: isMine ? "flex-end" : "flex-start",
          maxWidth: "65%",
        }}
      >
        {!isMine && (
          <span
            style={{
              fontSize: "12px",
              color: "#888",
              marginBottom: "4px",
              fontWeight: "600",
            }}
          >
            {message.senderName}
          </span>
        )}

        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            gap: "6px",
            flexDirection: isMine ? "row-reverse" : "row",
          }}
        >
          <div
            style={{
              padding: message.type === "IMAGE" ? "6px" : "10px 14px",
              borderRadius: isMine
                ? "18px 4px 18px 18px"
                : "4px 18px 18px 18px",
              background: isMine ? "#1A6DFF" : "#F0F2F5",
              color: isMine ? "#fff" : "#1A1A2E",
              fontSize: "14px",
              lineHeight: "1.5",
              wordBreak: "break-word",
              boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
            }}
          >
            {renderContent()}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: isMine ? "flex-end" : "flex-start",
              gap: "2px",
            }}
          >
            {isMine && (
              <span
                style={{
                  fontSize: "10px",
                  color: message.readYn === "Y" ? "#1A6DFF" : "#bbb",
                }}
              >
                {message.readYn === "Y" ? "읽음" : ""}
              </span>
            )}
            <span
              style={{ fontSize: "11px", color: "#aaa", whiteSpace: "nowrap" }}
            >
              {time}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
