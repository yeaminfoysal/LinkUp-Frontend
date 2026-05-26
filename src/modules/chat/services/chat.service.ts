import api from '../../../services/api';

export const chatService = {
  getConversations: async (page = 1, limit = 20) => {
    const res = await api.get('/conversations', { params: { page, limit } });
    return res.data; // returns Conversation[]
  },

  getConversation: async (id: string) => {
    const res = await api.get(`/conversations/${id}`);
    return res.data; // returns Conversation
  },

  createDirectConversation: async (targetUserId: string) => {
    const res = await api.post('/conversations/direct', { targetUserId });
    return res.data; // returns Conversation
  },

  createGroupConversation: async (data: { name: string; avatar?: string; memberIds: string[] }) => {
    const res = await api.post('/conversations/group', data);
    return res.data; // returns Conversation
  },

  getMessages: async (conversationId: string, cursor?: string, limit = 50) => {
    const params: Record<string, any> = { conversationId, limit };
    if (cursor) params.cursor = cursor;
    const res = await api.get('/messages', { params });
    return res.data; // returns { data: Message[], nextCursor, hasMore }
  },
};
export default chatService;
