import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

// 인터셉터로 토큰 자동 추가
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const memberApi = {
  // 로그인
  login: (loginId, password) => api.post('/member/login', { loginId, password }),
  
  // 아이디 중복 확인
  checkId: (loginId) => api.get(`/member/check-id?loginId=${loginId}`),
  
  // 개인회원 가입 (TB_MEMBER)
  join: (data) => api.post('/member/join', data),
  
  // 전문회원 가입 (TB_MEMBER + TB_LAWYER)
  joinLawyer: (data) => api.post('/member/lawyer/join', data),
  
  // 내 정보 조회
  getMyInfo: () => api.get('/member/mypage/info'),
  
  // 정보 수정 (비밀번호, 이메일, 전화번호, 알림설정)
  updateInfo: (data) => api.put('/member/mypage/edit', data),
  
  // 회원 탈퇴 (TB_MEMBER STATUS -> WITHDRAWN)
  withdraw: () => api.post('/member/mypage/withdraw')
};