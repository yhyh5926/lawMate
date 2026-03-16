import React from "react";
import "../../styles/main/ActivityListCard.css";

export default function ActivityListCard({
  title,
  onMore,
  loading,
  emptyText,
  items,
  renderItem,
}) {
  return (
    <div className="alc-card">
      <div className="alc-header">
        <h3 className="alc-title">{title}</h3>
        <button className="alc-more-btn" onClick={onMore}>
          더보기 →
        </button>
      </div>

      <div className="alc-body">
        {loading ? (
          <SkeletonList />
        ) : !items?.length ? (
          <div className="alc-empty">{emptyText}</div>
        ) : (
          <ul className="alc-list">
            {items.map((item, idx) => (
              <li key={idx} className="alc-list-item">
                {renderItem(item, idx, items.length)}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SkeletonList() {
  return (
    <ul className="alc-list">
      {Array.from({ length: 5 }).map((_, idx) => (
        <li key={idx} className="alc-skeleton-item">
          <div className="alc-skeleton alc-skeleton-title" />
          <div className="alc-skeleton alc-skeleton-meta" />
        </li>
      ))}
    </ul>
  );
}
