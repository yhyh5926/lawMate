// src/pages/admin/AdminStatsPage.jsx
import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";
import "../../styles/admins/AdminStatsPage.css"; // 💡 외부 CSS 파일 임포트

const BarChart = ({ data, title, color }) => {
  // 데이터가 없을 때 높이 계산 오류 방지
  const maxCount = data && data.length > 0 ? Math.max(...data.map(d => d.count), 1) : 1;
  return (
    <div className="sc-chart-card">
      <div className="sc-chart-title">{title}</div>
      <div className="sc-bars">
        {data && data.length > 0 ? data.map((item, idx) => (
          <div key={idx} className="sc-bar-group">
            <div className="sc-bar-outer">
              <div
                className="sc-bar-inner"
                style={{
                  height: `${Math.max((item.count / maxCount) * 100, 4)}%`,
                  background: color,
                }}
              >
                <div className="sc-bar-tooltip">{item.count}건</div>
              </div>
            </div>
            <span className="sc-bar-label">{item.date}</span>
          </div>
        )) : <div style={{ color: "#94a3b8", fontSize: "12px" }}>최근 데이터가 없습니다.</div>}
      </div>
    </div>
  );
};

const KpiCard = ({ label, value, unit, color }) => (
  <div className="sc-kpi-card">
    <div className="sc-kpi-dot" style={{ background: color }} />
    <div className="sc-kpi-label">{label}</div>
    <div className="sc-kpi-val">{value}<span className="sc-kpi-unit">{unit}</span></div>
  </div>
);

const AdminStatsPage = () => {
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState({ kpi: {}, users: [], cases: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        // 💡 백엔드에서 넘어온 진짜 데이터를 상태에 저장합니다.
        setStatsData(response.data);
      } catch (error) {
        console.error("통계 로드 실패", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="sc-wrap">
      {loading ? (
        <div className="sc-loading">실시간 데이터를 가져오는 중입니다...</div>
      ) : (
        <>
          <div className="sc-kpis">
            {/* 더미 값이 아닌 진짜 KPI 데이터 출력 */}
            <KpiCard label="누적 일반 회원" value={statsData.kpi?.totalPersonal?.toLocaleString() || "0"} unit="명" color="#3b82f6" />
            <KpiCard label="활동 전문 회원" value={statsData.kpi?.totalLawyer?.toLocaleString() || "0"} unit="명" color="#8b5cf6" />
            <KpiCard label="해결 완료 사건" value={statsData.kpi?.totalCases?.toLocaleString() || "0"} unit="건" color="#10b981" />
          </div>
          <div className="sc-charts">
            {/* 진짜 차트 데이터 출력 */}
            <BarChart data={statsData.users} title="📈 신규 회원 가입 추이" color="#3b82f6" />
            <BarChart data={statsData.cases} title="⚖️ 신규 사건 접수 추이" color="#8b5cf6" />
          </div>
        </>
      )}
    </div>
  );
};

export default AdminStatsPage;