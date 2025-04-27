import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "./axios";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false,
      login: async (email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post("auth/login", { email, password });

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          set({ isLoading: false, error: (error as any).response.data.message });
          throw error;
        }
      },
      register: async (name, email, password) => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.post("auth/register", { name, email, password });

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error: unknown) {
          set({ isLoading: false, error: (error as any).response.data.message });
          throw error;
        }
      },
      logout: async () => {
        try {
          set({ isLoading: true, error: null });
          await api.post("logout");

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error: unknown) {
          set({ isLoading: false, error: (error as any).response.data.message });
          throw error;
        }
      },
      checkAuth: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await api.get("auth/me");

          console.log(response);

          set({
            user: response.data.user,
            isAuthenticated: true,
            isLoading: false,
          });

          return true;
        } catch (error: unknown) {
          set({ isLoading: false, error: (error as any).response.data.message });
          return false;
        }
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
