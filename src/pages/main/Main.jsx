import { useNavigate } from "react-router-dom";
import HeroBanner from "../../components/main/HeroBanner"
import StatsChart from "../../components/main/StatsChart";
import SearchBar from "../../components/main/SearchBar";
import AiCases from "../../components/main/AiCases";
import "../../styles/main/main.css"

export default function Main() {
  const navigate = useNavigate();

  const handleWrite = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    navigate("/community/qna/write");
  };

  return (
    <div className="main-container">
      <HeroBanner onWrite={handleWrite} />

      <div className="main-content">
        <header className="main-header">
          <div className="header-text">
            <h1 className="main-title">대시보드</h1>
            <p className="main-subtitle">사건 통계 · 판례 검색 · AI 맞춤 추천</p>
          </div>
          <button className="quick-write-btn" onClick={handleWrite}>
            <span className="btn-icon">✍️</span>
            질문 등록
          </button>
        </header>

        <div className="dashboard-grid">
          {/* 사건 통계 */}
          <section className="dashboard-card stats-card">
            <div className="card-header">
              <div className="header-left">
                <span className="card-icon">📊</span>
                <h2 className="card-title">사건 통계</h2>
              </div>
              <span className="card-badge">일/주 단위</span>
            </div>
            <div className="card-body">
              <StatsChart />
            </div>
          </section>

          {/* 판례 검색 */}
          <section className="dashboard-card search-card">
            <div className="card-header">
              <div className="header-left">
                <span className="card-icon">🔍</span>
                <h2 className="card-title">판례 검색</h2>
              </div>
              <span className="card-badge">Enter 검색</span>
            </div>
            <div className="card-body">
              <SearchBar />
              <p className="card-hint">키워드를 입력하고 Enter를 누르면 검색 페이지로 이동합니다.</p>
            </div>
          </section>
        </div>

        {/* AI 맞춤 판례 */}
        <section className="dashboard-card ai-card">
          <div className="card-header">
            <div className="header-left">
              <span className="card-icon">🤖</span>
              <h2 className="card-title">AI 맞춤 판례</h2>
            </div>
            <span className="card-badge highlight">AI 추천</span>
          </div>
          <div className="card-body">
            <AiCases />
          </div>
        </section>
      </div>
    </div>
  );
}