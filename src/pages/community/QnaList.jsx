import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MOCK_QNA_LIST } from '../../mocks/community/communityData'
import '../../styles/community/community.css'

const QnaList = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setPosts(MOCK_QNA_LIST);
  }, []);

  return (
    <div className="container">
      <div className="qna-list-page">
        <div className="board-header">
          <h2>💬 법률 상담 Q&A</h2>
          <button onClick={() => navigate('/community/qna/write')}>
            ✏️ 질문하기
          </button>
        </div>

        {posts.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📋</div>
            <p className="empty-state-text">아직 등록된 질문이 없습니다.</p>
          </div>
        ) : (
          <ul>
            {posts.map(post => (
              <li 
                key={post.id} 
                className="qna-post-item"
                onClick={() => navigate(`/community/qna/${post.id}`)}
              >
                <div className={`post-status ${post.isAdopted ? 'answered' : ''}`}>
                  <span className="post-status-label">
                    {post.isAdopted ? '답변완료' : '답변대기'}
                  </span>
                  <span className="post-status-count">
                    {post.answerCount || 0}
                  </span>
                </div>

                <div className="post-content">
                  <h3 className="post-title">{post.title}</h3>
                  <div className="post-meta">
                    <span>👤 {post.writerName}</span>
                    <span>•</span>
                    <span>🕐 {post.createdAt || '방금 전'}</span>
                    {post.tags && (
                      <div className="post-tags">
                        {post.tags.split(',').map((tag, idx) => (
                          <span key={idx} className="post-tag">
                            #{tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="post-stats">
                  <div className="stat-item">
                    <div className="stat-label">조회</div>
                    <div className="stat-value">{post.views || 0}</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-label">댓글</div>
                    <div className="stat-value">{post.commentCount || 0}</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default QnaList;