import api from '../../../services/api';

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
  }
};

export default adminService;
