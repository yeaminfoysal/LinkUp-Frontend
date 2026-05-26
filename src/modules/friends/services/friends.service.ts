import api from '../../../services/api';

export const friendsService = {
  getFriends: async () => {
    const res = await api.get('/friends');
    return res.data; // returns Friendship[]
  },

  getPendingRequests: async () => {
    const res = await api.get('/friends/requests/pending');
    return res.data; // returns FriendRequest[]
  },

  getSentRequests: async () => {
    const res = await api.get('/friends/requests/sent');
    return res.data; // returns FriendRequest[]
  },

  sendRequest: async (receiverId: string) => {
    const res = await api.post('/friends/request', { receiverId });
    return res.data;
  },

  acceptRequest: async (requestId: string) => {
    const res = await api.post('/friends/accept', { requestId });
    return res.data;
  },

  rejectRequest: async (requestId: string) => {
    const res = await api.post('/friends/reject', { requestId });
    return res.data;
  },

  cancelRequest: async (requestId: string) => {
    const res = await api.delete(`/friends/cancel/${requestId}`);
    return res.data;
  },

  removeFriend: async (friendshipId: string) => {
    const res = await api.delete(`/friends/${friendshipId}`);
    return res.data;
  },

  blockUser: async (userId: string) => {
    const res = await api.post('/friends/block', { userId });
    return res.data;
  },

  unblockUser: async (userId: string) => {
    const res = await api.delete(`/friends/unblock/${userId}`);
    return res.data;
  },
};
export default friendsService;
