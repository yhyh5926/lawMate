import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_QNA_LIST, MOCK_ANSWERS } from '../../mocks/community/communityData';
import '../../styles/community/community.css';

const QnaDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [answers, setAnswers] = useState([]);

  
  useEffect(() => {
    const foundPost = MOCK_QNA_LIST.find(p => p.id === parseInt(id));
    const foundAnswers = MOCK_ANSWERS.filter(a => a.postId === parseInt(id));
    setPost(foundPost);
    setAnswers(foundAnswers);
  }, [id]);

  if (!post) return <div className="container">로딩 중...</div>;

  return (
    <div className="container">
      <div className="board-detail-container">
        {/* 상단 네비게이션 */}
        <div className="detail-nav">
          <button className="btn-back" onClick={() => navigate('/community/qna')}>
            ← 목록으로
          </button>
        </div>

        {/* 게시글 헤더 */}
        <div className="post-detail-header">
          <div className="post-category">
            <span className="category-badge">법률 상담</span>
            {post.isAdopted && <span className="status-badge adopted">✓ 채택완료</span>}
            {!post.isAdopted && answers.length > 0 && (
              <span className="status-badge pending">답변 {answers.length}개</span>
            )}
          </div>
          <h1 className="post-detail-title">{post.title}</h1>
          
          {/* 게시글 정보 */}
          <div className="post-detail-info">
            <div className="author-info">
              <span className="author-avatar">👤</span>
              <span className="author-name">{post.writerName}</span>
            </div>
            <div className="post-meta-info">
              <span>🕐 {post.createdAt || '2024-01-15 14:30'}</span>
              <span>•</span>
              <span>👁️ {post.views || 128}</span>
            </div>
          </div>

          {/* 태그 */}
          {post.tags && (
            <div className="post-detail-tags">
              {post.tags.split(',').map((tag, idx) => (
                <span key={idx} className="detail-tag">
                  #{tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 게시글 본문 */}
        <div className="post-detail-body">
          <div className="post-content-text">
            {post.content}
          </div>
        </div>

        {/* 게시글 푸터 (좋아요, 신고 등) */}
        <div className="post-detail-footer">
          <button className="btn-action">
            👍 도움이 돼요 <span className="count">24</span>
          </button>
          <button className="btn-action secondary">
            🔖 북마크
          </button>
          <button className="btn-action secondary">
            ⚠️ 신고
          </button>
        </div>

        <hr className="section-divider" />

        {/* 답변 섹션 */}
        <div className="answers-section">
          <div className="answers-header">
            <h3>💬 변호사 답변 ({answers.length})</h3>
          </div>

          {answers.length === 0 ? (
            <div className="no-answers">
              <div className="no-answers-icon">💭</div>
              <p>아직 답변이 없습니다.</p>
              <p className="no-answers-sub">변호사님의 답변을 기다리고 있습니다.</p>
            </div>
          ) : (
            <div className="answers-list">
              {answers.map((ans, index) => (
                <div key={ans.id} className="answer-item">
                  <div className="answer-header">
                    <div className="lawyer-info">
                      <span className="lawyer-avatar">⚖️</span>
                      <div className="lawyer-details">
                        <strong className="lawyer-name">{ans.lawyerName} 변호사</strong>
                        <span className="lawyer-firm">{ans.firm || '법무법인 정의'}</span>
                      </div>
                    </div>
                    <div className="answer-meta">
                      <span className="answer-date">{ans.createdAt || '2024-01-16 09:20'}</span>
                      {ans.isAdopted && (
                        <span className="adopted-badge">✓ 채택된 답변</span>
                      )}
                    </div>
                  </div>

                  <div className="answer-body">
                    <p>{ans.content}</p>
                  </div>

                  <div className="answer-footer">
                    <button className="btn-answer-action">
                      👍 도움됨 ({ans.likes || 12})
                    </button>
                    {!post.isAdopted && index === 0 && (
                      <button 
                        className="btn-adopt" 
                        onClick={() => alert('답변을 채택하시겠습니까?')}
                      >
                        ✓ 이 답변 채택하기
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 답변 작성 (변호사 전용) */}
        {!post.isAdopted && (
          <div className="answer-write-section">
            <h4>답변 작성</h4>
            <textarea 
              className="answer-textarea" 
              placeholder="전문적인 법률 조언을 작성해주세요..."
              rows="6"
            ></textarea>
            <div className="answer-write-actions">
              <button className="btn-primary">답변 등록</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QnaDetail;