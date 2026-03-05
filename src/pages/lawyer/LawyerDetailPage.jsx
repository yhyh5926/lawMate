import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";
import { DEFAULT_IMAGE } from "./LawyerListPage";
import "../../styles/lawyer/LawyerDetailPage.css";

const LawyerDetailPage = () => {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await lawyerApi.getLawyerDetail(id);
        setLawyer(data);
      } catch (err) {
        console.error("상세 정보 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="lawyer-detail-status">상세 정보를 로딩 중입니다...</div>
    );
  if (!lawyer)
    return (
      <div className="lawyer-detail-status">
        해당 변호사 정보를 찾을 수 없습니다.
      </div>
    );

  console.log(lawyer);
  return (
    <div className="lawyer-detail-container">
      <div className="lawyer-detail-card">
        {/* 1. 상단 프로필 영역 */}
        <div className="lawyer-detail-header">
          <div className="lawyer-detail-img-wrapper">
            <img
              src={
                lawyer.savePath
                  ? `http://localhost:8080${lawyer.savePath}`
                  : DEFAULT_IMAGE
              }
              alt={lawyer.name}
              className="lawyer-detail-profile-img"
              onError={(e) => (e.target.src = DEFAULT_IMAGE)}
            />
          </div>
          <div className="lawyer-detail-header-info">
            <span className="lawyer-detail-badge">{lawyer.specialty} 전문</span>
            <h1 className="lawyer-detail-name">{lawyer.name} 변호사</h1>
            <p className="lawyer-detail-office">{lawyer.officeName}</p>
            <div className="lawyer-detail-rating">
              ⭐ <strong>{lawyer.avgRating?.toFixed(1)}</strong>
              <span style={{ color: "#94a3b8" }}>
                ({lawyer.reviewCnt}개의 후기)
              </span>
            </div>
          </div>
        </div>

        {/* 2. 자기소개 및 경력 */}
        <p className="lawyer-detail-intro">{lawyer.intro}</p>

        <h3 className="lawyer-detail-section-title">주요 경력</h3>
        <p className="lawyer-detail-career">{lawyer.career}</p>

        {/* 3. 사무소 상세 정보 */}
        <h3 className="lawyer-detail-section-title">사무소 및 연락처 정보</h3>
        <div className="lawyer-detail-info-box">
          <div className="lawyer-detail-info-item">
            <strong>자격번호</strong> <span>{lawyer.licenseNo}</span>
          </div>
          <div className="lawyer-detail-info-item">
            <strong>이메일</strong> <span>{lawyer.email}</span>
          </div>
          <div className="lawyer-detail-info-item">
            <strong>연락처</strong> <span>{lawyer.phone}</span>
          </div>
          <div className="lawyer-detail-info-item">
            <strong>사무소 위치</strong> <span>{lawyer.officeAddr}</span>
          </div>
          <div className="lawyer-detail-info-item">
            <strong>기본 상담료 (30분)</strong>
            <span className="lawyer-detail-fee">
              {lawyer.consultFee?.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 4. 의뢰인 리뷰 섹션 */}
        <div className="lawyer-detail-reviews-wrapper">
          <h3 className="lawyer-detail-section-title">의뢰인 후기</h3>
          {lawyer.reviews &&
          lawyer.reviews.length > 0 &&
          lawyer.reviews[0].content !== null ? (
            <div className="lawyer-reviews-list">
              {lawyer.reviews.map((review) => (
                <div key={review.reviewId} className="lawyer-review-item">
                  <div className="lawyer-review-header">
                    <div className="review-user-info">
                      <span className="review-stars">
                        {"⭐".repeat(review.rating)}
                      </span>
                      <span className="review-author">
                        {review.reviewerName}
                      </span>
                      {/* [추가] 어떤 상담이었는지 보여주는 태그 */}
                      {review.consultSummary && (
                        <span className="review-consult-tag">
                          {review.consultSummary} 관련 상담
                        </span>
                      )}
                    </div>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="review-text">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reviews">아직 등록된 후기가 없습니다.</div>
          )}
        </div>

        {/* 5. 하단 버튼 그룹 */}
        <div className="lawyer-detail-btn-group">
          <button
            className="lawyer-detail-btn btn-chat"
            onClick={async () => {
              try {
                const res = await import("../../api/chatApi").then((m) =>
                  m.getOrCreateChatRoom(lawyer.memberId),
                );
                const roomNo = res.data.data.roomNo;
                navigate(`/chat/room?roomNo=${roomNo}`);
              } catch (err) {
                alert("채팅방 생성에 실패했습니다. 로그인이 필요합니다.", err);
              }
            }}
          >
            💬 채팅 상담하기
          </button>
          <button
            className="lawyer-detail-btn btn-reserve"
            onClick={() =>
              navigate(`/consult/reserve?lawyerId=${lawyer.lawyerId}`)
            }
          >
            지금 바로 상담 예약하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LawyerDetailPage;
