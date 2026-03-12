import React from "react";
import "../../styles/chart/StatsLineChart.css";

const StatsLineChart = ({ data, title }) => {
  // data 예시: [{ date: '02-20', count: 10 }, { date: '02-21', count: 25 }, ...]

  // 최대값 구하기 (차트 높이 비율 계산용)
  const maxCount =
    data && data.length > 0 ? Math.max(...data.map((d) => d.count)) : 100;

  return (
    <div className="stats-chart-container">
      <div className="stats-chart-header">
        <h4 className="stats-chart-title">{title}</h4>
        <div className="stats-chart-legend">
          <span className="legend-dot"></span>
          <span>데이터 추이</span>
        </div>
      </div>

      <div className="stats-chart-area">
        {data && data.length > 0 ? (
          data.map((item, index) => {
            const heightPercent =
              maxCount === 0 ? 0 : (item.count / maxCount) * 100;
            return (
              <div key={index} className="stats-bar-wrapper">
                {/* 툴팁 느낌의 숫자 표시 */}
                <div className="stats-bar-value">
                  {item.count.toLocaleString()}
                </div>

                {/* 실제 막대 부분 */}
                <div className="stats-bar-track">
                  <div
                    className="stats-bar-fill"
                    style={{ height: `${heightPercent}%` }}
                  >
                    <div className="stats-bar-top-point"></div>
                  </div>
                </div>

                <div className="stats-bar-label">{item.date}</div>
              </div>
            );
          })
        ) : (
          <div className="stats-no-data">표시할 데이터가 없습니다.</div>
        )}
      </div>
    </div>
  );
};

export default StatsLineChart;
