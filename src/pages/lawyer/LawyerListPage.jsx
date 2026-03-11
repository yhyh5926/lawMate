import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";
import defaultLawyerImg from "../../styles/images/Lawyers.png";
import "../../styles/lawyer/LawyerListPage.css";
import { baseURL } from "../../constants/baseURL";

export const DEFAULT_IMAGE = defaultLawyerImg;

const LawyerListPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [displayLawyers, setDisplayLawyers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [inputValue, setInputValue] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedSpecialties, setSelectedSpecialties] = useState(["전체"]);

  const navigate = useNavigate();
  const observer = useRef();

  const specialties = [
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

  // 초기 데이터 로드 (유지)
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const response = await lawyerApi.getAllLawyers();
        setLawyers(response.data || response);
      } catch (err) {
        console.error("데이터 로드 실패", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleClearInput = () => {
    setInputValue("");
    setSearchKeyword("");
  };
  const handleResetAll = () => {
    setInputValue("");
    setSearchKeyword("");
    setSelectedSpecialties(["전체"]);
    setPage(1);
  };

  const handleCategoryClick = (spec) => {
    if (spec === "전체") {
      setSelectedSpecialties(["전체"]);
      return;
    }
    setSelectedSpecialties((prev) => {
      const withoutAll = prev.filter((s) => s !== "전체");
      const next = withoutAll.includes(spec)
        ? withoutAll.filter((s) => s !== spec)
        : [...withoutAll, spec];
      return next.length === 0 ? ["전체"] : next;
    });
  };

  const handleSearch = () => setSearchKeyword(inputValue);
  const handleKeyDown = (e) => e.key === "Enter" && handleSearch();

  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [searchKeyword, selectedSpecialties]);

  useEffect(() => {
    let filtered = lawyers;
    if (!selectedSpecialties.includes("전체")) {
      filtered = filtered.filter((l) => {
        const lawyerSpecs = l.specialty ? l.specialty.split(",") : [];
        return selectedSpecialties.every((selected) =>
          lawyerSpecs.includes(selected),
        );
      });
    }
    if (searchKeyword.trim() !== "") {
      const kw = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(kw) ||
          l.officeName?.toLowerCase().includes(kw) ||
          l.specialty?.toLowerCase().includes(kw),
      );
    }
    const itemsToDisplay = filtered.slice(0, page * 12);
    setDisplayLawyers(itemsToDisplay);
    setHasMore(itemsToDisplay.length < filtered.length);
  }, [lawyers, searchKeyword, selectedSpecialties, page]);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) setPage((prev) => prev + 1);
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const getImageUrl = (lawyer) => {
    const path = lawyer.savePath || lawyer.profileUrl;
    return path
      ? path.startsWith("http")
        ? path
        : baseURL + path
      : DEFAULT_IMAGE;
  };

  return (
    <div className="lawyer-root">
      {/* ── HERO SECTION ── */}
      <header className="lawyer-hero">
        <div className="lawyer-hero-inner">
          <div className="lawyer-hero-eyebrow">
            <span className="lawyer-hero-line" />
            <span className="lawyer-hero-eyebrow-text">
              Professional Legal Partners
            </span>
          </div>
          <h1 className="lawyer-hero-title">전문 변호사 찾기</h1>

          <div className="lawyer-search-bar">
            <div className="lawyer-search-input-wrap">
              <input
                type="text"
                className="lawyer-search-input"
                placeholder="이름, 사무소, 전문분야 검색..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {inputValue && (
                <button className="lawyer-clear-btn" onClick={handleClearInput}>
                  ✕
                </button>
              )}
            </div>
            <button className="lawyer-search-btn" onClick={handleSearch}>
              검색
            </button>
          </div>
        </div>
      </header>

      {/* ── FILTER SECTION ── */}
      <div className="lawyer-filter-bar">
        <div className="lawyer-filter-inner">
          <nav className="lawyer-chips-wrap">
            {specialties.map((spec) => (
              <button
                key={spec}
                className={`lawyer-chip ${selectedSpecialties.includes(spec) ? "active" : ""}`}
                onClick={() => handleCategoryClick(spec)}
              >
                {spec}
              </button>
            ))}
          </nav>
          <button className="lawyer-reset-btn" onClick={handleResetAll}>
            <span className="reset-icon">↺</span> 초기화
          </button>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <main className="lawyer-content">
        {displayLawyers.length > 0 ? (
          <div className="lawyer-grid">
            {displayLawyers.map((lawyer, index) => (
              <article
                key={lawyer.lawyerId}
                ref={
                  displayLawyers.length === index + 1 ? lastElementRef : null
                }
                className="lawyer-card"
                onClick={() => navigate(`/lawyer/detail/${lawyer.lawyerId}`)}
              >
                <div className="lawyer-card-image">
                  <img src={getImageUrl(lawyer)} alt={lawyer.name} />
                  <div className="lawyer-card-badge">
                    {lawyer.officeName?.split(" ")[0]}
                  </div>
                </div>

                <div className="lawyer-card-body">
                  <div className="lawyer-card-header">
                    <h3 className="lawyer-card-name">{lawyer.name} 변호사</h3>
                    <div className="lawyer-card-rating">
                      <span className="star-icon">★</span>
                      <span className="rating-val">
                        {lawyer.avgRating ? lawyer.avgRating.toFixed(1) : "0.0"}
                      </span>
                      <span className="review-count">
                        ({lawyer.reviewCnt || 0})
                      </span>
                    </div>
                  </div>

                  <p className="lawyer-card-office">{lawyer.officeName}</p>

                  <div className="lawyer-card-tags">
                    {lawyer.specialty?.split(",").map((s) => (
                      <span key={s} className="lawyer-tag">
                        #{s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="lawyer-card-footer">
                  <span>상세보기</span>
                  <span className="footer-arrow">→</span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="lawyer-empty">
            <div className="lawyer-empty-icon">⚖️</div>
            <p className="lawyer-empty-title">검색 결과가 없습니다</p>
            <p className="lawyer-empty-desc">
              조건을 변경하거나 필터를 초기화해 보세요.
            </p>
            <button className="lawyer-empty-btn" onClick={handleResetAll}>
              필터 초기화
            </button>
          </div>
        )}

        {loading && (
          <div className="lawyer-loader">
            <div className="lawyer-spinner"></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default LawyerListPage;
