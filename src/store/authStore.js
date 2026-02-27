// src/store/authStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setToken, removeToken } from "../utils/tokenUtil.js";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false,

      /**
       * 💡 로그인 처리
       * @param {string} token - 서버에서 받은 JWT 토큰
       * @param {object} memberData - 서버의 'member' 객체 데이터
       */
      login: (token, memberData) => {
        // 전역 axios 헤더나 로컬스토리지에 토큰 저장
        setToken(token);

        set({
          token,
          user: {
            memberId: memberData.memberId, // 31 (PK)
            loginId: memberData.loginId, // "ljmljm"
            role: memberData.memberType, // "PERSONAL"
            name: memberData.name, // "이재명"
            email: memberData.email, // "ljm@kakao.com"
            phone: memberData.phone, // "01077777777"
            status: memberData.status, // "ACTIVE"
          },
          isAuthenticated: true,
        });
      },

      // 로그아웃 처리
      logout: () => {
        removeToken();
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("auth-storage"); // Persist 데이터 강제 삭제
      },

      // 스토어 초기화 완료 상태 설정
      setHasHydrated: (state) => {
        set({ isHydrated: state });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // 스토리지에서 데이터를 읽어온 후(새로고침 시) 실행
        state.setHasHydrated(true);
      },
    },
  ),
);
