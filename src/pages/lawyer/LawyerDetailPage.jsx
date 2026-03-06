// src/pages/lawyer/LawyerDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";
import { DEFAULT_IMAGE } from "./LawyerListPage";
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
        console.error("상세 정보 로드 실패:", err);
        setLawyer({
          lawyerId: id,
          name: "윤정의",
          specialty: "행정,헌법",
          officeName: "윤정의 법률사무소",
          intro: "행정소송 및 헌법소원 전문. 국가기관을 상대로 한 사건에 강합니다.",
          career: "행정부 법무담당 3년, 개업 5년",
          licenseNo: "LAW-2017-00654",
          email: "yoon@law.com",
          phone: "010-3456-7890",
          officeAddr: "서울시 종로구 종로 30",
          consultFee: 120000,
          avgRating: 0,
          reviewCnt: 0,
          savePath: null,
          profileUrl: null,
          reviews: []
        });
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) {
    return <div className="loading-status">상세 정보를 로딩 중입니다...</div>;
  }

  if (!lawyer) {
    return <div className="loading-status">해당 변호사 정보를 찾을 수 없습니다.</div>;
  }

  const imageUrl = (() => {
    const path = lawyer.savePath || lawyer.profileUrl || lawyer.profileImage || lawyer.imagePath || lawyer.imageUrl;
    if (path) return path.startsWith("http") ? path : `http://localhost:8080${path}`;
    return DEFAULT_IMAGE;
  })();

  const isDefault = imageUrl === DEFAULT_IMAGE;

  return (
    <div className="lawyer-detail-page">
      <div className="lawyer-detail-container">
        
        <section className="detail-header">
          <div className="detail-img-box">
            <img
              src={imageUrl}
              alt={lawyer.name}
              className={`detail-img ${isDefault ? 'default-avatar' : 'real-profile'}`}
              onError={(e) => { 
                e.target.src = DEFAULT_IMAGE; 
                e.target.className = "detail-img default-avatar";
              }}
            />
          </div>
          <div className="detail-info">
            {lawyer.specialty && (
              <span className="detail-specialty-badge">{lawyer.specialty} 전문</span>
            )}
            <h1 className="detail-name">{lawyer.name} 변호사</h1>
            <div className="detail-office">{lawyer.officeName || "사무소 정보 없음"}</div>
            <div className="detail-rating">
              <span className="star">★</span> {lawyer.avgRating ? lawyer.avgRating.toFixed(1) : "0.0"} 
              <span className="count">({lawyer.reviewCnt || 0}개의 후기)</span>
            </div>
          </div>
        </section>

        <section className="detail-summary-box">
          {lawyer.intro || "등록된 소개가 없습니다."}
        </section>

        <section className="detail-section">
          <h3 className="detail-section-title">주요 경력</h3>
          <div className="detail-career-text">
            {lawyer.career || "등록된 경력 정보가 없습니다."}
          </div>
        </section>

        <section className="detail-section">
          <h3 className="detail-section-title">사무소 및 연락처 정보</h3>
          <div className="info-table">
            <div className="info-row">
              <span className="info-label">자격번호</span>
              <span className="info-value">{lawyer.licenseNo || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">이메일</span>
              <span className="info-value">{lawyer.email || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">연락처</span>
              <span className="info-value">{lawyer.phone || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">사무소 위치</span>
              <span className="info-value">{lawyer.officeAddr || "-"}</span>
            </div>
            <div className="info-row">
              <span className="info-label">기본 상담료 (30분)</span>
              <span className="info-value price">
                {lawyer.consultFee ? `${lawyer.consultFee.toLocaleString()}원` : "문의 요망"}
              </span>
            </div>
          </div>
        </section>

        <section className="detail-section">
          <h3 className="detail-section-title">의뢰인 후기</h3>
          {lawyer.reviews && lawyer.reviews.length > 0 ? (
            <div className="review-list">
              {lawyer.reviews.map((review, index) => (
                <div key={index} className="review-box">
                  <div className="review-header">
                    <div>
                      <span className="review-stars">{"★".repeat(review.rating || 5)}</span>
                      <span className="review-author">{review.authorName}</span>
                    </div>
                    <span className="review-date">{review.createdAt}</span>
                  </div>
                  <p className="review-content">{review.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", color: "#94a3b8", fontSize: "15px" }}>
              아직 등록된 의뢰인 후기가 없습니다.
            </div>
          )}
        </section>

        <div className="detail-action-buttons">
          <button 
            className="btn-action-chat"
            onClick={() => alert("채팅 상담으로 연결합니다.")}
          >
            💬 채팅 상담하기
          </button>
          <button 
            className="btn-action-reserve"
            onClick={() => navigate(`/consult/reserve?lawyerId=${lawyer.lawyerId}`)}
          >
            지금 바로 상담 예약하기
          </button>
        </div>

      </div>
    </div>
  );
};

export default LawyerDetailPage;