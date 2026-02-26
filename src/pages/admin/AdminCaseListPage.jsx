import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminCaseListPage() {
  const [cases, setCases] = useState([]);
  const [filter, setFilter] = useState({ step: '', caseType: '' });

  const fetchCases = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:8080/api/admin/case/list', {
        params: filter,
        headers: { Authorization: `Bearer ${token}` }
      });
      setCases(res.data.data.list || []);
    } catch (error) {
      console.error('사건 목록 조회 실패', error);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [filter.step, filter.caseType]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">전체 사건 관리</h2>
      
      <div className="flex space-x-4 mb-6 bg-gray-50 p-4 rounded-md">
        <select className="border p-2 rounded" value={filter.step} onChange={(e) => setFilter({...filter, step: e.target.value})}>
          <option value="">진행 단계 전체</option>
          <option value="RECEIVED">접수완료</option>
          <option value="ASSIGNED">배정완료</option>
          <option value="IN_PROGRESS">진행중</option>
          <option value="CLOSED">종료됨</option>
        </select>
        <select className="border p-2 rounded" value={filter.caseType} onChange={(e) => setFilter({...filter, caseType: e.target.value})}>
          <option value="">사건 유형 전체</option>
          <option value="CIVIL">민사</option>
          <option value="CRIMINAL">형사</option>
          <option value="FAMILY">가사</option>
        </select>
      </div>

      <table className="w-full border-collapse border text-center text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">사건번호</th>
            <th className="border p-2">유형</th>
            <th className="border p-2">제목</th>
            <th className="border p-2">의뢰인(ID)</th>
            <th className="border p-2">담당변호사</th>
            <th className="border p-2">진행단계</th>
            <th className="border p-2">접수일</th>
          </tr>
        </thead>
        <tbody>
          {cases.map(c => (
            <tr key={c.caseId} className="hover:bg-gray-50">
              <td className="border p-2">{c.caseId}</td>
              <td className="border p-2">{c.caseType}</td>
              <td className="border p-2 text-left truncate max-w-xs">{c.title}</td>
              <td className="border p-2">{c.memberName}</td>
              <td className="border p-2">{c.lawyerName || '미배정'}</td>
              <td className="border p-2 font-semibold">{c.step}</td>
              <td className="border p-2">{c.createdAt?.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}