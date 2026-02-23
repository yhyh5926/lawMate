// src/stores/auth_store.js
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null, // 현재 로그인한 유저 객체
  isLoggedIn: false,

  // 로그인 처리
  login: (userInfo) => set({ user: userInfo, isLoggedIn: true }),

  // 로그아웃 처리
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, isLoggedIn: false });
  },

  // 정보 수정 반영
  updateUser: (updatedData) => set((state) => ({
    user: { ...state.user, ...updatedData }
  }))
}));

export default useAuthStore;