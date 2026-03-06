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
  const [totalPages, setTotalPages] = useState(1); // 백엔드 데이터에 맞게 초기화

  const categories = ["전체", "민사", "형사", "가사", "행정", "기타"];

  useEffect(() => {
    fetchQuestions();
  }, [searchQuery, caseTypeFilter, currentPage]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const response = await questionApi.getQuestionList({
        caseType: caseTypeFilter || undefined,
        title: searchQuery || undefined,
        page: currentPage,
        size: 10,
      });

      // 백엔드 QuestionController의 반환 구조에 맞게 매핑
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
      if (!nextParams[key]) delete nextParams[key];
    });
    setSearchParams(nextParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ query: tempQuery, page: 1 });
  };

  const handleCategoryChange = (e) => {
    updateParams({
      caseType: e.target.value === "전체" ? "" : e.target.value,
      page: 1,
    });
  };

  // 페이지 번호 배열 생성 로직
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
          <input
            type="text"
            className="ql-search-input"
            placeholder="궁금한 법률 내용을 검색해보세요..."
            value={tempQuery}
            onChange={(e) => setTempQuery(e.target.value)}
          />
          <button type="submit" className="ql-search-btn">
            검색
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
                  <th className="w-id">번호</th>
                  <th className="w-type">유형</th>
                  <th className="w-title">질문 제목</th>
                  <th className="w-author">작성자</th>
                  <th className="w-status">진행 상태</th>
                </tr>
              </thead>
              <tbody>
                {questions.length > 0 ? (
                  questions.map((q) => (
                    <tr key={q.questionId} className="ql-row">
                      <td className="ql-id">{q.questionId}</td>
                      <td>
                        <span className="ql-type-badge">{q.caseType}</span>
                      </td>
                      <td className="ql-subject">
                        <Link
                          to={`/question/detail/${q.questionId}`}
                          className="ql-link"
                        >
                          {q.title}{" "}
                          {q.answerCount > 0 && (
                            <span className="ql-count">[{q.answerCount}]</span>
                          )}
                        </Link>
                      </td>
                      <td className="ql-author">{q.memberName}</td>
                      <td>
                        <span
                          className={`ql-status ${q.status === "ADOPTED" ? "is-adopted" : "is-waiting"}`}
                        >
                          {q.status === "ADOPTED" ? "● 채택완료" : "○ 답변대기"}
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

          {/* 데이터가 있을 때만 페이지네이션 표시 */}
          {questions.length > 0 && (
            <div className="ql-pagination">
              <button
                className="ql-page-arrow"
                disabled={currentPage === 1}
                onClick={() => updateParams({ page: currentPage - 1 })}
              >
                &lt;
              </button>

              {renderPagination()}

              <button
                className="ql-page-arrow"
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
  );
};

export default QuestionListPage;
