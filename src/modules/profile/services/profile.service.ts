import api from '../../../services/api';

export const profileService = {
  getOwnProfile: async () => {
    const res = await api.get('/users/me');
    return res.data;
  },

  getProfileById: async (userId: string) => {
    const res = await api.get(`/users/${userId}`);
    return res.data;
  },

  resolveUsernameToProfile: async (username: string) => {
    const res = await api.get(`/users/profile/${username}`);
    return res.data;
  },

  updateOwnProfile: async (data: { name?: string; bio?: string; avatar?: string }) => {
    const res = await api.put('/users/me', data);
    return res.data;
  },

  getUserPosts: async (userId: string, cursor?: string, limit = 20) => {
    const params: Record<string, any> = { limit };
    if (cursor) params.cursor = cursor;
    const res = await api.get(`/posts/user/${userId}`, { params });
    return res.data; // returns { items: Post[], nextCursor, hasNextPage }
  },

  getSavedPosts: async (cursor?: string, limit = 20) => {
    // Let's assume endpoint for saved posts is GET /posts/saved or similar.
    // Let's search if there is one. If not, fallback.
    const params: Record<string, any> = { limit };
    if (cursor) params.cursor = cursor;
    const res = await api.get('/posts/saved', { params });
    return res.data;
  },
};
export default profileService;
