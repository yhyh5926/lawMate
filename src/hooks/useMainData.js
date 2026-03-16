import { useEffect, useMemo, useState } from "react";
import { mainApi } from "../api/mainApi";

export function useMainData() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  console.log(data);
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const response = await mainApi.getMainData();
        if (!alive) return;

        // 백엔드 MainResponseDTO 구조에 맞춰 데이터 저장
        setData(response.data || response);
      } catch (e) {
        console.error("MainPage load error:", e);
        if (alive) setErr("메인 데이터를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // --- [데이터 가공 섹션] ---

  // 1. 공지사항 (최신 3건)
  const topNotices = useMemo(() => data?.topNotices ?? [], [data]);

  // 2. 일반 게시글 (최신 5건)
  const recentPosts = useMemo(() => data?.recentPosts ?? [], [data]);

  // 3. 최근 판례
  const recentPrecedents = useMemo(() => data?.precedents ?? [], [data]);

  // 4. 최근 등록 변호사
  const recentLawyers = useMemo(() => data?.lawyers ?? [], [data]);

  // 5. 최근 모의 판결 (polls)
  const recentPolls = useMemo(() => data?.polls ?? [], [data]);

  // 6. 최근 법률 질문 (questions)
  // 컴포넌트에서 사용하는 이름인 'recentQuestions'로 내보냅니다.
  const recentQuestions = useMemo(() => data?.questions ?? [], [data]);

  // --- [통계/차트 로직] ---
  const stats = data?.stats ?? { todayCount: 0, weeklyCount: 0, series: [] };
  const series = useMemo(() => {
    const raw = Array.isArray(stats.series) ? stats.series : [];
    return [...raw]
      .filter((d) => d && d.date != null)
      .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  }, [stats.series]);

  const last = series[series.length - 1];
  const prev = series[series.length - 2];

  const todayCount = stats.todayCount || (last?.count ?? 0);
  const weeklyCount = stats.weeklyCount || 0;

  const todayChangePct = useMemo(() => {
    const a = Number(last?.count ?? todayCount);
    const b = Number(prev?.count ?? 0);
    return b ? ((a - b) / b) * 100 : null;
  }, [last, prev, todayCount]);

  const weeklyChangePct = useMemo(() => {
    const last7 = series.slice(-7);
    const prev7 = series.slice(-14, -7);
    const a = last7.reduce((s, d) => s + Number(d?.count ?? 0), 0);
    const b = prev7.reduce((s, d) => s + Number(d?.count ?? 0), 0);
    return b ? ((a - b) / b) * 100 : null;
  }, [series]);

  const chartSummaryText = useMemo(() => {
    if (!series.length) return "아직 집계된 상담 통계 데이터가 없습니다.";
    if (weeklyChangePct == null) return "최근 상담 흐름을 분석 중입니다.";
    if (weeklyChangePct > 0)
      return "이번 주 상담 수가 지난주보다 증가했습니다.";
    if (weeklyChangePct < 0)
      return "이번 주 상담 수가 지난주보다 감소했습니다.";
    return "이번 주 상담 수는 지난주와 비슷한 수준입니다.";
  }, [series, weeklyChangePct]);

  return {
    loading,
    err,
    series,
    todayCount,
    weeklyCount,
    todayChangePct,
    weeklyChangePct,
    chartSummaryText,
    topNotices,
    recentPosts,
    recentPrecedents,
    recentLawyers,
    recentPolls,
    recentQuestions,
  };
}
