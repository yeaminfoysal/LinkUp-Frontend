import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { User } from '../types/user.types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setTokens: (accessToken: string | null, refreshToken: string | null) => void;
  logout: () => void;
}

// Helper: cookie te token sync kore
const syncCookies = (accessToken: string | null, refreshToken: string | null) => {
  if (typeof window === 'undefined') return;

  if (accessToken) {
    document.cookie = `accessToken=${encodeURIComponent(accessToken)}; Path=/; Max-Age=604800; SameSite=Lax`;
  } else {
    document.cookie = 'accessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  if (refreshToken) {
    document.cookie = `refreshToken=${encodeURIComponent(refreshToken)}; Path=/; Max-Age=2592000; SameSite=Lax`;
  } else {
    document.cookie = 'refreshToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTokens: (accessToken, refreshToken) => {
        // Cookie te set koro
        syncCookies(accessToken, refreshToken);
        // Zustand store update
        set({
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
        });
      },
      logout: () => {
        // Cookie clear koro
        syncCookies(null, null);
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: 'linkup-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Page refresh er por localStorage theke rehydrate howar somoy cookie sync koro
      onRehydrateStorage: () => (state) => {
        if (state?.accessToken || state?.refreshToken) {
          syncCookies(state.accessToken, state.refreshToken);
        }
      },
    }
  )
);
