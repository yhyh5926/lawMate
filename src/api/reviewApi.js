import axiosInstance from "./axiosInstance";

const reviewApi = {
  /**
   * 1. 특정 변호사의 리뷰 목록 조회
   */
  getReviewsByLawyer: async (lawyerId) => {
    try {
      const response = await axiosInstance.get(`/reviews/lawyer/${lawyerId}`);
      return response.data;
    } catch (error) {
      console.error("변호사 리뷰 로드 실패:", error);
      throw error;
    }
  },

  /**
   * 2. 리뷰 작성 가능한 상담 내역 조회 (마이페이지용)
   */
  getPendingReviews: async (memberId) => {
    try {
      const response = await axiosInstance.get(`/reviews/pending/${memberId}`);
      return response.data;
    } catch (error) {
      console.error("작성 가능 리뷰 목록 로드 실패:", error);
      throw error;
    }
  },

  /**
   * 3. 리뷰 등록
   * @param {Object} reviewData (consultId, memberId, lawyerId, rating, content 등)
   */
  createReview: async (reviewData) => {
    try {
      const response = await axiosInstance.post("/reviews/write", reviewData);
      return response.data;
    } catch (error) {
      console.error("리뷰 등록 실패:", error);
      throw error.response?.data || error;
    }
  },

  /**
   * 💡 4. 리뷰 삭제 (논리 삭제)
   * @param {number} reviewId - 삭제할 리뷰의 PK
   * @param {number} memberId - 본인 확인을 위한 회원 ID
   * @param {number} lawyerId - 통계 갱신을 위한 변호사 ID
   */
  deleteReview: async (reviewId, memberId, lawyerId) => {
    try {
      const response = await axiosInstance.delete(`/reviews/${reviewId}`, {
        // DELETE 요청 시 쿼리 파라미터 전달 방식
        params: { memberId, lawyerId },
      });
      return response.data;
    } catch (error) {
      console.error("리뷰 삭제 실패:", error);
      throw error.response?.data || error;
    }
  },
};

export default reviewApi;
