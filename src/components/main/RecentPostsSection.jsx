import React from "react";
import { useNavigate } from "react-router-dom";
import ActivityListCard from "./ActivityListCard";
import { formatShortDateTime, getPollStatusText } from "../../utils/mainUtils";
import "../../styles/main/RecentPostsSection.css";

export default function RecentPostsSection({
  loading,
  recentPosts,
  recentQuestions,
  recentPolls,
}) {
  const navigate = useNavigate();

  const goCommunityDetail = (item) => {
    const pollId = item?.pollId;
    if (pollId) {
      navigate(`/community/poll/detail/${pollId}`);
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

  return (
    <section className="rps-section">
      <div className="rps-section-head">
        <div>
          <h2 className="rps-section-title">최근 게시물</h2>
          <p className="rps-section-desc">
            게시글, 법률질문, 모의 판결 최신 5건
          </p>
        </div>
      </div>

      <div className="rps-grid">
        {/* 최근 게시글 */}
        <ActivityListCard
          title="최근 게시글"
          onMore={() => navigate("/community/qnalist")}
          loading={loading}
          emptyText="최근 게시글이 없습니다."
          items={recentPosts}
          renderItem={(p, idx) => (
            <button
              key={p.postId ?? p.id ?? idx}
              type="button"
              className="rps-list-btn"
              onClick={() => goCommunityDetail(p)}
            >
              <span className="rps-item-title">{p.title}</span>
              <span className="rps-item-date">{p.createdAt ?? ""}</span>
            </button>
          )}
        />

        {/* 최근 법률질문 */}
        <ActivityListCard
          title="최근 법률질문"
          onMore={() => navigate("/question/list")}
          loading={loading}
          emptyText="최근 법률질문이 없습니다."
          items={recentQuestions}
          renderItem={(q, idx) => (
            <button
              key={q.questionId ?? q.id ?? idx}
              type="button"
              className="rps-list-btn"
              onClick={() => goQuestionDetail(q)}
            >
              <div className="rps-item-row">
                <span className="rps-pill">{q.caseType ?? "유형"}</span>
                <span className="rps-item-title rps-ellipsis">{q.title}</span>
              </div>
              <div className="rps-item-bottom">
                <span
                  className={`rps-status ${q.status === "ANSWERED" ? "rps-status--done" : "rps-status--wait"}`}
                >
                  {q.status === "ANSWERED" ? "답변완료" : "답변대기"}
                </span>
                <span className="rps-item-date">
                  {q.createdAt ? formatShortDateTime(q.createdAt) : ""}
                </span>
              </div>
            </button>
          )}
        />

        {/* 최근 모의 판결 */}
        <ActivityListCard
          title="모의 판결"
          onMore={() => navigate("/community/pollList")}
          loading={loading}
          emptyText="진행 중인 모의 판결이 없습니다."
          items={recentPolls}
          renderItem={(p, idx) => {
            const statusText = getPollStatusText(p);
            const isOpen = statusText === "진행중";
            return (
              <button
                key={p.pollId ?? idx}
                type="button"
                className="rps-list-btn"
                onClick={() => goCommunityDetail(p)}
              >
                <div className="rps-item-row">
                  <span
                    className={`rps-poll-badge ${isOpen ? "rps-poll-badge--open" : "rps-poll-badge--closed"}`}
                  >
                    {statusText}
                  </span>
                  <span className="rps-item-title rps-ellipsis">
                    {p.title ?? "제목 없음"}
                  </span>
                </div>
                <span className="rps-item-date">
                  종료일: {p.endDate || "미정"}
                </span>
              </button>
            );
          }}
        />
      </div>
    </section>
  );
}
