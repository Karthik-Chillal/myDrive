import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => {
      return {
        token: null,
        setToken: (newToken) => set({ token: newToken }),
        clearToken: () => set({ token: null }),
      };
    },
    { name: 'auth-store' }
  )
);

export const useLoadingStore = create((set) => ({
  loading: false,
  setLoading: (state) => set({ loading: state }),
}));
