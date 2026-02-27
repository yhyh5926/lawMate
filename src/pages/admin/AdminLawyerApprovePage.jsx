// src/pages/admin/AdminLawyerApprovePage.jsx
// 설명: 관리자 - 전문회원(변호사) 가입 승인 대기 목록 및 처리 화면입니다.
// 해결: 컴파일러의 경로 해석 오류를 방지하기 위해 adminApi 임포트 경로의 확장자를 제거했습니다.

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const AdminLawyerApprovePage = () => {
  const [lawyers, setLawyers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPendingLawyers();
  }, []);

  // 승인 대기 중인 변호사 목록을 서버에서 불러오는 함수
  const fetchPendingLawyers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getPendingLawyers();
      // 백엔드 응답 구조(data.data 또는 data)에 맞게 안전하게 처리
      setLawyers(response.data.data || response.data || []);
    } catch (error) {
      console.error("승인 대기 목록 조회 실패", error);
      // 개발 단계 확인용 모의 데이터 (실제 운영 시에는 제거 가능)
      if (process.env.NODE_ENV === 'development') {
        setLawyers([
          { lawyerId: 101, memberId: 4, name: "박변호", licenseNo: "12345-6789", officeName: "법무법인 정의", specialty: "형사, 이혼", createdAt: "2026-02-27T10:00:00" }
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  // 승인 또는 반려 처리를 담당하는 함수
  const handleApprove = async (lawyerId, status) => {
    const action = status === 'APPROVED' ? '승인' : '반려';
    if (!window.confirm(`해당 전문회원 가입을 ${action} 처리하시겠습니까?`)) return;
    
    try {
      // adminApi를 통해 처리 요청 (lawyerId와 상태값 전달)
      await adminApi.approveLawyer({ lawyerId, approveStatus: status });
      alert(`${action} 처리가 완료되었습니다.`);
      fetchPendingLawyers(); // 처리 후 목록 새로고침
    } catch (error) {
      alert("처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-8 border-b-2 border-gray-800 pb-4">전문회원 가입 승인</h2>
      
      {loading ? (
        <div className="py-20 text-center text-gray-500 font-medium">승인 대기 목록을 불러오는 중입니다...</div>
      ) : lawyers.length === 0 ? (
        <div className="py-20 text-center bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-medium">
          현재 승인 대기 중인 전문회원이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lawyers.map((l) => (
            <div key={l.lawyerId} className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl" role="img" aria-label="lawyer">👨‍⚖️</span>
                  <h3 className="text-lg font-bold text-gray-900">{l.name} 변호사</h3>
                  <span className="ml-auto text-xs text-gray-400">신청일: {l.createdAt?.split('T')[0]}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>자격번호:</strong> <span className="text-blue-600 font-mono">{l.licenseNo}</span></p>
                  <p><strong>소속:</strong> {l.officeName}</p>
                  <p><strong>전문분야:</strong> {l.specialty}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleApprove(l.lawyerId, 'REJECTED')} 
                  className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors"
                >
                  반려
                </button>
                <button 
                  onClick={() => handleApprove(l.lawyerId, 'APPROVED')} 
                  className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors"
                >
                  승인 완료
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminLawyerApprovePage;