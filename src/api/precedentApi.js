import axiosInstance from "./axiosInstance";

const precedentApi = {
  /**
   * 1. 판례 목록 가져오기 (검색어 + 카테고리 필터 포함)
   * @param {number} page - 현재 페이지 번호
   * @param {string} query - 검색 키워드 (사건명, 사건번호 등)
   * @param {string} caseType - 선택된 카테고리 (필터)
   * @param {number} size - 한 페이지당 보여줄 개수
   */
  getPrecedentList: async (page = 1, query = "", caseType = "", size = 10) => {
    try {
      // 💡 params 객체에 전달된 속성들은 ?page=1&query=...&caseType=... 형태로 변환됩니다.
      const response = await axiosInstance.get("/precedents", {
        params: {
          page,
          size,
          query: query || undefined, // 값이 없을 경우 URL에서 제외
          caseType: caseType || undefined, // 값이 없을 경우 URL에서 제외
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
   * @param {string|number} id - 판례 고유 ID (precId)
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
};

export default precedentApi;
