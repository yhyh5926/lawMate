// vs코드
// 파일 위치: src/components/chart/StatsLineChart.jsx
// 설명: 관리자 페이지에서 가입자 수, 결제 총액, 신고 건수 추이를 그리는 선 그래프 모의 UI
// 주의: 실제 차트를 그리려면 추후 npm install recharts 등 라이브러리 설치가 필요할 수 있어, 현재는 CSS 기반 Mock 차트로 구현했습니다.

import React from "react";

const StatsLineChart = ({ data, title }) => {
  // data 예시: [{ date: '02-20', count: 10 }, { date: '02-21', count: 25 }, ...]
  
  // 최대값 구하기 (차트 높이 비율 계산용)
  const maxCount = data && data.length > 0 ? Math.max(...data.map(d => d.count)) : 100;

  return (
    <div style={styles.container}>
      <h4 style={styles.title}>{title}</h4>
      <div style={styles.chartArea}>
        {data && data.map((item, index) => {
          const heightPercent = maxCount === 0 ? 0 : (item.count / maxCount) * 100;
          return (
            <div key={index} style={styles.barContainer}>
              <div style={styles.value}>{item.count}</div>
              <div style={{ ...styles.bar, height: `${heightPercent}%` }}></div>
              <div style={styles.label}>{item.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    border: "1px solid #eee", borderRadius: "8px", padding: "20px", 
    backgroundColor: "#fff", marginBottom: "20px"
  },
  title: { margin: "0 0 20px 0", color: "#333" },
  chartArea: {
    display: "flex", alignItems: "flex-end", justifyContent: "space-around",
    height: "200px", paddingBottom: "20px", borderBottom: "1px solid #ccc"
  },
  barContainer: {
    display: "flex", flexDirection: "column", alignItems: "center", width: "40px", height: "100%"
  },
  value: { fontSize: "12px", color: "#666", marginBottom: "5px" },
  bar: { width: "20px", backgroundColor: "#007BFF", borderRadius: "4px 4px 0 0", minHeight: "5px" },
  label: { fontSize: "12px", color: "#999", marginTop: "10px" }
};

export default StatsLineChart;