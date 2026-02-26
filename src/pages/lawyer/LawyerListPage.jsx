import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import lawyerApi from "../../api/lawyerApi";

const LawyerListPage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    // 💡 async/await 패턴으로 깔끔하게 비동기 처리
    const fetchLawyers = async () => {
      try {
        setLoading(true);
        const data = await lawyerApi.getAllLawyers();
        setLawyers(data);
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
              <div style={badgeStyle}>{lawyer.specialty}</div>
              <h3 style={{ margin: "10px 0" }}>{lawyer.officeName}</h3>
              <p
                style={{
                  color: "#666",
                  fontSize: "0.9rem",
                  height: "40px",
                  overflow: "hidden",
                }}
              >
                {lawyer.intro}
              </p>
              <div style={priceStyle}>
                상담료: {lawyer.consultFee?.toLocaleString()}원
              </div>
              <div style={addrStyle}>📍 {lawyer.officeAddr}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 스타일 컴포넌트화 (가독성을 위해 분리)
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
  gap: "20px",
  marginTop: "20px",
};

const cardStyle = {
  border: "1px solid #ddd",
  borderRadius: "12px",
  padding: "20px",
  cursor: "pointer",
  backgroundColor: "#fff",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 6px rgba(0,0,0,0.05)",
};

const badgeStyle = {
  display: "inline-block",
  backgroundColor: "#ebf5ff",
  color: "#007bff",
  padding: "4px 12px",
  borderRadius: "20px",
  fontSize: "0.75rem",
  fontWeight: "bold",
};

const priceStyle = {
  marginTop: "15px",
  fontWeight: "bold",
  color: "#e67e22",
};

const addrStyle = {
  fontSize: "0.8rem",
  color: "#95a5a6",
  marginTop: "10px",
};

export default LawyerListPage;
