// src/pages/admin/AdminCaseListPage.jsx
// 설명: 관리자 - 플랫폼 내 전체 사건 목록 및 진행 상태 모니터링 화면
// 해결: 모듈 해석 오류를 방지하기 위해 임포트 경로의 확장자를 제거했습니다.

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminCaseListPage = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getCaseList();
      // 백엔드 응답 구조(data.data 또는 data)에 맞게 안전하게 처리
      setCases(response.data.data || response.data || []);
    } catch (error) {
      console.error("사건 목록 조회 실패", error);
      // 개발 및 테스트 환경을 위한 모의 데이터
      setCases([
        { caseId: 10, title: "손해배상 청구의 건", caseType: "민사", step: "IN_PROGRESS", createdAt: "2026-02-15" },
        { caseId: 11, title: "사기 피해 고소장 작성", caseType: "형사", step: "RECEIVED", createdAt: "2026-02-26" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b-2 border-gray-800 pb-4">전체 사건 모니터링</h2>
      
      {loading ? (
        <div className="py-20 text-center text-gray-500 font-medium">사건 데이터를 동기화 중입니다...</div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="p-4 font-bold text-gray-700">사건번호</th>
                <th className="p-4 font-bold text-gray-700">유형</th>
                <th className="p-4 font-bold text-left text-gray-700">사건제목</th>
                <th className="p-4 font-bold text-gray-700">진행단계</th>
                <th className="p-4 font-bold text-gray-700">접수일</th>
              </tr>
            </thead>
            <tbody>
              {cases.length > 0 ? (
                cases.map((c) => (
                  <tr key={c.caseId} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500">{c.caseId}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium border border-gray-200">
                        {c.caseType}
                      </span>
                    </td>
                    <td className="p-4 text-left font-medium text-gray-800">{c.title}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        c.step === 'RECEIVED' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'
                      }`}>
                        {c.step}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500">{c.createdAt?.split('T')[0]}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-20 text-gray-400 font-medium">등록된 사건 내역이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminCaseListPage;