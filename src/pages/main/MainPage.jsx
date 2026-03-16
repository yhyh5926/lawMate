import React from "react";
import "../../styles/main/MainPage.css";
import { useMainData } from "../../hooks/useMainData";
import HeroSection from "../../components/main/HeroSection";
import StatsSection from "../../components/main/StatsSection";
import RecentPostsSection from "../../components/main/RecentPostsSection";
import RecentResourcesSection from "../../components/main/RecentResourcesSection";

export default function MainPage() {
  const {
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
  } = useMainData();

  return (
    <div className="lm-page">
      <HeroSection
        todayCount={todayCount}
        weeklyCount={weeklyCount}
        todayChangePct={todayChangePct}
        weeklyChangePct={weeklyChangePct}
        topNotices={topNotices}
      />

      <div className="lm-wrap">
        {err && <div className="lm-error">{err}</div>}

        <StatsSection
          series={series}
          todayCount={todayCount}
          weeklyCount={weeklyCount}
          todayChangePct={todayChangePct}
          weeklyChangePct={weeklyChangePct}
          chartSummaryText={chartSummaryText}
        />

        <RecentPostsSection
          loading={loading}
          recentPosts={recentPosts}
          recentQuestions={recentQuestions}
          recentPolls={recentPolls}
        />

        <RecentResourcesSection
          loading={loading}
          recentPrecedents={recentPrecedents}
          recentLawyers={recentLawyers}
        />
      </div>
    </div>
  );
}
