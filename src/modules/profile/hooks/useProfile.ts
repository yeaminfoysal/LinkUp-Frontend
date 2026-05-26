import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import profileService from '../services/profile.service';
import { useAuthStore } from '../../../store/auth.store';
import toast from '../../../components/ui/Toast';

export const useProfile = (username: string) => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  // Resolve username to profile
  const profileQuery = useQuery({
    queryKey: ['profile', username],
    queryFn: () => profileService.resolveUsernameToProfile(username),
    enabled: !!username,
  });

  const userId = profileQuery.data?.id;

  // Get user's posts
  const postsQuery = useQuery({
    queryKey: ['userPosts', userId],
    queryFn: () => profileService.getUserPosts(userId!),
    enabled: !!userId,
  });

  // Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: profileService.updateOwnProfile,
    onSuccess: (updatedUser) => {
      toast.success('Profile updated successfully!');
      setUser(updatedUser); // Update local Zustand Auth state
      queryClient.invalidateQueries({ queryKey: ['profile', username] });
      queryClient.invalidateQueries({ queryKey: ['profile', updatedUser.username] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    },
  });

  return {
    profile: profileQuery.data || null,
    isLoadingProfile: profileQuery.isLoading,
    isErrorProfile: profileQuery.isError,

    posts: postsQuery.data?.items || [],
    isLoadingPosts: postsQuery.isLoading,

    updateProfile: updateProfileMutation.mutateAsync,
    isUpdating: updateProfileMutation.isPending,
  };
};
export default useProfile;
