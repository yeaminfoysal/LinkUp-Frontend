import api from '../../../services/api';
import { useAuthStore } from '../../../store/auth.store';
import { disconnectSocket } from '../../../socket/socket.client';

export const authService = {
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data; // { user, accessToken, refreshToken }
  },

  login: async (data: any) => {
    const response = await api.post('/auth/login', data);
    return response.data; // { user, accessToken, refreshToken }
  },

  logout: async () => {
    try {
      const refreshToken = useAuthStore.getState().refreshToken;
      await api.post('/auth/logout', { refreshToken });
    } catch (e) {
      console.error('Logout request failed:', e);
    } finally {
      disconnectSocket();
      useAuthStore.getState().logout();
    }
  },
};
export default authService;
