import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MOCK_VOTE_LIST } from "../../mocks/community/communityData";
import "../../styles/community/community.css";

const VoteList = () => {
  const [votes, setVotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setVotes(MOCK_VOTE_LIST);
  }, []);

  return (
    <div className="container">
      <div className="vote-list-page">
        <div className="board-header">
          <h2>📊 분쟁 투표 게시판</h2>
          <button onClick={() => navigate("/community/vote/write")}>
            ➕ 투표 만들기
          </button>
        </div>

        {votes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🗳️</div>
            <p className="empty-state-text">아직 등록된 투표가 없습니다.</p>
          </div>
        ) : (
          <div className="vote-grid">
            {votes.map((vote) => {
              const totalVotes = vote.countA + vote.countB;
              const isActive = vote.status !== "closed";

              return (
                <div
                  key={vote.id}
                  className="vote-card"
                  onClick={() => navigate(`/community/vote/${vote.id}`)}
                >
                  <div className="vote-card-header">
                    <span
                      className={`vote-status-badge ${!isActive ? "closed" : ""}`}
                    >
                      {isActive ? "🔥 진행중" : "✅ 종료"}
                    </span>
                    <h4>{vote.title}</h4>
                  </div>

                  <div className="vote-options">
                    <div className="vote-vs">
                      <span>🅰️ {vote.optA}</span>
                      <span>VS</span>
                      <span>🅱️ {vote.optB}</span>
                    </div>
                  </div>

                  <div className="vote-card-footer">
                    <span className="vote-author">
                      👤 {vote.writerName || "익명"}
                    </span>
                    <span className="vote-participants">
                      👥 {totalVotes}명 참여
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoteList;
