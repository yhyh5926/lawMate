import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import precedentApi from "../../api/precedentApi";
// LegalTooltip 임포트 제거 (상세 페이지에서만 사용)
import "../../styles/precedent/PrecedentSearchPage.css";

const PrecedentSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 파라미터 추출
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("query") || "";
  const caseType = searchParams.get("caseType") || "";

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [tempQuery, setTempQuery] = useState(searchQuery);

  const categories = [
    "전체",
    "금융보험",
    "보험민사",
    "가사",
    "세무",
    "부동산임대차",
    "부동산매매",
    "교통형사",
    "교통민사",
    "형사재산",
    "형사강력",
    "가사상속",
    "근로산재",
  ];

  const PAGE_GROUP_SIZE = 5;
  const currentGroup = Math.ceil(page / PAGE_GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const data = await precedentApi.getPrecedentList(
          page,
          searchQuery,
          caseType,
        );
        setList(data.list || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("판례 목록 로딩 에러:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [page, searchQuery, caseType]);

  const updateParams = (newParams) => {
    const nextParams = {
      query: searchQuery,
      caseType: caseType,
      page: page,
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
    updateParams({ caseType: e.target.value, page: 1 });
  };

  const handleReset = () => {
    setTempQuery("");
    setSearchParams({});
  };

  const handlePageChange = (newPage) => {
    updateParams({ page: newPage });
    window.scrollTo(0, 0);
  };

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="ps-container">
      <header className="ps-header">
        <h1>판례 검색</h1>
        <div className="ps-search-controls">
          <form className="ps-search-bar" onSubmit={handleSearch}>
            <select
              className="ps-category-select"
              value={caseType}
              onChange={handleCategoryChange}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat === "전체" ? "" : cat}>
                  {cat}
                </option>
              ))}
            </select>

            <div className="ps-input-group">
              <div className="ps-input-wrapper">
                <input
                  type="text"
                  placeholder="사건명, 사건번호, 키워드 검색..."
                  value={tempQuery}
                  onChange={(e) => setTempQuery(e.target.value)}
                />
                {tempQuery && (
                  <button
                    type="button"
                    className="ps-clear-btn"
                    onClick={() => setTempQuery("")}
                  >
                    &times;
                  </button>
                )}
              </div>
              <button type="submit" className="ps-search-btn">
                검색
              </button>
            </div>

            <button
              type="button"
              className="ps-reset-btn"
              onClick={handleReset}
            >
              초기화
            </button>
          </form>
        </div>
      </header>

      {loading ? (
        <div className="ps-loading-state">
          <div className="spinner"></div>
          <p>법률 데이터를 불러오는 중입니다...</p>
        </div>
      ) : (
        <>
          <div className="ps-list-grid">
            {list.length > 0 ? (
              list.map((item) => (
                <div
                  key={item.precId}
                  className="ps-card"
                  onClick={() => navigate(`/precedent/detail/${item.precId}`)}
                >
                  <div className="ps-card-top">
                    <span className="ps-badge">{item.caseType}</span>
                    <small className="ps-case-no">{item.caseNo}</small>
                  </div>
                  <h3 className="ps-title">{item.title}</h3>
                  {/* 툴팁 제거: 일반 텍스트 렌더링으로 가독성 확보 */}
                  <div className="ps-one-line">{item.oneLine}</div>
                  <div className="ps-footer-info">
                    {item.court} | {item.judgeDate}
                  </div>
                </div>
              ))
            ) : (
              <div className="ps-no-data">
                <p>검색 결과가 없습니다.</p>
                <span>다른 검색어나 카테고리를 선택해 보세요.</span>
              </div>
            )}
          </div>

          <div className="ps-pagination">
            <button
              className="ps-page-arrow"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              &larr;
            </button>
            {pageNumbers.map((num) => (
              <button
                key={num}
                className={`ps-page-num ${page === num ? "active" : ""}`}
                onClick={() => handlePageChange(num)}
              >
                {num}
              </button>
            ))}
            <button
              className="ps-page-arrow"
              disabled={page === totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              &rarr;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PrecedentSearchPage;
