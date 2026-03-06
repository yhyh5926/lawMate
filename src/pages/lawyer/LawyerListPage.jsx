// src/pages/lawyer/LawyerListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";
import defaultLawyerImg from "../../styles/images/Lawyers.png";
import "../../styles/lawyer/LawyerListPage.css";

export const DEFAULT_IMAGE = defaultLawyerImg;

const LawyerListPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const response = await lawyerApi.getAllLawyers();
        setLawyers(response.data || response); 
      } catch (err) {
        console.error("데이터 로드 실패:", err);
        setLawyers([
          { lawyerId: 1, memberId: 101, name: "강법률", officeName: "강법률 사무소", specialty: "노동,산재", intro: "노동법 전문. 부당해고 및 산재 다수 승소 경험이 있습니다.", avgRating: 5.0, reviewCnt: 2, savePath: null, profileUrl: null },
          { lawyerId: 2, memberId: 102, name: "윤정의", officeName: "윤정의 법률사무소", specialty: "행정,헌법", intro: "행정소송 및 헌법소원 전문. 국가기관을 상대로 한 사건에 강합니다.", avgRating: 5.0, reviewCnt: 1, savePath: null, profileUrl: null },
          { lawyerId: 3, memberId: 103, name: "최법무", officeName: "최법무 법률사무소", specialty: "형사,이혼", intro: "형사 및 가사 전문. 신속하고 명쾌한 상담을 약속드립니다.", avgRating: 4.8, reviewCnt: 4, savePath: null, profileUrl: null },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  if (loading) {
    return <div className="loading-status">변호사 목록을 불러오는 중입니다...</div>;
  }

  const getImageUrl = (lawyer) => {
    const path = lawyer.savePath || lawyer.profileUrl || lawyer.profileImage || lawyer.imagePath || lawyer.imageUrl;
    if (path) {
      return path.startsWith("http") ? path : `http://localhost:8080${path}`;
    }
    return DEFAULT_IMAGE;
  };

  return (
    <div className="lawyer-list-page">
      <header className="lawyer-list-hero">
        <div className="lawyer-list-hero-inner">
          <h1 className="lawyer-list-title">전문 변호사 찾기</h1>
          <p className="lawyer-list-subtitle">
            분야별 최고의 전문가들이 당신의 권리를 지켜드립니다.
          </p>
        </div>
      </header>

      <main className="lawyer-list-main">
        {lawyers.map((lawyer) => {
          const imgSrc = getImageUrl(lawyer);
          const isDefault = imgSrc === DEFAULT_IMAGE;

          return (
            <article 
              key={lawyer.lawyerId} 
              className="lawyer-card"
              onClick={() => navigate(`/lawyer/detail/${lawyer.lawyerId}`)}
            >
              <div className="lawyer-card-img-wrapper">
                {lawyer.specialty && (
                  <span className="lawyer-specialty-badge">
                    {lawyer.specialty.split(",")[0]}
                  </span>
                )}
                <img
                  src={imgSrc}
                  alt={lawyer.name}
                  className={`lawyer-card-img ${isDefault ? 'default-avatar' : 'real-profile'}`}
                  onError={(e) => { 
                    e.target.src = DEFAULT_IMAGE; 
                    e.target.className = "lawyer-card-img default-avatar";
                  }}
                />
              </div>

              <div className="lawyer-card-info">
                <div className="lawyer-card-header">
                  <h3 className="lawyer-name">{lawyer.name}</h3>
                  <div className="lawyer-rating">
                    <span className="star-icon">★</span>
                    <span className="rating-score">{lawyer.avgRating ? lawyer.avgRating.toFixed(1) : "0.0"}</span>
                    <span className="rating-count">({lawyer.reviewCnt || 0})</span>
                  </div>
                </div>
                
                <div className="lawyer-office">{lawyer.officeName || "사무소 정보 없음"}</div>
                <p className="lawyer-intro">{lawyer.intro || "등록된 소개글이 없습니다."}</p>

                <div className="lawyer-card-actions">
                  <button 
                    className="btn-chat"
                    onClick={async (e) => {
                      e.stopPropagation();
                      alert("채팅방이 개설되었습니다. (API 연동 대기중)");
                    }}
                  >
                    💬 채팅상담
                  </button>
                  <button 
                    className="btn-consult"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/consult/reserve?lawyerId=${lawyer.lawyerId}`);
                    }}
                  >
                    상담신청
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </main>
    </div>
  );
};

export default LawyerListPage;