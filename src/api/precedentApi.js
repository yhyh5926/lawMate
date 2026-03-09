import axiosInstance from "./axiosInstance";

const precedentApi = {
  /**
   * 1. 판례 목록 가져오기 (검색어 + 카테고리 필터 포함)
   */
  getPrecedentList: async (page = 1, query = "", caseType = "", size = 10) => {
    try {
      const response = await axiosInstance.get("/precedents", {
        params: {
          page,
          size,
          query: query || undefined,
          caseType: caseType || undefined,
        },
      });
      return response.data;
    } catch (error) {
      console.error("판례 목록 API 호출 실패:", error);
      throw error;
    }
  },

  /**
   * 2. 판례 상세 정보 가져오기
   */
  getPrecedentDetail: async (id) => {
    try {
      const response = await axiosInstance.get(`/precedents/${id}`);
      const data = response.data;

      // DB의 CLOB 문자열 데이터를 JSON 객체로 파싱
      if (data && typeof data.aiSummary === "string") {
        try {
          data.aiSummary = JSON.parse(data.aiSummary);
        } catch (e) {
          console.error("AI 요약 데이터 JSON 파싱 실패:", e);
        }
      }
      return data;
    } catch (error) {
      console.error(`판례 상세(${id}) API 호출 실패:`, error);
      throw error;
    }
  },

  /**
   * 💡 3. 유사 판례 목록 가져오기 (추가됨)
   * 테이블 구조의 CASE_TYPE과 KEYWORD_CSV를 기반으로 유사 사건을 조회합니다.
   * * @param {string} caseType - 현재 판례의 사건 유형
   * @param {string} keywordCsv - 현재 판례의 키워드 리스트
   * @param {number|string} excludeId - 현재 보고 있는 판례 ID (목록 제외용)
   */
  getRelatedPrecedents: async (caseType, keywordCsv = "", excludeId) => {
    try {
      // 키워드 CSV 중 첫 번째 혹은 두 번째 핵심 키워드만 추출하여 전달 (정확도 향상)
      const mainKeyword = keywordCsv ? keywordCsv.split(",")[0].trim() : "";

      const response = await axiosInstance.get("/precedents/related", {
        params: {
          caseType,
          keyword: mainKeyword || undefined,
          excludeId: excludeId || undefined,
          limit: 4, // 추천 개수 고정
        },
      });
      return response.data;
    } catch (error) {
      console.error("유사 판례 로드 실패:", error);
      return []; // 추천 실패 시 빈 배열 반환하여 상세 페이지 렌더링 유지
    }
  },
};

export default precedentApi;
