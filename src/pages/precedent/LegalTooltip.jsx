import React, { useState } from "react";
import { legalDictionary } from "./legalDictionary";
import "../../styles/precedent/LegalTooltip.css";

// Font Awesome 관련 임포트
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faScaleBalanced } from "@fortawesome/free-solid-svg-icons";

const LegalTooltip = ({ text }) => {
  const [hoveredWord, setHoveredWord] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  if (!text) return null;

  const keywords = Object.keys(legalDictionary);
  const sortedKeywords = [...keywords].sort((a, b) => b.length - a.length);
  const regex = new RegExp(`(${sortedKeywords.join("|")})`, "g");
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
          style={{ top: mousePos.y + 15, left: mousePos.x + 15 }}
        >
          <header className="lt-tooltip-header">
            {/* FontAwesomeIcon 컴포넌트로 교체 */}
            <FontAwesomeIcon
              icon={faScaleBalanced}
              className="lt-tooltip-icon"
            />
            <strong className="lt-tooltip-term">{hoveredWord}</strong>
          </header>
          <p className="lt-tooltip-desc">{legalDictionary[hoveredWord]}</p>
        </aside>
      )}
    </span>
  );
};

export default LegalTooltip;
