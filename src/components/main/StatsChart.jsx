import { Bar } from "react-chartjs-2";
import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const GROUP_OPTIONS = [
  { key: "day", label: "일별" },
  { key: "week", label: "주별" },
];

export default function StatsChart() {
  const [groupBy, setGroupBy] = useState("day");
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const sample = useMemo(() => {
    const daily = {
      labels: ["02-07", "02-08", "02-09", "02-10", "02-11", "02-12", "02-13"],
      datasets: [{ label: "사건 수(샘플/일별)", data: [4, 7, 2, 6, 3, 5, 8] }],
    };
    const weekly = {
      labels: ["W05", "W06", "W07", "W08"],
      datasets: [{ label: "사건 수(샘플/주별)", data: [22, 31, 18, 27] }],
    };
    return { day: daily, week: weekly };
  }, []);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/stats?groupBy=${encodeURIComponent(groupBy)}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((result) => {
        if (cancelled) return;
        if (!result?.labels || !result?.counts)
          throw new Error("Invalid payload");

        setError(null);
        setData({
          labels: result.labels,
          datasets: [
            {
              label: groupBy === "day" ? "사건 수(일별)" : "사건 수(주별)",
              data: result.counts,
            },
          ],
        });
      })
      .catch(() => {
        if (cancelled) return;
        setError("통계 API 연결 전입니다. 샘플 데이터를 표시합니다.");
        setData(sample[groupBy]);
      });

    return () => {
      cancelled = true;
    };
  }, [groupBy, sample]);

  return (
    <div>
      <div className="segmented" role="tablist" aria-label="통계 단위 선택">
        {GROUP_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            type="button"
            className={`segBtn ${groupBy === opt.key ? "isActive" : ""}`}
            onClick={() => setGroupBy(opt.key)}
            role="tab"
            aria-selected={groupBy === opt.key}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {error && <p className="helperText">{error}</p>}

      {!data ? <p className="helperText">로딩 중...</p> : <Bar data={data} />}

      <p className="helperText">
        프론트: <code>fetch(&#39;/api/stats?groupBy=day|week&#39;)</code> →
        Chart.js 바인딩
      </p>
    </div>
  );
}
