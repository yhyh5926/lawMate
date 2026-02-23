import React from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/community/community.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1 className="title" style={{ fontSize: "36px" }}>
        ⚖️ 법률 커뮤니티
      </h1>
      <p className="home-subtitle">
        전문가 답변부터 시민들의 의견까지, 법률 고민을 함께 해결해보세요.
      </p>

      <div className="home-grid">
        {/* Q&A 카드 */}
        <div className="card-item" onClick={() => navigate("/community/qna")}>
          <div className="card-icon">💬</div>
          <h2 className="title">법률 상담 Q&A</h2>
          <p className="card-info">
            변호사에게 직접 질문하고
            <br />
            전문적인 답변을 받아보세요.
          </p>
        </div>

        {/* 투표 카드 */}
        <div className="card-item" onClick={() => navigate("/community/vote")}>
          <div className="card-icon">📊</div>
          <h2 className="title">분쟁 투표</h2>
          <p className="card-info">
            일상 속 억울한 분쟁,
            <br />
            누구의 잘못인지 투표해보세요.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
