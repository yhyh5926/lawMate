import React from "react";
import { useNavigate } from "react-router-dom";
import ActivityListCard from "./ActivityListCard";
import { formatShortDateTime } from "../../utils/mainUtils";
import "../../styles/main/RecentResourcesSection.css";

export default function RecentResourcesSection({
  loading,
  recentPrecedents,
  recentLawyers,
}) {
  const navigate = useNavigate();

  const goPrecedentDetail = (p) => {
    const precedentId = p?.precId;
    navigate(
      precedentId ? `/precedent/detail/${precedentId}` : "/precedent/search",
    );
  };

  const goLawyerDetail = (lawyer) => {
    const lawyerId = lawyer?.lawyerId ?? lawyer?.id;
    navigate(lawyerId ? `/lawyer/detail/${lawyerId}` : "/lawyer/list");
  };

  return (
    <section className="rrs-section">
      <div className="rrs-grid">
        {/* 최근 판례 */}
        <ActivityListCard
          title="최근 등록된 판례"
          onMore={() => navigate("/precedent/search")}
          loading={loading}
          emptyText="최근 판례가 없습니다."
          items={recentPrecedents}
          renderItem={(p, idx) => (
            <button
              key={p.precedentId ?? p.id ?? idx}
              type="button"
              className="rrs-list-btn"
              onClick={() => goPrecedentDetail(p)}
            >
              <div className="rrs-item-main">
                <span className="rrs-item-title">
                  {p.title ?? p.caseName ?? "판례 제목 없음"}
                </span>
                <span className="rrs-item-sub">
                  {p.caseNumber ?? p.courtName ?? p.keyword ?? ""}
                </span>
              </div>
              <span className="rrs-item-date">
                {p.createdAt
                  ? formatShortDateTime(p.createdAt)
                  : p.judgmentDate
                    ? String(p.judgmentDate)
                    : ""}
              </span>
            </button>
          )}
        />

        {/* 최근 변호사 */}
        <ActivityListCard
          title="최근 등록한 변호사"
          onMore={() => navigate("/lawyer/list")}
          loading={loading}
          emptyText="등록된 변호사가 없습니다."
          items={recentLawyers}
          renderItem={(lawyer, idx) => (
            <button
              key={lawyer.lawyerId ?? lawyer.id ?? idx}
              type="button"
              className="rrs-list-btn"
              onClick={() => goLawyerDetail(lawyer)}
            >
              <div className="rrs-item-main">
                <div className="rrs-item-row">
                  <span className="rrs-pill">
                    {lawyer.specialty ?? lawyer.field ?? "전문"}
                  </span>
                  <span className="rrs-item-title rrs-ellipsis">
                    {lawyer.name ?? "이름 없음"}
                  </span>
                </div>
                <span className="rrs-item-sub">
                  {lawyer.officeName ?? lawyer.location ?? lawyer.email ?? ""}
                </span>
              </div>
              <span className="rrs-item-date">
                {lawyer.createdAt ? formatShortDateTime(lawyer.createdAt) : ""}
              </span>
            </button>
          )}
        />
      </div>
    </section>
  );
}
