import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPrecedents } from "../../mocks/precedent/mockPrecedents";
import "../../styles/precedent/precedentList.css";

export default function PrecedentList() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  const categories = [
    "all",
    "교통형사",
    "교통민사",
    "부동산임대차",
    "부동산매매",
    "형사재산",
    "형사강력",
    "가사상속",
    "근로산재",
  ];

  const filtered = mockPrecedents.filter((p) => {
    const matchesQuery =
      p.display.title.includes(query) ||
      p.tags.some((tag) => tag.includes(query));
    const matchesCategory =
      selectedCategory === "all" || p.header.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="precedent-container">
      {/* [상단] 히어로 검색 섹션 */}
      <header className="precedent-hero">
        <h1 className="hero-title keep-all">
          실제 사건, 법원의 <span>판단</span>은 어떠했을까요?
        </h1>
        <div className="search-wrapper">
          <input
            className="search-input-main"
            placeholder="사건 키워드나 태그(#음주운전)를 검색하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-icon-btn">🔍</button>
        </div>
      </header>

      {/* [필터] 카테고리 내비게이션 */}
      <nav className="filter-nav-bar">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "all" ? "전체보기" : cat}
          </button>
        ))}
      </nav>

      {/* [상태] 결과 수 요약 */}
      <div className="result-status">
        유사 판례 <strong>{filtered.length}</strong>건을 찾았습니다.
      </div>

      {/* [메인] 리스트 영역 */}
      <main className="case-vertical-list">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="case-row-item"
            onClick={() => navigate(`/precedent/${item.id}`)}
          >
            {/* 왼쪽: 메타 정보 */}
            <div className="row-left">
              <span className="case-badge-v2">{item.header.category}</span>
              <span className="case-court-v2">{item.originInfo.court}</span>
            </div>

            {/* 중앙: 본문 요약 (줄바꿈 최적화 적용) */}
            <div className="row-center keep-all">
              <h3 className="case-row-title-v2">{item.display.title}</h3>
              <div className="case-issue-preview-v2">
                <span className="issue-label-v2">쟁점</span>
                <p className="issue-text-v2">{item.content.story.issue}</p>
              </div>
              <div className="case-row-tags-v2">
                {item.tags.map((tag) => (
                  <span key={tag} className="row-tag-v2">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* 오른쪽: 결과 액션 영역 */}
            <div className="row-right">
              <div className="reveal-box-v2">
                <span className="reveal-status-v2">판결 결과</span>
                <button className="reveal-btn-v2">리포트 보기</button>
              </div>
            </div>
          </article>
        ))}
      </main>

      {/* 결과가 없을 때의 예외 처리 */}
      {filtered.length === 0 && (
        <div className="no-result-ui keep-all">
          검색 결과와 일치하는 판례가 없습니다. <br />
          다른 키워드로 검색해 보시겠어요?
        </div>
      )}
    </div>
  );
}
