import axiosInstance from "./axiosInstance";

const lawyerApi = {
  // 1. 변호사 전체 목록 조회

  getAllLawyers: async () => {
    try {
      const response = await axiosInstance.get("/lawyers");
      return response.data;
    } catch (error) {
      console.error("변호사 목록 호출 실패:", error);
      throw error;
    }
  },

  // 2. 특정 변호사 상세 정보 조회

  getLawyerDetail: async (id) => {
    try {
      const response = await axiosInstance.get(`/lawyers/${id}`);
      return response.data;
    } catch (error) {
      console.error(`변호사 상세(${id}) 호출 실패:`, error);
      throw error;
    }
  },

  // 3. 전문 분야별 필터링 조회 (선택 사항)

  getLawyersBySpecialty: async (specialty) => {
    try {
      const response = await axiosInstance.get("/lawyers", {
        params: { specialty },
      });
      return response.data;
    } catch (error) {
      console.error("전문분야 필터링 실패:", error);
      throw error;
    }
  },
};

export default lawyerApi;
