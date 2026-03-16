import { useEffect, useState, useCallback } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import { categories } from "../../constants/categories.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faImages } from "@fortawesome/free-solid-svg-icons";
import { formatDate } from "../../utils/formatDate.js";
import "../../styles/question/QuestionListPage.css";
import { scrollToTop } from "../../utils/windowUtils.js";

const QuestionListPage = ({ user }) => {
  // 💡 접근 제어를 위해 user 프롭스 추가
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("query") || "";
  const caseTypeFilter = searchParams.get("caseType") || "";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tempQuery, setTempQuery] = useState(searchQuery);
  const [totalPages, setTotalPages] = useState(1);

  const fetchQuestions = useCallback(async () => {
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
  }, [searchQuery, caseTypeFilter, currentPage]);

  useEffect(() => {
    fetchQuestions();
    scrollToTop();
  }, [fetchQuestions]);

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

  // 💡 [접근 제어] 질문하기 버튼 클릭 핸들러
  const handleWriteClick = () => {
    if (!user) {
      if (
        window.confirm(
          "질문 작성은 로그인이 필요합니다.\n로그인 페이지로 이동하시겠습니까?",
        )
      ) {
        navigate("/member/login");
      }
      return;
    }
    navigate("/question/write");
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
            <strong style={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
              검증된 변호사
            </strong>
            만이 작성할 수 있습니다.
            <br />
            복잡한 법률 문제, 막막한 분쟁 상황 — 전문가의 시각으로 명확한 방향을
            찾아보세요.
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
                                    icon={q.fileCount >= 2 ? faImages : faImage}
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
                        <td className="qlp-author">{q.memberName}</td>
                        <td className="qlp-date">{formatDate(q.createdAt)}</td>
                        <td>
                          <span
                            className={`qlp-status-badge ${
                              q.status === "ADOPTED" ? "adopted" : "waiting"
                            }`}
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

            {/* ── FOOTER (Pagination + Write Button) ── */}
            <div className="qlp-footer-wrapper">
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

              {/* 💡 변경된 부분: 접근 제어 핸들러 연결 */}
              <button className="qlp-write-btn" onClick={handleWriteClick}>
                + 질문하기
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuestionListPage;
