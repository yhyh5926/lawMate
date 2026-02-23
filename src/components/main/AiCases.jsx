import { useEffect, useState } from "react";
import Skeleton from "./Skeleton";

export default function AiCases() {
  const [cases, setCases] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const fallback = () => [
      {
        title: "임대차 분쟁",
        summary: "계약 해지/보증금 반환 관련 핵심 쟁점과 최근 판례를 요약합니다.",
        tag: "부동산"
      },
      {
        title: "교통사고 손해배상",
        summary: "과실비율 및 치료비/위자료 산정 기준을 참고할 수 있습니다.",
        tag: "손해배상"
      },
      {
        title: "명예훼손",
        summary: "사실 적시/의견표현 구분과 위법성 조각 사유를 확인합니다.",
        tag: "형사"
      }
    ];

    fetch("/api/ai/recommend")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        if (!Array.isArray(data)) throw new Error("Invalid payload");
        setCases(data);
      })
      .catch(() => {
        if (cancelled) return;
        setError("AI 추천 API 연결 전입니다. 샘플 추천을 표시합니다.");
        setCases(fallback());
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!cases) return <Skeleton />;

  return (
    <div className="ai-cases-container">
      {error && <p className="ai-error-message">{error}</p>}
      
      <div className="ai-cases-grid">
        {cases.map((c, i) => (
          <div key={i} className="ai-case-card">
            <div className="case-card-header">
              <span className="case-number">#{i + 1}</span>
              {c.tag && <span className="case-tag">{c.tag}</span>}
            </div>
            <h3 className="case-title">{c.title}</h3>
            <p className="case-summary">{c.summary}</p>
            <button className="case-detail-btn">
              자세히 보기
              <svg className="arrow-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}