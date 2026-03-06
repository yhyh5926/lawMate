// src/api/lawyerApi.js
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

  // 4. 멤버 ID로 변호사 정보 조회
  getLawyerByMemberId: async (memberId) => {
    const response = await axiosInstance.get(`/lawyers/by-member/${memberId}`);
    return response;
  },

  // 5. 변호사 프로필 및 상담 페이지 정보 수정 (RESTful PUT 방식)
  updateLawyer: async (lawyerId, data) => {
    try {
      const response = await axiosInstance.put(`/lawyers/${lawyerId}`, data);
      return response.data;
    } catch (error) {
      console.error("변호사 정보 수정 실패:", error);
      throw error;
    }
  },

  // 💡 6. [신규 추가] 프로필 사진 업로드 (Multipart 방식)
  uploadProfileImage: async (lawyerId, formData) => {
    try {
      const response = await axiosInstance.post(`/lawyers/${lawyerId}/upload-profile`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      console.error("프로필 사진 업로드 실패:", error);
      throw error;
    }
  }
};

export default lawyerApi;