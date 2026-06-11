import api from './api';

export type FriendshipStatus =
  | 'FRIENDS'
  | 'REQUEST_SENT'
  | 'REQUEST_RECEIVED'
  | 'NONE';

// 'semantic' = matched via AI embedding similarity
// 'name'     = exact name/username match (matchScore may be null)
export type MatchType = 'name' | 'semantic';

export interface SearchResult {
  id: string;
  name: string;
  username: string;
  avatar: string | null;
  bio: string | null;
  location: string | null;
  university: string | null;
  department: string | null;
  skills: string | null;
  interests: string | null;
  profession: string | null;
  work_place: string | null;
  isOnline: boolean;
  matchScore: number | null;
  matchReason: string;
  matchType: MatchType;
  friendshipStatus: FriendshipStatus;
}

export const searchUsersViaAI = async (query: string): Promise<SearchResult[]> => {
  const response = await api.post('/ai/search-users', { query });
  // The API interceptor already unwraps `response.data.data` to `response.data`
  return response.data;
};
