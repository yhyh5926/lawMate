import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import { categories } from "../../constants/categories.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faImages } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatDate.js";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@400;600;700&family=Noto+Sans+KR:wght@300;400;500;600&display=swap');

  :root {
    --navy: #0d1b2a;
    --navy-mid: #1a2e45;
    --navy-light: #243b55;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --gold-pale: #f5e9c8;
    --cream: #faf7f2;
    --text-primary: #1a1a2e;
    --text-muted: #6b7080;
    --border: #e2ddd5;
    --adopted-bg: #eaf7f0;
    --adopted-text: #1a7a4a;
    --waiting-bg: #fff8ec;
    --waiting-text: #b07a10;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .qlp-root {
    min-height: 100vh;
    background: var(--cream);
    font-family: 'Noto Sans KR', sans-serif;
    color: var(--text-primary);
  }

  /* ── HERO BANNER ── */
  .qlp-hero {
    background: linear-gradient(135deg, var(--navy) 0%, var(--navy-mid) 60%, #1e3a5f 100%);
    padding: 56px 40px 48px;
    position: relative;
    overflow: hidden;
  }
  .qlp-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(circle at 80% 20%, rgba(201,168,76,0.12) 0%, transparent 50%),
      radial-gradient(circle at 10% 80%, rgba(201,168,76,0.07) 0%, transparent 40%);
    pointer-events: none;
  }
  .qlp-hero-inner {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 1;
  }
  .qlp-hero-eyebrow {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }
  .qlp-hero-eyebrow-line {
    width: 32px;
    height: 1.5px;
    background: var(--gold);
  }
  .qlp-hero-eyebrow-text {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
  }
  .qlp-hero-title {
    font-family: 'Noto Serif KR', serif;
    font-size: 36px;
    font-weight: 700;
    color: #fff;
    line-height: 1.25;
    margin-bottom: 14px;
  }
  .qlp-hero-title span {
    color: var(--gold-light);
  }
  .qlp-hero-desc {
    font-size: 14.5px;
    color: rgba(255,255,255,0.68);
    line-height: 1.8;
    max-width: 560px;
    margin-bottom: 28px;
    font-weight: 300;
  }
  .qlp-badges {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
  .qlp-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 20px;
    padding: 5px 14px;
    font-size: 12px;
    color: rgba(255,255,255,0.85);
    font-weight: 400;
    letter-spacing: 0.02em;
  }
  .qlp-badge-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--gold);
    flex-shrink: 0;
  }
  .qlp-hero-write-btn {
    position: absolute;
    top: 0;
    right: 0;
    background: linear-gradient(135deg, var(--gold) 0%, #b8913d 100%);
    color: var(--navy);
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    padding: 11px 24px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    letter-spacing: 0.04em;
    box-shadow: 0 4px 18px rgba(201,168,76,0.35);
    transition: all 0.22s ease;
  }
  .qlp-hero-write-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(201,168,76,0.45);
  }

  /* ── FILTER BAR ── */
  .qlp-filter-bar {
    background: #fff;
    border-bottom: 1px solid var(--border);
    box-shadow: 0 1px 6px rgba(0,0,0,0.05);
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .qlp-filter-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 14px 40px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .qlp-category-select {
    height: 40px;
    padding: 0 14px;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 13px;
    color: var(--text-primary);
    background: #fff;
    cursor: pointer;
    outline: none;
    min-width: 130px;
    transition: border-color 0.2s;
  }
  .qlp-category-select:focus { border-color: var(--navy-mid); }

  .qlp-search-form {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .qlp-search-input-wrap {
    flex: 1;
    position: relative;
  }
  .qlp-search-input {
    width: 100%;
    height: 40px;
    padding: 0 36px 0 14px;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 13.5px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    background: #fafafa;
  }
  .qlp-search-input:focus {
    border-color: var(--navy-mid);
    box-shadow: 0 0 0 3px rgba(13,27,42,0.07);
    background: #fff;
  }
  .qlp-search-clear {
    position: absolute;
    right: 10px; top: 50%;
    transform: translateY(-50%);
    background: none; border: none;
    color: var(--text-muted);
    cursor: pointer; font-size: 13px;
    line-height: 1;
    padding: 2px;
  }
  .qlp-search-btn {
    height: 40px;
    padding: 0 20px;
    background: var(--navy);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
    letter-spacing: 0.03em;
  }
  .qlp-search-btn:hover { background: var(--navy-light); }
  .qlp-reset-btn {
    height: 40px;
    width: 40px;
    background: none;
    border: 1.5px solid var(--border);
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center;
  }
  .qlp-reset-btn:hover { border-color: var(--navy); color: var(--navy); }

  /* ── CONTENT ── */
  .qlp-content {
    max-width: 1100px;
    margin: 0 auto;
    padding: 36px 40px 60px;
  }

  /* ── TABLE ── */
  .qlp-table-wrap {
    background: #fff;
    border-radius: 14px;
    border: 1px solid var(--border);
    overflow: hidden;
    box-shadow: 0 2px 16px rgba(0,0,0,0.05);
  }
  .qlp-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13.5px;
  }
  .qlp-table thead tr {
    background: var(--navy);
  }
  .qlp-table thead th {
    color: rgba(255,255,255,0.75);
    font-weight: 500;
    font-size: 11.5px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    padding: 14px 16px;
    text-align: left;
    border: none;
    white-space: nowrap;
  }
  .qlp-table thead th.col-type  { width: 110px; }
  .qlp-table thead th.col-title { }
  .qlp-table thead th.col-author { width: 100px; }
  .qlp-table thead th.col-date   { width: 110px; }
  .qlp-table thead th.col-status { width: 110px; }

  .qlp-table tbody tr {
    border-bottom: 1px solid #f0ece6;
    transition: background 0.15s;
  }
  .qlp-table tbody tr:last-child { border-bottom: none; }
  .qlp-table tbody tr:hover { background: #faf8f4; }

  .qlp-table td {
    padding: 15px 16px;
    vertical-align: middle;
  }

  .qlp-type-badge {
    display: inline-block;
    background: var(--gold-pale);
    color: #7a5a10;
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.02em;
    border: 1px solid rgba(201,168,76,0.3);
    white-space: nowrap;
  }

  .qlp-title-link {
    display: flex;
    align-items: center;
    gap: 8px;
    text-decoration: none;
    color: var(--text-primary);
    transition: color 0.2s;
  }
  .qlp-title-link:hover .qlp-title-text {
    color: var(--navy-mid);
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .qlp-title-text {
    font-weight: 500;
    line-height: 1.4;
    transition: color 0.2s;
  }
  .qlp-title-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
  }
  .qlp-file-icon {
    display: flex; align-items: center; gap: 3px;
    color: var(--text-muted);
    font-size: 12px;
  }
  .qlp-answer-count {
    color: var(--navy-mid);
    font-size: 12.5px;
    font-weight: 700;
  }

  .qlp-author {
    color: var(--text-muted);
    font-size: 12.5px;
  }
  .qlp-date {
    color: var(--text-muted);
    font-size: 12px;
    white-space: nowrap;
  }

  .qlp-status-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .qlp-status-badge.adopted {
    background: var(--adopted-bg);
    color: var(--adopted-text);
  }
  .qlp-status-badge.waiting {
    background: var(--waiting-bg);
    color: var(--waiting-text);
  }
  .qlp-status-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }
  .adopted .qlp-status-dot { background: var(--adopted-text); }
  .waiting .qlp-status-dot { background: var(--waiting-text); }

  /* empty */
  .qlp-empty {
    text-align: center;
    padding: 64px 0;
    color: var(--text-muted);
  }
  .qlp-empty-icon { font-size: 36px; margin-bottom: 12px; }
  .qlp-empty-text { font-size: 14px; }

  /* loading */
  .qlp-loading {
    text-align: center;
    padding: 80px 0;
    color: var(--text-muted);
    font-size: 14px;
  }
  .qlp-spinner {
    width: 28px; height: 28px;
    border: 2.5px solid #e0dbd3;
    border-top-color: var(--navy);
    border-radius: 50%;
    margin: 0 auto 14px;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── PAGINATION ── */
  .qlp-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 6px;
    margin-top: 28px;
  }
  .qlp-page-arrow,
  .qlp-page-btn {
    min-width: 36px;
    height: 36px;
    display: flex; align-items: center; justify-content: center;
    border-radius: 8px;
    border: 1.5px solid var(--border);
    background: #fff;
    font-family: 'Noto Sans KR', sans-serif;
    font-size: 13px;
    color: var(--text-muted);
    cursor: pointer;
    transition: all 0.18s;
  }
  .qlp-page-btn:hover, .qlp-page-arrow:hover:not(:disabled) {
    border-color: var(--navy);
    color: var(--navy);
  }
  .qlp-page-btn.active {
    background: var(--navy);
    border-color: var(--navy);
    color: #fff;
    font-weight: 700;
  }
  .qlp-page-arrow:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* responsive */
  @media (max-width: 768px) {
    .qlp-hero { padding: 40px 20px 36px; }
    .qlp-hero-title { font-size: 26px; }
    .qlp-hero-write-btn { position: static; margin-top: 22px; display: block; }
    .qlp-filter-inner { padding: 12px 16px; flex-wrap: wrap; }
    .qlp-content { padding: 24px 16px 48px; }
    .qlp-table thead th.col-author,
    .qlp-table thead th.col-date { display: none; }
    .qlp-table td.col-author,
    .qlp-table td.col-date { display: none; }
  }
`;

const QuestionListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("query") || "";
  const caseTypeFilter = searchParams.get("caseType") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempQuery, setTempQuery] = useState(searchQuery);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchQuestions();
  }, [searchQuery, caseTypeFilter, currentPage]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionApi.getQuestionList({
        caseType:
          caseTypeFilter === "전체" ? undefined : caseTypeFilter || undefined,
        title: searchQuery || undefined,
        page: currentPage,
        size: 10,
      });
      setQuestions(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error("조회 실패", error);
      setQuestions([]);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  const updateParams = (newParams) => {
    const nextParams = {
      query: searchQuery,
      caseType: caseTypeFilter,
      page: currentPage,
      ...newParams,
    };
    Object.keys(nextParams).forEach((key) => {
      if (!nextParams[key] || nextParams[key] === "전체")
        delete nextParams[key];
    });
    setSearchParams(nextParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ query: tempQuery, page: 1 });
  };

  const handleCategoryChange = (e) => {
    const val = e.target.value;
    updateParams({ caseType: val === "전체" ? "" : val, page: 1 });
  };

  const handleClearInput = () => {
    setTempQuery("");
    updateParams({ query: "", page: 1 });
  };

  const handleResetAll = () => {
    setTempQuery("");
    setSearchParams({});
  };

  const renderPagination = () =>
    Array.from({ length: totalPages }, (_, i) => i + 1).map((i) => (
      <button
        key={i}
        className={`qlp-page-btn${currentPage === i ? " active" : ""}`}
        onClick={() => updateParams({ page: i })}
      >
        {i}
      </button>
    ));

  return (
    <>
      <style>{styles}</style>
      <div className="qlp-root">
        {/* ── HERO ── */}
        <section className="qlp-hero">
          <div className="qlp-hero-inner">
            <div className="qlp-hero-eyebrow">
              <div className="qlp-hero-eyebrow-line" />
              <span className="qlp-hero-eyebrow-text">
                Verified Legal Counsel
              </span>
            </div>

            <h1 className="qlp-hero-title">
              변호사가 직접 답변하는
              <br />
              <span>법률 Q&A</span>
            </h1>

            <p className="qlp-hero-desc">
              이곳의 모든 답변은{" "}
              <strong
                style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}
              >
                검증된 변호사
              </strong>
              만이 작성할 수 있습니다.
              <br />
              복잡한 법률 문제, 막막한 분쟁 상황 — 전문가의 시각으로 명확한
              방향을 찾아보세요.
            </p>

            <div className="qlp-badges">
              <span className="qlp-badge">
                <span className="qlp-badge-dot" />
                변호사 인증 답변
              </span>
              <span className="qlp-badge">
                <span className="qlp-badge-dot" />
                민사 · 형사 · 가사 · 부동산
              </span>
              <span className="qlp-badge">
                <span className="qlp-badge-dot" />
                채택 시 우수 답변 상단 노출
              </span>
            </div>

            <button
              className="qlp-hero-write-btn"
              onClick={() => navigate("/question/write")}
            >
              + 질문하기
            </button>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        <div className="qlp-filter-bar">
          <div className="qlp-filter-inner">
            <select
              className="qlp-category-select"
              value={caseTypeFilter || "전체"}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <form className="qlp-search-form" onSubmit={handleSearch}>
              <div className="qlp-search-input-wrap">
                <input
                  type="text"
                  className="qlp-search-input"
                  placeholder="궁금한 법률 내용을 검색하세요..."
                  value={tempQuery}
                  onChange={(e) => setTempQuery(e.target.value)}
                />
                {tempQuery && (
                  <button
                    type="button"
                    className="qlp-search-clear"
                    onClick={handleClearInput}
                  >
                    ✕
                  </button>
                )}
              </div>
              <button type="submit" className="qlp-search-btn">
                검색
              </button>
              <button
                type="button"
                className="qlp-reset-btn"
                onClick={handleResetAll}
                title="초기화"
              >
                ↺
              </button>
            </form>
          </div>
        </div>

        {/* ── MAIN CONTENT ── */}
        <div className="qlp-content">
          {loading ? (
            <div className="qlp-loading">
              <div className="qlp-spinner" />
              데이터를 불러오는 중입니다...
            </div>
          ) : (
            <>
              <div className="qlp-table-wrap">
                <table className="qlp-table">
                  <thead>
                    <tr>
                      <th className="col-type">유형</th>
                      <th className="col-title">질문 제목</th>
                      <th className="col-author">작성자</th>
                      <th className="col-date">작성일</th>
                      <th className="col-status">상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {questions.length > 0 ? (
                      questions.map((q) => (
                        <tr key={q.questionId}>
                          <td>
                            <span className="qlp-type-badge">{q.caseType}</span>
                          </td>
                          <td>
                            <Link
                              to={`/question/detail/${q.questionId}`}
                              className="qlp-title-link"
                            >
                              <span className="qlp-title-text">{q.title}</span>
                              <div className="qlp-title-meta">
                                {q.fileCount > 0 && (
                                  <span
                                    className="qlp-file-icon"
                                    title={`첨부파일 ${q.fileCount}개`}
                                  >
                                    <FontAwesomeIcon
                                      icon={
                                        q.fileCount >= 2 ? faImages : faImage
                                      }
                                    />
                                    <span>{q.fileCount}</span>
                                  </span>
                                )}
                                {q.answerCount > 0 && (
                                  <span className="qlp-answer-count">
                                    [{q.answerCount}]
                                  </span>
                                )}
                              </div>
                            </Link>
                          </td>
                          <td className="qlp-author col-author">
                            {q.memberName}
                          </td>
                          <td className="qlp-date col-date">
                            {formatDate(q.createdAt)}
                          </td>
                          <td>
                            <span
                              className={`qlp-status-badge ${q.status === "ADOPTED" ? "adopted" : "waiting"}`}
                            >
                              <span className="qlp-status-dot" />
                              {q.status === "ADOPTED" ? "채택완료" : "채택대기"}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">
                          <div className="qlp-empty">
                            <div className="qlp-empty-icon">⚖️</div>
                            <div className="qlp-empty-text">
                              검색 결과가 없습니다.
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {questions.length > 0 && (
                <div className="qlp-pagination">
                  <button
                    className="qlp-page-arrow"
                    disabled={currentPage === 1}
                    onClick={() => updateParams({ page: currentPage - 1 })}
                  >
                    &lt;
                  </button>
                  {renderPagination()}
                  <button
                    className="qlp-page-arrow"
                    disabled={currentPage === totalPages}
                    onClick={() => updateParams({ page: currentPage + 1 })}
                  >
                    &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default QuestionListPage;
