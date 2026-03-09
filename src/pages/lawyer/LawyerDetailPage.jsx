import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";
import { DEFAULT_IMAGE } from "./LawyerListPage";
import "../../styles/lawyer/LawyerDetailPage.css";
import { getOrCreateChatRoom } from "../../api/chatApi";

const LawyerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  // 날짜 포맷팅 함수 (예: 2026. 03. 06)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await lawyerApi.getLawyerDetail(id);
        setLawyer(data);
      } catch (err) {
        console.error("상세 정보 로드 실패:", err);
        // 가상 데이터 (개발/테스트용)
        setLawyer({
          lawyerId: id,
          name: "윤정의",
          specialty: "행정,헌법",
          officeName: "윤정의 법률사무소",
          intro:
            "행정소송 및 헌법소원 전문. 국가기관을 상대로 한 사건에 강합니다.",
          career:
            "• 행정부 법무담당 3년\n• 법무법인 로펌 파트너\n• 현) 윤정의 법률사무소 대표 변호사",
          licenseNo: "LAW-2017-00654",
          email: "yoon@law.com",
          phone: "010-3456-7890",
          officeAddr: "서울시 종로구 종로 30",
          consultFee: 120000,
          avgRating: 4.8,
          reviewCnt: 12,
          reviews: [
            {
              authorName: "김*한",
              content: "친절하고 명쾌한 상담 감사합니다.",
              rating: 5,
              createdAt: "2026-02-15T10:00:00",
            },
            {
              authorName: "이*영",
              content: "행정 처리에 큰 도움을 받았습니다.",
              rating: 4,
              createdAt: "2026-01-20T14:30:00",
            },
          ],
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="detail-status-msg">변호사 프로필을 분석 중입니다...</div>
    );
  if (!lawyer)
    return (
      <div className="detail-status-msg">해당 정보를 찾을 수 없습니다.</div>
    );

  const imageUrl = (() => {
    const path =
      lawyer.savePath ||
      lawyer.profileUrl ||
      lawyer.profileImage ||
      lawyer.imagePath ||
      lawyer.imageUrl;
    if (path)
      return path.startsWith("http") ? path : `http://localhost:8080${path}`;
    return DEFAULT_IMAGE;
  })();

  return (
    <div className="lawyer-detail-page">
      <div className="lawyer-detail-container">
        {/* 1. 헤더 섹션: 프로필 이미지 및 기본 정보 */}
        <section className="detail-header-card">
          <div className="header-flex">
            <div className="detail-img-wrapper">
              <img
                src={imageUrl}
                alt={lawyer.name}
                className={
                  imageUrl === DEFAULT_IMAGE ? "default-avatar" : "real-profile"
                }
                onError={(e) => {
                  e.target.src = DEFAULT_IMAGE;
                }}
              />
            </div>
            <div className="detail-main-info">
              {lawyer.specialty && (
                <span className="specialty-badge">{lawyer.specialty} 전문</span>
              )}
              <h1 className="lawyer-fullname">
                {lawyer.name} <span className="title-suffix">변호사</span>
              </h1>
              <p className="office-text">
                {lawyer.officeName || "소속 정보 없음"}
              </p>
              <div className="rating-summary">
                <span className="star-icon">★</span>
                <span className="rating-score">
                  {lawyer.avgRating ? lawyer.avgRating.toFixed(1) : "0.0"}
                </span>
                <span className="review-count">
                  ({lawyer.reviewCnt || 0}개의 후기)
                </span>
              </div>
            </div>
          </div>
          <div className="intro-text-box">
            "{lawyer.intro || "의뢰인의 권익을 위해 최선을 다하겠습니다."}"
          </div>
        </section>

        {/* 2. 상세 정보 영역 */}
        <div className="detail-content-grid">
          {/* 왼쪽: 경력 및 이력 */}
          <div className="content-left">
            <section className="info-section">
              <h3 className="section-title">주요 경력</h3>
              <div className="career-list-box">
                {lawyer.career
                  ? lawyer.career.split("\n").map((line, i) => (
                      <p key={i} className="career-line">
                        {line}
                      </p>
                    ))
                  : "등록된 경력 정보가 없습니다."}
              </div>
            </section>

            <section className="info-section">
              <h3 className="section-title">의뢰인 후기</h3>
              <div className="review-container">
                {lawyer.reviews && lawyer.reviews.length > 0 ? (
                  lawyer.reviews.map((review, index) => (
                    <div key={index} className="review-card">
                      <div className="review-card-header">
                        <span className="review-stars">
                          {"★".repeat(review.rating)}
                        </span>
                        <span className="review-date">
                          {formatDate(review.createdAt)}
                        </span>
                      </div>
                      <p className="review-body">{review.content}</p>
                      <span className="review-author">
                        {review.authorName} 의뢰인
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="no-reviews">
                    아직 작성된 후기가 없습니다. 첫 번째 후기를 남겨주세요!
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* 오른쪽: 연락처 및 정보 테이블 */}
          <div className="content-right">
            <section className="contact-card">
              <h3 className="section-title">사무소 정보</h3>
              <div className="contact-info-list">
                <div className="contact-item">
                  <label>자격번호</label>
                  <span>{lawyer.licenseNo || "-"}</span>
                </div>
                <div className="contact-item">
                  <label>이메일</label>
                  <span>{lawyer.email || "-"}</span>
                </div>
                <div className="contact-item">
                  <label>연락처</label>
                  <span>{lawyer.phone || "-"}</span>
                </div>
                <div className="contact-item">
                  <label>사무소 주소</label>
                  <span className="address-text">
                    {lawyer.officeAddr || "-"}
                  </span>
                </div>
                <div className="fee-divider"></div>
                <div className="contact-item fee-item">
                  <label>기본 상담료</label>
                  <span className="price-tag">
                    {lawyer.consultFee
                      ? `${lawyer.consultFee.toLocaleString()}원`
                      : "문의 요망"}
                  </span>
                </div>
              </div>

              <div className="sticky-actions">
                <button
                  className="btn-chat"
                  onClick={async () => {
                    try {
                      const res = await getOrCreateChatRoom(lawyer.memberId);
                      const roomNo = res.data?.data?.roomNo;
                      navigate(`/chat/room?roomNo=${roomNo}`);
                    } catch (e) {
                      alert("채팅방 생성 중 오류가 발생했습니다.");
                    }
                  }}
                >
                  💬 실시간 채팅 문의
                </button>
                <button
                  className="btn-reserve"
                  onClick={() =>
                    navigate(`/consult/reserve?lawyerId=${lawyer.lawyerId}`)
                  }
                >
                  상담 예약 신청하기
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LawyerDetailPage;
