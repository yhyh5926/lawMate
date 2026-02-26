import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
// import StatusBadge from '../../components/common/StatusBadge';

export default function CaseListPage() {
  const [caseList, setCaseList] = useState([]);

  useEffect(() => {
    const fetchMyCases = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const res = await axios.get('http://localhost:8080/api/mypage/case/list', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCaseList(res.data.data.list || []);
      } catch (error) {
        console.error('사건 목록 로딩 실패', error);
      }
    };
    fetchMyCases();
  }, []);

  // 진행 단계별 배지 색상 변환 함수
  const getStepBadge = (step) => {
    switch(step) {
      case 'RECEIVED': return <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm">접수완료</span>;
      case 'ASSIGNED': return <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded text-sm">배정완료</span>;
      case 'IN_PROGRESS': return <span className="px-2 py-1 bg-yellow-100 text-yellow-600 rounded text-sm">진행중</span>;
      case 'OPINION_READY': return <span className="px-2 py-1 bg-green-100 text-green-600 rounded text-sm">의견완료</span>;
      case 'CLOSED': return <span className="px-2 py-1 bg-gray-300 text-gray-800 rounded text-sm">종료</span>;
      default: return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-bold mb-6">나의 사건 목록</h2>
      
      <div className="space-y-4">
        {caseList.length > 0 ? caseList.map(item => (
          <div key={item.caseId} className="border p-4 rounded-md hover:shadow-lg transition flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-500 mb-1">
                사건번호: {item.caseId} | {item.caseType}
              </div>
              <Link to={`/mypage/case/detail.do?caseId=${item.caseId}`} className="text-lg font-semibold hover:text-blue-600">
                {item.title}
              </Link>
              <div className="text-sm text-gray-400 mt-2">
                접수일: {item.createdAt?.substring(0, 10)}
              </div>
            </div>
            <div>
              {getStepBadge(item.step)}
            </div>
          </div>
        )) : (
          <div className="text-center py-10 text-gray-500">
            접수된 사건이 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}