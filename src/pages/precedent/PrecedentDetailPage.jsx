import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import precedentApi from "../../api/precedentApi";
import LegalTooltip from "./LegalTooltip";
import "../../styles/precedent/PrecedentDetailPage.css"; // CSS 임포트

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

  if (loading) return <div className="prec-loading">상세 정보 로딩 중...</div>;
  if (!data)
    return <div className="prec-error">데이터를 찾을 수 없습니다.</div>;

  return (
    <div className="prec-container">
      <button onClick={() => navigate(-1)} className="prec-back-btn">
        <span className="icon">←</span> 뒤로가기
      </button>

      <article className="prec-article">
        <header className="prec-header">
          <div className="prec-badge-group">
            <span className="prec-type-badge">{data.caseType}</span>
            <span className="prec-judgment-badge">{data.judgment}</span>
          </div>
          <h1 className="prec-main-title">{data.title}</h1>
          <div className="prec-one-line">
            <LegalTooltip text={data.oneLine} />
          </div>
        </header>

        {/* AI 요약 섹션 */}
        {data.aiSummary && (
          <section className="prec-ai-section">
            <div className="ai-label">AI Insights</div>
            <h2 className="ai-section-title">사건 리포트 요약</h2>

            <div className="ai-content-card">
              <div className="ai-item">
                <h4>📝 사건의 발단</h4>
                <div className="ai-text">
                  <LegalTooltip text={data.aiSummary.story?.start} />
                </div>
              </div>

              <div className="ai-item">
                <h4>⚖️ 핵심 쟁점</h4>
                <div className="ai-text">
                  <LegalTooltip text={data.aiSummary.story?.issue} />
                </div>
              </div>

              <div className="ai-item">
                <h4>🏛️ 법원의 판단 로직</h4>
                <ul className="ai-logic-list">
                  {data.aiSummary.logic?.map((text, index) => (
                    <li key={index}>
                      <LegalTooltip text={text} />
                    </li>
                  ))}
                </ul>
              </div>

              <div className="ai-expert-tip">
                <span className="tip-icon">💡</span>
                <div className="tip-body">
                  <strong>전문가의 한 줄 팁</strong>
                  <p>
                    <LegalTooltip text={data.aiSummary.tip} />
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="prec-footer">
          <div className="footer-info-grid">
            <div className="info-item">
              <span>사건번호</span> {data.caseNo}
            </div>
            <div className="info-item">
              <span>법원</span> {data.court}
            </div>
            <div className="info-item">
              <span>선고일자</span> {data.judgeDate}
            </div>
          </div>
          <div className="prec-keywords">
            <strong>키워드:</strong> {data.keywordCsv}
          </div>
        </footer>
      </article>
    </div>
  );
};

export default PrecedentDetailPage;
