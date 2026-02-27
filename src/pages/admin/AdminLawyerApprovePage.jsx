// vs코드
// 파일 위치: src/pages/admin/AdminLawyerApprovePage.jsx
// 설명: 관리자 - 전문회원(변호사) 가입 승인 대기 목록 및 처리 화면

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminLawyerApprovePage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  const fetchPendingLawyers = async () => {
    try {
      const response = await adminApi.getPendingLawyers();
      setLawyers(response.data.data || []);
    } catch (error) {
      console.error("승인 대기 목록 조회 실패", error);
      // 테스트용 모의 데이터
      setLawyers([
        { lawyerId: 101, memberId: 4, name: "박변호", licenseNo: "12345-6789", officeName: "법무법인 정의", specialty: "형사, 이혼", createdAt: "2026-02-27" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (lawyerId, status) => {
    if (!window.confirm(`해당 전문회원 가입을 ${status === 'APPROVED' ? '승인' : '반려'} 처리하시겠습니까?`)) return;
    
    try {
      await adminApi.approveLawyer({ lawyerId, approveStatus: status });
      alert("처리가 완료되었습니다.");
      fetchPendingLawyers(); // 목록 새로고침
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>전문회원 가입 승인</h2>
      
      {loading ? (
        <div style={{ padding: "50px", textAlign: "center" }}>데이터를 불러오는 중입니다...</div>
      ) : lawyers.length === 0 ? (
        <div style={{ padding: "50px", textAlign: "center", color: "#666", backgroundColor: "#f8f9fa", borderRadius: "8px" }}>
          현재 승인 대기 중인 전문회원이 없습니다.
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px", marginTop: "20px" }}>
          {lawyers.map((l) => (
            <div key={l.lawyerId} style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 10px 0" }}>{l.name} 변호사</h3>
                <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}><strong>자격번호:</strong> {l.licenseNo} &nbsp;|&nbsp; <strong>소속:</strong> {l.officeName}</p>
                <p style={{ margin: "5px 0", fontSize: "14px", color: "#555" }}><strong>전문분야:</strong> {l.specialty}</p>
                <p style={{ margin: "5px 0", fontSize: "12px", color: "#999" }}>신청일: {l.createdAt}</p>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button onClick={() => handleApprove(l.lawyerId, 'REJECTED')} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>반려</button>
                <button onClick={() => handleApprove(l.lawyerId, 'APPROVED')} style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>승인</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLawyerApprovePage;