import { useState, useEffect } from "react";
import { getComments, writeComment } from "../../api/communityApi";
import "../../styles/community/CommentList.css";

const CommentList = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState(""); // 일반
  const [replyContent, setReplyContent] = useState({}); // 대댓글
  const [openReplyId, setOpenReplyId] = useState(null); // 답글

  const fetchComments = async () => {
    try {
      const data = await getComments(postId);
      console.log("댓글", data);
      setComments(data);
    } catch (error) {
      console.error("댓글 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const parentComments = comments.filter((c) => c.parentId === null);

  const getReplies = (commentId) => {
    return comments.filter((c) => c.parentId === commentId);
  };

  const memberId = Number(localStorage.getItem("memberId"));

  const handleWriteComment = async () => {
    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!content.trim()) {
      alert("댓글 내용을 입력해주세요.");
      return;
    }

    try {
      await writeComment({
        postId: Number(postId),
        memberId,
        parentId: null,
        content
      });

      setContent("");
      fetchComments();
    } catch (error) {
      console.error("댓글 등록 실패:", error);
      alert("댓글 등록 실패");
    }
  };

  const handleWriteReply = async (parentId) => {
    if (!memberId) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!replyContent[parentId]?.trim()) {
      alert("답글 내용을 입력해주세요.");
      return;
    }

    try {
      await writeComment({
        postId: Number(postId),
        memberId,
        parentId,
        content: replyContent[parentId]
      });

      setReplyContent({
        ...replyContent,
        [parentId]: ""
      });
      setOpenReplyId(null);
      fetchComments();
    } catch (error) {
      console.error("답글 등록 실패:", error);
      alert("답글 등록 실패");
    }
  };

  return (
    <div className="comment-section">
      <h3 className="comment-title">
        댓글
        <span className="comment-count">{parentComments.length}</span>
      </h3>

      <div className="comment-write-box">
        <textarea
          className="comment-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력하세요"
        />
        <button className="comment-write-btn" onClick={handleWriteComment}>
          댓글 등록
        </button>
      </div>

      {parentComments.length === 0 ? (
        <p className="comment-empty">아직 댓글이 없습니다.</p>
      ) : (
        parentComments.map((c, idx) => (
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

            <p className="comment-content">
              {c.status === "DELETED" ? "삭제된 댓글입니다." : c.content}
            </p>

            {c.status === "ACTIVE" && (
              <button
                className="reply-toggle-btn"
                onClick={() =>
                  setOpenReplyId(openReplyId === c.commentId ? null : c.commentId)
                }
              >
                답글쓰기
              </button>
            )}

            {openReplyId === c.commentId && (
              <div className="reply-write-box">
                <textarea
                  className="reply-textarea"
                  value={replyContent[c.commentId] || ""}
                  onChange={(e) =>
                    setReplyContent({
                      ...replyContent,
                      [c.commentId]: e.target.value
                    })
                  }
                  placeholder="답글을 입력하세요"
                />
                <button
                  className="reply-write-btn"
                  onClick={() => handleWriteReply(c.commentId)}
                >
                  답글 등록
                </button>
              </div>
            )}

            <div className="reply-list">
              {getReplies(c.commentId).map((reply) => (
                <div key={reply.commentId} className="reply-item">
                  <div className="comment-meta">
                    <span className="comment-author">{reply.name}</span>
                    <span className="comment-date">
                      {reply.updatedAt === null ? reply.createdAt : reply.updatedAt}
                    </span>
                    {reply.updatedAt !== null && (
                      <span className="comment-edited-tag">수정됨</span>
                    )}
                  </div>

                  <p className="comment-content">
                    {reply.status === "DELETED"
                      ? "삭제된 댓글입니다."
                      : reply.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default CommentList;
