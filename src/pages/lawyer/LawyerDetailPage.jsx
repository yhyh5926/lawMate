import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";

const LawyerDetailPage = () => {
  const { id } = useParams();
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
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  if (loading)
    return <div style={statusMessageStyle}>상세 정보를 로딩 중입니다...</div>;
  if (!lawyer)
    return (
      <div style={statusMessageStyle}>해당 변호사 정보를 찾을 수 없습니다.</div>
    );

  return (
    <div style={containerStyle}>
      <div style={contentCardStyle}>
        {/* 💡 레이아웃: 상단 프로필 영역 (사진 + 핵심정보) */}
        <div style={headerSectionStyle}>
          <div style={imageWrapperStyle}>
            <img
              src={
                lawyer.savePath
                  ? `http://localhost:8080${lawyer.savePath}`
                  : "/img/default_profile.png"
              }
              alt={lawyer.name}
              style={profileImgStyle}
              onError={(e) => (e.target.src = "/img/default_profile.png")}
            />
          </div>
          <div style={headerTitleStyle}>
            <span style={specialtyBadgeStyle}>{lawyer.specialty} 전문</span>
            <h1 style={{ margin: "10px 0 5px 0", color: "#2c3e50" }}>
              {lawyer.name} 변호사
            </h1>
            <p
              style={{
                color: "#3498db",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {lawyer.officeName}
            </p>
            <div style={ratingSummaryStyle}>
              ⭐{" "}
              <span style={{ fontWeight: "bold" }}>
                {lawyer.avgRating?.toFixed(1)}
              </span>
              <span style={{ color: "#95a5a6", marginLeft: "5px" }}>
                ({lawyer.reviewCnt}개의 후기)
              </span>
            </div>
          </div>
        </div>

        <p style={introTextStyle}>{lawyer.intro}</p>

        <hr style={dividerStyle} />

        <h3 style={{ marginBottom: "15px", color: "#2c3e50" }}>주요 경력</h3>
        <p style={careerTextStyle}>{lawyer.career}</p>

        <h3
          style={{ marginTop: "40px", marginBottom: "15px", color: "#2c3e50" }}
        >
          사무소 및 연락처 정보
        </h3>
        <div style={infoBoxStyle}>
          <div style={infoItemStyle}>
            <strong>자격번호</strong> <span>{lawyer.licenseNo}</span>
          </div>
          <div style={infoItemStyle}>
            <strong>이메일</strong> <span>{lawyer.email}</span>
          </div>
          <div style={infoItemStyle}>
            <strong>연락처</strong> <span>{lawyer.phone}</span>
          </div>
          <div style={infoItemStyle}>
            <strong>사무소 위치</strong> <span>{lawyer.officeAddr}</span>
          </div>
          <div style={infoItemStyle}>
            <strong>기본 상담료 (30분)</strong>
            <span
              style={{
                color: "#e74c3c",
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {lawyer.consultFee?.toLocaleString()}원
            </span>
          </div>
        </div>

        <button
          style={btnStyle}
          onClick={() =>
            alert(`${lawyer.name} 변호사에게 상담 예약을 신청합니다.`)
          }
        >
          지금 바로 상담 예약하기
        </button>
      </div>
    </div>
  );
};

// --- 스타일 객체 업데이트 ---

const containerStyle = {
  padding: "40px 20px",
  maxWidth: "900px",
  margin: "0 auto",
  backgroundColor: "#f8f9fa",
  minHeight: "100vh",
};

const contentCardStyle = {
  backgroundColor: "#fff",
  padding: "50px",
  borderRadius: "20px",
  boxShadow: "0 15px 35px rgba(0,0,0,0.05)",
};

const headerSectionStyle = {
  display: "flex",
  gap: "30px",
  marginBottom: "40px",
  alignItems: "center",
};

const imageWrapperStyle = {
  width: "180px",
  height: "220px",
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

const profileImgStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

const headerTitleStyle = {
  flex: 1,
};

const ratingSummaryStyle = {
  marginTop: "10px",
  fontSize: "1rem",
};

const specialtyBadgeStyle = {
  backgroundColor: "#e1f5fe",
  color: "#0288d1",
  padding: "5px 15px",
  borderRadius: "30px",
  fontWeight: "bold",
  fontSize: "0.85rem",
};

const introTextStyle = {
  fontSize: "1.2rem",
  lineHeight: "1.8",
  color: "#34495e",
  fontWeight: "500",
  backgroundColor: "#fdfdfd",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #f0f0f0",
};

const careerTextStyle = {
  whiteSpace: "pre-wrap",
  color: "#636e72",
  lineHeight: "1.9",
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "10px",
  border: "1px solid #eee",
};

const infoBoxStyle = {
  backgroundColor: "#f9f9f9",
  padding: "30px",
  borderRadius: "15px",
  border: "1px solid #f1f1f1",
};

const infoItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #eee",
  fontSize: "1rem",
};

const dividerStyle = {
  margin: "40px 0",
  border: "0",
  borderTop: "2px solid #f5f5f5",
};

const statusMessageStyle = {
  textAlign: "center",
  padding: "100px",
  fontSize: "1.2rem",
  color: "#7f8c8d",
};

const btnStyle = {
  width: "100%",
  padding: "20px",
  marginTop: "40px",
  backgroundColor: "#1e3799",
  color: "#fff",
  border: "none",
  borderRadius: "12px",
  fontSize: "1.25rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "all 0.2s ease",
  boxShadow: "0 8px 20px rgba(30, 55, 153, 0.3)",
};

export default LawyerDetailPage;
