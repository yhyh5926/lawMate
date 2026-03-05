import { useState, useEffect } from "react";
import { getComments } from "../../api/communityApi";
import "../../styles/community/CommentList.css";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    getComments(postId).then((data) => {
      console.log("댓글", data);
      setComments(data);
    });
  }, [postId]);

  return (
    <div className="comment-section">
      <h3 className="comment-title">
        댓글
        <span className="comment-count">{comments.length}</span>
      </h3>

      {comments.length === 0 ? (
        <p className="comment-empty">아직 댓글이 없습니다.</p>
      ) : (
        comments.map((c, idx) => (
          <div
            key={c.commentId}
            className="comment-item"
            style={{ animationDelay: `${idx * 0.04}s` }}
          >
            <div className="comment-meta">
              <span className="comment-author">{c.name}</span>
              <span className="comment-date">
                {c.updatedAt === null ? c.createdAt : c.updatedAt}
              </span>
              {c.updatedAt !== null && (
                <span className="comment-edited-tag">수정됨</span>
              )}
            </div>
            <p className="comment-content">{c.content}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
