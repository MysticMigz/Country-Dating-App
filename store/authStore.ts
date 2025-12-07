import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  visitedCountries: string[];
  datedCountries: string[];
  wishlistCountries: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  updateVisitedCountries: (countries: string[]) => void;
  updateDatedCountries: (countries: string[]) => void;
  updateWishlistCountries: (countries: string[]) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (user, token) => set({ user, token }),
      clearAuth: () => set({ user: null, token: null }),
      updateVisitedCountries: (countries) =>
        set((state) => ({
          user: state.user ? { ...state.user, visitedCountries: countries } : null,
        })),
      updateDatedCountries: (countries) =>
        set((state) => ({
          user: state.user ? { ...state.user, datedCountries: countries } : null,
        })),
      updateWishlistCountries: (countries) =>
        set((state) => ({
          user: state.user ? { ...state.user, wishlistCountries: countries } : null,
        })),
    }),
    {
      name: 'auth-storage',
    }
  )
);

