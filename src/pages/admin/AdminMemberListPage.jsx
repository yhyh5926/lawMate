// vs코드
// 파일 위치: src/pages/admin/AdminMemberListPage.jsx
// 설명: 관리자 - 전체 회원 목록 조회 및 상태 관리 화면

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminMemberListPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await adminApi.getMemberList();
      setMembers(response.data.data || []);
    } catch (error) {
      console.error("회원 목록 조회 실패", error);
      // 테스트용 모의 데이터
      setMembers([
        { memberId: 1, loginId: "user01", name: "홍길동", memberType: "PERSONAL", status: "ACTIVE", createdAt: "2026-01-10" },
        { memberId: 2, loginId: "lawyer01", name: "김변호", memberType: "LAWYER", status: "ACTIVE", createdAt: "2026-01-15" },
        { memberId: 3, loginId: "baduser", name: "이진상", memberType: "PERSONAL", status: "WITHDRAWN", createdAt: "2026-02-01" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ borderBottom: "2px solid #333", paddingBottom: "10px" }}>회원 관리</h2>
      
      {loading ? (
        <div style={{ padding: "50px", textAlign: "center" }}>데이터를 불러오는 중입니다...</div>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={{ backgroundColor: "#f8f9fa" }}>
              <th style={thStyle}>회원번호</th>
              <th style={thStyle}>유형</th>
              <th style={thStyle}>아이디</th>
              <th style={thStyle}>이름</th>
              <th style={thStyle}>가입일</th>
              <th style={thStyle}>상태</th>
              <th style={thStyle}>관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.memberId} style={{ borderBottom: "1px solid #eee", textAlign: "center" }}>
                <td style={tdStyle}>{m.memberId}</td>
                <td style={tdStyle}>{m.memberType === 'LAWYER' ? '👨‍⚖️ 전문' : '👤 일반'}</td>
                <td style={tdStyle}>{m.loginId}</td>
                <td style={tdStyle}>{m.name}</td>
                <td style={tdStyle}>{m.createdAt}</td>
                <td style={{ ...tdStyle, color: m.status === 'ACTIVE' ? 'green' : 'red', fontWeight: 'bold' }}>
                  {m.status === 'ACTIVE' ? '정상' : '탈퇴/정지'}
                </td>
                <td style={tdStyle}>
                  <button style={{ padding: "4px 8px", fontSize: "12px", cursor: "pointer" }}>상세보기</button>
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

export default AdminMemberListPage;