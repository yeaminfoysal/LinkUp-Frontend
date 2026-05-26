import api from '../../../services/api';

export const postsService = {
  uploadFile: async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await api.post('/uploads', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data; // returns { mediaUrl, mimeType, mediaSize, name }
  },

  uploadFiles: async (files: File[]) => {
    const formData = new FormData();
    files.forEach((f) => formData.append('files', f));
    const res = await api.post('/uploads/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data; // returns array of uploaded file objects
  },

  getComments: async (postId: string) => {
    const res = await api.get(`/comments?postId=${postId}`);
    return res.data; // returns Comment[]
  },

  createComment: async (postId: string, content: string, parentId: string | null = null) => {
    const res = await api.post('/comments', { postId, content, parentId });
    return res.data;
  },

  deleteComment: async (commentId: string) => {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  },

  likeComment: async (commentId: string) => {
    const res = await api.post(`/comments/${commentId}/like`);
    return res.data;
  },

  unlikeComment: async (commentId: string) => {
    const res = await api.delete(`/comments/${commentId}/like`);
    return res.data;
  },
};
export default postsService;
