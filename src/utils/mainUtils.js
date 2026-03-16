// src/utils/mainUtils.js

export function formatShortDateTime(value) {
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

export function getPollStatusText(poll) {
  const status = String(
    poll?.status ?? poll?.pollStatus ?? poll?.state ?? "",
  ).toUpperCase();

  if (
    status.includes("END") ||
    status.includes("CLOSE") ||
    status.includes("DONE")
  ) {
    return "마감";
  }
  if (
    status.includes("PROGRESS") ||
    status.includes("OPEN") ||
    status.includes("ONGOING")
  ) {
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

export function getPollMetaText(poll) {
  const voteCount =
    poll?.voteCount ??
    poll?.participantCount ??
    poll?.totalVotes ??
    poll?.votes;
  if (Number.isFinite(Number(voteCount))) return `${Number(voteCount)}명 참여`;

  const optionCount = poll?.optionCount ?? poll?.optionsCount;
  if (Number.isFinite(Number(optionCount)))
    return `선택지 ${Number(optionCount)}개`;

  return "";
}

export function trendText(pct) {
  if (pct == null || Number.isNaN(pct)) return "변화 없음";
  const v = Math.round(pct * 10) / 10;
  if (v > 0) return `▲ ${v}%`;
  if (v < 0) return `▼ ${Math.abs(v)}%`;
  return "— 0%";
}

export function trendClass(pct, prefix = "lm-trend") {
  if (pct == null || Number.isNaN(pct) || pct === 0) return `${prefix}Neutral`;
  return pct > 0 ? `${prefix}Up` : `${prefix}Down`;
}
