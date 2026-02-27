import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import precedentApi from "../../api/precedentApi";
import LegalTooltip from "./LegalTooltip"; // 💡 공통 툴팁 컴포넌트 임포트

const PrecedentDetailPage = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const result = await precedentApi.getPrecedentDetail(id);
        setData(result);
      } catch (err) {
        console.error("상세 정보 로드 에러:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDetail();
  }, [id]);

  if (loading) return <div style={msgStyle}>상세 정보 로딩 중...</div>;
  if (!data) return <div style={msgStyle}>데이터를 찾을 수 없습니다.</div>;

  return (
    <div style={containerStyle}>
      <button onClick={() => navigate(-1)} style={backBtnStyle}>
        ← 뒤로가기
      </button>

      <header>
        <div style={{ color: "#007bff", fontWeight: "bold" }}>
          {data.caseType} · {data.judgment}
        </div>
        <h1 style={{ fontSize: "2rem", margin: "10px 0" }}>{data.title}</h1>
        {/* 💡 한 줄 요약에 툴팁 적용 */}
        <p style={{ color: "#666", fontSize: "1.1rem" }}>
          <LegalTooltip text={data.oneLine} />
        </p>
        <hr style={{ margin: "20px 0", border: "0.5px solid #eee" }} />
      </header>

      {/* AI 요약 정보 섹션 */}
      {data.aiSummary && (
        <section style={aiSectionStyle}>
          <h2 style={aiTitleStyle}>AI 사건 요약</h2>

          <div style={{ marginTop: "20px" }}>
            <h4 style={{ color: "#555" }}>📝 사건의 시작</h4>
            <p>
              <LegalTooltip text={data.aiSummary.story?.start} />
            </p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h4 style={{ color: "#555" }}>⚖️ 핵심 쟁점</h4>
            <p>
              <LegalTooltip text={data.aiSummary.story?.issue} />
            </p>
          </div>

          <div style={{ marginTop: "20px" }}>
            <h4 style={{ color: "#555" }}>🏛️ 법원의 판단 로직</h4>
            <ul style={{ paddingLeft: "20px" }}>
              {data.aiSummary.logic?.map((text, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>
                  <LegalTooltip text={text} />
                </li>
              ))}
            </ul>
          </div>

          <div style={tipBoxStyle}>
            <strong>💡 전문가의 한 줄 팁:</strong>{" "}
            <LegalTooltip text={data.aiSummary.tip} />
          </div>
        </section>
      )}

      <footer style={footerStyle}>
        <p>
          사건번호: {data.caseNo} | 법원: {data.court}
        </p>
        <p>선고일자: {data.judgeDate}</p>
        <p>키워드: {data.keywordCsv}</p>
      </footer>
    </div>
  );
};

// --- 스타일 객체 ---
const containerStyle = {
  padding: "30px",
  maxWidth: "800px",
  margin: "0 auto",
  lineHeight: "1.6",
};
const msgStyle = { textAlign: "center", padding: "50px" };
const backBtnStyle = {
  marginBottom: "20px",
  padding: "8px 16px",
  cursor: "pointer",
  border: "1px solid #ddd",
  borderRadius: "5px",
  backgroundColor: "#fff",
};
const aiSectionStyle = {
  backgroundColor: "#f8f9fa",
  padding: "25px",
  borderRadius: "15px",
};
const aiTitleStyle = {
  color: "#333",
  borderLeft: "4px solid #007bff",
  paddingLeft: "10px",
};
const tipBoxStyle = {
  marginTop: "20px",
  padding: "15px",
  backgroundColor: "#fff3cd",
  borderRadius: "8px",
};
const footerStyle = {
  marginTop: "40px",
  paddingTop: "20px",
  borderTop: "1px solid #eee",
  color: "#888",
  fontSize: "0.9rem",
};

export default PrecedentDetailPage;
