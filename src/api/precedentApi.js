import axiosInstance from "./axiosInstance";

const precedentApi = {
  // 1. 판례 목록 가져오기
  getPrecedentList: async () => {
    try {
      const response = await axiosInstance.get("/precedents");
      return response.data;
    } catch (error) {
      console.error("판례 목록 API 호출 실패:", error);
      throw error;
    }
  },

  // 2. 판례 상세 정보 가져오기 (JSON 파싱 포함)
  getPrecedentDetail: async (id) => {
    try {
      const response = await axiosInstance.get(`/precedents/${id}`);
      const data = response.data;

      // DB CLOB 데이터(문자열)를 객체로 자동 변환 [cite: 2026-02-20]
      if (data && data.aiSummary) {
        try {
          data.aiSummary = JSON.parse(data.aiSummary);
        } catch (e) {
          console.error("AI 요약 데이터 파싱 실패:", e);
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
