import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { mockPrecedents } from "../../mocks/precedent/mockPrecedents";
import { legalDictionary } from "../../mocks/precedent/legalDictionary";
import "../../styles/precedent/precedentDetail.css";

export default function PrecedentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const data = mockPrecedents.find((item) => item.id === id);

  const [tooltip, setTooltip] = useState({ show: false, text: "", x: 0, y: 0 });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const handleMouseEnter = (e, word) => {
    setTooltip({
      show: true,
      text: legalDictionary[word],
      x: e.clientX,
      y: e.clientY,
    });
  };

  const renderContentWithDict = useCallback((text) => {
    if (!text) return "";
    const words = Object.keys(legalDictionary);
    const regex = new RegExp(`(${words.join("|")})`, "g");

    return text.split(regex).map((part, i) => {
      if (words.includes(part)) {
        return (
          <span
            key={i}
            className="concept-term"
            onMouseEnter={(e) => handleMouseEnter(e, part)}
            onMouseMove={(e) =>
              setTooltip((prev) => ({ ...prev, x: e.clientX, y: e.clientY }))
            }
            onMouseLeave={() =>
              setTooltip((prev) => ({ ...prev, show: false }))
            }
          >
            {part}
          </span>
        );
      }
      return part;
    });
  }, []);

  if (!data)
    return <div className="loading-state">데이터를 불러올 수 없습니다.</div>;

  return (
    <div className="premium-report-layout">
      {/* 툴팁 UI */}
      {tooltip.show && (
        <div
          className="floating-tooltip"
          style={{ top: tooltip.y - 10, left: tooltip.x }}
        >
          <div className="tooltip-inner">{tooltip.text}</div>
        </div>
      )}

      {/* 헤더 섹션 */}
      <header className="report-hero">
        <div className="hero-top-info">
          <span className="case-label">{data.header.category} 분석 리포트</span>
          <span className="case-vol">{data.originInfo.caseNumber}</span>
        </div>
        <h1 className="report-main-title keep-all">{data.display.title}</h1>
        <div className="title-underline"></div>
        <p className="hero-abstract keep-all">{data.display.oneLine}</p>
      </header>

      {/* 결과 배너 */}
      <section className="final-judgment-banner">
        <div className="judgment-box">
          <div className="verdict-tag">FINAL VERDICT</div>
          <h2 className="verdict-text keep-all">
            {renderContentWithDict(data.header.result)}
          </h2>
          <p className="verdict-detail keep-all">{data.content.story.court}</p>
        </div>
      </section>

      {/* 본문 그리드 */}
      <main className="report-body-grid">
        <section className="story-section">
          <div className="section-header">
            <span className="section-no">01</span>
            <h3 className="section-name">사건의 발단</h3>
          </div>
          <p className="section-desc keep-all">{data.content.story.start}</p>
        </section>

        <section className="story-section accent-box">
          <div className="section-header">
            <span className="section-no">02</span>
            <h3 className="section-name">법적 쟁점</h3>
          </div>
          <p className="section-desc-bold keep-all">
            {renderContentWithDict(data.content.story.issue)}
          </p>
        </section>

        <section className="story-section">
          <div className="section-header">
            <span className="section-no">03</span>
            <h3 className="section-name">판단 근거</h3>
          </div>
          <div className="logic-list-vertical">
            {data.content.logic.map((text, i) => (
              <div key={i} className="logic-card">
                <div className="logic-card-no">{i + 1}</div>
                <p className="logic-card-text keep-all">
                  {renderContentWithDict(text)}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 푸터 영역 */}
      <footer className="report-footer-area">
        <div className="expert-tip-container">
          <div className="tip-header">💡 전문가 제언</div>
          <p className="tip-body keep-all">{data.content.tip}</p>
        </div>

        <div className="metadata-footer">
          <div className="tags">
            {data.tags.map((tag) => (
              <span key={tag} className="tag-pill">
                #{tag}
              </span>
            ))}
          </div>
          <div className="court-info">
            {data.originInfo.court} · {data.originInfo.date}
          </div>
          <button className="full-back-btn" onClick={() => navigate(-1)}>
            목록으로 돌아가기
          </button>
        </div>
      </footer>
    </div>
  );
}
