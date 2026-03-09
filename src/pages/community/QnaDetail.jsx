import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, deletePost } from '../../api/communityApi';
import CommentList from '../../components/community/CommentList';
import '../../styles/community/QnaDetail.css';

const QnaDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [qnaDetail, setQnaDetail] = useState(null);

  useEffect(() => {
    getPost(postId).then(data => {
      console.log(data);
      setQnaDetail(data);
    });
  }, [postId]);

  if (!qnaDetail) return <div className="detail-loading">불러오는 중...</div>;

  const loginMemberId = Number(localStorage.getItem("memberId"));
  const isWriter = loginMemberId === qnaDetail.memberId;

  const handleEdit = () => {
    navigate(`/community/edit/${postId}`);
  };

  const handleDelete = async () => {
    const isConfirm = window.confirm("정말 삭제하시겠습니까?");
    if (!isConfirm) return;

    try {
      await deletePost(postId);
      alert("게시글이 삭제되었습니다.");
      navigate("/community/qnalist");
    } catch (error) {
      console.error("게시글 삭제 실패:", error);
      console.error("응답 데이터:", error.response?.data);
      alert("게시글 삭제 실패");
    }
  };

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

            {isWriter && (
              <div className="detail-action-box">
                <button className="detail-edit-btn" onClick={handleEdit}>
                  수정
                </button>
                <button className="detail-delete-btn" onClick={handleDelete}>
                  삭제
                </button>
              </div>
            )}
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