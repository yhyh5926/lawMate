import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import precedentApi from "../../api/precedentApi";
import LegalTooltip from "./LegalTooltip"; // 💡 외부에서 임포트

const PrecedentSearchPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL에서 페이지 번호 추출 (기본값 1)
  const page = parseInt(searchParams.get("page") || "1", 10);

  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchList = async () => {
      try {
        setLoading(true);
        const data = await precedentApi.getPrecedentList(page);
        setList(data.list || []);
        setTotalPages(data.totalPages || 1);
      } catch (err) {
        console.error("목록 로드 에러:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchList();
  }, [page]);

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    window.scrollTo(0, 0);
  };

  if (loading) return <div style={loadingStyle}>데이터 로딩 중...</div>;

  return (
    <div style={containerStyle}>
      <h1 style={headerStyle}>판례 검색</h1>

      <div style={listGridStyle}>
        {list.length > 0 ? (
          list.map((item) => (
            <div
              key={item.precId}
              onClick={() => navigate(`/precedent/detail.do/${item.precId}`)}
              style={cardStyle}
            >
              <div style={{ marginBottom: "5px" }}>
                <span style={badgeStyle}>{item.caseType}</span>
                <small style={{ marginLeft: "10px", color: "#999" }}>
                  {item.caseNo}
                </small>
              </div>
              <h3 style={{ margin: "5px 0" }}>{item.title}</h3>
              <p style={{ color: "#666", fontSize: "0.95rem" }}>
                {/* 💡 분리된 툴팁 컴포넌트 사용 */}
                <LegalTooltip text={item.oneLine} />
              </p>
              <div style={footerInfoStyle}>
                {item.court} | {item.judgeDate}
              </div>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "50px" }}>
            데이터가 없습니다.
          </div>
        )}
      </div>

      <div style={paginationContainer}>
        <button
          disabled={page === 1}
          onClick={() => handlePageChange(page - 1)}
          style={pageBtnStyle}
        >
          이전
        </button>
        <span style={pageIndicator}>
          <strong>{page}</strong> / {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => handlePageChange(page + 1)}
          style={pageBtnStyle}
        >
          다음
        </button>
      </div>
    </div>
  );
};

// 스타일 가독성을 위해 하단 배치
const containerStyle = {
  padding: "20px",
  maxWidth: "1000px",
  margin: "0 auto",
};
const headerStyle = { borderBottom: "2px solid #333", paddingBottom: "10px" };
const listGridStyle = { display: "grid", gap: "15px", marginTop: "20px" };
const loadingStyle = { padding: "50px", textAlign: "center" };
const footerInfoStyle = {
  fontSize: "0.8rem",
  color: "#888",
  marginTop: "10px",
};
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
const paginationContainer = {
  marginTop: "40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "20px",
};
const pageBtnStyle = {
  padding: "8px 16px",
  border: "1px solid #ddd",
  borderRadius: "4px",
  backgroundColor: "#fff",
  cursor: "pointer",
};
const pageIndicator = { fontSize: "16px", color: "#333" };

export default PrecedentSearchPage;
