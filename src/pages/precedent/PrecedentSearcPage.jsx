import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import precedentApi from "../../api/precedentApi"; // API 모듈 임포트 확인 [cite: 2026-02-20]

const PrecedentSearchPage = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const data = await precedentApi.getPrecedentList();
        setList(data || []);
      } catch (err) {
        console.error("목록 로드 에러:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, []);

  if (loading)
    return (
      <div style={{ padding: "50px", textAlign: "center" }}>
        데이터 로딩 중...
      </div>
    );

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "0 auto" }}>
      <h1 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>
        판례 검색
      </h1>
      <div style={{ display: "grid", gap: "15px", marginTop: "20px" }}>
        {list.map((item) => (
          <div
            key={item.precId}
            onClick={() => navigate(`/precedent/detail.do/${item.precId}`)} // .do 유지 [cite: 2026-02-20]
            style={cardStyle}
          >
            <div style={{ marginBottom: "5px" }}>
              <span style={badgeStyle}>{item.caseType}</span>
              <small style={{ marginLeft: "10px", color: "#999" }}>
                {item.caseNo}
              </small>
            </div>
            <h3 style={{ margin: "5px 0" }}>{item.title}</h3>
            <p style={{ color: "#666", fontSize: "0.95rem" }}>{item.oneLine}</p>
            <div
              style={{ fontSize: "0.8rem", color: "#888", marginTop: "10px" }}
            >
              {item.court} | {item.judgeDate}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 스타일 상수
const cardStyle = {
  border: "1px solid #ddd",
  padding: "20px",
  borderRadius: "10px",
  cursor: "pointer",
  backgroundColor: "#fff",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
};

const badgeStyle = {
  backgroundColor: "#f0f7ff",
  color: "#007bff",
  padding: "2px 8px",
  borderRadius: "4px",
  fontSize: "0.8rem",
  fontWeight: "bold",
};

export default PrecedentSearchPage;
