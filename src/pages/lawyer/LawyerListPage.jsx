import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";

const LawyerListPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const data = await lawyerApi.getAllLawyers();
        setLawyers(data);
        console.log(data);
      } catch (err) {
        console.error("변호사 목록 로드 중 오류 발생:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLawyers();
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        변호사 정보를 불러오는 중입니다...
      </div>
    );

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ borderBottom: "2px solid #2c3e50", paddingBottom: "10px" }}>
        전문 변호사 찾기
      </h2>

      {lawyers.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "50px" }}>
          등록된 변호사가 없습니다.
        </p>
      ) : (
        <div style={gridStyle}>
          {lawyers.map((lawyer) => (
            <div
              key={lawyer.lawyerId}
              onClick={() => navigate(`/lawyer/detail.do/${lawyer.lawyerId}`)}
              style={cardStyle}
              onMouseOver={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              {/* 💡 프로필 이미지 추가 (savePath가 없으면 기본 이미지) */}
              <div style={imgContainerStyle}>
                <img
                  src={
                    lawyer.savePath
                      ? `http://localhost:8080${lawyer.savePath}`
                      : "/img/default_profile.png"
                  }
                  alt={lawyer.name}
                  style={imageStyle}
                  onError={(e) => (e.target.src = "/img/default_profile.png")} // 이미지 로드 실패 시 보정
                />
              </div>

              <div style={badgeStyle}>{lawyer.specialty}</div>

              {/* 💡 사무소명과 변호사 성함을 함께 노출 */}
              <h3 style={{ margin: "10px 0 5px 0" }}>{lawyer.name} 변호사</h3>
              <p
                style={{
                  margin: "0 0 10px 0",
                  color: "#2980b9",
                  fontWeight: "600",
                  fontSize: "0.85rem",
                }}
              >
                {lawyer.officeName}
              </p>

              <p style={introStyle}>{lawyer.intro}</p>

              {/* 💡 별점 및 후기 개수 추가 (평판 정보) */}
              <div style={ratingStyle}>
                ⭐ {lawyer.avgRating?.toFixed(1)} ({lawyer.reviewCnt}개의 후기)
              </div>

              <div style={priceStyle}>
                상담료: {lawyer.consultFee?.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// --- 스타일 컴포넌트 추가 및 수정 ---

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
  gap: "25px",
  marginTop: "20px",
};

const cardStyle = {
  border: "1px solid #eee",
  borderRadius: "16px",
  padding: "24px",
  cursor: "pointer",
  backgroundColor: "#fff",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  display: "flex",
  flexDirection: "column",
};

const imgContainerStyle = {
  width: "100%",
  height: "180px",
  borderRadius: "12px",
  overflow: "hidden",
  marginBottom: "15px",
  backgroundColor: "#f8f9fa",
};

const imageStyle = {
  width: "100%",
  height: "100%",
  objectFit: "cover", // 💡 비율 유지하면서 영역 꽉 채우기
};

const badgeStyle = {
  alignSelf: "flex-start",
  backgroundColor: "#e3f2fd",
  color: "#1976d2",
  padding: "4px 12px",
  borderRadius: "8px",
  fontSize: "0.75rem",
  fontWeight: "bold",
  marginBottom: "8px",
};

const introStyle = {
  color: "#666",
  fontSize: "0.9rem",
  lineHeight: "1.4",
  height: "40px",
  overflow: "hidden",
  textOverflow: "ellipsis", // 💡 긴 문장 말줄임표 처리
  display: "-webkit-box",
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical",
};

const ratingStyle = {
  fontSize: "0.85rem",
  color: "#f1c40f",
  marginTop: "10px",
  fontWeight: "600",
};

const priceStyle = {
  marginTop: "auto",
  paddingTop: "15px",
  fontWeight: "bold",
  color: "#d35400",
  fontSize: "1.1rem",
  borderTop: "1px solid #f5f5f5",
};

export default LawyerListPage;
