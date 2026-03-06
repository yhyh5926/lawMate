import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import precedentApi from "../../api/precedentApi";
import LegalTooltip from "./LegalTooltip";
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
        console.error("목록 로드 에러:", err);
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
    const selectedType = e.target.value;
    updateParams({ caseType: selectedType, page: 1 });
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
                {/* 텍스트가 있을 때만 X 버튼 노출 */}
                {tempQuery && (
                  <button
                    type="button"
                    className="ps-clear-btn"
                    onClick={() => setTempQuery("")}
                    aria-label="검색어 지우기"
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
        <div className="ps-loading">데이터 로딩 중...</div>
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
                  <div className="ps-one-line">
                    <LegalTooltip text={item.oneLine} />
                  </div>
                  <div className="ps-footer-info">
                    {item.court} | {item.judgeDate}
                  </div>
                </div>
              ))
            ) : (
              <div className="ps-no-data">데이터가 없습니다.</div>
            )}
          </div>

          <div className="ps-pagination">
            <button
              className="ps-page-arrow"
              disabled={page === 1}
              onClick={() => handlePageChange(page - 1)}
            >
              &lt;
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
              &gt;
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default PrecedentSearchPage;
