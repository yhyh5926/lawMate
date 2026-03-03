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
       * @param {object} memberData - 서버의 'MemberVO' 객체 데이터 (Join된 데이터 포함)
       */
      login: (token, memberData) => {
        setToken(token);

        set({
          token,
          user: {
            memberId: memberData.memberId,
            loginId: memberData.loginId,
            role: memberData.memberType, // "LAWYER" or "PERSONAL"
            name: memberData.name,
            email: memberData.email,
            phone: memberData.phone,
            status: memberData.status,
            // 💡 변호사일 경우에만 데이터가 들어오고, 일반 회원이면 null이 됩니다.
            lawyerId: memberData.lawyerId || null,
            specialty: memberData.specialty || null,
            officeName: memberData.officeName || null,
            approveStatus: memberData.approveStatus || null,
          },
          isAuthenticated: true,
        });
      },

      logout: () => {
        removeToken();
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("auth-storage");
      },

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
