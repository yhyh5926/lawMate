import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";
import { DEFAULT_IMAGE } from "./LawyerListPage";
import { getOrCreateChatRoom } from "../../api/chatApi";
import { baseURL } from "../../constants/baseURL";
import LawyerReviewSection from "../../components/lawyer/LawyerReviewSection"; // 💡 컴포넌트 임포트
import "../../styles/lawyer/LawyerDetailPage.css";

const LawyerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await lawyerApi.getLawyerDetail(id);
        setLawyer(data);
      } catch (err) {
        console.error("데이터 로드 실패:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="detail-status-msg">프로필을 불러오는 중입니다...</div>
    );
  if (!lawyer)
    return <div className="detail-status-msg">정보를 찾을 수 없습니다.</div>;

  // 이미지 경로 처리
  const imageUrl = (() => {
    const path = lawyer.savePath || lawyer.profileUrl || lawyer.lawyerProfile;
    if (path) return path.startsWith("http") ? path : baseURL + path;
    return DEFAULT_IMAGE;
  })();

  console.log(lawyer);
  return (
    <div className="lawyer-detail-page">
      <div className="lawyer-detail-container">
        {/* 1. 상단 프로필 카드 */}
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
            "
            {lawyer.intro || "의뢰인의 신뢰를 바탕으로 최선의 결과를 만듭니다."}
            "
          </div>
        </section>

        <div className="detail-content-grid">
          {/* 2. 왼쪽 영역: 경력 및 후기 */}
          <div className="content-left">
            <section className="info-section">
              <h3 className="section-title">주요 경력</h3>
              <div className="career-list-box">
                {lawyer.career ? (
                  lawyer.career.split("\n").map((line, i) => (
                    <p key={i} className="career-line">
                      {line}
                    </p>
                  ))
                ) : (
                  <p className="no-data">등록된 경력 정보가 없습니다.</p>
                )}
              </div>
            </section>

            <LawyerReviewSection lawyerId={lawyer.lawyerId} />
          </div>

          {/* 3. 오른쪽 영역: 사무소 정보 및 액션 버튼 */}
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
                      alert("채팅 연결에 실패했습니다.");
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
