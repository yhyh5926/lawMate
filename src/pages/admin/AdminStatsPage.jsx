// src/pages/admin/AdminStatsPage.jsx
// 설명: 관리자 - 플랫폼 가입 및 사건 접수 지표를 시각화하여 확인하는 화면
// 수정: 모듈 해석 오류 해결을 위해 임포트 경로의 확장자를 제거했습니다.

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

// 내부 차트 컴포넌트 (은혁님 요청사항 반영)
const StatsLineChart = ({ data, title }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col h-full">
      <h3 className="text-lg font-bold mb-8 text-gray-800">{title}</h3>
      <div className="flex items-end justify-between h-56 gap-4 px-4">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 group">
            <div 
              className="w-full bg-blue-500 rounded-t-lg transition-all duration-300 group-hover:bg-blue-600 relative"
              style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: '8px' }}
            >
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1.5 px-3 rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {item.count}건
              </div>
            </div>
            <span className="text-[11px] text-gray-400 mt-4 font-medium">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminStatsPage = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({ users: [], cases: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        setStatsData(response.data);
      } catch (error) {
        console.error("통계 로드 실패", error);
        // 기본 모의 데이터
        setStatsData({
          users: [{date:"02-23",count:10},{date:"02-24",count:25},{date:"02-25",count:15},{date:"02-26",count:40},{date:"02-27",count:62}],
          cases: [{date:"02-23",count:5},{date:"02-24",count:12},{date:"02-25",count:8},{date:"02-26",count:15},{date:"02-27",count:30}]
        });
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="p-10 max-w-6xl mx-auto">
      <h2 className="text-3xl font-black text-gray-900 mb-10 pb-4 border-b-4 border-gray-900 inline-block">플랫폼 인사이트</h2>
      
      {loading ? (
        <div className="py-24 text-center text-gray-400 font-bold animate-pulse">데이터 엔진 분석 중...</div>
      ) : (
        <div className="space-y-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <StatsLineChart data={statsData.users} title="📈 신규 회원 가입 추이" />
            <StatsLineChart data={statsData.cases} title="⚖️ 신규 사건 접수 추이" />
          </div>
          
          <div className="bg-gray-900 text-white p-12 rounded-3xl shadow-2xl flex flex-col md:flex-row justify-around items-center gap-10">
            <div className="text-center group">
              <p className="text-gray-400 text-sm mb-2 group-hover:text-blue-400 transition-colors">누적 일반 회원</p>
              <h2 className="text-5xl font-black">1,204<span className="text-lg ml-1 font-normal text-gray-500">명</span></h2>
            </div>
            <div className="hidden md:block w-px h-16 bg-gray-700"></div>
            <div className="text-center group">
              <p className="text-gray-400 text-sm mb-2 group-hover:text-green-400 transition-colors">활동 전문 회원</p>
              <h2 className="text-5xl font-black">85<span className="text-lg ml-1 font-normal text-gray-500">명</span></h2>
            </div>
            <div className="hidden md:block w-px h-16 bg-gray-700"></div>
            <div className="text-center group">
              <p className="text-gray-400 text-sm mb-2 group-hover:text-red-400 transition-colors">해결 완료 사건</p>
              <h2 className="text-5xl font-black">218<span className="text-lg ml-1 font-normal text-gray-500">건</span></h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminStatsPage;