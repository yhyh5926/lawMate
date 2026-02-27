// src/pages/admin/AdminMemberListPage.jsx
// 설명: 관리자 - 전체 회원 목록 조회 및 상태 관리 화면
// 은혁님 파트: 회원 유형 및 상태에 따른 필터링 기능을 포함합니다.

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminMemberListPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ type: "ALL", status: "ALL" });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getMemberList();
      // 백엔드 응답 구조에 맞춰 데이터 추출
      setMembers(response.data.data || response.data || []);
    } catch (error) {
      console.error("회원 목록 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredMembers = members.filter(m => {
    const typeMatch = filter.type === "ALL" || m.memberType === filter.type;
    const statusMatch = filter.status === "ALL" || m.status === filter.status;
    return typeMatch && statusMatch;
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8 border-b-2 border-gray-800 pb-4">
        <h2 className="text-2xl font-bold text-gray-800">회원 관리</h2>
        <div className="flex gap-4">
          <select 
            className="border p-2 rounded text-sm bg-white"
            value={filter.type}
            onChange={(e) => setFilter({...filter, type: e.target.value})}
          >
            <option value="ALL">전체 유형</option>
            <option value="PERSONAL">일반 회원</option>
            <option value="LAWYER">전문 회원</option>
          </select>
          <select 
            className="border p-2 rounded text-sm bg-white"
            value={filter.status}
            onChange={(e) => setFilter({...filter, status: e.target.value})}
          >
            <option value="ALL">전체 상태</option>
            <option value="ACTIVE">정상</option>
            <option value="WITHDRAWN">탈퇴/정지</option>
          </select>
          <button onClick={fetchMembers} className="px-4 py-2 bg-gray-100 rounded text-sm hover:bg-gray-200">새로고침</button>
        </div>
      </div>
      
      {loading ? (
        <div className="py-20 text-center text-gray-500">데이터를 불러오는 중입니다...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm text-center border-collapse">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 font-bold">회원번호</th>
                <th className="p-4 font-bold">유형</th>
                <th className="p-4 font-bold">아이디</th>
                <th className="p-4 font-bold">이름</th>
                <th className="p-4 font-bold">가입일</th>
                <th className="p-4 font-bold">상태</th>
                <th className="p-4 font-bold">관리</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.memberId} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-gray-500">{m.memberId}</td>
                  <td className="p-4">
                    {m.memberType === 'LAWYER' ? (
                      <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-bold">👨‍⚖️ 전문</span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-bold">👤 일반</span>
                    )}
                  </td>
                  <td className="p-4 font-medium">{m.loginId}</td>
                  <td className="p-4">{m.name}</td>
                  <td className="p-4 text-gray-500">{m.createdAt?.split('T')[0]}</td>
                  <td className="p-4">
                    <span className={`font-bold ${m.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>
                      {m.status === 'ACTIVE' ? '정상' : '탈퇴/정지'}
                    </span>
                  </td>
                  <td className="p-4">
                    <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 transition-colors">상세보기</button>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-10 text-gray-400">조회된 회원이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
const tableStyle = { width: "100%", borderCollapse: "collapse", marginTop: "20px" };
const thStyle = { padding: "12px", borderBottom: "2px solid #ddd" };
const tdStyle = { padding: "12px" };

export default AdminMemberListPage;