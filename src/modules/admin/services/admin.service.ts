import api from '../../../services/api';

export interface ReindexResult {
  total: number;
  updated: number;
  skipped: number;
  failed: number;
}

export const adminService = {
  getUsers: async (sortBy = 'lastSeen', order = 'desc') => {
    const response = await api.get(`/admin/users?sortBy=${sortBy}&order=${order}`);
    return response.data;
  },

  getUserFriends: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}/friends`);
    return response.data;
  },

  getUserPendingRequests: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}/pending-requests`);
    return response.data;
  },

  getUserConversations: async (userId: string) => {
    const response = await api.get(`/admin/users/${userId}/conversations`);
    return response.data;
  },

  getConversationMessages: async (conversationId: string) => {
    const response = await api.get(`/admin/conversations/${conversationId}/messages`);
    return response.data;
  },

  // Regenerates AI embeddings for ALL users (SUPER_ADMIN only).
  // Long-running: the backend processes users sequentially.
  reindexEmbeddings: async (): Promise<ReindexResult> => {
    const response = await api.post('/ai/reindex-embeddings');
    return response.data;
  }
};

export default adminService;
