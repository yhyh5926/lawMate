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

      login: (token, memberData) => {
        setToken(token);

        set({
          token,
          user: {
            memberId: memberData.memberId,
            loginId: memberData.loginId,
            role: memberData.memberType,
            name: memberData.name,
            email: memberData.email,
            phone: memberData.phone,
            status: memberData.status,

            // 💡 [추가] 구글 계정 구분을 위해 provider 저장
            provider: memberData.provider || "LOCAL",

            // 💡 [추가] 마이페이지 출력을 위해 주소 정보 추가
            address: memberData.address || "",
            detailAddress: memberData.detailAddress || "",

            // 💡 [추가] 변호사 전용 데이터 (자격증 번호 포함)
            lawyerId: memberData.lawyerId || null,
            licenseNo: memberData.licenseNo || "",
            specialty: memberData.specialty || null,
            officeName: memberData.officeName || null,
            officeAddr: memberData.officeAddr || "",
            officeDetailAddr: memberData.officeDetailAddr || "",
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

      updateUser: (updatedFields) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedFields } : null,
        }));
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
