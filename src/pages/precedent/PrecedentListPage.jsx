import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import precedentApi from "../../api/precedentApi";
import "../../styles/precedent/PrecedentSearchPage.css";
import { scrollToTop } from "../../utils/windowUtils";

const categories = [
  "금융보험",
  "보험민사",
  "가사",
  "세무",
  "부동산임대차",
  "부동산임대차/상속",
  "부동산매매/형사",
  "부동산매매",
  "교통형사",
  "교통형사/마약",
  "교통민사",
  "형사재산",
  "형사강력",
  "가사상속",
  "근로산재",
  "가족법",
  "산업재해",
  "보험금",
  "조세/세금",
  "영업비밀 침해",
  "스토킹범죄",
];

const PAGE_GROUP_SIZE = 5;

const PrecedentListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const listRef = useRef(null);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const searchQuery = searchParams.get("query") || "";
  const caseType = searchParams.get("caseType") || "";

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [tempQuery, setTempQuery] = useState(searchQuery);

  const currentGroup = Math.ceil(page / PAGE_GROUP_SIZE);
  const startPage = (currentGroup - 1) * PAGE_GROUP_SIZE + 1;
  const endPage = Math.min(startPage + PAGE_GROUP_SIZE - 1, totalPages);
  const pageNumbers = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i,
  );

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
    scrollToTop();
  }, [page, searchQuery, caseType]);

  const updateParams = (newParams) => {
    const nextParams = { query: searchQuery, caseType, page, ...newParams };
    Object.keys(nextParams).forEach((k) => {
      if (!nextParams[k]) delete nextParams[k];
    });
    setSearchParams(nextParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateParams({ query: tempQuery, page: 1 });
  };
  const handleCategoryChange = (val) =>
    updateParams({ caseType: val === "전체" ? "" : val, page: 1 });
  const handleReset = () => {
    setTempQuery("");
    setSearchParams({});
  };
  const handlePageChange = (n) => {
    updateParams({ page: n });
    if (listRef.current) {
      const yOffset = -100;
      const y =
        listRef.current.getBoundingClientRect().top +
        window.pageYOffset +
        yOffset;

      window.scrollTo({ top: y });
    }
  };

  return (
    <div className="prec-root">
      {/* ── HERO ── */}
      <section className="prec-hero">
        <div className="prec-hero-inner">
          <div className="prec-hero-eyebrow">
            <span className="prec-hero-eyebrow-line" />
            <span className="prec-hero-eyebrow-text">
              Legal Precedent Database
            </span>
          </div>
          <h1 className="prec-hero-title">판례 검색</h1>
          <p className="prec-hero-desc">
            방대한 법률 판례 데이터베이스에서 사건번호·키워드로
            <br />
            원하는 판례를 빠르게 찾아보세요.
          </p>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="prec-filter-bar">
        <div className="prec-filter-inner">
          {/* 카테고리 칩 */}
          <div className="prec-chips-wrap">
            {categories.map((cat) => {
              const val = cat === "전체" ? "" : cat;
              return (
                <button
                  key={cat}
                  className={`prec-chip ${caseType === val ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat)}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* 검색창 */}
          <form className="prec-search-form" onSubmit={handleSearch}>
            <div className="prec-search-input-wrap">
              <input
                type="text"
                className="prec-search-input"
                placeholder="사건명, 사건번호, 키워드 검색..."
                value={tempQuery}
                onChange={(e) => setTempQuery(e.target.value)}
              />
              {tempQuery && (
                <button
                  type="button"
                  className="prec-clear-btn"
                  onClick={() => setTempQuery("")}
                >
                  ✕
                </button>
              )}
            </div>
            <button type="submit" className="prec-search-btn">
              검색
            </button>
            <button
              type="button"
              className="prec-reset-btn"
              onClick={handleReset}
              title="초기화"
            >
              ↺
            </button>
          </form>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="prec-content">
        {loading ? (
          <div className="prec-loading">
            <div className="prec-spinner" />
            법률 데이터를 불러오는 중...
          </div>
        ) : list.length === 0 ? (
          <div className="prec-empty">
            <div className="prec-empty-icon">⚖️</div>
            <p className="prec-empty-title">검색 결과가 없습니다</p>
            <p className="prec-empty-desc">
              다른 검색어나 카테고리를 선택해 보세요
            </p>
            <button className="prec-empty-reset" onClick={handleReset}>
              검색 초기화
            </button>
          </div>
        ) : (
          <>
            <ul className="prec-list" ref={listRef}>
              {list.map((item) => (
                <li
                  key={item.precId}
                  className="prec-item"
                  onClick={() =>
                    navigate(
                      `/precedent/detail/${item.precId}?page=${page}${searchQuery ? `&query=${searchQuery}` : ""}${caseType ? `&caseType=${caseType}` : ""}`,
                    )
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    navigate(
                      `/precedent/detail/${item.precId}?page=${page}${searchQuery ? `&query=${searchQuery}` : ""}${caseType ? `&caseType=${caseType}` : ""}`,
                    )
                  }
                >
                  <div className="prec-item-left">
                    <div className="prec-item-top">
                      <span className="prec-case-badge">{item.caseType}</span>
                      <span className="prec-case-no">{item.caseNo}</span>
                    </div>
                    <h2 className="prec-item-title">{item.title}</h2>
                    <p className="prec-item-summary">{item.oneLine}</p>
                  </div>
                  <div className="prec-item-right">
                    <span className="prec-court">{item.court}</span>
                    <span className="prec-date">{item.judgeDate}</span>
                    <span className="prec-arrow">→</span>
                  </div>
                </li>
              ))}
            </ul>

            {/* 페이지네이션 */}
            <nav className="prec-pagination">
              <button
                className="prec-page-arrow"
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
              >
                &lt;
              </button>

              <div className="prec-page-numbers">
                {pageNumbers.map((num) => (
                  <button
                    key={num}
                    className={`prec-page-btn ${page === num ? "active" : ""}`}
                    onClick={() => handlePageChange(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button
                className="prec-page-arrow"
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
              >
                &gt;
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default PrecedentListPage;
