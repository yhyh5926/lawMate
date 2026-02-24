import axiosInstance from './axiosInstance';

// 결제 요청 (PG사 연동 전 서버 주문 생성)
export const createPaymentOrder = (consultNo) =>
  axiosInstance.post('/api/payment/order', { consultNo });

// 결제 완료 검증 (PG사 콜백 후 서버 검증)
export const verifyPayment = (impUid, merchantUid) =>
  axiosInstance.post('/api/payment/verify', { impUid, merchantUid });

// 결제 내역 목록
export const getPaymentList = () =>
  axiosInstance.get('/api/payment/my');

// 결제 상세
export const getPaymentDetail = (paymentNo) =>
  axiosInstance.get(`/api/payment/${paymentNo}`);

// 환불 신청
export const requestRefund = (paymentNo, reason) =>
  axiosInstance.post(`/api/payment/${paymentNo}/refund`, { reason });

// 정산 내역 (전문회원)
export const getSettlementList = (year, month) =>
  axiosInstance.get('/api/payment/settlement', { params: { year, month } });

// 월별 정산 차트 데이터 (Python API)
export const getSettlementChart = () =>
  axiosInstance.get('/api/payment/settlement/chart');
