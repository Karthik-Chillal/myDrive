import { create } from 'zustand';

export const useAuthStore = create((set) => {
  return {
    token: null,
    setToken: (newToken) => set({ token: newToken }),
    clearToken: () => set({ token: null }),
  };
});
