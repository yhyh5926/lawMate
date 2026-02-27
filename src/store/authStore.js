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

      // 💡 로그인 처리: 백엔드 MemberVO 구조에 맞춰 필드 확장
      login: (token, memberData) => {
        setToken(token);
        set({
          token,
          user: {
            memberId: memberData.memberId, // 💡 식별값 (PK) 추가
            loginId: memberData.loginId, // 아이디
            role: memberData.memberType, // 권한 (GENERAL, ADMIN 등)
            name: memberData.name, // 💡 실명 추가
            email: memberData.email, // 💡 이메일 추가
          },
          isAuthenticated: true,
        });
      },

      // 로그아웃 처리
      logout: () => {
        removeToken();
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("auth-storage");
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
        state.setHasHydrated(true);
      },
    },
  ),
);
