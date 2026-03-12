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
    <span className="lt-wrap">
      {parts.map((part, i) =>
        legalDictionary[part] ? (
          <mark
            key={i}
            className="lt-keyword"
            onMouseMove={(e) => {
              setHoveredWord(part);
              setMousePos({ x: e.clientX, y: e.clientY });
            }}
            onMouseLeave={() => setHoveredWord(null)}
          >
            {part}
          </mark>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}

      {hoveredWord && (
        <aside
          className="lt-tooltip"
          role="tooltip"
          style={{ top: mousePos.y + 14, left: mousePos.x + 14 }}
        >
          <header className="lt-tooltip-header">
            <span className="lt-tooltip-icon">⚖️</span>
            <strong className="lt-tooltip-term">{hoveredWord}</strong>
          </header>
          <p className="lt-tooltip-desc">{legalDictionary[hoveredWord]}</p>
        </aside>
      )}
    </span>
  );
};

export default LegalTooltip;
