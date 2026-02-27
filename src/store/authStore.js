// src/store/authStore.js
// 설명: Zustand 인증 스토어입니다. persist 미들웨어를 사용하여 새로고침 시에도 로그인 상태를 유지합니다.

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setToken, removeToken } from "../utils/tokenUtil.js";

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: false, // 스토어가 스토리지로부터 데이터를 불러왔는지 여부

      // 로그인 처리
      login: (token, memberData) => {
        setToken(token);
        set({
          token,
          user: {
            loginId: memberData.loginId,
            role: memberData.memberType,
          },
          isAuthenticated: true,
        });
      },

      // 로그아웃 처리
      logout: () => {
        removeToken();
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("auth-storage"); // 저장소 강제 삭제
      },

      // 스토어 초기화 완료 상태 설정 (미들웨어가 호출함)
      setHasHydrated: (state) => {
        set({ isHydrated: state });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // 스토리지에서 데이터를 읽어온 후 실행됨
        state.setHasHydrated(true);
      },
    }
  )
);