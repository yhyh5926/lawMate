// vs코드
// 파일 위치: src/pages/admin/AdminReportListPage.jsx
// 설명: 관리자 - 사용자들이 접수한 신고 목록 조회 화면

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminApi";

const AdminReportListPage = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await adminApi.getReportList();
      setReports(response.data.data || []);
    } catch (error) {
      console.error("신고 목록 조회 실패", error);
      // 모의 데이터
      setReports([
        { reportId: 1, targetType: "POST", reason: "욕설 및 비방", status: "PENDING", createdAt: "2026-02-27" },
        { reportId: 2, targetType: "REVIEW", reason: "허위 사실 유포", status: "RESOLVED", createdAt: "2026-02-25" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>신고 접수 목록</h2>
      
      {loading ? (
        <div style={{ padding: "50px", textAlign: "center" }}>데이터를 불러오는 중입니다...</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={thStyle}>신고번호</th>
              <th style={thStyle}>대상유형</th>
              <th style={thStyle}>신고사유</th>
              <th style={thStyle}>처리상태</th>
              <th style={thStyle}>접수일</th>
              <th style={thStyle}>관리</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.reportId} style={{ borderBottom: "1px solid #eee", textAlign: "center" }}>
                <td style={tdStyle}>{r.reportId}</td>
                <td style={tdStyle}>{r.targetType}</td>
                <td style={{ ...tdStyle, textAlign: "left" }}>{r.reason}</td>
                <td style={{ ...tdStyle, color: r.status === 'PENDING' ? '#dc3545' : '#28a745', fontWeight: 'bold' }}>
                  {r.status === 'PENDING' ? '미처리' : '처리완료'}
                </td>
                <td style={tdStyle}>{r.createdAt}</td>
                <td style={tdStyle}>
                  <button 
                    onClick={() => navigate(`/admin/report/detail.do/${r.reportId}`)}
                    style={{ padding: "4px 8px", fontSize: "12px", cursor: "pointer", backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "4px" }}
                  >
                    상세 및 제재
                  </button>
                </td>
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

export default AdminReportListPage;