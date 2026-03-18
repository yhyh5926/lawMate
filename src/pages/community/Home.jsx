import { useNavigate } from "react-router-dom";
import "../../styles/community/Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-wrapper">
      <div className="home-inner">
        <h1 className="home-title">⚖️ 법률 커뮤니티</h1>
        <p className="home-subtitle">
          전문가 답변부터 시민들의 의견까지, 법률 고민을 해결해보세요.
        </p>

        <div className="home-grid">
          {/* Q&A 카드 */}
          <button
            type="button"
            className="home-card qna-card"
            onClick={() => navigate("/community/qnalist")}
          >
            <div className="card-icon-wrap">💬</div>
            <h2 className="card-title">자유게시판</h2>
            <p className="card-desc">
              자유롭게 질문하고
              <br />
              답변을 받아보세요.
            </p>
          </button>

          {/* 투표 카드 */}
          <button
            type="button"
            className="home-card vote-card"
            onClick={() => navigate("/community/pollList")}
          >
            <div className="card-icon-wrap">📊</div>
            <h2 className="card-title">의견 조사 게시판</h2>
            <p className="card-desc">
              사건을 읽고 A 또는 B 중<br />
              여러분의 판결을 내려보세요.
            </p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
