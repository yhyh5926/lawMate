import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  AreaChart,
  Area,
} from "recharts";
import { trendText, trendClass } from "../../utils/mainUtils";
import "../../styles/main/StatsSection.css";

export default function StatsSection({
  series,
  todayCount,
  weeklyCount,
  todayChangePct,
  weeklyChangePct,
  chartSummaryText,
}) {
  const last = series[series.length - 1];

  return (
    <section className="stats-section">
      <div className="stats-section-head">
        <div>
          <h2 className="stats-section-title">상담 통계</h2>
          <p className="stats-section-desc">최근 7일 기준 상담 흐름</p>
        </div>
      </div>

      <div className="stats-row">
        {/* 요약 패널 */}
        <div className="stats-summary-panel">
          <p className="stats-panel-label">요약</p>

          <MetricCard
            icon="📅"
            label="오늘 상담 접수"
            value={`${todayCount}건`}
            pct={todayChangePct}
            prefix="전일 대비"
          />
          <MetricCard
            icon="📈"
            label="이번 주 상담"
            value={`${weeklyCount}건`}
            pct={weeklyChangePct}
            prefix="전주 대비"
          />

          <div className="stats-mini-chart-wrap">
            <p className="stats-mini-chart-label">최근 7일 추이</p>
            <div style={{ width: "100%", height: 80 }}>
              {series.length ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={series.slice(-7)}>
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="#1a375a"
                      fill="rgba(26,55,90,0.1)"
                      strokeWidth={2.5}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="stats-chart-empty-mini">데이터 없음</div>
              )}
            </div>
          </div>

          {chartSummaryText && (
            <div className="stats-insight-box">{chartSummaryText}</div>
          )}
        </div>

        {/* 차트 패널 */}
        <div className="stats-chart-panel">
          <div className="stats-chart-panel-head">
            <p className="stats-panel-label">주간 추이</p>
            <p className="stats-chart-sub">
              {series.length
                ? `최근일: ${String(last?.date ?? "")}`
                : "데이터 없음"}
            </p>
          </div>

          <div style={{ width: "100%", height: 320 }}>
            {series.length ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={series}
                  margin={{ top: 12, right: 16, left: 0, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tickMargin={8}
                    tick={{ fontSize: 12, fill: "#718096" }}
                    tickFormatter={(v) => {
                      const s = String(v);
                      return s.length >= 10 ? s.slice(5) : s;
                    }}
                  />
                  <YAxis
                    tickMargin={8}
                    tick={{ fontSize: 12, fill: "#718096" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 10,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 8px 20px rgba(26,55,90,0.1)",
                      fontFamily: "Pretendard, sans-serif",
                    }}
                    labelStyle={{ fontWeight: 700, color: "#1a375a" }}
                    labelFormatter={(label) => (label ? `일자: ${label}` : "")}
                    formatter={(val) => [`${val}건`, "상담 건수"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1a375a"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#7fb3d5" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="stats-chart-empty">
                아직 표시할 통계 데이터가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function MetricCard({ icon, label, value, pct, prefix }) {
  return (
    <div className="stats-metric-card">
      <span className="stats-metric-icon">{icon}</span>
      <div className="stats-metric-body">
        <p className="stats-metric-label">{label}</p>
        <p className="stats-metric-value">{value}</p>
        <p
          className={`stats-metric-trend ${trendClass(pct, "stats-metric-trend")}`}
        >
          {prefix} {trendText(pct)}
        </p>
      </div>
    </div>
  );
}
