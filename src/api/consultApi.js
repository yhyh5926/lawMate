import axiosInstance from './axiosInstance';

// 상담 예약 신청
export const createConsult = (consultData) =>
  axiosInstance.post('/api/consult', consultData);

// 나의 상담 예약 목록
export const getMyConsults = (status = '') =>
  axiosInstance.get('/api/consult/my', { params: { status } });

// 상담 예약 상세
export const getConsultDetail = (consultNo) =>
  axiosInstance.get(`/api/consult/${consultNo}`);

// 상담 예약 취소
export const cancelConsult = (consultNo) =>
  axiosInstance.put(`/api/consult/${consultNo}/cancel`);

// 변호사 가용 시간 조회
export const getAvailableTimes = (lawyerNo, date) =>
  axiosInstance.get('/api/consult/available', { params: { lawyerNo, date } });

// 환불 신청
export const requestRefund = (paymentNo, reason) =>
  axiosInstance.post(`/api/payment/${paymentNo}/refund`, { reason });
