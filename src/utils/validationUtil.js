// vs코드
// 파일 위치: src/utils/validationUtil.js
// 설명: 회원가입, 로그인 시 아이디, 비밀번호, 이메일, 전화번호 등 폼 유효성 검사 로직

export const validateId = (id) => {
  // 4자 이상 영문, 숫자
  const regex = /^[a-zA-Z0-9]{4,20}$/;
  return regex.test(id);
};

export const validatePassword = (password) => {
  // 4자 이상 (기본)
  return password.length >= 4;
};

export const validateEmail = (email) => {
  if (!email) return true; // 이메일은 선택사항이므로 비어있으면 통과
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePhone = (phone) => {
  // 하이픈 제외 숫자만 10~11자리
  const regex = /^[0-9]{10,11}$/;
  return regex.test(phone.replace(/-/g, ""));
};