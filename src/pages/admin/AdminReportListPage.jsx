import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function AdminReportListPage() {
  const [reports, setReports] = useState([]);
  const [filter, setFilter] = useState({ targetType: '', status: '' });

  const fetchReports = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const res = await axios.get('http://localhost:8080/api/admin/report/list', {
        params: filter,
        headers: { Authorization: `Bearer ${token}` }
      });
      setReports(res.data.data.list || []);
    } catch (error) {
      console.error('신고 목록 로딩 실패', error);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [filter.targetType, filter.status]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">신고/제재 관리</h2>

      <div className="flex space-x-4 mb-6 bg-gray-50 p-4 rounded-md">
        <select className="border p-2 rounded" value={filter.targetType} onChange={(e) => setFilter({...filter, targetType: e.target.value})}>
          <option value="">신고 대상 전체</option>
          <option value="MEMBER">회원</option>
          <option value="POST">게시글</option>
          <option value="COMMENT">댓글</option>
          <option value="REVIEW">후기</option>
        </select>
        <select className="border p-2 rounded" value={filter.status} onChange={(e) => setFilter({...filter, status: e.target.value})}>
          <option value="">처리 상태 전체</option>
          <option value="PENDING">대기중</option>
          <option value="RESOLVED">처리완료</option>
          <option value="DISMISSED">기각/반려</option>
        </select>
      </div>

      <table className="w-full border-collapse border text-center text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">신고번호</th>
            <th className="border p-2">대상 유형</th>
            <th className="border p-2">신고사유</th>
            <th className="border p-2">신고자</th>
            <th className="border p-2">접수일</th>
            <th className="border p-2">상태</th>
            <th className="border p-2">관리</th>
          </tr>
        </thead>
        <tbody>
          {reports.length > 0 ? reports.map(r => (
            <tr key={r.reportId} className="hover:bg-gray-50">
              <td className="border p-2">{r.reportId}</td>
              <td className="border p-2">{r.targetType} (ID: {r.targetId})</td>
              <td className="border p-2">{r.reason}</td>
              <td className="border p-2">{r.reporterId}</td>
              <td className="border p-2">{r.createdAt?.substring(0, 10)}</td>
              <td className="border p-2 text-red-600 font-bold">{r.status}</td>
              <td className="border p-2">
                <Link to={`/admin/report/detail.do?reportId=${r.reportId}`} className="bg-gray-800 text-white px-3 py-1 rounded text-xs">
                  상세/처리
                </Link>
              </td>
            </tr>
          )) : (
            <tr><td colSpan="7" className="border p-4 text-gray-500">조회된 신고 내역이 없습니다.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}