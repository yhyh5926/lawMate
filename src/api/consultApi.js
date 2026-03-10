import axiosInstance from './axiosInstance';

// 상담 예약 신청
export const createConsult = (consultData) =>
  axiosInstance.post('/consult', consultData);

// 나의 상담 예약 목록
export const getMyConsults = (status = '') =>
  axiosInstance.get('/consult/my', { params: { status } });

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

export const restoreConsult = (consultId) =>
  axiosInstance.put(`/consult/${consultId}/restore`);

export const deleteConsult = (consultId) =>
  axiosInstance.delete(`/consult/${consultId}`);

export const getLawyerConsults = () =>
  axiosInstance.get('/consult/lawyer');

export const confirmConsult = (consultId) =>
  axiosInstance.put(`/consult/${consultId}/confirm`);

export const rejectConsult = (consultId) =>
  axiosInstance.put(`/consult/${consultId}/reject`);