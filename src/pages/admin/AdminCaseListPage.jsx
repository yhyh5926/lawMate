// vs코드
// 파일 위치: src/pages/admin/AdminCaseListPage.jsx
// 설명: 관리자 - 플랫폼 내 전체 사건 목록 및 진행 상태 모니터링 화면

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminCaseListPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const response = await adminApi.getCaseList();
      setCases(response.data.data || []);
    } catch (error) {
      console.error("사건 목록 조회 실패", error);
      // 모의 데이터
      setCases([
        { caseId: 10, title: "손해배상 청구의 건", caseType: "민사", step: "IN_PROGRESS", createdAt: "2026-02-15" },
        { caseId: 11, title: "사기 피해 고소장 작성", caseType: "형사", step: "RECEIVED", createdAt: "2026-02-26" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>전체 사건 모니터링</h2>
      
      {loading ? (
        <div style={{ padding: "50px", textAlign: "center" }}>데이터를 불러오는 중입니다...</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={thStyle}>사건번호</th>
              <th style={thStyle}>유형</th>
              <th style={thStyle}>사건제목</th>
              <th style={thStyle}>진행단계</th>
              <th style={thStyle}>접수일</th>
            </tr>
          </thead>
          <tbody>
            {cases.map((c) => (
              <tr key={c.caseId} style={{ borderBottom: "1px solid #eee", textAlign: "center" }}>
                <td style={tdStyle}>{c.caseId}</td>
                <td style={tdStyle}>{c.caseType}</td>
                <td style={{ ...tdStyle, textAlign: "left" }}>{c.title}</td>
                <td style={tdStyle}>
                  <span style={{ padding: "4px 8px", backgroundColor: "#e9ecef", borderRadius: "4px", fontSize: "12px", fontWeight: "bold" }}>
                    {c.step}
                  </span>
                </td>
                <td style={tdStyle}>{c.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px" };
const thStyle = { padding: "12px", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "12px" };

export default AdminCaseListPage;