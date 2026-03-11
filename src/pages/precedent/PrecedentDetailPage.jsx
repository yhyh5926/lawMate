import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import precedentApi from "../../api/precedentApi";
import LegalTooltip from "./LegalTooltip";
import "../../styles/precedent/PrecedentDetailPage.css";
import { scrollToTop } from "../../utils/windowUtils";

const PrecedentDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleBack = () => {
    const page = searchParams.get("page");
    const query = searchParams.get("query");
    const caseType = searchParams.get("caseType");
    const params = new URLSearchParams();
    if (page) params.set("page", page);
    if (query) params.set("query", query);
    if (caseType) params.set("caseType", caseType);
    const qs = params.toString();
    navigate(`/precedent/search${qs ? `?${qs}` : ""}`);
  };

  const [data, setData] = useState(null);
  const [relatedList, setRelatedList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await precedentApi.getPrecedentDetail(id);
        setData(result);
        if (result) {
          const related = await precedentApi.getRelatedPrecedents(
            result.caseType,
            result.keywordCsv,
            id,
          );
          setRelatedList(related);
          scrollToTop();
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
      <div className="pd-state-screen">
        <div className="pd-spinner" />
        <p className="pd-state-text">판례를 분석하고 있습니다...</p>
        <p className="pd-state-sub">복잡한 법률 내용을 쉽게 풀어드릴게요</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="pd-state-screen">
        <p className="pd-state-icon">🔍</p>
        <p className="pd-state-text">해당 판례를 찾을 수 없습니다.</p>
        <button className="pd-back-btn" onClick={handleBack}>
          목록으로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="pd-root">
      <div className="pd-body">
        {/* ── 헤더 ── */}
        <header className="pd-header-card">
          <div className="pd-header-glow" />
          <div className="pd-header-content">
            <div className="pd-badge-row">
              {data.caseType && (
                <span className="pd-badge pd-badge--type">{data.caseType}</span>
              )}
              {data.judgment && (
                <span className="pd-badge pd-badge--judgment">
                  {data.judgment}
                </span>
              )}
            </div>
            <h1 className="pd-title">{data.title}</h1>
            {data.oneLine && (
              <div className="pd-summary-box">
                <span className="pd-summary-label">한 줄 요약</span>
                <p className="pd-summary-text">
                  <LegalTooltip text={data.oneLine} />
                </p>
              </div>
            )}
          </div>
        </header>

        {/* ── AI 분석 ── */}
        {data.aiSummary && (
          <section className="pd-card">
            <div className="pd-card-eyebrow">판례 분석</div>
            <h2 className="pd-card-title">이 사건, 어떤 내용인가요?</h2>

            <div className="pd-story-wrap">
              <div className="pd-story-block">
                <div className="pd-story-icon-wrap">
                  <span className="pd-story-icon">📋</span>
                </div>
                <div className="pd-story-body">
                  <h3 className="pd-story-heading">무슨 일이 있었나요?</h3>
                  <p className="pd-story-text">
                    <LegalTooltip
                      text={data.aiSummary.story?.start || "내용이 없습니다."}
                    />
                  </p>
                </div>
              </div>

              <div className="pd-story-block">
                <div className="pd-story-icon-wrap">
                  <span className="pd-story-icon">🤔</span>
                </div>
                <div className="pd-story-body">
                  <h3 className="pd-story-heading">무엇이 문제였나요?</h3>
                  <p className="pd-story-text">
                    <LegalTooltip
                      text={data.aiSummary.story?.issue || "내용이 없습니다."}
                    />
                  </p>
                </div>
              </div>

              {data.aiSummary.logic?.length > 0 && (
                <div className="pd-story-block">
                  <div className="pd-story-icon-wrap">
                    <span className="pd-story-icon">⚖️</span>
                  </div>
                  <div className="pd-story-body">
                    <h3 className="pd-story-heading">
                      법원은 어떻게 결론 냈나요?
                    </h3>
                    <ol className="pd-logic-list">
                      {data.aiSummary.logic.map((text, i) => (
                        <li key={i} className="pd-logic-item">
                          <LegalTooltip text={text} />
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              )}
            </div>

            {data.aiSummary.tip && (
              <div className="pd-tip-box">
                <span className="pd-tip-icon">💡</span>
                <div className="pd-tip-right">
                  <strong className="pd-tip-label">
                    이런 상황이라면 알아두세요
                  </strong>
                  <p className="pd-tip-text">
                    <LegalTooltip text={data.aiSummary.tip} />
                  </p>
                </div>
              </div>
            )}
          </section>
        )}

        {/* ── 사건 기본 정보 ── */}
        <section className="pd-card">
          <h2 className="pd-card-title">사건 기본 정보</h2>
          <dl className="pd-meta-grid">
            <div className="pd-meta-item">
              <dt>사건번호</dt>
              <dd>{data.caseNo || "-"}</dd>
            </div>
            <div className="pd-meta-item">
              <dt>담당 법원</dt>
              <dd>{data.court || "-"}</dd>
            </div>
            <div className="pd-meta-item">
              <dt>판결 날짜</dt>
              <dd>{data.judgeDate || "-"}</dd>
            </div>
          </dl>
          {data.keywordCsv && (
            <div className="pd-keywords">
              <span className="pd-keywords-label">관련 키워드</span>
              <span className="pd-keywords-text">{data.keywordCsv}</span>
            </div>
          )}
        </section>

        {/* ── 유사 판례 ── */}
        {relatedList.length > 0 && (
          <section className="pd-card">
            <h2 className="pd-card-title">비슷한 사건도 살펴보세요</h2>
            <p className="pd-card-desc">이 판례와 유사한 사건들이에요</p>
            <ul className="pd-related-list">
              {relatedList.map((item) => (
                <li
                  key={item.precId}
                  className="pd-related-item"
                  onClick={() => {
                    navigate(`/precedent/detail/${item.precId}`);
                    window.scrollTo(0, 0);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate(`/precedent/detail/${item.precId}`)
                  }
                >
                  <div className="pd-related-top">
                    <span className="pd-badge pd-badge--type pd-badge--sm">
                      {item.caseType}
                    </span>
                    <span className="pd-related-judgment">{item.judgment}</span>
                  </div>
                  <p className="pd-related-title">{item.title}</p>
                  <p className="pd-related-case-no">{item.caseNo}</p>
                  <span className="pd-related-arrow">→</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ── 뒤로가기 ── */}
        <div className="pd-footer-nav">
          <button className="pd-back-btn" onClick={handleBack}>
            ← 목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrecedentDetailPage;
