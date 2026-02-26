import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminMemberListPage() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState({ memberType: '', status: '', search: '' });

  const fetchMembers = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:8080/api/admin/member/list', {
        params: filter,
        headers: { Authorization: `Bearer ${token}` }
      });
      setMembers(res.data.data.list); // 페이징 객체 가정
    } catch (error) {
      console.error('Failed to fetch members', error);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [filter.memberType, filter.status]); // 필터 변경 시 자동 갱신

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">회원 관리 (전체 목록)</h2>
      
      {/* 필터 영역 */}
      <div className="flex space-x-4 mb-6 bg-gray-50 p-4 rounded-md">
        <select className="border p-2 rounded" value={filter.memberType} onChange={(e) => setFilter({...filter, memberType: e.target.value})}>
          <option value="">유형 전체</option>
          <option value="PERSONAL">일반회원</option>
          <option value="LAWYER">전문회원</option>
        </select>
        <select className="border p-2 rounded" value={filter.status} onChange={(e) => setFilter({...filter, status: e.target.value})}>
          <option value="">상태 전체</option>
          <option value="ACTIVE">정상(ACTIVE)</option>
          <option value="SUSPENDED">정지(SUSPENDED)</option>
          <option value="WITHDRAWN">탈퇴(WITHDRAWN)</option>
        </select>
        <div className="flex-1 flex space-x-2">
          <input 
            type="text" placeholder="이름 또는 아이디 검색" 
            className="flex-1 border p-2 rounded"
            value={filter.search} onChange={(e) => setFilter({...filter, search: e.target.value})} 
            onKeyDown={(e) => e.key === 'Enter' && fetchMembers()}
          />
          <button onClick={fetchMembers} className="bg-gray-800 text-white px-4 rounded">검색</button>
        </div>
      </div>

      {/* 목록 테이블 */}
      <table className="w-full border-collapse border text-center">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">회원번호</th>
            <th className="border p-2">유형</th>
            <th className="border p-2">아이디</th>
            <th className="border p-2">이름</th>
            <th className="border p-2">휴대폰</th>
            <th className="border p-2">가입일</th>
            <th className="border p-2">상태</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? members.map(m => (
            <tr key={m.memberId} className="hover:bg-gray-50">
              <td className="border p-2">{m.memberId}</td>
              <td className="border p-2">{m.memberType === 'LAWYER' ? '전문' : '일반'}</td>
              <td className="border p-2">{m.loginId}</td>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.phone}</td>
              <td className="border p-2">{m.createdAt.substring(0, 10)}</td>
              <td className="border p-2">
                <span className={`px-2 py-1 text-xs rounded-full ${m.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {m.status}
                </span>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="7" className="border p-4 text-gray-500">회원 데이터가 없습니다.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}