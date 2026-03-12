import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";
import { DEFAULT_IMAGE } from "./LawyerListPage";
import { getOrCreateChatRoom } from "../../api/chatApi";
import { baseURL } from "../../constants/baseURL";
import LawyerReviewSection from "../../components/lawyer/LawyerReviewSection";
import "../../styles/lawyer/LawyerDetailPage.css";
import { scrollToTop } from "../../utils/windowUtils";

const LawyerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (id) fetchDetail();
    scrollToTop();
  }, [id]);

  if (loading)
    return (
      <div className="ld-status-screen">
        <div className="ld-spinner"></div>
        <p className="ld-status-text">변호사 프로필을 불러오는 중입니다...</p>
      </div>
    );

  if (!lawyer)
    return (
      <div className="ld-status-screen">
        <div className="ld-state-icon">⚠️</div>
        <p className="ld-status-text">정보를 찾을 수 없습니다.</p>
        <button className="ld-back-btn" onClick={() => navigate(-1)}>
          뒤로 가기
        </button>
      </div>
    );

  const imageUrl = (() => {
    const path = lawyer.savePath || lawyer.profileUrl || lawyer.lawyerProfile;
    if (path) return path.startsWith("http") ? path : baseURL + path;
    return DEFAULT_IMAGE;
  })();

  return (
    <div className="ld-root">
      <div className="ld-container">
        {/* ── 1. HEADER PROFILE CARD ── */}
        <header className="ld-header-card">
          <div className="ld-header-glow"></div>
          <div className="ld-header-content">
            <div className="ld-profile-flex">
              <div className="ld-img-wrapper">
                <img
                  src={imageUrl}
                  alt={lawyer.name}
                  className={
                    imageUrl === DEFAULT_IMAGE ? "is-default" : "is-real"
                  }
                  onError={(e) => {
                    e.target.src = DEFAULT_IMAGE;
                  }}
                />
              </div>
              <div className="ld-main-meta">
                <div className="ld-badge-row">
                  {lawyer.specialty && (
                    <span className="ld-badge ld-badge--gold">
                      {lawyer.specialty} 전문
                    </span>
                  )}
                  <span className="ld-badge ld-badge--outline">
                    변호사 등록
                  </span>
                </div>
                <h1 className="ld-name">
                  {lawyer.name} <span className="ld-name-suffix">변호사</span>
                </h1>
                <p className="ld-office">
                  {lawyer.officeName || "소속 정보 없음"}
                </p>
                <div className="ld-rating-row">
                  <span className="star-icon">★</span>
                  <span className="ld-score">
                    {lawyer.avgRating ? lawyer.avgRating.toFixed(1) : "0.0"}
                  </span>
                  <span className="ld-rev-count">
                    ({lawyer.reviewCnt || 0}개의 후기)
                  </span>
                </div>
              </div>
            </div>
            <div className="ld-intro-quote">
              <span className="quote-mark">“</span>
              <p>
                {lawyer.intro ||
                  "의뢰인의 신뢰를 바탕으로 최선의 결과를 만듭니다."}
              </p>
              <span className="quote-mark">”</span>
            </div>
          </div>
        </header>

        {/* ── 2. CONTENT GRID ── */}
        <div className="ld-grid">
          <div className="ld-col-left">
            <section className="ld-card">
              <div className="ld-card-eyebrow">PROFESSIONAL EXPERIENCE</div>
              <h3 className="ld-card-title">주요 경력</h3>
              <div className="ld-career-box">
                {lawyer.career ? (
                  lawyer.career.split("\n").map((line, i) => (
                    <div key={i} className="ld-career-item">
                      <span className="ld-career-dot"></span>
                      <p>{line}</p>
                    </div>
                  ))
                ) : (
                  <p className="ld-no-data">등록된 경력 정보가 없습니다.</p>
                )}
              </div>
            </section>

            <section className="ld-review-wrapper">
              <LawyerReviewSection
                lawyerId={lawyer.lawyerId}
                onReviewChange={fetchDetail}
              />
            </section>
          </div>

          <aside className="ld-col-right">
            <div className="ld-sticky-sidebar">
              <section className="ld-card ld-contact-card">
                <h3 className="ld-card-title">사무소 정보</h3>
                <dl className="ld-contact-list">
                  <div className="ld-contact-item">
                    <dt>자격번호</dt>
                    <dd>{lawyer.licenseNo || "-"}</dd>
                  </div>
                  <div className="ld-contact-item">
                    <dt>이메일</dt>
                    <dd>{lawyer.email || "-"}</dd>
                  </div>
                  <div className="ld-contact-item">
                    <dt>연락처</dt>
                    <dd>{lawyer.phone || "-"}</dd>
                  </div>
                  <div className="ld-contact-item">
                    <dt>주소</dt>
                    <dd className="ld-address">{lawyer.officeAddr || "-"}</dd>
                  </div>
                </dl>
                <div className="ld-fee-box">
                  <span className="ld-fee-label">기본 상담료 (30분)</span>
                  <span className="ld-fee-value">
                    {lawyer.consultFee
                      ? `${lawyer.consultFee.toLocaleString()}원`
                      : "문의 요망"}
                  </span>
                </div>
                <div className="ld-actions">
                  <button
                    className="ld-btn-chat"
                    onClick={async () => {
                      try {
                        const res = await getOrCreateChatRoom(lawyer.memberId);
                        navigate(`/chat/room?roomNo=${res.data?.data?.roomNo}`);
                      } catch (error) {
                        alert("채팅 연결 실패", error);
                      }
                    }}
                  >
                    💬 실시간 채팅 문의
                  </button>
                  <button
                    className="ld-btn-reserve"
                    onClick={() =>
                      navigate(`/consult/reserve?lawyerId=${lawyer.lawyerId}`)
                    }
                  >
                    상담 예약 신청하기
                  </button>
                </div>
              </section>
            </div>
          </aside>
        </div>

        {/* ── 3. BOTTOM BACK ACTION (Centering) ── */}
        <div className="ld-bottom-action">
          <button className="ld-list-back-center" onClick={() => navigate(-1)}>
            목록으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default LawyerDetailPage;
