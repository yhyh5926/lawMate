import { useEffect, useMemo, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { mainApi } from "../api/mainApi";

export function useMainData() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  // 💡 데이터 호출 함수
  const fetchMainData = useCallback(async (isAlive) => {
    try {
      // 💡 무한 로딩 방지: 데이터가 없을 때만 전체 로딩 스피너 표시
      // 이미 데이터가 있다면 백그라운드에서 조용히 업데이트함
      setData((prev) => {
        if (!prev) setLoading(true);
        return prev;
      });

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

  useEffect(() => {
    let alive = true;

    // 💡 경로가 변경될 때마다(메인 복귀 포함) 호출
    fetchMainData(alive);

    // 탭 전환 시 갱신 로직
    const handleFocus = () => fetchMainData(alive);
    window.addEventListener("focus", handleFocus);

    return () => {
      alive = false;
      window.removeEventListener("focus", handleFocus);
    };
  }, [fetchMainData, location.pathname]); // 💡 여기서 모든 갱신을 제어함

  // --- [데이터 가공 섹션] ---
  const topNotices = useMemo(() => data?.topNotices ?? [], [data]);
  const recentPosts = useMemo(() => data?.recentPosts ?? [], [data]);
  const recentPrecedents = useMemo(() => data?.precedents ?? [], [data]);
  const recentLawyers = useMemo(() => data?.lawyers ?? [], [data]);
  const recentPolls = useMemo(() => data?.polls ?? [], [data]);
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
