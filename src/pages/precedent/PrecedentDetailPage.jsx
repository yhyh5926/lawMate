import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import precedentApi from "../../api/precedentApi";
import LegalTooltip from "./LegalTooltip";
import "../../styles/precedent/PrecedentDetailPage.css";

const PrecedentDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const result = await precedentApi.getPrecedentDetail(id);
        setData(result);
      } catch (err) {
        console.error("상세 정보 로드 에러:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="prec-loading-container">
        <div className="spinner"></div>
        <p>AI가 판례 데이터를 정밀 분석 중입니다...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="prec-error-container">
        <p>해당 판례 데이터를 찾을 수 없습니다.</p>
        <button onClick={() => navigate(-1)}>목록으로 돌아가기</button>
      </div>
    );
  }

  return (
    <div className="prec-container">
      {/* 상단 내비게이션 */}
      <nav className="prec-nav">
        <button onClick={() => navigate(-1)} className="prec-back-btn">
          <span className="icon">←</span> 이전 목록으로
        </button>
      </nav>

      <article className="prec-article">
        {/* 헤더 섹션: 사건 기본 정보 */}
        <header className="prec-header">
          <div className="prec-badge-group">
            {data.caseType && (
              <span className="prec-type-badge">{data.caseType}</span>
            )}
            {data.judgment && (
              <span className="prec-judgment-badge">{data.judgment}</span>
            )}
          </div>
          <h1 className="prec-main-title">{data.title}</h1>
          <div className="prec-one-line">
            <LegalTooltip text={data.oneLine} />
          </div>
        </header>

        {/* AI 분석 리포트 섹션 */}
        {data.aiSummary && (
          <section className="prec-ai-section">
            <div className="ai-label">AI CASE ANALYSIS</div>
            <h2 className="ai-section-title">핵심 요약 리포트</h2>

            <div className="ai-content-card">
              {/* 사건의 발단 */}
              <div className="ai-item">
                <h4>📝 사건의 발단</h4>
                <div className="ai-text">
                  <LegalTooltip
                    text={data.aiSummary.story?.start || "내용이 없습니다."}
                  />
                </div>
              </div>

              {/* 핵심 쟁점 */}
              <div className="ai-item">
                <h4>⚖️ 핵심 쟁점</h4>
                <div className="ai-text">
                  <LegalTooltip
                    text={data.aiSummary.story?.issue || "내용이 없습니다."}
                  />
                </div>
              </div>

              {/* 법원의 판단 로직 */}
              <div className="ai-item">
                <h4>🏛️ 법원의 판단 로직</h4>
                <ul className="ai-logic-list">
                  {data.aiSummary.logic && data.aiSummary.logic.length > 0 ? (
                    data.aiSummary.logic.map((text, index) => (
                      <li key={index}>
                        <LegalTooltip text={text} />
                      </li>
                    ))
                  ) : (
                    <li>판단 로직 데이터가 없습니다.</li>
                  )}
                </ul>
              </div>

              {/* 전문가 가이드 */}
              <div className="ai-expert-tip">
                <span className="tip-icon">💡</span>
                <div className="tip-body">
                  <strong>전문가 가이드</strong>
                  <div className="tip-text">
                    <LegalTooltip
                      text={data.aiSummary.tip || "준비된 팁이 없습니다."}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 푸터 섹션: 법적 메타데이터 */}
        <footer className="prec-footer">
          <div className="footer-info-grid">
            <div className="info-item">
              <span>사건번호</span>
              <p>{data.caseNo || "-"}</p>
            </div>
            <div className="info-item">
              <span>관할 법원</span>
              <p>{data.court || "-"}</p>
            </div>
            <div className="info-item">
              <span>선고 일자</span>
              <p>{data.judgeDate || "-"}</p>
            </div>
          </div>
          {data.keywordCsv && (
            <div className="prec-keywords">
              <strong>관련 키워드</strong> {data.keywordCsv}
            </div>
          )}
        </footer>
      </article>
    </div>
  );
};

export default PrecedentDetailPage;
