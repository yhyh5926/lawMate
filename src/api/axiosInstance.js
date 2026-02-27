// vs코드
// 파일 위치: src/api/axiosInstance.js
// 설명: 스프링부트 서버와 통신하기 위한 Axios 기본 설정 및 토큰 자동 첨부 인터셉터

import axios from "axios";
import { getToken } from "../utils/tokenUtil.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // 스프링 부트 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청(Request) 인터셉터: API 요청을 보내기 직전에 가로채서 실행되는 로직
axiosInstance.interceptors.request.use(
  (config) => {
    // 로컬 스토리지에서 JWT 토큰을 가져옵니다.
    const token = getToken();
    
    // 토큰이 존재한다면, 모든 요청의 헤더에 Authorization 값으로 추가합니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;