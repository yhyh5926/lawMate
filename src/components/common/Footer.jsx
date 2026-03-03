import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import Modal from "../../components/common/Modal";
import { mainApi } from "../../api/mainApi";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function MainPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  const [data, setData] = useState(null);
  const [noticeDetail, setNoticeDetail] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      setErr("");
      try {
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

  const topNotices = useMemo(() => (data?.topNotices ?? []).slice(0, 3), [data]);
  const recentPosts = useMemo(() => (data?.recentPosts ?? []).slice(0, 5), [data]);

  const stats = data?.stats ?? { todayCount: 0, weeklyCount: 0, series: [] };
  const series = Array.isArray(stats.series) ? stats.series : [];

  const openNotice = async (id) => {
    try {
      const detail = await mainApi.getNoticeDetail(id);
      setNoticeDetail(detail);
    } catch (e) {
      window.alert("공지 상세를 불러오지 못했습니다.");
    }
  };

  const goWriteQuestion = () => {
    if (!isAuthenticated) return navigate("/member/login.do");
    navigate("/question/write.do");
  };

  const goCommunityDetail = (p) => {
    const postId = p?.postId ?? p?.id;
    if (!postId) return;
    navigate(`/community/detail/${postId}`);
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        {/* HERO */}
        <div style={styles.hero}>
          <div style={styles.heroInner}>
            <div>
              <div style={styles.heroBadge}>LawMate</div>
              <h1 style={styles.heroTitle}>법률 상담을 더 빠르고, 더 정확하게</h1>
              <p style={styles.heroDesc}>
                공지 · 통계 · 커뮤니티 최신 글을 한 번에 확인하고 바로 질문을 등록하세요.
              </p>
              <div style={styles.heroActions}>
                <button style={styles.primaryBtn} onClick={goWriteQuestion}>
                  ✍️ 법률 질문 바로 등록
                </button>
                <button
                  style={styles.secondaryBtn}
                  onClick={() => navigate("/question/list.do")}
                >
                  📄 질문 목록 보기
                </button>
              </div>
              {!isAuthenticated && (
                <div style={styles.hint}>
                  비로그인 상태면 질문 등록 시 로그인 페이지로 이동합니다.
                </div>
              )}
            </div>

            {/* KPI mini cards */}
            <div style={styles.heroKpis}>
              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>오늘 접수 사건 수</div>
                <div style={styles.kpiValue}>{stats.todayCount ?? 0}</div>
              </div>
              <div style={styles.kpiCard}>
                <div style={styles.kpiLabel}>주간 누적 상담 건수</div>
                <div style={styles.kpiValue}>{stats.weeklyCount ?? 0}</div>
              </div>
            </div>
          </div>
        </div>

        {err && <div style={styles.error}>{err}</div>}

        {/* 공지사항 3건 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>📌 공지사항</h2>
            <span style={styles.subText}>최신 3건</span>
          </div>

          <div style={styles.grid3}>
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
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 통계 + 차트 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>📈 오늘/주간 사건 통계</h2>
            <span style={styles.subText}>Python 집계 → React 차트</span>
          </div>

          <div style={styles.chartCard}>
            <div style={styles.chartTitle}>주간 추이</div>
            <div style={{ width: "100%", height: 280 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#1e4d8c"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        {/* 최근 게시글 5건 */}
        <section style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.h2}>📝 최근 게시글</h2>
            <span style={styles.subText}>최신 5건</span>
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
                      idx === recentPosts.length - 1 ? "none" : styles.borderLine,
                  }}
                  onClick={() => goCommunityDetail(p)}
                  role="button"
                  tabIndex={0}
                >
                  <div style={styles.listTitle}>{p.title}</div>
                  <div style={styles.listMeta}>
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* 하단 CTA */}
        <section style={{ ...styles.section, marginBottom: 12 }}>
          <div style={styles.bottomCta}>
            <div>
              <div style={styles.bottomTitle}>바로 질문을 등록해보세요</div>
              <div style={styles.bottomDesc}>
                비로그인 상태면 로그인 페이지로 이동합니다.
              </div>
            </div>
            <button style={styles.primaryBtn} onClick={goWriteQuestion}>
              질문 등록
            </button>
          </div>
        </section>
      </div>

      {/* 레이어 팝업 */}
      {noticeDetail && (
        <Modal onClose={() => setNoticeDetail(null)}>
          <h3 style={{ margin: 0 }}>{noticeDetail.title}</h3>
          <div style={{ marginTop: 8, color: "#64748b", fontSize: 12 }}>
            {noticeDetail.createdAt
              ? new Date(noticeDetail.createdAt).toLocaleString()
              : ""}
          </div>
          <hr style={{ margin: "12px 0" }} />
          <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {noticeDetail.content}
          </div>
        </Modal>
      )}
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

  hero: {
    borderRadius: 18,
    overflow: "hidden",
    background: "linear-gradient(135deg, #0f2244 0%, #1e4d8c 55%, #2d6bc4 100%)",
    color: "#fff",
    marginBottom: 26,
    boxShadow: "0 14px 38px rgba(15,34,68,0.25)",
  },
  heroInner: {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.7fr",
    gap: 18,
    padding: "26px 22px",
    alignItems: "start",
  },
  heroBadge: {
    display: "inline-block",
    background: "rgba(255,255,255,0.16)",
    border: "1px solid rgba(255,255,255,0.22)",
    padding: "6px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  heroTitle: {
    margin: "0 0 8px",
    fontSize: 28,
    lineHeight: 1.2,
    fontWeight: 900,
  },
  heroDesc: {
    margin: 0,
    opacity: 0.92,
    fontSize: 14,
    lineHeight: 1.6,
  },
  heroActions: {
    display: "flex",
    gap: 10,
    marginTop: 14,
    flexWrap: "wrap",
  },
  heroKpis: {
    display: "grid",
    gap: 12,
  },

  section: { marginBottom: 28 },
  sectionHeader: {
    display: "flex",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  h2: { margin: 0, fontSize: 20, color: "#0f172a" },
  subText: { fontSize: 12, color: "#64748b" },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 14,
  },

  borderLine: "1px solid #e5e7eb",

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  },
  cardClickable: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
    cursor: "pointer",
    transition: "transform 0.15s ease",
  },
  cardTitle: { fontWeight: 900, color: "#0f172a", marginBottom: 8 },
  cardMeta: { fontSize: 12, color: "#64748b" },

  kpiCard: {
    background: "rgba(255,255,255,0.14)",
    border: "1px solid rgba(255,255,255,0.22)",
    borderRadius: 16,
    padding: 14,
  },
  kpiLabel: { fontSize: 12, opacity: 0.92, marginBottom: 6 },
  kpiValue: { fontSize: 26, fontWeight: 900 },

  chartCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  },
  chartTitle: { fontWeight: 900, marginBottom: 12, color: "#0f172a" },

  listCard: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    overflow: "hidden",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  },
  listItem: {
    padding: "12px 14px",
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    cursor: "pointer",
  },
  listTitle: { fontWeight: 800, color: "#0f172a" },
  listMeta: { fontSize: 12, color: "#64748b", whiteSpace: "nowrap" },
  empty: { padding: 14, color: "#64748b" },

  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "none",
    background: "#1e4d8c",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.35)",
    background: "rgba(255,255,255,0.12)",
    color: "#fff",
    fontWeight: 900,
    cursor: "pointer",
  },
  hint: { marginTop: 10, fontSize: 12, opacity: 0.9 },

  bottomCta: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 16,
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.06)",
  },
  bottomTitle: { fontWeight: 900, color: "#0f172a" },
  bottomDesc: { fontSize: 12, color: "#64748b", marginTop: 4 },

  error: {
    margin: "10px 0 0",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#be123c",
    fontWeight: 800,
  },
};