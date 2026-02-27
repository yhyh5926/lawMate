// src/store/authStore.js
// 설명: Zustand를 이용한 전역 인증 상태 관리 스토어입니다.
// 로그인 유저 정보, 토큰 저장 및 로그아웃 로직을 처리합니다.

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { setToken, removeToken, parseJwt } from "../utils/tokenUtil";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null, // { loginId, role }
      token: null,
      isAuthenticated: false,

      // 로그인 성공 시 호출: 토큰 저장 및 상태 업데이트
      login: (token, memberData) => {
        setToken(token); // 로컬 스토리지 저장
        set({
          token,
          user: {
            loginId: memberData.loginId,
            role: memberData.memberType,
          },
          isAuthenticated: true,
        });
      },

      // 로그아웃 시 호출: 상태 초기화 및 토큰 제거
      logout: () => {
        removeToken();
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });
      },

      // 앱 새로고침 시 토큰 유효성 체크 및 상태 복구
      checkAuth: () => {
        const token = localStorage.getItem("token");
        if (token) {
          const decoded = parseJwt(token);
          if (decoded) {
            set({
              token,
              user: { loginId: decoded.sub, role: decoded.role },
              isAuthenticated: true,
            });
          } else {
            get().logout();
          }
        }
      },
    }),
    {
      name: "auth-storage", // 로컬 스토리지에 저장될 키 이름
    }
  )
);