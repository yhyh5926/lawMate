import React, { useState } from "react";
import { legalDictionary } from "./legalDictionary";

const LegalTooltip = ({ text }) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!text) return null;

  const keywords = Object.keys(legalDictionary);
  const regex = new RegExp(`(${keywords.join("|")})`, "g");
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => {
        if (legalDictionary[part]) {
          return (
            <span
              key={i}
              onMouseEnter={(e) => {
                setHoveredWord(part);
                setMousePos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredWord(null)}
              style={highlightStyle}
            >
              {part}
            </span>
          );
        }
        return part;
      })}

      {hoveredWord && (
        <div
          style={{
            ...tooltipStyle,
            top: mousePos.y + 15,
            left: mousePos.x + 15,
          }}
        >
          <strong>{hoveredWord}</strong>: {legalDictionary[hoveredWord]}
        </div>
      )}
    </span>
  );
};

// 스타일은 컴포넌트 파일 안에 묶어서 관리합니다.
const highlightStyle = {
  textDecoration: "underline dotted #007bff",
  cursor: "help",
  color: "#0056b3",
  fontWeight: "500",
};

const tooltipStyle = {
  position: "fixed",
  backgroundColor: "#333",
  color: "#fff",
  padding: "10px",
  borderRadius: "6px",
  fontSize: "0.85rem",
  zIndex: 1000,
  maxWidth: "280px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
  lineHeight: "1.4",
};

export default LegalTooltip; // 💡 여기서 export!
