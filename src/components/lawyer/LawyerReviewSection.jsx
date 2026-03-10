import React, { useEffect, useState } from "react";
import reviewApi from "../../api/reviewApi";
import { useAuthStore } from "../../store/authStore";
import "../../styles/lawyer/LawyerReviewSection.css";
import { formatDate } from "../../utils/formatDate";

const LawyerReviewSection = ({ lawyerId }) => {
  const { user, isAuthenticated } = useAuthStore();

  const [reviews, setReviews] = useState([]);
  const [pendingReview, setPendingReview] = useState(null);
  const [loading, setLoading] = useState(true);

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const reviewData = await reviewApi.getReviewsByLawyer(lawyerId);
      setReviews(reviewData);

      if (isAuthenticated && user?.memberId) {
        const pendingList = await reviewApi.getPendingReviews(user.memberId);
        const match = pendingList.find(
          (item) => item.lawyerId === Number(lawyerId),
        );
        setPendingReview(match);
      }
    } catch (err) {
      console.error("리뷰 섹션 데이터 로드 실패:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (lawyerId) fetchData();
  }, [lawyerId, user?.memberId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!content.trim()) return alert("후기 내용을 입력해주세요.");

    try {
      const reviewData = {
        consultId: pendingReview.consultId,
        memberId: user.memberId,
        lawyerId: lawyerId,
        rating: rating,
        content: content,
      };

      await reviewApi.createReview(reviewData);
      alert("후기가 성공적으로 등록되었습니다!");
      setPendingReview(null);
      setContent("");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "후기 등록에 실패했습니다.");
    }
  };

  // 💡 후기 삭제 핸들러
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("정말 이 후기를 삭제하시겠습니까?")) return;

    try {
      // API 호출 시 본인 확인용 memberId와 통계 갱신용 lawyerId 전달
      await reviewApi.deleteReview(reviewId, user.memberId, lawyerId);
      alert("후기가 성공적으로 삭제되었습니다.");
      fetchData(); // 삭제 후 목록 및 평점 갱신
    } catch (err) {
      alert(err.message || "삭제 권한이 없거나 요청에 실패했습니다.");
    }
  };

  if (loading)
    return <div className="review-loading">후기를 불러오는 중...</div>;

  return (
    <section className="lawyer-review-section">
      <h3 className="section-title">의뢰인 후기 ({reviews.length})</h3>

      {pendingReview && (
        <div className="pending-review-box">
          <div className="pending-header">
            <span className="info-icon">📝</span>
            <p>
              <strong>{user.name}</strong> 의뢰인님, 상담은 어떠셨나요? 아직
              작성하지 않은 후기가 있습니다.
            </p>
          </div>
          <form className="review-write-form" onSubmit={handleSubmitReview}>
            <div className="rating-select">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={`star-btn ${rating >= num ? "active" : ""}`}
                  onClick={() => setRating(num)}
                >
                  ★
                </button>
              ))}
              <span className="rating-label">{rating}점</span>
            </div>
            <textarea
              placeholder="변호사님과의 상담 경험을 공유해주세요."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="form-footer">
              <button type="submit" className="review-submit-btn">
                후기 등록하기
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="review-list">
        {reviews.length > 0 ? (
          reviews.map((review) => (
            <div key={review.reviewId} className="review-item">
              <div className="review-item-header">
                <div className="review-stars">
                  {"★".repeat(review.rating)}
                  <span className="empty-stars">
                    {"★".repeat(5 - review.rating)}
                  </span>
                </div>
                <div className="review-info-right">
                  <span className="review-date">
                    {formatDate(review.createdAt)}
                  </span>
                  {/* 💡 본인이 작성한 리뷰일 경우에만 삭제 버튼 표시 */}
                  {isAuthenticated && user?.memberId === review.memberId && (
                    <button
                      className="delete-text-btn"
                      onClick={() => handleDeleteReview(review.reviewId)}
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
              <p className="review-content">{review.content}</p>
              <div className="review-footer">
                <span className="review-author">
                  {review.reviewerName || "익명"} 의뢰인
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="no-reviews">아직 등록된 후기가 없습니다.</div>
        )}
      </div>
    </section>
  );
};

export default LawyerReviewSection;
