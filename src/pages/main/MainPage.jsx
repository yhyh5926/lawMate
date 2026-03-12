// src/pages/main/MainPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { mainApi } from "../../api/mainApi";
import { questionApi } from "../../api/questionApi";
import { getPollList } from "../../api/communityApi";
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

export default function MainPage() {
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [noticeDetail, setNoticeDetail] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [recentQuestions, setRecentQuestions] = useState([]);
  const [recentCommunity, setRecentCommunity] = useState([]);

  const goToLogin = () => {
    window.location.href = "/member/login";
  };

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const [mainResult, questionResult, pollResult] = await Promise.allSettled([
          mainApi.getMainData(),
          questionApi.getQuestionList({}),
          getPollList(),
        ]);

        if (!alive) return;

        if (mainResult.status === "fulfilled") {
          setData(mainResult.value);
        } else {
          console.error("mainApi.getMainData failed:", mainResult.reason);
          setData(null);
          setErr("메인 정보를 불러오지 못했습니다.");
        }

        if (questionResult.status === "fulfilled") {
          const qRes = questionResult.value;
          const qList = Array.isArray(qRes?.data?.data) ? qRes.data.data : [];
          const qSorted = [...qList].sort((a, b) =>
            String(b?.createdAt ?? "").localeCompare(String(a?.createdAt ?? "")),
          );
          setRecentQuestions(qSorted.slice(0, 5));
        } else {
          console.error("questionApi.getQuestionList failed:", questionResult.reason);
          setRecentQuestions([]);
        }

        if (pollResult.status === "fulfilled") {
          const pollRes = pollResult.value;
          const pollList = Array.isArray(pollRes) ? pollRes : [];
          const pollSorted = [...pollList].sort((a, b) =>
            String(b?.createdAt ?? b?.updatedAt ?? "").localeCompare(
              String(a?.createdAt ?? a?.updatedAt ?? ""),
            ),
          );
          setRecentCommunity(pollSorted.slice(0, 5));
        } else {
          console.error("getPollList failed:", pollResult.reason);
          setRecentCommunity([]);
        }
      } catch (e) {
        console.error("MainPage unexpected load error:", e);
        if (!alive) return;
        setErr("메인 데이터를 불러오지 못했습니다.");
        setData(null);
        setRecentQuestions([]);
        setRecentCommunity([]);
      } finally {
        if (alive) setLoading(false);
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

  const recentPrecedents = useMemo(
    () => (data?.recentPrecedents ?? []).slice(0, 5),
    [data],
  );

  const recentLawyers = useMemo(
    () => (data?.recentLawyers ?? []).slice(0, 5),
    [data],
  );

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
    if (pct == null || Number.isNaN(pct)) return "변화 없음";
    const v = Math.round(pct * 10) / 10;
    if (v > 0) return `▲ ${v}%`;
    if (v < 0) return `▼ ${Math.abs(v)}%`;
    return "— 0%";
  };

  const trendStyle = (pct) => {
    if (pct == null || Number.isNaN(pct) || pct === 0) {
      return styles.trendNeutral;
    }
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

  const goCommunityDetail = (item) => {
    const pollId = item?.pollId;
    if (pollId) {
      navigate(`/community/pollList/${pollId}`);
      return;
    }

    const postId = item?.postId ?? item?.id;
    if (!postId) return;
    navigate(`/community/detail/${postId}`);
  };

  const goQuestionDetail = (q) => {
    const qid = q?.questionId ?? q?.id;
    if (!qid) return;
    navigate(`/question/detail/${qid}`);
  };

  const goPrecedentDetail = (p) => {
    const precedentId = p?.precedentId ?? p?.id;
    if (!precedentId) {
      navigate("/precedent/search");
      return;
    }
    navigate(`/precedent/detail/${precedentId}`);
  };

  const goLawyerDetail = (lawyer) => {
    const lawyerId = lawyer?.lawyerId ?? lawyer?.id;
    if (!lawyerId) {
      navigate("/lawyer/list");
      return;
    }
    navigate(`/lawyer/detail/${lawyerId}`);
  };

  const tooltipLabel = (label) => {
    if (!label) return "";
    return `일자: ${label}`;
  };

  const tooltipValue = (val) => [`${val}건`, "상담 건수"];

  const chartSummaryText = useMemo(() => {
    if (!series.length) return "아직 집계된 상담 통계 데이터가 없습니다.";
    if (weeklyChangePct == null || Number.isNaN(weeklyChangePct)) {
      return "최근 7일 상담 흐름을 기준으로 통계를 표시하고 있습니다.";
    }
    if (weeklyChangePct > 0) {
      return "이번 주 상담 수는 지난주보다 증가하는 흐름입니다.";
    }
    if (weeklyChangePct < 0) {
      return "이번 주 상담 수는 지난주보다 다소 감소했습니다.";
    }
    return "이번 주 상담 수는 지난주와 비슷한 수준입니다.";
  }, [series, weeklyChangePct]);

  return (
    <div style={styles.page}>
      <style>{`
        @media (max-width: 1080px) {
          .lm-hero { grid-template-columns: 1fr !important; }
          .lm-heroAside { width: 100% !important; }
          .lm-statRow { grid-template-columns: 1fr !important; }
          .lm-grid3 { grid-template-columns: 1fr !important; }
          .lm-grid2 { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 720px) {
          .lm-kpiGrid { grid-template-columns: 1fr !important; }
          .lm-sectionHead { flex-direction: column; align-items: flex-start !important; gap: 6px; }
        }

        @media (hover: hover) {
          .lm-hoverCard:hover {
            transform: translateY(-4px);
            box-shadow: 0 18px 36px rgba(15, 23, 42, 0.10);
          }

          .lm-listItem:hover {
            background: #f5f9ff;
            transform: translateY(-2px);
          }

          .lm-primaryBtn:hover {
            filter: brightness(0.98);
          }

          .lm-secondaryBtn:hover,
          .lm-moreBtn:hover {
            background: #eef4ff;
          }
        }

        .lm-skeleton {
          position: relative;
          overflow: hidden;
          background: #e9eef5;
        }

        .lm-skeleton::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-100%);
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,0.6),
            transparent
          );
          animation: shimmer 1.3s infinite;
        }

        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <div style={styles.wrap}>
        <section className="lm-hero" style={styles.hero}>
          <div style={styles.heroMain}>
            <div style={styles.heroBadgeRow}>
              <span style={styles.heroBadge}>LawMate</span>
              <span style={styles.heroPath}></span>
            </div>

            <div style={styles.welcomeText}>환영합니다. 필요한 법률 서비스를 빠르게 시작해보세요.</div>
            <h1 style={styles.heroTitle}>법률 상담을 더 쉽고 빠르게</h1>
            <p style={styles.heroSubtitle}>
              상담 통계, 최근 법률질문, 커뮤니티와 모의 판결 게시판까지
              한 번에 확인하고 필요한 기능으로 빠르게 이동하세요.
            </p>

            <div className="lm-kpiGrid" style={styles.heroStatGrid}>
              <div style={styles.heroStatCard}>
                <div style={styles.heroStatLabel}>📅 오늘 상담 접수</div>
                <div style={styles.heroStatValue}>{todayCount}</div>
                <div
                  style={{ ...styles.heroTrendText, ...trendStyle(todayChangePct) }}
                >
                  전일 대비 {trendText(todayChangePct)}
                </div>
              </div>

              <div style={styles.heroStatCard}>
                <div style={styles.heroStatLabel}>📈 이번 주 상담 건수</div>
                <div style={styles.heroStatValue}>{weeklyCount}</div>
                <div
                  style={{ ...styles.heroTrendText, ...trendStyle(weeklyChangePct) }}
                >
                  전주 대비 {trendText(weeklyChangePct)}
                </div>
              </div>
            </div>
          </div>

          <aside className="lm-heroAside" style={styles.heroAside}>
            <div style={styles.ctaCard}>
              <div style={styles.ctaTitle}>지금 바로 질문하세요</div>
              <div style={styles.ctaDesc}>
                질문 등록은 로그인 후 이용할 수 있습니다. 질문 목록을 먼저 둘러본 뒤
                필요한 내용을 바로 남길 수 있습니다.
              </div>

              <button
                className="lm-primaryBtn"
                style={styles.ctaPrimaryBtn}
                onClick={goToLogin}
              >
                질문 등록하기 →
              </button>

              <button
                className="lm-secondaryBtn"
                style={styles.ctaSecondaryBtn}
                onClick={() => navigate("/question/list")}
              >
                질문 목록 보기
              </button>
            </div>

            <div style={styles.trustCard}>
              <div style={styles.trustItem}>
                <span style={styles.trustDot} />
                <span>신뢰할 수 있는 법률 질문 환경</span>
              </div>
              <div style={styles.trustItem}>
                <span style={styles.trustDot} />
                <span>최신 커뮤니티와 모의 판결 게시판 제공</span>
              </div>
              <div style={styles.trustItem}>
                <span style={styles.trustDot} />
                <span>판례·변호사·질문 등록까지 한 곳에서</span>
              </div>
            </div>
          </aside>
        </section>

        {err && <div style={styles.error}>{err}</div>}

        <section style={styles.section}>
          <div className="lm-sectionHead" style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>상담 통계</h2>
              <div style={styles.sectionDesc}>
                Python 집계 결과를 기반으로 최근 상담 흐름을 보여줍니다.
              </div>
            </div>
            <span style={styles.sectionHint}>최근 7일 기준</span>
          </div>

          <div className="lm-statRow" style={styles.statRow}>
            <div style={styles.summaryPanel}>
              <div style={styles.panelTitle}>요약</div>

              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>📅</div>
                <div style={styles.metricBody}>
                  <div style={styles.metricLabel}>오늘 상담 접수</div>
                  <div style={styles.metricValue}>{todayCount}건</div>
                  <div style={{ ...styles.metricTrend, ...trendStyle(todayChangePct) }}>
                    전일 대비 {trendText(todayChangePct)}
                  </div>
                </div>
              </div>

              <div style={styles.metricCard}>
                <div style={styles.metricIcon}>📈</div>
                <div style={styles.metricBody}>
                  <div style={styles.metricLabel}>이번 주 상담 건수</div>
                  <div style={styles.metricValue}>{weeklyCount}건</div>
                  <div
                    style={{ ...styles.metricTrend, ...trendStyle(weeklyChangePct) }}
                  >
                    전주 대비 {trendText(weeklyChangePct)}
                  </div>
                </div>
              </div>

              <div style={styles.miniChartWrap}>
                <div style={styles.miniChartTitle}>최근 7일 추이</div>
                <div style={{ width: "100%", height: 84 }}>
                  {series.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={series.slice(-7)}>
                        <Area
                          type="monotone"
                          dataKey="count"
                          stroke="#1e4d8c"
                          fill="rgba(30, 77, 140, 0.12)"
                          strokeWidth={2.5}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={styles.chartEmptyMini}>데이터 없음</div>
                  )}
                </div>
              </div>

              <div style={styles.chartInsightBox}>{chartSummaryText}</div>
            </div>

            <div style={styles.chartPanel}>
              <div style={styles.chartPanelHeader}>
                <div>
                  <div style={styles.panelTitle}>주간 추이</div>
                  <div style={styles.chartSubText}>
                    {series.length
                      ? `최근일: ${String(last?.date ?? "")}`
                      : "데이터 없음"}
                  </div>
                </div>
              </div>

              <div style={{ width: "100%", height: 340 }}>
                {series.length ? (
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
                          return s.length >= 10 ? s.slice(5) : s;
                        }}
                      />
                      <YAxis tickMargin={8} />
                      <Tooltip
                        contentStyle={{
                          borderRadius: 12,
                          border: "1px solid #e8edf5",
                          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)",
                        }}
                        labelStyle={{ fontWeight: 800 }}
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
                ) : (
                  <div style={styles.chartEmpty}>아직 표시할 통계 데이터가 없습니다.</div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section style={styles.section}>
          <div className="lm-sectionHead" style={styles.sectionHeader}>
            <div>
              <h2 style={styles.sectionTitle}>최근 게시물</h2>
              <div style={styles.sectionDesc}>
                최근 게시글, 법률질문, 모의 판결 게시판 최신 항목
              </div>
            </div>
            <span style={styles.sectionHint}>각 최신 5건</span>
          </div>

          <div className="lm-grid3" style={styles.grid3}>
            <ActivityListCard
              title="📝 최근 게시글"
              onMore={() => navigate("/community/qnalist")}
              loading={loading}
              emptyText="최근 게시글이 없습니다."
              items={recentPosts}
              renderItem={(p, idx, len) => (
                <button
                  key={p.postId ?? p.id ?? idx}
                  type="button"
                  className="lm-listItem"
                  style={{
                    ...styles.listItem,
                    borderBottom: idx === len - 1 ? "none" : styles.borderLine,
                  }}
                  onClick={() => goCommunityDetail(p)}
                >
                  <div style={styles.listMain}>
                    <div style={styles.listTitle}>{p.title}</div>
                  </div>
                  <div style={styles.listMeta}>
                    {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}
                  </div>
                </button>
              )}
            />

            <ActivityListCard
              title="⚖️ 최근 법률질문"
              onMore={() => navigate("/question/list")}
              loading={loading}
              emptyText="최근 법률질문이 없습니다."
              items={recentQuestions}
              renderItem={(q, idx, len) => (
                <button
                  key={q.questionId ?? q.id ?? idx}
                  type="button"
                  className="lm-listItem"
                  style={{
                    ...styles.listItem,
                    borderBottom: idx === len - 1 ? "none" : styles.borderLine,
                  }}
                  onClick={() => goQuestionDetail(q)}
                >
                  <div style={styles.listMain}>
                    <div style={styles.questionTitleRow}>
                      <span style={styles.pill}>{q.caseType ?? "유형"}</span>
                      <span style={styles.ellipsisTitle}>{q.title}</span>
                    </div>
                    <div style={styles.subMeta}>
                      {q.status
                        ? q.status === "ANSWERED"
                          ? "답변완료"
                          : "답변대기"
                        : ""}
                    </div>
                  </div>
                  <div style={styles.listMeta}>
                    {q.createdAt ? formatShortDateTime(q.createdAt) : ""}
                  </div>
                </button>
              )}
            />

            <ActivityListCard
              title="⚖️ 모의 판결 게시판"
              onMore={() => navigate("/community/pollList")}
              loading={loading}
              emptyText="모의 판결 게시판 글이 없습니다."
              items={recentCommunity}
              renderItem={(p, idx, len) => (
                <button
                  key={p.pollId ?? p.postId ?? p.id ?? idx}
                  type="button"
                  className="lm-listItem"
                  style={{
                    ...styles.listItem,
                    borderBottom: idx === len - 1 ? "none" : styles.borderLine,
                  }}
                  onClick={() => goCommunityDetail(p)}
                >
                  <div style={styles.listMain}>
                    <div style={styles.questionTitleRow}>
                      <span
                        style={{
                          ...styles.pollStatusBadge,
                          ...(getPollStatusText(p) === "진행중"
                            ? styles.pollStatusOpen
                            : styles.pollStatusClosed),
                        }}
                      >
                        {getPollStatusText(p)}
                      </span>
                      <span style={styles.ellipsisTitle}>
                        {p.title ?? p.subject ?? "제목 없음"}
                      </span>
                    </div>
                    <div style={styles.subMeta}>
                      {getPollMetaText(p) || "모의 판결 게시판"}
                    </div>
                  </div>
                  <div style={styles.listMeta}>
                    {p.createdAt
                      ? formatShortDateTime(p.createdAt)
                      : p.updatedAt
                        ? formatShortDateTime(p.updatedAt)
                        : ""}
                  </div>
                </button>
              )}
            />
          </div>
        </section>

        <section style={{ ...styles.section, marginBottom: 26 }}>
          <div className="lm-grid2" style={styles.grid2}>
            <ActivityListCard
              title="📚 최근 판례"
              onMore={() => navigate("/precedent/search")}
              loading={loading}
              emptyText="최근 판례가 없습니다."
              items={recentPrecedents}
              renderItem={(p, idx, len) => (
                <button
                  key={p.precedentId ?? p.id ?? idx}
                  type="button"
                  className="lm-listItem"
                  style={{
                    ...styles.listItem,
                    borderBottom: idx === len - 1 ? "none" : styles.borderLine,
                  }}
                  onClick={() => goPrecedentDetail(p)}
                >
                  <div style={styles.listMain}>
                    <div style={styles.listTitle}>
                      {p.title ?? p.caseName ?? "판례 제목 없음"}
                    </div>
                    <div style={styles.subMeta}>
                      {p.caseNumber ?? p.courtName ?? p.keyword ?? ""}
                    </div>
                  </div>
                  <div style={styles.listMeta}>
                    {p.createdAt
                      ? formatShortDateTime(p.createdAt)
                      : p.judgmentDate
                        ? String(p.judgmentDate)
                        : ""}
                  </div>
                </button>
              )}
            />

            <ActivityListCard
              title="👨‍⚖️ 등록한 변호사"
              onMore={() => navigate("/lawyer/list")}
              loading={loading}
              emptyText="등록된 변호사가 없습니다."
              items={recentLawyers}
              renderItem={(lawyer, idx, len) => (
                <button
                  key={lawyer.lawyerId ?? lawyer.id ?? idx}
                  type="button"
                  className="lm-listItem"
                  style={{
                    ...styles.listItem,
                    borderBottom: idx === len - 1 ? "none" : styles.borderLine,
                  }}
                  onClick={() => goLawyerDetail(lawyer)}
                >
                  <div style={styles.listMain}>
                    <div style={styles.questionTitleRow}>
                      <span style={styles.pill}>
                        {lawyer.specialty ?? lawyer.field ?? "전문"}
                      </span>
                      <span style={styles.ellipsisTitle}>
                        {lawyer.name ?? "이름 없음"}
                      </span>
                    </div>
                    <div style={styles.subMeta}>
                      {lawyer.officeName ?? lawyer.location ?? lawyer.email ?? ""}
                    </div>
                  </div>
                  <div style={styles.listMeta}>
                    {lawyer.createdAt ? formatShortDateTime(lawyer.createdAt) : ""}
                  </div>
                </button>
              )}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function ActivityListCard({
  title,
  onMore,
  loading,
  emptyText,
  items,
  renderItem,
}) {
  return (
    <div style={styles.listCardCol}>
      <div style={styles.listHeaderRow}>
        <div style={styles.listHeaderTitle}>{title}</div>
        <button className="lm-moreBtn" style={styles.moreBtn} onClick={onMore}>
          더보기
        </button>
      </div>

      {loading ? (
        <div style={styles.listSkeletonWrap}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={idx} style={styles.listSkeletonItem}>
              <div className="lm-skeleton" style={styles.listSkeletonTitle} />
              <div className="lm-skeleton" style={styles.listSkeletonMeta} />
            </div>
          ))}
        </div>
      ) : !items?.length ? (
        <div style={styles.empty}>{emptyText}</div>
      ) : (
        items.map((item, idx) => renderItem(item, idx, items.length))
      )}
    </div>
  );
}

function formatShortDateTime(value) {
  if (!value) return "";
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const mi = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
  } catch {
    return String(value);
  }
}

function getPollStatusText(poll) {
  const status = String(
    poll?.status ?? poll?.pollStatus ?? poll?.state ?? "",
  ).toUpperCase();

  if (status.includes("END") || status.includes("CLOSE") || status.includes("DONE")) {
    return "마감";
  }
  if (status.includes("PROGRESS") || status.includes("OPEN") || status.includes("ONGOING")) {
    return "진행중";
  }

  const endAt = poll?.endAt ?? poll?.endDate ?? poll?.closedAt;
  if (endAt) {
    const endDate = new Date(endAt);
    if (!Number.isNaN(endDate.getTime())) {
      return endDate.getTime() < Date.now() ? "마감" : "진행중";
    }
  }

  return "모의 판결";
}

function getPollMetaText(poll) {
  const voteCount =
    poll?.voteCount ??
    poll?.participantCount ??
    poll?.totalVotes ??
    poll?.votes;

  if (Number.isFinite(Number(voteCount))) {
    return `${Number(voteCount)}명 참여`;
  }

  const optionCount = poll?.optionCount ?? poll?.optionsCount;
  if (Number.isFinite(Number(optionCount))) {
    return `선택지 ${Number(optionCount)}개`;
  }

  return "";
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f6fb",
    fontFamily: "'Noto Sans KR', sans-serif",
    paddingBottom: 60,
  },

  wrap: {
    width: "100%",
    maxWidth: 1240,
    margin: "0 auto",
    padding: "22px 24px 0",
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1.35fr 0.75fr",
    gap: 18,
    padding: 22,
    borderRadius: 28,
    background:
      "linear-gradient(135deg, #09152d 0%, #102a57 42%, #193f7a 100%)",
    boxShadow: "0 20px 44px rgba(15, 23, 42, 0.16)",
    border: "1px solid rgba(255,255,255,0.08)",
    marginBottom: 20,
    color: "#fff",
  },

  heroMain: {
    minWidth: 0,
  },

  heroAside: {
    width: 360,
    maxWidth: "100%",
    display: "flex",
    flexDirection: "column",
    gap: 14,
    marginLeft: "auto",
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
    justifyContent: "center",
    padding: "7px 12px",
    borderRadius: 999,
    background: "rgba(255,255,255,0.12)",
    border: "1px solid rgba(255,255,255,0.14)",
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: 1,
  },

  heroPath: {
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    fontWeight: 700,
  },

  welcomeText: {
    fontSize: 13,
    fontWeight: 700,
    color: "rgba(255,255,255,0.82)",
    marginBottom: 8,
  },

  heroTitle: {
    margin: 0,
    fontSize: 48,
    lineHeight: 1.12,
    letterSpacing: -1.4,
    fontWeight: 900,
  },

  heroSubtitle: {
    marginTop: 12,
    marginBottom: 0,
    maxWidth: 760,
    fontSize: 15,
    lineHeight: 1.75,
    color: "rgba(255,255,255,0.88)",
  },

  heroStatGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 20,
  },

  heroStatCard: {
    borderRadius: 18,
    padding: "16px 16px 14px",
    background: "rgba(255,255,255,0.10)",
    border: "1px solid rgba(255,255,255,0.14)",
    backdropFilter: "blur(8px)",
  },

  heroStatLabel: {
    fontSize: 13,
    fontWeight: 800,
    color: "rgba(255,255,255,0.84)",
  },

  heroStatValue: {
    marginTop: 6,
    fontSize: 34,
    fontWeight: 900,
    letterSpacing: -0.7,
  },

  heroTrendText: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: 800,
  },

  ctaCard: {
    borderRadius: 22,
    padding: 18,
    background: "#ffffff",
    color: "#0f172a",
    boxShadow: "0 16px 36px rgba(0,0,0,0.22)",
  },

  ctaTitle: {
    fontSize: 25,
    fontWeight: 900,
    letterSpacing: -0.6,
  },

  ctaDesc: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 1.7,
    color: "#64748b",
  },

  ctaPrimaryBtn: {
    width: "100%",
    marginTop: 16,
    border: "none",
    background: "#1e4d8c",
    color: "#fff",
    borderRadius: 14,
    padding: "13px 14px",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },

  ctaSecondaryBtn: {
    width: "100%",
    marginTop: 10,
    border: "1px solid #d7e3f4",
    background: "#f8fbff",
    color: "#1e4d8c",
    borderRadius: 14,
    padding: "12px 14px",
    fontSize: 14,
    fontWeight: 900,
    cursor: "pointer",
  },

  trustCard: {
    borderRadius: 20,
    padding: "14px 16px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
  },

  trustItem: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    color: "rgba(255,255,255,0.92)",
    fontSize: 13,
    lineHeight: 1.6,
    marginBottom: 8,
  },

  trustDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: "#93c5fd",
    flexShrink: 0,
  },

  section: {
    marginTop: 24,
  },

  sectionHeader: {
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  sectionTitle: {
    margin: 0,
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: -0.8,
    color: "#0f172a",
  },

  sectionDesc: {
    marginTop: 4,
    color: "#64748b",
    fontSize: 13,
  },

  sectionHint: {
    fontSize: 12,
    fontWeight: 700,
    color: "#64748b",
  },

  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 16,
  },

  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 16,
  },

  statRow: {
    display: "grid",
    gridTemplateColumns: "360px 1fr",
    gap: 16,
    alignItems: "start",
  },

  summaryPanel: {
    background: "#fff",
    border: "1px solid #e7edf5",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 12px 26px rgba(15, 23, 42, 0.05)",
  },

  chartPanel: {
    background: "#fff",
    border: "1px solid #e7edf5",
    borderRadius: 24,
    padding: 16,
    boxShadow: "0 12px 26px rgba(15, 23, 42, 0.05)",
  },

  chartPanelHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  panelTitle: {
    fontSize: 20,
    fontWeight: 900,
    color: "#0f172a",
  },

  chartSubText: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 4,
  },

  metricCard: {
    display: "flex",
    gap: 12,
    alignItems: "center",
    border: "1px solid #edf2f7",
    background: "#f8fbff",
    borderRadius: 18,
    padding: 14,
    marginTop: 12,
  },

  metricIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: "#fff",
    border: "1px solid #dbe6f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 20,
    flexShrink: 0,
  },

  metricBody: {
    minWidth: 0,
  },

  metricLabel: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 900,
  },

  metricValue: {
    marginTop: 2,
    fontSize: 28,
    color: "#0f172a",
    fontWeight: 900,
    letterSpacing: -0.6,
  },

  metricTrend: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 900,
  },

  miniChartWrap: {
    marginTop: 16,
    paddingTop: 14,
    borderTop: "1px solid #edf2f7",
  },

  miniChartTitle: {
    fontSize: 12,
    color: "#64748b",
    fontWeight: 900,
    marginBottom: 8,
  },

  chartInsightBox: {
    marginTop: 14,
    borderRadius: 16,
    background: "#f8fbff",
    border: "1px solid #e7edf5",
    padding: "12px 14px",
    color: "#334155",
    lineHeight: 1.65,
    fontSize: 13,
    fontWeight: 700,
  },

  chartEmpty: {
    height: "100%",
    borderRadius: 18,
    border: "1px dashed #dbe5f3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    background: "#fbfdff",
    fontSize: 14,
    fontWeight: 700,
  },

  chartEmptyMini: {
    height: "100%",
    borderRadius: 14,
    border: "1px dashed #dbe5f3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    background: "#fbfdff",
    fontSize: 12,
    fontWeight: 700,
  },

  listCardCol: {
    background: "#ffffff",
    borderRadius: 24,
    border: "1px solid #e7edf5",
    boxShadow: "0 12px 26px rgba(15, 23, 42, 0.05)",
    overflow: "hidden",
    minHeight: 320,
    display: "flex",
    flexDirection: "column",
  },

  listHeaderRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 16px",
    borderBottom: "1px solid #edf2f7",
    background: "linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)",
  },

  listHeaderTitle: {
    fontSize: 18,
    fontWeight: 900,
    color: "#0f172a",
  },

  moreBtn: {
    border: "1px solid #dbe5f3",
    background: "#fff",
    borderRadius: 999,
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 900,
    cursor: "pointer",
    color: "#1e4d8c",
  },

  borderLine: "1px solid #edf2f7",

  listItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 14,
    width: "100%",
    textAlign: "left",
    padding: "14px 16px",
    background: "#fff",
    border: "none",
    cursor: "pointer",
    transition: "all 0.16s ease",
  },

  listMain: {
    minWidth: 0,
    flex: 1,
  },

  listTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#0f172a",
    lineHeight: 1.45,
    wordBreak: "break-word",
  },

  listMeta: {
    fontSize: 12,
    color: "#64748b",
    whiteSpace: "nowrap",
    flexShrink: 0,
    paddingTop: 2,
  },

  subMeta: {
    marginTop: 6,
    fontSize: 12,
    color: "#64748b",
    fontWeight: 700,
  },

  questionTitleRow: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    minWidth: 0,
  },

  ellipsisTitle: {
    minWidth: 0,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    display: "block",
    fontWeight: 800,
    color: "#0f172a",
  },

  pill: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 900,
    background: "#eef2ff",
    border: "1px solid #e0e7ff",
    color: "#3730a3",
    flexShrink: 0,
  },

  pollStatusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4px 8px",
    borderRadius: 999,
    fontSize: 11,
    fontWeight: 900,
    flexShrink: 0,
    border: "1px solid transparent",
  },

  pollStatusOpen: {
    background: "#ecfdf3",
    color: "#15803d",
    borderColor: "#bbf7d0",
  },

  pollStatusClosed: {
    background: "#fff1f2",
    color: "#be123c",
    borderColor: "#fecdd3",
  },

  empty: {
    padding: 18,
    color: "#64748b",
    fontSize: 14,
  },

  error: {
    marginTop: 12,
    padding: "12px 14px",
    borderRadius: 14,
    background: "#fff1f2",
    border: "1px solid #fecdd3",
    color: "#be123c",
    fontWeight: 900,
  },

  trendUp: {
    color: "#bbf7d0",
  },

  trendDown: {
    color: "#fecaca",
  },

  trendNeutral: {
    color: "#e2e8f0",
  },

  listSkeletonWrap: {
    padding: "6px 0",
  },

  listSkeletonItem: {
    padding: "14px 16px",
    borderBottom: "1px solid #edf2f7",
  },

  listSkeletonTitle: {
    height: 16,
    width: "68%",
    borderRadius: 8,
  },

  listSkeletonMeta: {
    marginTop: 10,
    height: 12,
    width: "34%",
    borderRadius: 8,
  },
};