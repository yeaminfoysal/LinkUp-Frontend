import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  isRightPanelOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (isOpen: boolean) => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarOpen: false, // Default is closed on mobile, shown on desktop (responsive css handles it)
      isRightPanelOpen: true, // Default open on desktop
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
