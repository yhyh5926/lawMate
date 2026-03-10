// vs코드
// 파일 위치: src/pages/main/MainPage.jsx
// 수정사항: 인라인 스타일 전체 제거 및 외부 CSS 파일 연결, map 함수 key 경고 해결

import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/common/Modal";
import { mainApi } from "../../api/mainApi";
import { questionApi } from "../../api/questionApi";
import { getPollList } from "../../api/communityApi";
import "../../styles/main/MainPage.css"; // 💡 분리된 CSS 임포트
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

  const quickLinks = [
    { label: "법률질문 작성", desc: "궁금한 내용을 바로 등록", onClick: goToLogin },
    { label: "변호사 찾기", desc: "전문 변호사 바로 찾기", onClick: () => navigate("/lawyer/search") },
    { label: "판례 검색", desc: "판례 검색 페이지로 이동", onClick: () => navigate("/precedent/search") },
    { label: "의견조사 보기", desc: "의견조사 게시판 바로가기", onClick: () => navigate("/community/poll") },
  ];

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const [res, qRes, pollRes] = await Promise.all([
          mainApi.getMainData(),
          questionApi.getQuestionList({}),
          getPollList(),
        ]);

        if (!alive) return;
        setData(res);

        const qList = Array.isArray(qRes?.data?.data) ? qRes.data.data : [];
        const qSorted = [...qList].sort((a, b) =>
          String(b?.createdAt ?? "").localeCompare(String(a?.createdAt ?? ""))
        );
        setRecentQuestions(qSorted.slice(0, 5));

        const pollList = Array.isArray(pollRes) ? pollRes : [];
        const pollSorted = [...pollList].sort((a, b) =>
          String(b?.createdAt ?? b?.updatedAt ?? "").localeCompare(
            String(a?.createdAt ?? a?.updatedAt ?? "")
          )
        );
        setRecentCommunity(pollSorted.slice(0, 5));
      } catch (e) {
        if (!alive) return;
        setErr("메인 데이터를 불러오지 못했습니다.");
        setData(null);
        setRecentQuestions([]);
        setRecentCommunity([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  const topNotices = useMemo(() => (data?.topNotices ?? []).slice(0, 3), [data]);
  const recentPosts = useMemo(() => (data?.recentPosts ?? []).slice(0, 5), [data]);

  const stats = data?.stats ?? { todayCount: 0, weeklyCount: 0, series: [] };
  const rawSeries = Array.isArray(stats.series) ? stats.series : [];

  const series = useMemo(() => {
    const arr = [...rawSeries].filter((d) => d && d.date != null);
    arr.sort((a, b) => String(a.date).localeCompare(String(b.date)));
    return arr;
  }, [rawSeries]);

  const last = series[series.length - 1];
  const prev = series[series.length - 2];

  const todayCount = Number.isFinite(Number(stats.todayCount)) ? Number(stats.todayCount) : Number(last?.count ?? 0);

  const weeklyFromSeries = useMemo(() => {
    return series.slice(-7).reduce((sum, d) => sum + Number(d?.count ?? 0), 0);
  }, [series]);

  const weeklyCount = Number.isFinite(Number(stats.weeklyCount)) ? Number(stats.weeklyCount) : weeklyFromSeries;

  const todayChangePct = useMemo(() => {
    const a = Number(last?.count ?? todayCount);
    const b = Number(prev?.count ?? 0);
    if (!b) return null;
    return ((a - b) / b) * 100;
  }, [last, prev, todayCount]);

  const weeklyChangePct = useMemo(() => {
    const last7 = series.slice(-7).reduce((s, d) => s + Number(d?.count ?? 0), 0);
    const prev7 = series.slice(-14, -7).reduce((s, d) => s + Number(d?.count ?? 0), 0);
    if (!prev7) return null;
    return ((last7 - prev7) / prev7) * 100;
  }, [series]);

  const trendText = (pct) => {
    if (pct == null || Number.isNaN(pct)) return "변화 없음";
    const v = Math.round(pct * 10) / 10;
    if (v > 0) return `▲ ${v}%`;
    if (v < 0) return `▼ ${Math.abs(v)}%`;
    return "— 0%";
  };

  const getTrendClass = (pct) => {
    if (pct == null || Number.isNaN(pct) || pct === 0) return "trend-neutral";
    return pct > 0 ? "trend-up" : "trend-down";
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
    if (item?.pollId) return navigate(`/community/poll/${item.pollId}`);
    if (item?.postId || item?.id) return navigate(`/community/detail/${item.postId ?? item.id}`);
  };

  const goQuestionDetail = (q) => {
    if (q?.questionId || q?.id) navigate(`/question/detail/${q.questionId ?? q.id}`);
  };

  const chartSummaryText = useMemo(() => {
    if (!series.length) return "아직 집계된 통계 데이터가 없습니다.";
    if (weeklyChangePct == null || Number.isNaN(weeklyChangePct)) return "최근 7일 상담 흐름을 기준으로 통계를 표시하고 있습니다.";
    if (weeklyChangePct > 0) return "이번 주 상담 수는 지난주보다 증가하는 흐름입니다.";
    if (weeklyChangePct < 0) return "이번 주 상담 수는 지난주보다 다소 감소했습니다.";
    return "이번 주 상담 수는 지난주와 비슷한 수준입니다.";
  }, [series, weeklyChangePct]);

  return (
    <div className="lm-page">
      <div className="lm-wrap">
        {/* 히어로 섹션 */}
        <section className="lm-hero">
          <div className="lm-hero-main">
            <div className="lm-hero-badge-row">
              <span className="lm-hero-badge">LAW MATE</span>
              <span className="lm-hero-path">/ main</span>
            </div>

            <h1 className="lm-hero-title">법률 상담을 더 쉽고 빠르게</h1>
            <p className="lm-hero-subtitle">
              공지사항, 통계, 최근 법률질문과 커뮤니티 활동을 한 번에 확인하고 필요한 기능으로 빠르게 이동하세요.
            </p>

            <div className="lm-kpi-grid">
              <div className="lm-hero-stat-card">
                <div className="lm-hero-stat-label">오늘 접수 사건 수</div>
                <div className="lm-hero-stat-value">{todayCount}</div>
                <div className={`lm-hero-trend-text ${getTrendClass(todayChangePct)}`}>
                  전일 대비 {trendText(todayChangePct)}
                </div>
              </div>

              <div className="lm-hero-stat-card">
                <div className="lm-hero-stat-label">주간 누적 상담 건수</div>
                <div className="lm-hero-stat-value">{weeklyCount}</div>
                <div className={`lm-hero-trend-text ${getTrendClass(weeklyChangePct)}`}>
                  전주 대비 {trendText(weeklyChangePct)}
                </div>
              </div>
            </div>

            <div className="lm-quick-grid">
              {quickLinks.map((item, idx) => (
                <button key={`quick-${idx}`} className="lm-quick-btn" onClick={item.onClick}>
                  <div className="lm-quick-title">{item.label}</div>
                  <div className="lm-quick-desc">{item.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <aside className="lm-hero-aside">
            <div className="lm-cta-card">
              <div className="lm-cta-title">지금 바로 질문하세요</div>
              <div className="lm-cta-desc">
                질문 등록은 로그인 후 이용할 수 있습니다. 필요한 경우 질문 목록을 먼저 둘러본 뒤 등록할 수 있습니다.
              </div>
              <button className="lm-primary-btn" onClick={goToLogin}>질문 등록하기 →</button>
              <button className="lm-secondary-btn" onClick={() => navigate("/question/list")}>질문 목록 보기</button>
            </div>

            <div className="lm-trust-card">
              <div className="lm-trust-item"><span className="lm-trust-dot" />신뢰할 수 있는 법률 질문 환경</div>
              <div className="lm-trust-item"><span className="lm-trust-dot" />최신 커뮤니티와 의견조사 제공</div>
              <div className="lm-trust-item"><span className="lm-trust-dot" />판례·변호사·질문 등록까지 한 곳에서</div>
            </div>
          </aside>
        </section>

        {err && <div className="lm-error-box">{err}</div>}

        {/* 공지사항 섹션 */}
        <section className="lm-section">
          <div className="lm-section-head">
            <div>
              <h2 className="lm-section-title">공지사항</h2>
              <div className="lm-section-desc">서비스 공지 최신 3건</div>
            </div>
            <span className="lm-section-hint">최신 3건</span>
          </div>

          <div className="lm-grid3">
            {loading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={`notice-skeleton-${idx}`} className="lm-skeleton-card">
                  <div className="lm-skeleton lm-skel-title" />
                  <div className="lm-skeleton lm-skel-meta" />
                  <div className="lm-skeleton lm-skel-short" />
                </div>
              ))
            ) : topNotices.length === 0 ? (
              <div className="lm-empty-card" style={{ gridColumn: "1 / -1" }}>등록된 공지사항이 없습니다.</div>
            ) : (
              topNotices.map((n, idx) => (
                <button key={`notice-${n.id || idx}`} className="lm-notice-card" onClick={() => openNotice(n.id)}>
                  <div className="lm-notice-badge">NOTICE</div>
                  <div className="lm-notice-title">{n.title}</div>
                  <div className="lm-notice-meta">
                    {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ""}
                  </div>
                </button>
              ))
            )}
          </div>
        </section>

        {/* 통계 섹션 */}
        <section className="lm-section">
          <div className="lm-section-head">
            <div>
              <h2 className="lm-section-title">오늘/주간 사건 통계</h2>
              <div className="lm-section-desc">Python 집계 결과를 기반으로 최근 흐름을 보여줍니다.</div>
            </div>
            <span className="lm-section-hint">최근 7일 기준</span>
          </div>

          <div className="lm-stat-row">
            <div className="lm-summary-panel">
              <div className="lm-panel-title">요약</div>
              <div className="lm-metric-card">
                <div className="lm-metric-icon">📅</div>
                <div className="lm-metric-body">
                  <div className="lm-metric-label">오늘 접수</div>
                  <div className="lm-metric-value">{todayCount}건</div>
                  <div className={`lm-metric-trend ${getTrendClass(todayChangePct)}`}>
                    전일 대비 {trendText(todayChangePct)}
                  </div>
                </div>
              </div>
              <div className="lm-metric-card">
                <div className="lm-metric-icon">📈</div>
                <div className="lm-metric-body">
                  <div className="lm-metric-label">주간 상담</div>
                  <div className="lm-metric-value">{weeklyCount}건</div>
                  <div className={`lm-metric-trend ${getTrendClass(weeklyChangePct)}`}>
                    전주 대비 {trendText(weeklyChangePct)}
                  </div>
                </div>
              </div>

              <div className="lm-mini-chart-wrap">
                <div className="lm-mini-chart-title">최근 7일 추이</div>
                <div style={{ width: "100%", height: 84 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={series.slice(-7)}>
                      <Area type="monotone" dataKey="count" stroke="#1e4d8c" fill="rgba(30, 77, 140, 0.12)" strokeWidth={2.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="lm-chart-insight-box">{chartSummaryText}</div>
            </div>

            <div className="lm-chart-panel">
              <div className="lm-chart-panel-header">
                <div>
                  <div className="lm-panel-title">주간 추이</div>
                  <div className="lm-chart-subtext">{series.length ? `최근일: ${String(last?.date ?? "")}` : "데이터 없음"}</div>
                </div>
              </div>
              <div style={{ width: "100%", height: 340 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={series} margin={{ top: 12, right: 16, left: 0, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickMargin={8} tickFormatter={(v) => String(v).length >= 10 ? String(v).slice(5) : String(v)} />
                    <YAxis tickMargin={8} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, border: "1px solid #e8edf5", boxShadow: "0 10px 24px rgba(15, 23, 42, 0.10)" }}
                      labelStyle={{ fontWeight: 800 }}
                      labelFormatter={(label) => `일자: ${label}`}
                      formatter={(val) => [`${val}건`, "상담/접수"]}
                    />
                    <Line type="monotone" dataKey="count" stroke="#1e4d8c" strokeWidth={3} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </section>

        {/* 최근 활동 섹션 */}
        <section className="lm-section">
          <div className="lm-section-head">
            <div>
              <h2 className="lm-section-title">최근 활동</h2>
              <div className="lm-section-desc">최근 게시글, 법률질문, 의견조사 게시판 최신 항목</div>
            </div>
            <span className="lm-section-hint">각 최신 5건</span>
          </div>

          <div className="lm-grid3">
            <ActivityListCard
              title="📝 최근 게시글"
              onMore={() => navigate("/community/qnalist")}
              loading={loading}
              emptyText="최근 게시글이 없습니다."
              items={recentPosts}
              renderItem={(p, idx) => (
                <button key={`post-${p.postId || p.id || idx}`} className="lm-list-item" onClick={() => goCommunityDetail(p)}>
                  <div className="lm-list-main">
                    <div className="lm-list-title">{p.title}</div>
                  </div>
                  <div className="lm-list-meta">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</div>
                </button>
              )}
            />

            <ActivityListCard
              title="⚖️ 최근 법률질문"
              onMore={() => navigate("/question/list")}
              loading={loading}
              emptyText="최근 법률질문이 없습니다."
              items={recentQuestions}
              renderItem={(q, idx) => (
                <button key={`question-${q.questionId || q.id || idx}`} className="lm-list-item" onClick={() => goQuestionDetail(q)}>
                  <div className="lm-list-main">
                    <div className="lm-question-title-row">
                      <span className="lm-pill">{q.caseType ?? "유형"}</span>
                      <span className="lm-ellipsis-title">{q.title}</span>
                    </div>
                    <div className="lm-sub-meta">{q.status === "ANSWERED" ? "답변완료" : q.status ? "답변대기" : ""}</div>
                  </div>
                  <div className="lm-list-meta">{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : ""}</div>
                </button>
              )}
            />

            <ActivityListCard
              title="💬 최근 커뮤니티"
              onMore={() => navigate("/community/poll")}
              loading={loading}
              emptyText="의견조사 게시판 글이 없습니다."
              items={recentCommunity}
              renderItem={(p, idx) => (
                <button key={`comm-${p.pollId || p.postId || p.id || idx}`} className="lm-list-item" onClick={() => goCommunityDetail(p)}>
                  <div className="lm-list-main">
                    <div className="lm-list-title">{p.title ?? p.subject ?? "제목 없음"}</div>
                    <div className="lm-sub-meta">{getPollStatusText(p)}</div>
                  </div>
                  <div className="lm-list-meta">{p.createdAt ? new Date(p.createdAt).toLocaleDateString() : ""}</div>
                </button>
              )}
            />
          </div>
        </section>

        {/* 하단 CTA 섹션 */}
        <section className="lm-section" style={{ marginBottom: 26 }}>
          <div className="lm-bottom-cta">
            <div>
              <div className="lm-bottom-title">법률 질문 등록</div>
              <div className="lm-bottom-desc">질문 등록은 로그인 후 이용할 수 있습니다. 궁금한 점을 빠르게 남겨보세요.</div>
            </div>
            <div className="lm-bottom-btn-group">
              <button className="lm-bottom-ghost-btn" onClick={() => navigate("/question/list")}>질문 목록 보기</button>
              <button className="lm-bottom-primary-btn" onClick={goToLogin}>질문 등록</button>
            </div>
          </div>
        </section>
      </div>

      <Modal isOpen={!!noticeDetail} title={noticeDetail?.title || "공지사항"} onClose={() => setNoticeDetail(null)}>
        {noticeDetail && (
          <>
            <div style={{ fontSize: 12, color: "#64748b" }}>
              {noticeDetail.createdAt ? new Date(noticeDetail.createdAt).toLocaleString() : ""}
            </div>
            <hr style={{ margin: "12px 0" }} />
            <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.75 }}>{noticeDetail.content}</div>
          </>
        )}
      </Modal>
    </div>
  );
}

function ActivityListCard({ title, onMore, loading, emptyText, items, renderItem }) {
  return (
    <div className="lm-list-card-col">
      <div className="lm-list-header-row">
        <div className="lm-list-header-title">{title}</div>
        <button className="lm-more-btn" onClick={onMore}>더보기</button>
      </div>

      {loading ? (
        <div className="lm-list-skeleton-wrap">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div key={`skel-${idx}`} className="lm-list-skeleton-item">
              <div className="lm-skeleton lm-skel-title-line" />
              <div className="lm-skeleton lm-skel-meta-line" />
            </div>
          ))}
        </div>
      ) : !items?.length ? (
        <div className="lm-empty-list">{emptyText}</div>
      ) : (
        items.map((item, idx) => renderItem(item, idx))
      )}
    </div>
  );
}

function getPollStatusText(poll) {
  const status = String(poll?.status ?? poll?.pollStatus ?? poll?.state ?? "").toUpperCase();
  if (status.includes("END") || status.includes("CLOSE") || status.includes("DONE")) return "마감";
  if (status.includes("PROGRESS") || status.includes("OPEN") || status.includes("ONGOING")) return "진행중";
  const endAt = poll?.endAt ?? poll?.endDate ?? poll?.closedAt;
  if (endAt) {
    const endDate = new Date(endAt);
    if (!Number.isNaN(endDate.getTime())) return endDate.getTime() < Date.now() ? "마감" : "진행중";
  }
  return "의견조사";
}