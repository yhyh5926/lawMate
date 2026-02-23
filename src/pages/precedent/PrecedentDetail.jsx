// pages/PrecedentDetail.jsx
import { useParams, useNavigate } from "react-router-dom";
import { mockPrecedents } from "../../mocks/precedent/mockPrecedents";
import "../../styles/precedent/precedentDetail.css";

export default function PrecedentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const precedent = mockPrecedents.find((p) => p.id === id);

  if (!precedent) {
    return (
      <div className="detail-page">
        <div className="not-found">
          <div className="not-found-icon">⚖️</div>
          <h2 className="not-found-title">판례를 찾을 수 없습니다</h2>
          <p className="not-found-text">
            요청하신 판례가 존재하지 않거나 삭제되었습니다.
          </p>
          <button
            className="primary-button"
            onClick={() => navigate("/precedent")}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 날짜 포맷팅
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.replace(/(\d{4})(\d{2})(\d{2})/, "$1년 $2월 $3일");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: precedent.display.title,
          text: precedent.display.oneLine,
          url: window.location.href,
        });
      } catch (err) {
        console.log("공유 취소:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("링크가 복사되었습니다!");
    }
  };

  return (
    <div className="detail-page">
      {/* 상단 네비게이션 */}
      <nav className="top-nav">
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← 목록으로
        </button>
        <div className="action-group">
          <button className="icon-btn" onClick={handlePrint}>
            🖨️ 인쇄
          </button>
          <button className="icon-btn" onClick={handleShare}>
            🔗 공유
          </button>
        </div>
      </nav>

      {/* 헤더 */}
      <header className="detail-header">
        <div className="badge-row">
          <span className="category-badge">{precedent.header.category}</span>
          <span className={`result-badge badge-${precedent.header.result}`}>
            {precedent.header.result}
          </span>
        </div>

        <h1 className="detail-title">{precedent.display.title}</h1>

        <div className="meta-row">
          <div className="meta-box">
            <div className="meta-label">사건번호</div>
            <div className="meta-value">{precedent.originInfo.caseNumber}</div>
          </div>
          <div className="meta-box">
            <div className="meta-label">법원</div>
            <div className="meta-value">{precedent.originInfo.court}</div>
          </div>
          <div className="meta-box">
            <div className="meta-label">선고일</div>
            <div className="meta-value">
              {formatDate(precedent.originInfo.date)}
            </div>
          </div>
        </div>
      </header>

      {/* 한줄 요약 */}
      <section className="summary-section">
        <div className="summary-inner">
          <div className="summary-label">💡 한줄 요약</div>
          <p className="summary-content">{precedent.display.oneLine}</p>
        </div>
      </section>

      {/* 사건의 흐름 */}
      <section className="story-section">
        <h2 className="section-heading">
          <span className="heading-icon">📖</span>
          사건의 흐름
        </h2>

        <div className="timeline">
          <div className="timeline-step">
            <div className="step-badge">STEP 1</div>
            <div className="step-content">
              <h3 className="step-title">사건 발생</h3>
              <p className="step-text">{precedent.content.story.start}</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-badge">STEP 2</div>
            <div className="step-content">
              <h3 className="step-title">문제 상황</h3>
              <p className="step-text">{precedent.content.story.issue}</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-badge">STEP 3</div>
            <div className="step-content">
              <h3 className="step-title">법원 판단</h3>
              <p className="step-text">{precedent.content.story.court}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 핵심 법리 */}
      <section className="logic-section">
        <h2 className="section-heading">
          <span className="heading-icon">⚖️</span>
          핵심 법리
        </h2>

        <div className="logic-grid">
          {precedent.content.logic.map((item, index) => (
            <div key={index} className="logic-card">
              <div className="logic-num">{index + 1}</div>
              <p className="logic-content">{item}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 실무 팁 */}
      <section className="tip-section">
        <h2 className="section-heading">
          <span className="heading-icon">💼</span>
          실무 적용 팁
        </h2>

        <div className="tip-box">
          <div className="tip-emoji">💡</div>
          <p className="tip-content">{precedent.content.tip}</p>
        </div>
      </section>

      {/* 관련 키워드 */}
      <section className="keyword-section">
        <h3 className="keyword-heading">🏷️ 관련 키워드</h3>
        <div className="keyword-list">
          {precedent.metadata.tags.map((tag, index) => (
            <span key={index} className="keyword-tag">
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* 하단 버튼 */}
      <footer className="detail-footer">
        <button className="footer-btn" onClick={() => navigate(-1)}>
          목록으로 돌아가기
        </button>
      </footer>
    </div>
  );
}
