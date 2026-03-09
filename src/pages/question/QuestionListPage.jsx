import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { questionApi } from "../../api/questionApi.js";
import "../../styles/question/QuestionListPage.css";

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

  const categories = [
    "전체",
    "민사",
    "형사",
    "가사",
    "이혼",
    "노동",
    "행정",
    "기업",
    "부동산",
  ];

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

  // 날짜 포맷 함수 (YYYY-MM-DD 형식)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toISOString().split("T")[0];
  };

  const renderPagination = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`ql-page-btn ${currentPage === i ? "active" : ""}`}
          onClick={() => updateParams({ page: i })}
        >
          {i}
        </button>,
      );
    }
    return pages;
  };

  return (
    <div className="ql-container">
      <header className="ql-header">
        <h2 className="ql-title">⚖️ 법률 Q&A 게시판</h2>
        <button
          className="ql-write-btn"
          onClick={() => navigate("/question/write")}
        >
          질문하기
        </button>
      </header>

      <section className="ql-search-section">
        <select
          className="ql-category-select"
          value={caseTypeFilter || "전체"}
          onChange={handleCategoryChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <form className="ql-search-form" onSubmit={handleSearch}>
          <div className="ql-search-input-wrapper">
            <input
              type="text"
              className="ql-search-input"
              placeholder="궁금한 법률 내용을 검색해보세요..."
              value={tempQuery}
              onChange={(e) => setTempQuery(e.target.value)}
            />
            {tempQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearInput}
              >
                ✕
              </button>
            )}
          </div>
          <button type="submit" className="ql-search-btn">
            검색
          </button>
          <button
            type="button"
            className="ql-reset-btn"
            onClick={handleResetAll}
            title="검색 초기화"
          >
            ↺
          </button>
        </form>
      </section>

      {loading ? (
        <div className="ql-loading">데이터를 불러오는 중입니다...</div>
      ) : (
        <>
          <div className="ql-table-wrapper">
            <table className="ql-table">
              <thead>
                <tr>
                  <th className="w-type">유형</th>
                  <th className="w-title">질문 제목</th>
                  <th className="w-author">작성자</th>
                  <th className="w-date">작성일</th>{" "}
                  {/* 💡 번호 삭제 후 작성일 추가 */}
                  <th className="w-status">진행 상태</th>
                </tr>
              </thead>
              <tbody>
                {questions.length > 0 ? (
                  questions.map((q) => (
                    <tr key={q.questionId} className="ql-row">
                      <td>
                        <span className="ql-type-badge">{q.caseType}</span>
                      </td>
                      <td className="ql-subject">
                        <Link
                          to={`/question/detail/${q.questionId}`}
                          className="ql-link"
                        >
                          {q.title}
                          {q.answerCount > 0 && (
                            <span className="ql-count">[{q.answerCount}]</span>
                          )}
                        </Link>
                      </td>
                      <td className="ql-author">{q.memberName}</td>
                      <td className="ql-date">
                        {formatDate(q.createdAt)}
                      </td>{" "}
                      {/* 💡 작성일 출력 */}
                      <td>
                        <span
                          className={`ql-status ${q.status === "ADOPTED" ? "is-adopted" : "is-waiting"}`}
                        >
                          {q.status === "ADOPTED" ? "● 채택완료" : "○ 채택대기"}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="ql-no-data">
                      검색 조건에 맞는 질문이 존재하지 않습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {questions.length > 0 && (
            <div className="ql-pagination">
              <button
                className="ql-page-arrow"
                disabled={currentPage === 1}
                onClick={() => updateParams({ page: currentPage - 1 })}
              >
                {" "}
                &lt;{" "}
              </button>
              {renderPagination()}
              <button
                className="ql-page-arrow"
                disabled={currentPage === totalPages}
                onClick={() => updateParams({ page: currentPage + 1 })}
              >
                {" "}
                &gt;{" "}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QuestionListPage;
