import api from './api';

export interface SearchResult {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  matchScore: number;
  matchReason: string;
  isOnline: boolean;
  score: number; // Some embeddings return score as 'score'
}

export const searchUsersViaAI = async (query: string): Promise<SearchResult[]> => {
  const response = await api.post('/ai/search-users', { query });
  // The API interceptor already unwraps `response.data.data` to `response.data`
  return response.data;
};
