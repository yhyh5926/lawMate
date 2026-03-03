// src/pages/admin/AdminStatsPage.jsx

import React, { useEffect, useState } from "react";
import { adminApi } from "../../api/adminApi";

const BarChart = ({ data, title, color }) => {
  const maxCount = Math.max(...data.map(d => d.count), 1);
  return (
    <div className="sc-chart-card">
      <div className="sc-chart-title">{title}</div>
      <div className="sc-bars">
        {data.map((item, idx) => (
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
        ))}
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
  const [statsData, setStatsData] = useState({ users: [], cases: [] });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminApi.getStats();
        setStatsData(response.data);
      } catch (error) {
        console.error("통계 로드 실패", error);
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
    <>
      <style>{`
        .sc-wrap { font-family: 'Pretendard', 'Apple SD Gothic Neo', sans-serif; }

        /* KPI row */
        .sc-kpis { display: flex; gap: 14px; margin-bottom: 24px; }
        .sc-kpi-card {
          flex: 1; background: #fff; border-radius: 14px; padding: 22px 24px;
          border: 1px solid #e2e8f0; position: relative; overflow: hidden;
        }
        .sc-kpi-dot {
          width: 8px; height: 8px; border-radius: 50%; margin-bottom: 12px;
        }
        .sc-kpi-label { font-size: 11.5px; color: #94a3b8; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; }
        .sc-kpi-val { font-size: 32px; font-weight: 900; color: #0f172a; line-height: 1; letter-spacing: -1px; }
        .sc-kpi-unit { font-size: 14px; font-weight: 600; color: #94a3b8; margin-left: 4px; letter-spacing: 0; }

        /* Charts */
        .sc-charts { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

        .sc-chart-card {
          background: #fff; border: 1px solid #e2e8f0; border-radius: 14px;
          padding: 24px;
        }
        .sc-chart-title { font-size: 14px; font-weight: 800; color: #0f172a; margin-bottom: 24px; }
        .sc-bars {
          display: flex; align-items: flex-end; gap: 10px;
          height: 160px; padding-bottom: 28px; position: relative;
        }
        .sc-bars::before {
          content: ''; position: absolute;
          left: 0; right: 0; bottom: 28px; top: 0;
          background: repeating-linear-gradient(
            to bottom,
            transparent, transparent calc(50% - 0.5px),
            #f1f5f9 calc(50% - 0.5px), #f1f5f9 calc(50%)
          );
        }
        .sc-bar-group { flex: 1; display: flex; flex-direction: column; align-items: center; height: 100%; }
        .sc-bar-outer { flex: 1; width: 100%; display: flex; align-items: flex-end; position: relative; }
        .sc-bar-inner {
          width: 100%; border-radius: 6px 6px 0 0;
          transition: height 0.4s ease; position: relative;
        }
        .sc-bar-inner:hover .sc-bar-tooltip { opacity: 1; transform: translateY(0); }
        .sc-bar-tooltip {
          position: absolute; top: -32px; left: 50%; transform: translateX(-50%) translateY(4px);
          background: #0f172a; color: #fff; font-size: 11px; font-weight: 700;
          padding: 4px 8px; border-radius: 6px; white-space: nowrap;
          opacity: 0; transition: all 0.15s; pointer-events: none; z-index: 10;
        }
        .sc-bar-label { font-size: 11px; color: #94a3b8; margin-top: 8px; font-weight: 600; }

        .sc-loading { padding: 60px; text-align: center; color: #94a3b8; font-weight: 600; }
      `}</style>

      <div className="sc-wrap">
        {loading ? (
          <div className="sc-loading">데이터 분석 중...</div>
        ) : (
          <>
            <div className="sc-kpis">
              <KpiCard label="누적 일반 회원" value="1,204" unit="명" color="#3b82f6" />
              <KpiCard label="활동 전문 회원" value="85"    unit="명" color="#8b5cf6" />
              <KpiCard label="해결 완료 사건" value="218"   unit="건" color="#10b981" />
            </div>
            <div className="sc-charts">
              <BarChart data={statsData.users} title="📈 신규 회원 가입 추이" color="#3b82f6" />
              <BarChart data={statsData.cases} title="⚖️ 신규 사건 접수 추이" color="#8b5cf6" />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default AdminStatsPage;
