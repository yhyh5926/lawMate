// src/pages/main/MainPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainApi } from "../../api/mainApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function MainPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  const goToLogin = () => {
    window.location.href = "/member/login";
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr("");
        const res = await mainApi.getMainData();
        if (!alive) return;
        setData(res);
      } catch (e) {
        if (!alive) return;
        setErr("메인 데이터를 불러오지 못했습니다.");
        setData(null);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const recentPosts = useMemo(
    () => (data?.recentPosts ?? []).slice(0, 5),
    [data],
  );

  // --- Stats normalization ---
  const stats = data?.stats ?? { todayCount: 0, weeklyCount: 0, series: [] };
  const rawSeries = Array.isArray(stats.series) ? stats.series : [];

  const series = useMemo(() => {
    const arr = [...rawSeries].filter((d) => d && d.date != null);
    arr.sort((a, b) => String(a.date).localeCompare(String(b.date)));
    return arr;
  }, [rawSeries]);

  const last = series[series.length - 1];
  const prev = series[series.length - 2];

  const todayCount = Number.isFinite(Number(stats.todayCount))
    ? Number(stats.todayCount)
    : Number(last?.count ?? 0);

  const weeklyFromSeries = useMemo(() => {
    const last7 = series.slice(-7);
    return last7.reduce((sum, d) => sum + Number(d?.count ?? 0), 0);
  }, [series]);

  const weeklyCount = Number.isFinite(Number(stats.weeklyCount))
    ? Number(stats.weeklyCount)
    : weeklyFromSeries;

  const todayChangePct = useMemo(() => {
    const a = Number(last?.count ?? todayCount);
    const b = Number(prev?.count ?? 0);
    if (!b) return null;
    return ((a - b) / b) * 100;
  }, [last, prev, todayCount]);

  const weeklyChangePct = useMemo(() => {
    const last7 = series.slice(-7);
    const prev7 = series.slice(-14, -7);
    const a = last7.reduce((s, d) => s + Number(d?.count ?? 0), 0);
    const b = prev7.reduce((s, d) => s + Number(d?.count ?? 0), 0);
    if (!b) return null;
    return ((a - b) / b) * 100;
  }, [series]);

  const trendText = (pct) => {
    if (pct == null || Number.isNaN(pct)) return "—";
    const v = Math.round(pct * 10) / 10;
    if (v > 0) return `▲ ${v}%`;
    if (v < 0) return `▼ ${Math.abs(v)}%`;
    return "— 0%";
  };

  const trendStyle = (pct) => {
    if (pct == null || Number.isNaN(pct) || pct === 0)
      return styles.trendNeutral;
    return pct > 0 ? styles.trendUp : styles.trendDown;
  };

  const goCommunityDetail = (p) => {
    const pid = p?.postId ?? p?.id;
    if (!pid) return;
    navigate(`/community/detail/${pid}`);
  };

  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 980px) {
          .lm-hero { grid-template-columns: 1fr; }
          .lm-ctaBox { width: 100% !important; }
          .lm-grid3 { grid-template-columns: 1fr; }
          .lm-kpis { grid-template-columns: 1fr 1fr; }
          .lm-statRow { grid-template-columns: 1fr; }
        }
        @media (max-width: 520px) {
          .lm-kpis { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={styles.wrap}>
        {/* ===== HeroBar ===== */}
        <section className="lm-hero" style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.heroTitle}>법률 상담을 더 쉽고 빠르게</div>
            <div style={styles.heroSubtitle}>
              사건 통계와 실시간 커뮤니티 글을 확인하고,
              <br />
              전문 변호사들의 답변을 받아보세요.
            </div>

            <div className="lm-kpis" style={styles.kpis}>
              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>오늘 접수 사건</div>
                <div style={styles.kpiValue}>{todayCount}</div>
                <div
                  style={{ ...styles.kpiTrend, ...trendStyle(todayChangePct) }}
                >
                  전일 대비 {trendText(todayChangePct)}
                </div>
              </div>

              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>주간 누적 상담</div>
                <div style={styles.kpiValue}>{weeklyCount}</div>
                <div
                  style={{ ...styles.kpiTrend, ...trendStyle(weeklyChangePct) }}
                >
                  전주 대비 {trendText(weeklyChangePct)}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.heroRight}>
            <div className="lm-ctaBox" style={styles.ctaBox}>
              <div style={styles.ctaTitle}>지금 바로 질문하세요</div>
              <div style={styles.ctaDesc}>
                로그인 후 질문을 등록하시면 여러 명의 전문 변호사로부터 답변을
                받을 수 있습니다.
              </div>
              <button style={styles.ctaBtn} onClick={goToLogin}>
                질문 등록하기 →
              </button>
              <button
                style={styles.ctaBtnGhost}
                onClick={() => navigate("/question/list")}
              >
                질문 목록 보기
              </button>
            </div>
          </div>
        </section>

        {err && <div style={styles.error}>{err}</div>}

        {/* ===== 통계 섹션 ===== */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>사건 통계 분석</h2>
            <span style={styles.subText}>실시간 데이터 시각화</span>
          </div>

          <div className="lm-statRow" style={styles.statRow}>
            <div style={styles.statSideCard}>
              <div style={styles.sideTitle}>요약 데이터</div>
              <div style={styles.sideKpi}>
                <div style={styles.sideKpiTop}>
                  <div style={styles.sideKpiIcon}>📅</div>
                  <div>
                    <div style={styles.sideKpiLabel}>오늘 접수</div>
                    <div style={styles.sideKpiValue}>{todayCount}건</div>
                  </div>
                </div>
              </div>

              <div style={styles.sideKpi}>
                <div style={styles.sideKpiTop}>
                  <div style={styles.sideKpiIcon}>📈</div>
                  <div>
                    <div style={styles.sideKpiLabel}>주간 상담</div>
                    <div style={styles.sideKpiValue}>{weeklyCount}건</div>
                  </div>
                </div>
              </div>

              <div style={styles.sparkWrap}>
                <div style={styles.sparkTitle}>최근 7일 트렌드</div>
                <div style={{ width: "100%", height: 54 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={series.slice(-7)}>
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#1e4d8c"
                        strokeWidth={2.5}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div style={styles.card}>
              <div style={styles.chartHeader}>
                <div style={styles.chartTitle}>주간 사건 추이</div>
              </div>
              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={series}
                    margin={{ top: 12, right: 16, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f0f0f0"
                    />
                    <XAxis
                      dataKey="date"
                      tickMargin={8}
                      tickFormatter={(v) => String(v).slice(5)}
                    />
                    <YAxis tickMargin={8} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "none",
                        boxShadow: "0 10px 24px rgba(0,0,0,0.1)",
                      }}
                      formatter={(val) => [`${val}건`, "건수"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#1e4d8c"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 최근 게시글 섹션 ===== */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>최근 커뮤니티 게시글</h2>
            <span style={styles.subText}>따끈따끈한 새 글</span>
          </div>
          <div style={styles.listCard}>
            {recentPosts.length === 0 ? (
              <div style={styles.empty}>최근 게시글이 없습니다.</div>
            ) : (
              recentPosts.map((p, idx) => (
                <div
                  key={p.postId ?? p.id ?? idx}
                  style={{
                    ...styles.listItem,
                    borderBottom:
                      idx === recentPosts.length - 1
                        ? "none"
                        : styles.borderLine,
                  }}
                  onClick={() => goCommunityDetail(p)}
                  role="button"
                  tabIndex={0}
                >
                  <div style={styles.listTitle}>{p.title}</div>
                  <div style={styles.listMeta}>
                    {p.createdAt
                      ? new Date(p.createdAt).toLocaleDateString()
                      : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ===== 하단 CTA ===== */}
        <section style={{ ...styles.section, marginBottom: 40 }}>
          <div style={styles.bottomCta}>
            <div>
              <div style={styles.bottomTitle}>
                전문 변호사의 조언이 필요하신가요?
              </div>
              <div style={styles.bottomDesc}>
                익명으로 안전하게 고민을 털어놓으세요.
              </div>
            </div>
            <button style={styles.bottomBtn} onClick={goToLogin}>
              지금 질문하기
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  // 위에서 제공해주신 styles 객체와 동일하며, 공지사항 관련 grid3 스타일 등은 자동으로 무시됩니다.
  page: {
    minHeight: "100vh",
    background: "#f4f6fb",
    fontFamily: "'Noto Sans KR', sans-serif",
    paddingBottom: 60,
  },
  wrap: {
    width: "100%",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "18px 24px 0",
  },
  hero: {
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: 18,
    padding: 22,
    borderRadius: 24,
    background:
      "linear-gradient(135deg, #0b1220 0%, #0f2347 40%, #173b73 100%)",
    boxShadow: "0 18px 46px rgba(15, 23, 42, 0.18)",
    color: "#fff",
    marginBottom: 30,
  },
  heroLeft: { minWidth: 0 },
  heroRight: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "flex-end",
  },
  heroBadgeRow: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  heroBadge: {
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.14)",
    fontSize: 12,
    fontWeight: 900,
  },
  heroBadgeMuted: { fontSize: 12, opacity: 0.75 },
  heroTitle: { fontSize: 32, fontWeight: 900, marginTop: 6 },
  heroSubtitle: { marginTop: 10, fontSize: 15, opacity: 0.9, lineHeight: 1.6 },
  kpis: {
    marginTop: 20,
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: 12,
  },
  kpiCard: {
    borderRadius: 16,
    padding: "14px",
    background: "rgba(255,255,255,0.1)",
    border: "1px solid rgba(255,255,255,0.15)",
  },
  kpiLabel: { fontSize: 12, opacity: 0.8 },
  kpiValue: { fontSize: 24, fontWeight: 900, marginTop: 4 },
  kpiTrend: { fontSize: 12, marginTop: 6, fontWeight: 700 },
  trendUp: { color: "#4ade80" },
  trendDown: { color: "#fb7185" },
  trendNeutral: { color: "#cbd5e1" },
  ctaBox: {
    width: 340,
    borderRadius: 18,
    padding: 20,
    background: "#fff",
    color: "#0f172a",
    boxShadow: "0 18px 50px rgba(0,0,0,0.2)",
  },
  ctaTitle: { fontSize: 18, fontWeight: 900, marginBottom: 8 },
  ctaDesc: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.5,
    marginBottom: 15,
  },
  ctaBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: 12,
    border: "none",
    background: "#1e4d8c",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  ctaBtnGhost: {
    width: "100%",
    padding: "10px",
    borderRadius: 12,
    border: "1px solid #dbe6f5",
    background: "#f7faff",
    color: "#1e4d8c",
    fontWeight: 900,
    marginTop: 10,
    cursor: "pointer",
  },
  section: { marginTop: 30 },
  sectionHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  h2: { fontSize: 20, fontWeight: 900, color: "#1e293b" },
  subText: { fontSize: 13, color: "#94a3b8" },
  card: {
    background: "#fff",
    borderRadius: 20,
    border: "1px solid #e8edf5",
    padding: 20,
    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
  },
  statRow: { display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 },
  statSideCard: {
    background: "#fff",
    borderRadius: 20,
    border: "1px solid #e8edf5",
    padding: 20,
  },
  sideTitle: { fontWeight: 900, marginBottom: 15 },
  sideKpi: {
    padding: 12,
    borderRadius: 12,
    background: "#f8fbff",
    marginBottom: 12,
  },
  sideKpiTop: { display: "flex", gap: 10, alignItems: "center" },
  sideKpiIcon: {
    width: 36,
    height: 36,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#fff",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
  },
  sideKpiLabel: { fontSize: 12, color: "#64748b" },
  sideKpiValue: { fontSize: 18, fontWeight: 900 },
  sparkWrap: { marginTop: 15, borderTop: "1px solid #f1f5f9", paddingTop: 15 },
  sparkTitle: { fontSize: 12, color: "#94a3b8", marginBottom: 8 },
  chartHeader: { marginBottom: 15 },
  chartTitle: { fontWeight: 800 },
  listCard: {
    background: "#fff",
    borderRadius: 20,
    border: "1px solid #e8edf5",
    overflow: "hidden",
  },
  listItem: {
    padding: "16px 20px",
    display: "flex",
    justifyContent: "space-between",
    cursor: "pointer",
  },
  listTitle: { fontWeight: 700, color: "#334155" },
  listMeta: { fontSize: 12, color: "#94a3b8" },
  borderLine: "1px solid #f1f5f9",
  empty: { padding: 30, textAlign: "center", color: "#94a3b8" },
  bottomCta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 30px",
    background: "#fff",
    borderRadius: 24,
    border: "1px solid #e8edf5",
  },
  bottomTitle: { fontSize: 18, fontWeight: 900 },
  bottomDesc: { fontSize: 14, color: "#64748b", marginTop: 4 },
  bottomBtn: {
    padding: "12px 24px",
    borderRadius: 12,
    background: "#1e4d8c",
    color: "#fff",
    fontWeight: 900,
    border: "none",
    cursor: "pointer",
  },
  error: {
    padding: 12,
    background: "#fff1f2",
    color: "#e11d48",
    borderRadius: 10,
    marginBottom: 15,
    fontWeight: 700,
  },
};
