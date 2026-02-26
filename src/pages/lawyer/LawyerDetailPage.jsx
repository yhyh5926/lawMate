import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// 💡 만들어둔 lawyerApi를 사용합니다.
import lawyerApi from "../../api/lawyerApi";

const LawyerDetailPage = () => {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        // 💡 API 모듈의 상세 조회 함수 호출
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
        <span style={specialtyBadgeStyle}>{lawyer.specialty} 전문</span>
        <h1 style={{ marginTop: "10px", color: "#2c3e50" }}>
          {lawyer.officeName}
        </h1>
        <p style={introTextStyle}>{lawyer.intro}</p>

        <hr style={dividerStyle} />

        <h3 style={{ marginBottom: "15px" }}>주요 경력</h3>
        <p style={careerTextStyle}>{lawyer.career}</p>

        <div style={infoBoxStyle}>
          <div style={infoItemStyle}>
            <strong>자격번호</strong> <span>{lawyer.licenseNo}</span>
          </div>
          <div style={infoItemStyle}>
            <strong>사무소 위치</strong> <span>{lawyer.officeAddr}</span>
          </div>
          <div style={infoItemStyle}>
            <strong>기본 상담료</strong>
            <span style={{ color: "#e74c3c", fontWeight: "bold" }}>
              {lawyer.consultFee?.toLocaleString()}원
            </span>
          </div>
        </div>

        <button
          style={btnStyle}
          onClick={() =>
            alert(`${lawyer.officeName} 상담 예약 페이지로 연결합니다.`)
          }
        >
          지금 바로 상담 예약하기
        </button>
      </div>
    </div>
  );
};

// 스타일 객체
const containerStyle = {
  padding: "40px 20px",
  maxWidth: "850px",
  margin: "0 auto",
  backgroundColor: "#f4f7f6",
  minHeight: "100vh",
};

const contentCardStyle = {
  backgroundColor: "#fff",
  padding: "40px",
  borderRadius: "16px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
};

const specialtyBadgeStyle = {
  color: "#3498db",
  fontWeight: "800",
  fontSize: "0.9rem",
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const introTextStyle = {
  fontSize: "1.15rem",
  lineHeight: "1.8",
  color: "#444",
  marginTop: "20px",
};

const careerTextStyle = {
  whiteSpace: "pre-wrap",
  color: "#666",
  lineHeight: "1.7",
  backgroundColor: "#fcfcfc",
  padding: "15px",
  borderRadius: "8px",
  borderLeft: "4px solid #dcdde1",
};

const infoBoxStyle = {
  backgroundColor: "#f8f9fa",
  padding: "25px",
  borderRadius: "12px",
  marginTop: "30px",
};

const infoItemStyle = {
  display: "flex",
  justifyContent: "space-between",
  marginBottom: "10px",
  fontSize: "0.95rem",
};

const dividerStyle = {
  margin: "30px 0",
  border: "0",
  borderTop: "1px solid #eee",
};

const statusMessageStyle = {
  textAlign: "center",
  padding: "100px",
  fontSize: "1.2rem",
  color: "#7f8c8d",
};

const btnStyle = {
  width: "100%",
  padding: "18px",
  marginTop: "35px",
  backgroundColor: "#2c3e50",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontSize: "1.2rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "background-color 0.2s",
};

export default LawyerDetailPage;
