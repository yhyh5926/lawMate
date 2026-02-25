import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LawyerJoinCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-md rounded-md text-center">
      <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl font-bold">
        ✓
      </div>
      <h2 className="text-2xl font-bold mb-4">전문회원 가입 신청 완료</h2>
      <div className="bg-gray-50 p-4 rounded-md mb-8 text-sm text-gray-700 leading-relaxed text-left border">
        <p className="font-semibold text-indigo-700 mb-2">현재 관리자 승인 대기 중입니다.</p>
        <ul className="list-disc list-inside space-y-1">
          <li>제출해주신 자격 정보를 바탕으로 승인 심사가 진행됩니다.</li>
          <li>영업일 기준 1~2일 내에 완료되며, 결과는 알림 및 이메일로 안내됩니다.</li>
          <li>승인 완료 후 정상적으로 전문가 서비스 이용이 가능합니다.</li>
        </ul>
      </div>
      
      <button 
        onClick={() => navigate('/main.do')} 
        className="w-full bg-gray-800 text-white py-3 rounded-md font-bold hover:bg-black transition"
      >
        메인으로 이동
      </button>
    </div>
  );
}