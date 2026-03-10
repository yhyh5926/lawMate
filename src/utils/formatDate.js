export const formatDate = (dateString) => {
  if (!dateString || dateString === "-") return "-";
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 24시간제로 더 깔끔하게
  })
    .format(new Date(dateString))
    .replace(/\s/g, ""); // 공백 제거 필요 시 추가
};
