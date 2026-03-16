import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { trendText, trendClass } from "../../utils/mainUtils";
import NoticeModal from "./NoticeModal";
import "../../styles/main/HeroSection.css";

export default function HeroSection({
  todayCount,
  weeklyCount,
  todayChangePct,
  weeklyChangePct,
  topNotices = [],
}) {
  const navigate = useNavigate();
  const [noticeDetail, setNoticeDetail] = useState(null);

  const goToLogin = () => {
    window.location.href = "/member/login";
  };
  const openNotice = (postId) => {
    const found = topNotices.find((n) => n.postId === postId) ?? null;
    setNoticeDetail(found);
  };

  return (
    <>
      <section className="hero-root">
        <div className="hero-bg-decor" />

        <div className="hero-inner">
          {/* ── 좌측 메인 콘텐츠 ── */}
          <div className="hero-main">
            <div className="hero-eyebrow">
              <span className="hero-eyebrow-dot" />
              <span className="hero-eyebrow-text">LawMate</span>
            </div>

            <h1 className="hero-title">
              법률 상담을
              <br />더 쉽고 빠르게
            </h1>
            <p className="hero-desc">
              검증된 변호사의 답변, 판례 검색, 커뮤니티까지
              <br />
              필요한 법률 서비스를 한 곳에서 시작하세요.
            </p>

            {/* KPI 카드 */}
            <div className="hero-kpi-row">
              <StatCard
                icon="📅"
                label="오늘 상담 접수"
                value={todayCount}
                pct={todayChangePct}
                prefix="전일 대비"
              />
              <StatCard
                icon="📈"
                label="이번 주 상담"
                value={weeklyCount}
                pct={weeklyChangePct}
                prefix="전주 대비"
              />
            </div>

            {/* 공지사항 */}
            <NoticeBanner
              notices={topNotices}
              onOpen={openNotice}
              onMore={() => navigate("/community/qnalist")}
            />
          </div>

          {/* ── 우측 CTA ── */}
          <aside className="hero-aside">
            <div className="hero-cta-card">
              <div className="hero-cta-icon">⚖️</div>
              <h2 className="hero-cta-title">지금 바로 질문하세요</h2>
              <p className="hero-cta-desc">
                로그인 후 변호사에게 직접 질문을 남길 수 있어요. 먼저 다른
                사람들의 질문을 둘러봐도 좋아요.
              </p>
              <button className="hero-primary-btn" onClick={goToLogin}>
                질문 등록하기
              </button>
              <button
                className="hero-secondary-btn"
                onClick={() => navigate("/question/list")}
              >
                질문 목록 보기
              </button>
            </div>

            <ul className="hero-trust-list">
              {[
                "신뢰할 수 있는 법률 질문 환경",
                "최신 커뮤니티와 모의 판결 게시판 제공",
                "판례·변호사·질문 등록까지 한 곳에서",
              ].map((text) => (
                <li key={text} className="hero-trust-item">
                  <span className="hero-trust-check">✓</span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {noticeDetail && (
        <NoticeModal
          notice={noticeDetail}
          onClose={() => setNoticeDetail(null)}
        />
      )}
    </>
  );
}

/* ── 공지 배너 ── */
function NoticeBanner({ notices, onOpen, onMore }) {
  return (
    <div className="notice-banner">
      <div className="notice-banner-head">
        <span className="notice-banner-label">
          <span className="notice-label-dot" />
          공지사항
        </span>
        <button className="notice-more-btn" onClick={onMore}>
          전체보기 →
        </button>
      </div>

      {notices.length === 0 ? (
        <p className="notice-empty">등록된 공지사항이 없습니다.</p>
      ) : (
        <ul className="notice-list">
          {notices.map((n, idx) => (
            <li key={n.postId ?? idx}>
              <button
                type="button"
                className="notice-item"
                onClick={() => onOpen(n.postId)}
              >
                <span className="notice-item-idx">{idx + 1}</span>
                <span className="notice-item-title">{n.title}</span>
                <span className="notice-item-date">{n.createdAt ?? ""}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ── KPI 카드 ── */
function StatCard({ icon, label, value, pct, prefix }) {
  return (
    <div className="hero-stat-card">
      <span className="hero-stat-icon">{icon}</span>
      <div className="hero-stat-body">
        <p className="hero-stat-label">{label}</p>
        <p className="hero-stat-value">
          {value ?? "-"}
          <span className="hero-stat-unit">건</span>
        </p>
        <p className={`hero-stat-trend ${trendClass(pct)}`}>
          {prefix} {trendText(pct)}
        </p>
      </div>
    </div>
  );
}
