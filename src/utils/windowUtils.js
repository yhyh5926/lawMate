/**
 * 프로젝트 전반에서 사용하는 윈도우/브라우저 관련 유틸리티
 */

// 화면 최상단으로 스크롤 이동
export const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "auto",
  });
};

// 특정 엘리먼트 위치로 스크롤 이동 (상세페이지 리뷰 섹션 등에서 활용 가능)
export const scrollToElement = (elementId, offset = 0) => {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({
      top: elementPosition - offset,
      behavior: "auto",
    });
  }
};
