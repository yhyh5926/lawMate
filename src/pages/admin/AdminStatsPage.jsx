import React, { useEffect, useState } from "react";

// 가상의 adminApi 모킹 (unresolved import 방지)
const adminApi = {
  getStats: async () => ({
    data: {
      users: [
        { date: "02-23", count: 12 }, { date: "02-24", count: 15 },
        { date: "02-25", count: 8 }, { date: "02-26", count: 20 },
        { date: "02-27", count: 35 }
      ],
      cases: [
        { date: "02-23", count: 5 }, { date: "02-24", count: 7 },
        { date: "02-25", count: 4 }, { date: "02-26", count: 12 },
        { date: "02-27", count: 18 }
      ]
    }
  })
};

// 누락되었던 StatsLineChart 컴포넌트를 파일 내부에 정의하여 참조 오류를 해결합니다.
const StatsLineChart = ({ data, title }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 w-full">
      <h3 className="text-lg font-bold mb-6 text-gray-800">{title}</h3>
      <div className="flex items-end justify-between h-48 gap-2 px-2">
        {data.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center flex-1 group">
            <div 
              className="w-full bg-blue-500 rounded-t-md transition-all duration-300 group-hover:bg-blue-600 relative"
              style={{ height: `${(item.count / maxCount) * 100}%`, minHeight: '4px' }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                {item.count}
              </div>
            </div>
            <span className="text-[10px] text-gray-400 mt-2 transform -rotate-45 sm:rotate-0">{item.date}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const AdminStatsPage = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({
    users: [],
    cases: []
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // 실제 API 호출 대신 모킹된 데이터를 사용하거나, 
      // 로컬 환경에서는 실제 adminApi를 호출하도록 구성할 수 있습니다.
      const response = await adminApi.getStats();
      setStatsData(response.data);
    } catch (error) {
      console.error("통계 데이터 조회 실패", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-5 max-w-5xl mx-auto font-sans">
      <h2 className="text-2xl font-bold border-b-2 border-gray-800 pb-3 mb-8">플랫폼 주요 지표 통계</h2>
      
      {loading ? (
        <div className="py-12 text-center text-gray-500">통계 데이터를 집계 중입니다...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsLineChart data={statsData.users} title="📈 최근 5일 신규 가입자 수 추이" />
          <StatsLineChart data={statsData.cases} title="⚖️ 최근 5일 신규 사건 접수 추이" />
          
          <div className="md:col-span-2 bg-gray-50 p-8 rounded-2xl border border-gray-200 mt-4">
            <h4 className="text-lg font-semibold mb-6 text-gray-700">📊 실시간 서비스 요약</h4>
            <div className="flex flex-col sm:flex-row justify-around items-center gap-8 text-center">
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">전체 일반 회원</p>
                <h2 className="text-3xl font-black text-blue-600">1,204</h2>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">승인 전문 회원</p>
                <h2 className="text-3xl font-black text-green-600">85</h2>
              </div>
              <div className="hidden sm:block w-px h-12 bg-gray-300"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-500 mb-2">누적 접수 사건</p>
                <h2 className="text-3xl font-black text-red-600">342</h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 환경에 맞는 export 설정 (App으로 명명하여 미리보기 호환성 유지)
export default function App() {
  return <AdminStatsPage />;
}