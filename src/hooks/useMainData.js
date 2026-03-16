import { useEffect, useMemo, useState, useCallback } from "react";
import { mainApi } from "../api/mainApi";

export function useMainData() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  // 💡 1. 데이터 호출 로직을 독립적인 함수로 분리
  const fetchMainData = useCallback(async (isAlive) => {
    try {
      setLoading(true);
      setErr("");
      const response = await mainApi.getMainData();

      if (isAlive) {
        setData(response.data || response);
      }
    } catch (e) {
      console.error("MainPage load error:", e);
      if (isAlive) setErr("메인 데이터를 불러오지 못했습니다.");
    } finally {
      if (isAlive) setLoading(false);
    }
  }, []);

  // 💡 2. 생명주기 및 이벤트 리스너 관리
  useEffect(() => {
    let alive = true;

    // 초기 로드
    fetchMainData(alive);

    // 사용자가 다른 탭/창에 갔다가 다시 메인으로 돌아왔을 때 자동 갱신
    // (다른 곳에서 글 삭제 후 메인 탭으로 돌아오면 바로 반영됨)
    const handleFocus = () => fetchMainData(alive);
    window.addEventListener("focus", handleFocus);

    return () => {
      alive = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchMainData]);

  // --- [데이터 가공 섹션] --- (기존 로직 유지)
  const topNotices = useMemo(() => data?.topNotices ?? [], [data]);
  const recentPosts = useMemo(() => data?.recentPosts ?? [], [data]);
  const recentPrecedents = useMemo(() => data?.precedents ?? [], [data]);
  const recentLawyers = useMemo(() => data?.lawyers ?? [], [data]);
  const recentPolls = useMemo(() => data?.polls ?? [], [data]);
  const recentQuestions = useMemo(() => data?.questions ?? [], [data]);

  // --- [통계/차트 로직] --- (기존 로직 유지)
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
    refresh: () => fetchMainData(true), // 💡 필요시 수동 새로고침용 함수 제공
  };
}
