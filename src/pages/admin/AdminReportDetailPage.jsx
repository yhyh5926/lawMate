// vs코드
// 파일 위치: src/pages/admin/AdminReportDetailPage.jsx
// 설명: 관리자 - 특정 신고의 상세 내용을 확인하고 제재(경고, 정지 등)를 집행하는 화면

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminApi } from "../../api/adminApi";

const AdminReportDetailPage = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [sanction, setSanction] = useState({ sanctionType: "WARNING", reason: "" });

  useEffect(() => {
    // 실제 API 호출 시뮬레이션
    setReport({
      reportId, reporterId: 10, targetType: "POST", targetId: 55,
      reason: "욕설 및 비방", detail: "게시글 내용에 심한 욕설이 포함되어 있습니다.",
      status: "PENDING", createdAt: "2026-02-27"
    });
  }, [reportId]);

  const handleSanctionSubmit = async (e) => {
    e.preventDefault();
    if (!sanction.reason) return alert("제재 상세 사유를 입력해주세요.");

    try {
      await adminApi.processSanction({ reportId, ...sanction });
      alert("해당 대상에 대한 제재 처리가 완료되었습니다.");
      navigate("/admin/report/list.do");
    } catch (error) {
      alert("제재 처리 중 오류가 발생했습니다.");
    }
  };

  if (!report) return <div style={{ padding: "50px", textAlign: "center" }}>데이터를 불러오는 중입니다...</div>;

  return (
    <div style={{ maxWidth: "800px", margin: "20px auto", padding: "20px" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "#007BFF", cursor: "pointer", marginBottom: "20px" }}>
        &larr; 목록으로 돌아가기
      </button>

      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>신고 상세 내용</h2>
      
      <div style={{ backgroundColor: "#f8f9fa", padding: "20px", borderRadius: "8px", marginBottom: "30px", fontSize: "15px", lineHeight: "1.6" }}>
        <p><strong>신고 번호:</strong> {report.reportId} &nbsp;&nbsp;|&nbsp;&nbsp; <strong>상태:</strong> <span style={{ color: "#dc3545", fontWeight: "bold" }}>{report.status}</span></p>
        <p><strong>대상 유형:</strong> {report.targetType} (ID: {report.targetId})</p>
        <p><strong>신고 사유:</strong> {report.reason}</p>
        <hr style={{ border: "0", borderTop: "1px solid #ddd", margin: "15px 0" }} />
        <p><strong>상세 내용:</strong></p>
        <p style={{ color: "#555" }}>{report.detail}</p>
      </div>

      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px", marginBottom: "20px" }}>관리자 제재 처리</h2>
      <form onSubmit={handleSanctionSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px", backgroundColor: "#fff5f5", padding: "20px", border: "1px solid #dc3545", borderRadius: "8px" }}>
        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>제재 조치 선택</label>
          <select 
            value={sanction.sanctionType} 
            onChange={(e) => setSanction({ ...sanction, sanctionType: e.target.value })}
            style={{ width: "200px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}
          >
            <option value="WARNING">경고 조치 (알림 발송)</option>
            <option value="SUSPEND">이용 정지 (7일)</option>
            <option value="FORCE_WITHDRAW">강제 탈퇴</option>
            <option value="DISMISS">무혐의 (반려)</option>
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontWeight: "bold", marginBottom: "8px" }}>제재 처리 메모 (사유)</label>
          <textarea 
            placeholder="제재 처리 사유를 상세히 기록해주세요."
            value={sanction.reason}
            onChange={(e) => setSanction({ ...sanction, reason: e.target.value })}
            style={{ width: "100%", height: "100px", padding: "12px", border: "1px solid #ccc", borderRadius: "4px", boxSizing: "border-box" }}
          />
        </div>

        <button type="submit" style={{ padding: "12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", marginTop: "10px" }}>
          제재 집행 및 신고 종결
        </button>
      </form>
    </div>
  );
};

export default AdminReportDetailPage;