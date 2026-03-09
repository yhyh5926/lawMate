import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import precedentApi from "../../api/precedentApi";
import LegalTooltip from "./LegalTooltip";
import "../../styles/precedent/PrecedentDetailPage.css";

const PrecedentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [relatedList, setRelatedList] = useState([]); // 유사 판례 상태 추가
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // 1. 메인 판례 상세 정보 로드
        const result = await precedentApi.getPrecedentDetail(id);
        setData(result);

        // 2. 유사 판례 로드 (메인 데이터 로드 성공 시)
        if (result) {
          const related = await precedentApi.getRelatedPrecedents(
            result.caseType,
            result.keywordCsv,
            id,
          );
          setRelatedList(related);
        }
      } catch (err) {
        console.error("데이터 로드 에러:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
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
              <div className="ai-item">
                <h4>📝 사건의 발단</h4>
                <div className="ai-text">
                  <LegalTooltip
                    text={data.aiSummary.story?.start || "내용이 없습니다."}
                  />
                </div>
              </div>

              <div className="ai-item">
                <h4>⚖️ 핵심 쟁점</h4>
                <div className="ai-text">
                  <LegalTooltip
                    text={data.aiSummary.story?.issue || "내용이 없습니다."}
                  />
                </div>
              </div>

              <div className="ai-item">
                <h4>🏛️ 법원의 판단 로직</h4>
                <ul className="ai-logic-list">
                  {data.aiSummary.logic?.length > 0 ? (
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

        {/* 유사 판례 추천 섹션 (추가됨) */}
        {relatedList.length > 0 && (
          <section className="prec-related-section">
            <h3 className="related-title">⚖️ 함께 보면 좋은 비슷한 사건</h3>
            <div className="related-grid">
              {relatedList.map((item) => (
                <div
                  key={item.precId}
                  className="related-card"
                  onClick={() => {
                    navigate(`/precedent/detail/${item.precId}`);
                    window.scrollTo(0, 0); // 새 판례 이동 시 스크롤 상단으로
                  }}
                >
                  <div className="related-card-top">
                    <span className="related-badge">{item.caseType}</span>
                    <span className="related-judgment">{item.judgment}</span>
                  </div>
                  <h4 className="related-card-title">{item.title}</h4>
                  <p className="related-case-no">{item.caseNo}</p>
                </div>
              ))}
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
