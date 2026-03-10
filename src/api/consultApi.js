import axiosInstance from './axiosInstance';

// 상담 예약 신청
export const createConsult = (consultData) =>
  axiosInstance.post('/consult', consultData);

// 💡 [수정됨] 나의 상담 예약 목록 (status가 비어있으면 파라미터에서 제외)
export const getMyConsults = (status = '') => {
  const params = status ? { status } : {}; // 값이 있을 때만 params에 넣음
  return axiosInstance.get('/consult/my', { params });
};

// 상담 예약 상세
export const getConsultDetail = (consultNo) =>
  axiosInstance.get(`/consult/${consultNo}`);

// 상담 예약 취소
export const cancelConsult = (consultNo) =>
  axiosInstance.put(`/consult/${consultNo}/cancel`);

// 변호사 가용 시간 조회
export const getAvailableTimes = (lawyerId, date) =>
  axiosInstance.get("/consult/available", { params: { lawyerId, date } });

// 환불 신청
export const requestRefund = (paymentNo, reason) =>
  axiosInstance.post(`/payment/${paymentNo}/refund`, { reason });