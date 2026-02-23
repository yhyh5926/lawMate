import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockPrecedents } from "../../mocks/precedent/mockPrecedents";
import "../../styles/precedent/precedentList.css";

export default function PrecedentList() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const navigate = useNavigate();

  // 모든 카테고리 (생략 없이 유지)
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
      p.metadata.tags.some((tag) => tag.includes(query)) ||
      p.content.story.issue.includes(query);
    const matchesCategory =
      selectedCategory === "all" || p.header.category === selectedCategory;
    return matchesQuery && matchesCategory;
  });

  return (
    <div className="precedent-container">
      <header className="hero-section">
        <h1 className="hero-title">
          실제 사건, 법원의 <span>판단</span>은?
        </h1>
        <div className="search-bar-container">
          <input
            className="search-input"
            type="text"
            placeholder="사건 키워드나 태그(#음주운전)를 검색하세요"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </header>

      <nav className="filter-nav">
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-tab ${selectedCategory === cat ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat === "all" ? "전체" : cat}
          </button>
        ))}
      </nav>

      <div className="result-info">
        검색 결과 <strong>{filtered.length}</strong>건
      </div>

      {/* 그리드가 아닌 세로 리스트 구조 */}
      <main className="case-list-vertical">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <article
              key={item.id}
              className="case-item-wide"
              onClick={() => navigate(`/precedent/${item.id}`)}
            >
              <div className="item-left">
                <span className="case-category">{item.header.category}</span>
                <span className="case-difficulty">
                  난이도 {item.metadata.difficulty}
                </span>
              </div>

              <div className="item-center">
                <h3 className="case-title">{item.display.title}</h3>
                <p className="case-hook">"{item.content.story.start}"</p>
                <div className="case-issue-summary">
                  <span className="issue-label">법적 쟁점</span>
                  <p className="issue-text">{item.content.story.issue}</p>
                </div>
                <div className="case-tags">
                  {item.metadata.tags.map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="item-right">
                <div className="reveal-box">
                  <span className="reveal-text">결과 보기</span>
                  <span className="reveal-arrow">→</span>
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="no-result">일치하는 판례가 없습니다.</div>
        )}
      </main>
    </div>
  );
}
