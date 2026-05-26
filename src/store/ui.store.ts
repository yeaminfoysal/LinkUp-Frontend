import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  theme: 'light' | 'dark';
  isSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: 'dark', // Modern default is dark
      isSidebarOpen: false, // Default is closed on mobile, shown on desktop (responsive css handles it)
      isRightPanelOpen: true, // Default open on desktop
      toggleTheme: () =>
        set((state) => {
          const next = state.theme === 'light' ? 'dark' : 'light';
          if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('dark', next === 'dark');
          }
          return { theme: next };
        }),
      setTheme: (theme) =>
        set(() => {
          if (typeof window !== 'undefined') {
            document.documentElement.classList.toggle('dark', theme === 'dark');
          }
          return { theme };
        }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
      setSidebarOpen: (isSidebarOpen) => set({ isSidebarOpen }),
      toggleRightPanel: () => set((state) => ({ isRightPanelOpen: !state.isRightPanelOpen })),
      setRightPanelOpen: (isRightPanelOpen) => set({ isRightPanelOpen }),
    }),
    {
      name: 'linkup-ui-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
