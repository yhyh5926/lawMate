import React, { useEffect, useState } from "react";
import { authApi } from "../../api/auth_api";
import "../../styles/auth/Admin.css"; // [CSS 분리 적용]

const AdminPage = () => {
  const [pendingLawyers, setPendingLawyers] = useState([]);
  const [reports, setReports] = useState([]);

  const loadData = async () => {
    setPendingLawyers(await authApi.getPendingLawyers());
    setReports(await authApi.getReports());
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm("승인하시겠습니까?")) {
      await authApi.approveLawyer(id);
      loadData();
    }
  };
  const handleBan = async (id) => {
    if (window.confirm("정지하시겠습니까?")) {
      await authApi.banUser(id);
      loadData();
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h2 className="admin-title">🛡️ 관리자 대시보드</h2>
        <p style={{ color: "#64748b" }}>
          사이트의 회원과 신고 내용을 관리합니다.
        </p>
      </div>

      <div className="section-title">⚖️ 변호사 가입 승인 대기</div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>이름</th>
            <th>자격증명</th>
            <th>학력</th>
            <th>증빙</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {pendingLawyers.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", color: "#94a3b8" }}>
                대기 중인 요청이 없습니다.
              </td>
            </tr>
          ) : (
            pendingLawyers.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.licenseName}</td>
                <td>{u.education}</td>
                <td>
                  <button
                    className="admin-btn"
                    style={{ background: "#64748b" }}
                  >
                    이미지
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => handleApprove(u.id)}
                    className="admin-btn btn-approve"
                  >
                    승인
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="section-title">🚨 신고 및 제재 관리</div>
      <table className="admin-table">
        <thead>
          <tr>
            <th>신고대상</th>
            <th>사유</th>
            <th>상태</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r.id}>
              <td>{r.targetUser}</td>
              <td>{r.reason}</td>
              <td>
                <span
                  className={`badge ${r.status === "대기" ? "pending" : "approved"}`}
                >
                  {r.status}
                </span>
              </td>
              <td>
                <button
                  onClick={() => handleBan(r.targetUser)}
                  className="admin-btn btn-ban"
                >
                  계정 정지
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPage;
