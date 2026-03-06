import React, { useState } from "react";
import { legalDictionary } from "./legalDictionary";
import "../../styles/precedent/LegalTooltip.css";

const LegalTooltip = ({ text }) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!text) return null;

  const keywords = Object.keys(legalDictionary);
  const regex = new RegExp(`(${keywords.join("|")})`, "g");
  const parts = text.split(regex);

  return (
    <span className="tooltip-container">
      {parts.map((part, i) => {
        if (legalDictionary[part]) {
          return (
            <span
              key={i}
              className="legal-keyword"
              onMouseMove={(e) => {
                setHoveredWord(part);
                setMousePos({ x: e.clientX, y: e.clientY });
              }}
              onMouseLeave={() => setHoveredWord(null)}
            >
              {part}
            </span>
          );
        }
        return part;
      })}

      {hoveredWord && (
        <div
          className="legal-tooltip-box"
          style={{
            top: mousePos.y + 15,
            left: mousePos.x + 15,
          }}
        >
          <div className="tooltip-header">
            <span className="tooltip-icon">⚖️</span>
            <strong>{hoveredWord}</strong>
          </div>
          <div className="tooltip-body">{legalDictionary[hoveredWord]}</div>
        </div>
      )}
    </span>
  );
};

export default LegalTooltip;
