import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPost } from '../../api/communityApi';
import CommentList from '../../components/community/CommentList';
import '../../styles/community/QnaDetail.css';

const QnaDetail = () => {

  const { postId } = useParams();
  const [qnaDetail, setQnaDetail] = useState(null);

  useEffect(() => {
    getPost(postId).then(data => {
      console.log(data);
      setQnaDetail(data);
    });
  }, [postId]);

  if (!qnaDetail) return <div className="detail-loading">불러오는 중...</div>;

  return (
    <div className="detail-wrapper">
      <div className="detail-container">

        <div className="detail-card">
          <div className="detail-header">
            {qnaDetail.caseType && (
              <span className="detail-case-tag">{qnaDetail.caseType}</span>
            )}
            <h2 className="detail-title">{qnaDetail.title}</h2>
            <div className="detail-meta">
              <span className="detail-meta-item">
                <strong>작성자</strong> {qnaDetail.name}
              </span>
              <span className="detail-meta-divider" />
              <span className="detail-meta-item">
                <strong>작성일</strong> {qnaDetail.createdAt}
              </span>
              <span className="detail-meta-divider" />
              <span className="detail-meta-item">
                <strong>조회수</strong> {qnaDetail.viewCnt}
              </span>
            </div>
          </div>

          <div className="detail-body">
            {qnaDetail.content}
          </div>
        </div>

        <div className="detail-comment-section">
          <CommentList postId={postId} />
        </div>

      </div>
    </div>
  );
};

export default QnaDetail;