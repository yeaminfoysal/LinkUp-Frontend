import api from '../../../services/api';

export const feedService = {
  getFeed: async (cursor?: string, limit = 20) => {
    const params: Record<string, any> = { limit };
    if (cursor) params.cursor = cursor;
    const res = await api.get('/posts/feed', { params });
    return res.data; // returns { items: Post[], nextCursor, hasNextPage }
  },

  createPost: async (data: { content?: string; mediaUrls?: string[]; visibility?: string }) => {
    const res = await api.post('/posts', data);
    return res.data;
  },

  likePost: async (postId: string) => {
    const res = await api.post(`/posts/${postId}/like`);
    return res.data;
  },

  unlikePost: async (postId: string) => {
    const res = await api.delete(`/posts/${postId}/like`);
    return res.data;
  },

  savePost: async (postId: string) => {
    const res = await api.post(`/posts/${postId}/save`);
    return res.data;
  },

  unsavePost: async (postId: string) => {
    const res = await api.delete(`/posts/${postId}/save`);
    return res.data;
  },

  deletePost: async (postId: string) => {
    const res = await api.delete(`/posts/${postId}`);
    return res.data;
  },
};
export default feedService;
