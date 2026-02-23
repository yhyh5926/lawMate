import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_VOTE_LIST } from '../../mocks/community/communityData';
import '../../styles/community/community.css';
const VoteDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [voteData, setVoteData] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState(null);

  useEffect(() => {
    const data = MOCK_VOTE_LIST.find((v) => v.id === parseInt(id));
    setVoteData(data);
  }, [id]);

  const handleVote = (option) => {
    if (hasVoted) {
      alert('이미 투표하셨습니다!');
      return;
    }
    setHasVoted(true);
    setMyVote(option);
    alert(`${option} 에 투표하셨습니다!`);
  };

  if (!voteData) return <div className="container">로딩 중...</div>;

  const total = voteData.countA + voteData.countB;
  const percentA = total === 0 ? 0 : Math.round((voteData.countA / total) * 100);
  const percentB = total === 0 ? 0 : Math.round((voteData.countB / total) * 100);

  return (
    <div className="container">
      <div className="board-detail-container">
        {/* 상단 네비게이션 */}
        <div className="detail-nav">
          <button className="btn-back" onClick={() => navigate('/community/vote')}>
            ← 목록으로
          </button>
        </div>

        {/* 게시글 헤더 */}
        <div className="post-detail-header">
          <div className="post-category">
            <span className="category-badge vote">분쟁 투표</span>
            <span className="status-badge active">🔥 진행중</span>
          </div>
          <h1 className="post-detail-title">{voteData.title}</h1>
          
          {/* 게시글 정보 */}
          <div className="post-detail-info">
            <div className="author-info">
              <span className="author-avatar">👤</span>
              <span className="author-name">{voteData.writerName || '익명'}</span>
            </div>
            <div className="post-meta-info">
              <span>🕐 {voteData.createdAt || '2024-01-15 14:30'}</span>
              <span>•</span>
              <span>👥 {total}명 참여</span>
            </div>
          </div>
        </div>

        {/* 게시글 본문 */}
        <div className="post-detail-body">
          <div className="post-content-text">
            {voteData.content}
          </div>
        </div>

        <hr className="section-divider" />

        {/* 투표 섹션 */}
        <div className="vote-section">
          <h3 className="vote-section-title">📊 투표하기</h3>
          
          {!hasVoted ? (
            <div className="vote-buttons-area">
              <button 
                className="vote-option-btn option-a"
                onClick={() => handleVote(voteData.optA)}
              >
                <span className="option-label">A</span>
                <span className="option-text">{voteData.optA}</span>
              </button>
              <div className="vote-vs-divider">VS</div>
              <button 
                className="vote-option-btn option-b"
                onClick={() => handleVote(voteData.optB)}
              >
                <span className="option-label">B</span>
                <span className="option-text">{voteData.optB}</span>
              </button>
            </div>
          ) : (
            <div className="voted-message">
              ✅ <strong>{myVote}</strong> 에 투표하셨습니다!
            </div>
          )}
        </div>

        {/* 투표 결과 */}
        <div className="vote-result-section">
          <h3 className="result-title">📈 실시간 투표 현황</h3>
          
          <div className="result-summary">
            <div className="summary-item">
              <span className="summary-label">총 참여자</span>
              <span className="summary-value">{total}명</span>
            </div>
          </div>

          <div className="result-bars">
            <div className="result-bar-item">
              <div className="result-bar-header">
                <span className="result-option">
                  <span className="option-badge a">A</span>
                  {voteData.optA}
                </span>
                <span className="result-percent">{percentA}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill a-fill" 
                  style={{ width: `${percentA}%` }}
                >
                  <span className="progress-count">{voteData.countA}표</span>
                </div>
              </div>
            </div>

            <div className="result-bar-item">
              <div className="result-bar-header">
                <span className="result-option">
                  <span className="option-badge b">B</span>
                  {voteData.optB}
                </span>
                <span className="result-percent">{percentB}%</span>
              </div>
              <div className="progress-bar-bg">
                <div 
                  className="progress-bar-fill b-fill" 
                  style={{ width: `${percentB}%` }}
                >
                  <span className="progress-count">{voteData.countB}표</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className="comments-section">
          <div className="comments-header">
            <h3>💬 댓글 (12)</h3>
          </div>
          
          <div className="comment-write">
            <textarea 
              className="comment-textarea" 
              placeholder="의견을 남겨주세요..."
              rows="3"
            ></textarea>
            <button className="btn-primary">댓글 작성</button>
          </div>

          <div className="comments-list">
            <div className="comment-item">
              <div className="comment-header">
                <span className="comment-author">👤 김철수</span>
                <span className="comment-date">5분 전</span>
              </div>
              <div className="comment-body">
                저도 비슷한 경험이 있는데, 명확히 A가 잘못한 것 같네요.
              </div>
              <div className="comment-actions">
                <button className="btn-comment-action">👍 12</button>
                <button className="btn-comment-action">답글</button>
              </div>
            </div>

            <div className="comment-item">
              <div className="comment-header">
                <span className="comment-author">👤 이영희</span>
                <span className="comment-date">1시간 전</span>
              </div>
              <div className="comment-body">
                법적으로는 B의 책임도 있을 것 같은데요?
              </div>
              <div className="comment-actions">
                <button className="btn-comment-action">👍 8</button>
                <button className="btn-comment-action">답글</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoteDetail;