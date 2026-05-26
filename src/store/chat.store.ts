import { create } from 'zustand';

interface ChatState {
  activeConversationId: string | null;
  typingUsers: Record<string, string[]>; // convId -> list of userIds
  onlineUserIds: string[]; // List of userIds currently online
  setActiveConversationId: (id: string | null) => void;
  setTyping: (convId: string, userId: string, isTyping: boolean) => void;
  setOnline: (userId: string, isOnline: boolean) => void;
  setOnlineUsers: (userIds: string[]) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  typingUsers: {},
  onlineUserIds: [],
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setTyping: (convId, userId, isTyping) =>
    set((state) => {
      const current = state.typingUsers[convId] || [];
      const updated = isTyping
        ? current.includes(userId)
          ? current
          : [...current, userId]
        : current.filter((id) => id !== userId);
      return {
        typingUsers: {
          ...state.typingUsers,
          [convId]: updated,
        },
      };
    }),
  setOnline: (userId, isOnline) =>
    set((state) => {
      const updated = isOnline
        ? state.onlineUserIds.includes(userId)
          ? state.onlineUserIds
          : [...state.onlineUserIds, userId]
        : state.onlineUserIds.filter((id) => id !== userId);
      return { onlineUserIds: updated };
    }),
  setOnlineUsers: (onlineUserIds) => set({ onlineUserIds }),
}));
