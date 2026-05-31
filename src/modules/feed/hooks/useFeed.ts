import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import feedService from '../services/feed.service';
import toast from '../../../components/ui/Toast';
import { Post } from '../../../types/post.types';

export const useFeed = () => {
  const queryClient = useQueryClient();

  // Get social feed infinite query
  const feedQuery = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => feedService.getFeed(pageParam as string | undefined),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
  });

  // Create Post Mutation
  const createPostMutation = useMutation({
    mutationFn: feedService.createPost,
    onSuccess: (newPost) => {
      toast.success('Post shared successfully!');
      // Prepend the new post to the cache
      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old) return old;
        const pages = [...old.pages];
        if (pages.length > 0) {
          pages[0] = {
            ...pages[0],
            items: [newPost, ...pages[0].items],
          };
        }
        return { ...old, pages };
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to create post');
    },
  });

  // Like Mutation
  const likeMutation = useMutation({
    mutationFn: feedService.likePost,
    onMutate: async (postId) => {
      // Optimistic Update
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((post: Post) =>
              post.id === postId
                ? {
                    ...post,
                    hasLiked: true,
                    _count: {
                      ...post._count,
                      likes: (post._count?.likes || 0) + 1,
                    },
                  }
                : post
            ),
          })),
        };
      });

      return { previousFeed };
    },
    onError: (err, postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
      toast.error('Failed to like post');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
  });

  // Unlike Mutation
  const unlikeMutation = useMutation({
    mutationFn: feedService.unlikePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((post: Post) =>
              post.id === postId
                ? {
                    ...post,
                    hasLiked: false,
                    _count: {
                      ...post._count,
                      likes: Math.max(0, (post._count?.likes || 0) - 1),
                    },
                  }
                : post
            ),
          })),
        };
      });

      return { previousFeed };
    },
    onError: (err, postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
      toast.error('Failed to unlike post');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
  });

  // Save Bookmark Mutation
  const saveMutation = useMutation({
    mutationFn: feedService.savePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((post: Post) =>
              post.id === postId ? { ...post, hasSaved: true } : post
            ),
          })),
        };
      });

      return { previousFeed };
    },
    onSuccess: () => {
      toast.success('Post bookmarked!');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
    onError: (err, postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
      toast.error('Failed to save bookmark');
    },
  });

  // Unsave Bookmark Mutation
  const unsaveMutation = useMutation({
    mutationFn: feedService.unsavePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      const previousFeed = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((post: Post) =>
              post.id === postId ? { ...post, hasSaved: false } : post
            ),
          })),
        };
      });

      return { previousFeed };
    },
    onSuccess: () => {
      toast.success('Bookmark removed');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
    onError: (err, postId, context) => {
      if (context?.previousFeed) {
        queryClient.setQueryData(['feed'], context.previousFeed);
      }
      toast.error('Failed to remove bookmark');
    },
  });

  return {
    // Queries
    posts: feedQuery.data?.pages.flatMap((page) => page.items) || [],
    isLoading: feedQuery.isLoading,
    isError: feedQuery.isError,
    fetchNextPage: feedQuery.fetchNextPage,
    hasNextPage: feedQuery.hasNextPage,
    isFetchingNextPage: feedQuery.isFetchingNextPage,
    refetch: feedQuery.refetch,

    // Mutations
    createPost: createPostMutation.mutateAsync,
    isCreatingPost: createPostMutation.isPending,
    
    likePost: likeMutation.mutate,
    unlikePost: unlikeMutation.mutate,
    savePost: saveMutation.mutate,
    unsavePost: unsaveMutation.mutate,
  };
};
export default useFeed;
