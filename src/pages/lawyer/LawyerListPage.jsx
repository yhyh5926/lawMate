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

  // 검색 상태 관리
  const [inputValue, setInputValue] = useState(""); // 입력창 값
  const [searchKeyword, setSearchKeyword] = useState(""); // 실제 적용된 검색어
  const [selectedSpecialties, setSelectedSpecialties] = useState(["전체"]); // 선택된 카테고리들

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

  // 1. 데이터 초기 로드
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

  // 2. 검색어 개별 삭제 (X 버튼)
  const handleClearInput = () => {
    setInputValue("");
    setSearchKeyword(""); // 검색 결과도 즉시 초기화
  };

  // 3. 전체 필터 초기화 (초기화 버튼)
  const handleResetAll = () => {
    setInputValue("");
    setSearchKeyword("");
    setSelectedSpecialties(["전체"]);
    setPage(1);
  };

  // 4. 카테고리 클릭 핸들러 (다중 선택 토글)
  const handleCategoryClick = (spec) => {
    if (spec === "전체") {
      setSelectedSpecialties(["전체"]);
      return;
    }

    setSelectedSpecialties((prev) => {
      const withoutAll = prev.filter((s) => s !== "전체");
      let next;
      if (withoutAll.includes(spec)) {
        next = withoutAll.filter((s) => s !== spec);
      } else {
        next = [...withoutAll, spec];
      }
      return next.length === 0 ? ["전체"] : next;
    });
  };

  const handleSearch = () => setSearchKeyword(inputValue);
  const handleKeyDown = (e) => e.key === "Enter" && handleSearch();

  // 필터 변경 시 페이지 초기화
  useEffect(() => {
    setPage(1);
    setHasMore(true);
  }, [searchKeyword, selectedSpecialties]);

  // 5. 필터링 및 무한 스크롤 데이터 가공 (AND 로직)
  useEffect(() => {
    let filtered = lawyers;

    // 카테고리 AND 필터
    if (!selectedSpecialties.includes("전체")) {
      filtered = filtered.filter((l) => {
        const lawyerSpecs = l.specialty ? l.specialty.split(",") : [];
        return selectedSpecialties.every((selected) =>
          lawyerSpecs.includes(selected),
        );
      });
    }

    // 검색어 필터
    if (searchKeyword.trim() !== "") {
      const kw = searchKeyword.toLowerCase();
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(kw) ||
          l.officeName?.toLowerCase().includes(kw) ||
          l.specialty?.toLowerCase().includes(kw),
      );
    }

    // 12명(3행 4열) 단위 노출
    const itemsToDisplay = filtered.slice(0, page * 12);
    setDisplayLawyers(itemsToDisplay);
    setHasMore(itemsToDisplay.length < filtered.length);
  }, [lawyers, searchKeyword, selectedSpecialties, page]);

  // 6. 무한 스크롤 관찰자
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
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
    <div className="lawyer-list-page">
      <header className="lawyer-list-hero">
        <div className="lawyer-list-hero-inner">
          <h1 className="lawyer-list-title">전문 변호사 찾기</h1>
          <div className="lawyer-search-container">
            <div className="lawyer-search-input-wrapper">
              <input
                type="text"
                className="lawyer-search-input"
                placeholder="이름, 사무소, 전문분야 검색..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              {inputValue && (
                <button className="search-clear-btn" onClick={handleClearInput}>
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

      <div className="filter-controls-container">
        <nav className="lawyer-filter-nav">
          {specialties.map((spec) => (
            <button
              key={spec}
              className={`filter-chip ${selectedSpecialties.includes(spec) ? "active" : ""}`}
              onClick={() => handleCategoryClick(spec)}
            >
              {spec}
            </button>
          ))}
        </nav>
        <button className="filter-reset-btn" onClick={handleResetAll}>
          <span className="reset-icon">↺</span> 필터 초기화
        </button>
      </div>

      <main className="lawyer-list-grid">
        {displayLawyers.length > 0 ? (
          displayLawyers.map((lawyer, index) => {
            const isLastElement = displayLawyers.length === index + 1;
            return (
              <article
                key={lawyer.lawyerId}
                ref={isLastElement ? lastElementRef : null}
                className="lawyer-card"
                onClick={() => navigate(`/lawyer/detail/${lawyer.lawyerId}`)}
              >
                <div className="lawyer-card-img-wrapper">
                  <img
                    src={getImageUrl(lawyer)}
                    alt={lawyer.name}
                    className="lawyer-card-img"
                  />
                </div>
                <div className="lawyer-card-info">
                  <div className="lawyer-card-header">
                    <h3 className="lawyer-name">{lawyer.name}</h3>
                    <div className="lawyer-rating">
                      ★ {lawyer.avgRating?.toFixed(1)}
                    </div>
                  </div>
                  <div className="lawyer-office">{lawyer.officeName}</div>
                  <div className="lawyer-specialties-tags">
                    {lawyer.specialty?.split(",").map((s) => (
                      <span key={s} className="spec-tag">
                        #{s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })
        ) : (
          <div className="no-results">
            <p>선택하신 조건에 맞는 변호사가 없습니다.</p>
            <button className="no-results-reset" onClick={handleResetAll}>
              필터 초기화하기
            </button>
          </div>
        )}
      </main>

      {loading && (
        <div className="scroll-loader">변호사 데이터를 불러오는 중...</div>
      )}
      {!hasMore && displayLawyers.length > 0 && (
        <div className="scroll-end">모든 변호사를 확인했습니다.</div>
      )}
    </div>
  );
};

export default LawyerListPage;
