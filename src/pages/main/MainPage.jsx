// src/pages/main/MainPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/common/Modal";
import { mainApi } from "../../api/mainApi";
import { questionApi } from "../../api/questionApi";
import { getPostList } from "../../api/communityApi";
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
  const [noticeDetail, setNoticeDetail] = useState(null);
  const [err, setErr] = useState("");

  // ✅ NEW: 최근 법률질문 / 최근 커뮤니티
  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentCommunity, setRecentCommunity] = useState([]);

  // ✅ requirement: 질문 등록(하단/상단) 클릭 시 바로 로그인 페이지로 이동
  const goToLogin = () => {
    window.location.href = "/member/login";
  };

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setErr("");
        // 메인(공지/통계/최근게시글) + 최근 법률질문 + 최근 커뮤니티
        const [res, qRes, cRes] = await Promise.all([
          mainApi.getMainData(),
          questionApi.getQuestionList({}),
          getPostList(),
        ]);
        if (!alive) return;
        setData(res);

        // 질문 목록(법률질문)
        const qList = Array.isArray(qRes?.data?.data) ? qRes.data.data : [];
        const qSorted = [...qList].sort((a, b) =>
          String(b?.createdAt ?? "").localeCompare(String(a?.createdAt ?? "")),
        );
        setRecentQuestions(qSorted.slice(0, 5));

        // 커뮤니티 목록
        const cList = Array.isArray(cRes) ? cRes : [];
        const cSorted = [...cList].sort((a, b) =>
          String(b?.createdAt ?? b?.updatedAt ?? "").localeCompare(
            String(a?.createdAt ?? a?.updatedAt ?? ""),
          ),
        );
        setRecentCommunity(cSorted.slice(0, 5));
      } catch (e) {
        if (!alive) return;
        setErr("메인 데이터를 불러오지 못했습니다.");
        setData(null);
        setRecentQuestions([]);
        setRecentCommunity([]);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const topNotices = useMemo(
    () => (data?.topNotices ?? []).slice(0, 3),
    [data],
  );
  const recentPosts = useMemo(
    () => (data?.recentPosts ?? []).slice(0, 5),
    [data],
  );

  // --- Stats normalization ---
  const stats = data?.stats ?? { todayCount: 0, weeklyCount: 0, series: [] };
  const rawSeries = Array.isArray(stats.series) ? stats.series : [];

  // Sort by date ASC safely (expects YYYY-MM-DD)
  const series = useMemo(() => {
    const arr = [...rawSeries].filter((d) => d && d.date != null);
    arr.sort((a, b) => String(a.date).localeCompare(String(b.date)));
    return arr;
  }, [rawSeries]);

  const last = series[series.length - 1];
  const prev = series[series.length - 2];

  // Today count: prefer stats.todayCount, fallback to last point
  const todayCount = Number.isFinite(Number(stats.todayCount))
    ? Number(stats.todayCount)
    : Number(last?.count ?? 0);

  // Weekly count: prefer stats.weeklyCount, fallback to sum of last 7
  const weeklyFromSeries = useMemo(() => {
    const last7 = series.slice(-7);
    return last7.reduce((sum, d) => sum + Number(d?.count ?? 0), 0);
  }, [series]);

  const weeklyCount = Number.isFinite(Number(stats.weeklyCount))
    ? Number(stats.weeklyCount)
    : weeklyFromSeries;

  // Day-over-day % change based on last two points
  const todayChangePct = useMemo(() => {
    const a = Number(last?.count ?? todayCount);
    const b = Number(prev?.count ?? 0);
    if (!b) return null;
    return ((a - b) / b) * 100;
  }, [last, prev, todayCount]);

  // Week-over-week % change: sum(last7) vs sum(prev7)
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

  const openNotice = async (id) => {
    try {
      const detail = await mainApi.getNoticeDetail(id);
      setNoticeDetail(detail);
    } catch {
      window.alert("공지 상세를 불러오지 못했습니다.");
    }
  };

  const goCommunityDetail = (p) => {
    const pid = p?.postId ?? p?.id;
    if (!pid) return;
    navigate(`/community/detail/${pid}`);
  };

  const goQuestionDetail = (q) => {
    const qid = q?.questionId ?? q?.id;
    if (!qid) return;
    navigate(`/question/detail/${qid}`);
  };

  const tooltipLabel = (label) => {
    if (!label) return "";
    return `일자: ${label}`;
  };

  const tooltipValue = (val) => [`${val}건`, "상담/접수"];

  return (
    <div style={styles.page}>
      {/* Responsive helpers (no separate css file needed) */}
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
        {/* ===== Professional Compact HeroBar ===== */}
        <section className="lm-hero" style={styles.hero}>
          <div style={styles.heroLeft}>
            <div style={styles.heroBadgeRow}>
              <span style={styles.heroBadge}>LAW MATE</span>
              <span style={styles.heroBadgeMuted}>/ main</span>
            </div>

            <div style={styles.heroTitle}>법률 상담을 더 쉽고 빠르게</div>
            <div style={styles.heroSubtitle}>
              공지 · 통계 · 커뮤니티 최신 글을 한 번에 확인하고, 로그인 후
              질문을 등록하세요.
            </div>

            <div className="lm-kpis" style={styles.kpis}>
              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>오늘 접수 사건 수</div>
                <div style={styles.kpiValue}>{todayCount}</div>
                <div
                  style={{ ...styles.kpiTrend, ...trendStyle(todayChangePct) }}
                >
                  전일 대비 {trendText(todayChangePct)}
                </div>
              </div>

              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>주간 누적 상담 건수</div>
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
                질문 등록은 로그인 후 이용할 수 있습니다. 버튼 클릭 시 로그인
                페이지로 이동합니다.
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

        {/* ===== 공지사항 3건 카드 ===== */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>공지사항</h2>
            <span style={styles.subText}>최신 3건</span>
          </div>

          <div className="lm-grid3" style={styles.grid3}>
            {topNotices.length === 0 ? (
              <div style={{ ...styles.card, gridColumn: "1 / -1" }}>
                <div style={styles.cardTitle}>공지사항이 없습니다.</div>
                <div style={styles.cardMeta}>—</div>
              </div>
            ) : (
              topNotices.map((n) => (
                <div
                  key={n.id}
                  style={styles.cardClickable}
                  onClick={() => openNotice(n.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div style={styles.cardTitle}>{n.title}</div>
                  <div style={styles.cardMeta}>
                    {n.createdAt
                      ? new Date(n.createdAt).toLocaleDateString()
                      : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ===== 오늘/주간 사건 통계 (개선 통합) ===== */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>오늘/주간 사건 통계</h2>
            <span style={styles.subText}>Python 집계 → React 차트</span>
          </div>

          <div className="lm-statRow" style={styles.statRow}>
            {/* KPI + Sparkline */}
            <div style={styles.statSideCard}>
              <div style={styles.sideTitle}>요약</div>

              <div style={styles.sideKpi}>
                <div style={styles.sideKpiTop}>
                  <div style={styles.sideKpiIcon}>📅</div>
                  <div>
                    <div style={styles.sideKpiLabel}>오늘 접수</div>
                    <div style={styles.sideKpiValue}>{todayCount}건</div>
                  </div>
                </div>
                <div
                  style={{
                    ...styles.sideKpiTrend,
                    ...trendStyle(todayChangePct),
                  }}
                >
                  전일 대비 {trendText(todayChangePct)}
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
                <div
                  style={{
                    ...styles.sideKpiTrend,
                    ...trendStyle(weeklyChangePct),
                  }}
                >
                  전주 대비 {trendText(weeklyChangePct)}
                </div>
              </div>

              <div style={styles.sparkWrap}>
                <div style={styles.sparkTitle}>최근 7일 추이</div>
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

            {/* Main Chart */}
            <div style={styles.card}>
              <div style={styles.chartHeader}>
                <div style={styles.chartTitle}>주간 추이</div>
                <div style={styles.chartHint}>
                  {series.length
                    ? `최근일: ${String(last?.date ?? "")}`
                    : "데이터 없음"}
                </div>
              </div>

              <div style={{ width: "100%", height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={series}
                    margin={{ top: 12, right: 16, left: 0, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickMargin={8}
                      tickFormatter={(v) => {
                        const s = String(v);
                        return s.length >= 10 ? s.slice(5) : s; // YYYY-MM-DD -> MM-DD
                      }}
                    />
                    <YAxis tickMargin={8} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: 12,
                        border: "1px solid #e8edf5",
                        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)",
                      }}
                      labelStyle={{ fontWeight: 900 }}
                      labelFormatter={tooltipLabel}
                      formatter={tooltipValue}
                    />
                    <Line
                      type="monotone"
                      dataKey="count"
                      stroke="#1e4d8c"
                      strokeWidth={3}
                      dot={false}
                      activeDot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* ===== 최근 게시글 + 최근 법률질문 + 최근 커뮤니티 ===== */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>최근 활동</h2>
            <span style={styles.subText}>각 최신 5건</span>
          </div>

          <div className="lm-grid3" style={styles.grid3}>
            {/* 최근 게시글 (mainData) */}
            <div style={styles.listCardCol}>
              <div style={styles.listHeaderRow}>
                <div style={styles.listHeaderTitle}>📝 최근 게시글</div>
                <button
                  style={styles.moreBtn}
                  onClick={() => navigate("/community/qnalist")}
                >
                  더보기
                </button>
              </div>

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

            {/* 최근 법률질문 */}
            <div style={styles.listCardCol}>
              <div style={styles.listHeaderRow}>
                <div style={styles.listHeaderTitle}>⚖️ 최근 법률질문</div>
                <button
                  style={styles.moreBtn}
                  onClick={() => navigate("/question/list")}
                >
                  더보기
                </button>
              </div>

              {recentQuestions.length === 0 ? (
                <div style={styles.empty}>최근 법률질문이 없습니다.</div>
              ) : (
                recentQuestions.map((q, idx) => (
                  <div
                    key={q.questionId ?? q.id ?? idx}
                    style={{
                      ...styles.listItem,
                      borderBottom:
                        idx === recentQuestions.length - 1
                          ? "none"
                          : styles.borderLine,
                    }}
                    onClick={() => goQuestionDetail(q)}
                    role="button"
                    tabIndex={0}
                  >
                    <div
                      style={{ ...styles.listTitle, display: "flex", gap: 8 }}
                    >
                      <span style={styles.pill}>{q.caseType ?? "유형"}</span>
                      <span
                        style={{
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {q.title}
                      </span>
                    </div>
                    <div style={styles.listMeta}>
                      {q.createdAt ? String(q.createdAt) : ""}
                      {q.status
                        ? ` · ${q.status === "ANSWERED" ? "답변완료" : "답변대기"}`
                        : ""}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* 최근 커뮤니티 (직접 fetch) */}
            <div style={styles.listCardCol}>
              <div style={styles.listHeaderRow}>
                <div style={styles.listHeaderTitle}>💬 최근 커뮤니티</div>
                <button
                  style={styles.moreBtn}
                  onClick={() => navigate("/community/qnalist")}
                >
                  더보기
                </button>
              </div>

              {recentCommunity.length === 0 ? (
                <div style={styles.empty}>최근 커뮤니티 글이 없습니다.</div>
              ) : (
                recentCommunity.map((p, idx) => (
                  <div
                    key={p.postId ?? p.id ?? idx}
                    style={{
                      ...styles.listItem,
                      borderBottom:
                        idx === recentCommunity.length - 1
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
                        ? String(p.createdAt)
                        : p.updatedAt
                          ? String(p.updatedAt)
                          : ""}
                      {Number.isFinite(Number(p.commentCnt))
                        ? ` · 댓글 ${p.commentCnt}`
                        : ""}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ===== 하단 CTA: 클릭 시 바로 로그인 페이지 이동 ===== */}
        <section style={{ ...styles.section, marginBottom: 18 }}>
          <div style={styles.bottomCta}>
            <div>
              <div style={styles.bottomTitle}>법률 질문 등록</div>
              <div style={styles.bottomDesc}>
                질문 등록은 로그인 후 이용할 수 있습니다.
              </div>
            </div>

            <button style={styles.bottomBtn} onClick={goToLogin}>
              질문 등록
            </button>
          </div>
        </section>
      </div>

      {/* ===== 레이어 팝업 (공지 상세) ===== */}
      <Modal
        isOpen={!!noticeDetail}
        title={noticeDetail?.title || "공지사항"}
        onClose={() => setNoticeDetail(null)}
      >
        {noticeDetail && (
          <>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {noticeDetail.createdAt
                ? new Date(noticeDetail.createdAt).toLocaleString()
                : ""}
            </div>
            <hr style={{ margin: "12px 0" }} />
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.75 }}>
              {noticeDetail.content}
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}

const styles = {
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

  // ===== Hero =====
  hero: {
    display: "grid",
    gridTemplateColumns: "1.25fr 0.75fr",
    gap: 18,
    padding: 22,
    borderRadius: 24,
    border: "1px solid #e8edf5",
    background:
      "linear-gradient(135deg, #0b1220 0%, #0f2347 40%, #173b73 100%)",
    boxShadow: "0 18px 46px rgba(15, 23, 42, 0.18)",
    color: "#fff",
    overflow: "hidden",
    position: "relative",
    marginBottom: 18,
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
    display: "inline-flex",
    alignItems: "center",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.18)",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1.2,
  },
  heroBadgeMuted: { fontSize: 12, opacity: 0.75 },
  heroTitle: {
    fontSize: 30,
    fontWeight: 900,
    letterSpacing: -0.4,
    lineHeight: 1.15,
    marginTop: 6,
  },
  heroSubtitle: {
    marginTop: 10,
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 1.6,
    maxWidth: 680,
  },

  kpis: {
    marginTop: 16,
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  kpiCard: {
    borderRadius: 16,
    padding: "12px 14px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.16)",
    backdropFilter: "blur(6px)",
  },
  kpiLabel: { fontSize: 12, opacity: 0.85, fontWeight: 800 },
  kpiValue: {
    marginTop: 6,
    fontSize: 22,
    fontWeight: 900,
    letterSpacing: -0.3,
  },
  kpiTrend: { marginTop: 6, fontSize: 12, fontWeight: 800, opacity: 0.95 },

  trendUp: { color: "#bbf7d0" }, // light green
  trendDown: { color: "#fecaca" }, // light red
  trendNeutral: { color: "rgba(255,255,255,0.85)" },

  ctaBox: {
    width: 340,
    maxWidth: "100%",
    borderRadius: 18,
    padding: 18,
    background: "#ffffff",
    color: "#0f172a",
    border: "1px solid rgba(255,255,255,0.65)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  ctaTitle: { fontSize: 16, fontWeight: 900, marginBottom: 8 },
  ctaDesc: {
    fontSize: 13,
    color: "#64748b",
    lineHeight: 1.6,
    marginBottom: 12,
  },
  ctaBtn: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "none",
    background: "#1e4d8c",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  ctaBtnGhost: {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #dbe6f5",
    background: "#f7faff",
    color: "#1e4d8c",
    fontWeight: 900,
    cursor: "pointer",
    marginTop: 10,
  },

  // ===== Sections =====
  section: { marginTop: 22 },
  sectionHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  h2: { margin: 0, fontSize: 18, fontWeight: 900, color: "#0f172a" },
  subText: { fontSize: 12, color: "#64748b" },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },

  card: {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e8edf5",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
    padding: 16,
  },
  cardClickable: {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e8edf5",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
    padding: 16,
    cursor: "pointer",
    transition: "transform 0.14s ease",
  },
  cardTitle: {
    fontWeight: 900,
    color: "#0f172a",
    marginBottom: 8,
    lineHeight: 1.35,
  },
  cardMeta: { fontSize: 12, color: "#64748b" },

  // ===== Stats row (side + chart) =====
  statRow: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: 14,
    alignItems: "start",
  },
  statSideCard: {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e8edf5",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
    padding: 16,
  },
  sideTitle: { fontWeight: 900, color: "#0f172a", marginBottom: 10 },

  sideKpi: {
    borderRadius: 16,
    border: "1px solid #edf2f7",
    background: "#f8fbff",
    padding: 12,
    marginBottom: 10,
  },
  sideKpiTop: { display: "flex", gap: 10, alignItems: "center" },
  sideKpiIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#ffffff",
    border: "1px solid #dbe6f5",
    fontSize: 18,
  },
  sideKpiLabel: { fontSize: 12, color: "#64748b", fontWeight: 900 },
  sideKpiValue: {
    fontSize: 18,
    color: "#0f172a",
    fontWeight: 900,
    marginTop: 2,
  },
  sideKpiTrend: {
    fontSize: 12,
    fontWeight: 900,
    marginTop: 8,
    color: "#334155",
  },

  sparkWrap: {
    marginTop: 12,
    borderTop: "1px solid #eef2f7",
    paddingTop: 12,
  },
  sparkTitle: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 900,
    marginBottom: 8,
  },

  chartHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  chartTitle: { fontWeight: 900, color: "#0f172a" },
  chartHint: { fontSize: 12, color: "#64748b" },

  listCard: {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e8edf5",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
    overflow: "hidden",
  },
  // column version used in the 3-up recent activity grid
  listCardCol: {
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e8edf5",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
    overflow: "hidden",
    minHeight: 240,
    display: "flex",
    flexDirection: "column",
  },
  listHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 14px",
    borderBottom: "1px solid #edf2f7",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  },
  listHeaderTitle: { fontWeight: 900, color: "#0f172a" },
  moreBtn: {
    border: "1px solid #e8edf5",
    background: "#ffffff",
    borderRadius: 999,
    padding: "6px 10px",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
    color: "#1e4d8c",
  },
  borderLine: "1px solid #edf2f7",
  listItem: {
    padding: "12px 14px",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    cursor: "pointer",
  },
  listTitle: { fontWeight: 800, color: "#0f172a" },
  listMeta: { fontSize: 12, color: "#64748b", whiteSpace: "nowrap" },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    padding: "3px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    background: "#eef2ff",
    border: "1px solid #e0e7ff",
    color: "#3730a3",
    whiteSpace: "nowrap",
  },
  empty: { padding: 14, color: "#64748b" },

  bottomCta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    background: "#ffffff",
    borderRadius: 20,
    border: "1px solid #e8edf5",
    boxShadow: "0 14px 30px rgba(15, 23, 42, 0.06)",
    padding: 16,
  },
  bottomTitle: { fontWeight: 900, color: "#0f172a" },
  bottomDesc: { fontSize: 12, color: "#64748b", marginTop: 4 },
  bottomBtn: {
    padding: "10px 16px",
    borderRadius: 12,
    border: "none",
    background: "#1e4d8c",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  error: {
    marginTop: 12,
    padding: "10px 12px",
    borderRadius: 12,
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#be123c",
    fontWeight: 900,
  },
};
