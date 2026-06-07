import { useMutation } from '@tanstack/react-query';
import { searchUsersViaAI, SearchResult } from '../services/ai-discovery.service';

export const useAISearch = () => {
  return useMutation<SearchResult[], Error, string>({
    mutationFn: (query: string) => searchUsersViaAI(query),
  });
};
