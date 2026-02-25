import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import CaseStepBar from '../../components/case/CaseStepBar';

export default function CaseDetailPage() {
  const [searchParams] = useSearchParams();
  const caseId = searchParams.get('caseId');
  const navigate = useNavigate();
  const [caseDetail, setCaseDetail] = useState(null);

  useEffect(() => {
    const fetchCaseDetail = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get(`http://localhost:8080/api/mypage/case/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCaseDetail(res.data.data);
      } catch (error) {
        alert('사건 상세 정보를 불러오는데 실패했습니다.');
        navigate('/mypage/case/list.do');
      }
    };
    if (caseId) fetchCaseDetail();
  }, [caseId, navigate]);

  if (!caseDetail) return <div className="text-center mt-20">로딩중...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md mb-10">
      <h2 className="text-2xl font-bold mb-6">사건 상세 정보</h2>
      
      {/* 임시 스텝 UI (CaseStepBar 컴포넌트로 분리 가능) */}
      <div className="flex justify-between items-center mb-8 p-4 bg-gray-50 rounded-md">
        {['RECEIVED', 'ASSIGNED', 'IN_PROGRESS', 'OPINION_READY', 'CLOSED'].map((step, idx) => (
          <div key={step} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${caseDetail.step === step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {idx + 1}
            </div>
            <span className="text-xs mt-2 text-gray-600">
              {step === 'RECEIVED' ? '접수완료' : step === 'ASSIGNED' ? '배정완료' : step === 'IN_PROGRESS' ? '진행중' : step === 'OPINION_READY' ? '의견완료' : '종료'}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-b py-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500">사건번호: {caseDetail.caseId}</span>
          <span className="text-sm font-semibold text-blue-600">{caseDetail.caseType}</span>
        </div>
        <h3 className="text-xl font-bold mb-4">{caseDetail.title}</h3>
        <div className="whitespace-pre-wrap text-gray-700 min-h-[150px] bg-gray-50 p-4 rounded-md">
          {caseDetail.description}
        </div>
      </div>

      {caseDetail.expertOpinion && (
        <div className="mb-6">
          <h4 className="text-lg font-bold mb-2 text-indigo-700">전문가 의견서</h4>
          <div className="border border-indigo-200 bg-indigo-50 p-4 rounded-md whitespace-pre-wrap text-sm text-gray-800">
            {caseDetail.expertOpinion}
          </div>
        </div>
      )}

      <div className="flex justify-center">
        <button onClick={() => navigate('/mypage/case/list.do')} className="px-6 py-2 bg-gray-800 text-white rounded-md">
          목록으로
        </button>
      </div>
    </div>
  );
}