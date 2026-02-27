// src/pages/admin/AdminReportListPage.jsx
// 설명: 관리자 - 사용자들이 접수한 신고 목록 조회 화면
// 수정 사항: 모듈 경로 해석 오류를 방지하기 위해 임포트 경로의 확장자를 제거했습니다.

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
    setLoading(true);
    try {
      const response = await adminApi.getReportList();
      // 백엔드 API 응답 구조에 맞춰 데이터 추출 (data.data 또는 data)
      setReports(response.data?.data || response.data || []);
    } catch (error) {
      console.error("신고 목록 조회 실패", error);
      // API 호출 실패 시에도 빈 배열로 초기화하여 렌더링 에러 방지
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b-2 border-gray-800 pb-4">신고 접수 목록</h2>
      
      {loading ? (
        <div className="py-20 text-center text-gray-500 font-medium">신고 내역을 집계 중입니다...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-700">번호</th>
                <th className="p-4 font-bold text-gray-700">대상유형</th>
                <th className="p-4 font-bold text-left text-gray-700">신고사유</th>
                <th className="p-4 font-bold text-gray-700">처리상태</th>
                <th className="p-4 font-bold text-gray-700">접수일</th>
                <th className="p-4 font-bold text-gray-700">관리</th>
              </tr>
            </thead>
            <tbody>
              {reports.length > 0 ? (
                reports.map((r) => (
                  <tr key={r.reportId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500">{r.reportId}</td>
                    <td className="p-4 font-semibold text-gray-800">{r.targetType}</td>
                    <td className="p-4 text-left text-gray-700">{r.reason}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        r.status === 'PENDING' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {r.status === 'PENDING' ? '🔴 미처리' : '🟢 처리완료'}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {r.createdAt ? r.createdAt.split('T')[0] : '-'}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => navigate(`/admin/report/detail.do/${r.reportId}`)}
                        className="px-4 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-black transition-colors font-bold"
                      >
                        상세 및 제재
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-20 text-gray-400 font-medium">접수된 신고 건이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReportListPage;