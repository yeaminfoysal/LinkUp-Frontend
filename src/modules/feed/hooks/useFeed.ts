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
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      await queryClient.cancelQueries({ queryKey: ['savedPosts'] });
      await queryClient.cancelQueries({ queryKey: ['userPosts'] });

      const postQueries = queryClient.getQueryCache().findAll({
        predicate: (query) => ['feed', 'savedPosts', 'userPosts'].includes(query.queryKey[0] as string),
      });

      const snapshots = postQueries.map((query) => ({
        queryKey: query.queryKey,
        data: queryClient.getQueryData(query.queryKey),
      }));

      snapshots.forEach(({ queryKey, data }) => {
        if (!data) return;
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          const updatePost = (post: Post) => {
            if (post.id !== postId) return post;
            return {
              ...post,
              hasLiked: true,
              _count: {
                ...post._count,
                likes: (post._count?.likes || 0) + 1,
              },
            };
          };

          if (old.pages && Array.isArray(old.pages)) {
            return {
              ...old,
              pages: old.pages.map((page: any) => {
                if (page.items && Array.isArray(page.items)) {
                  return { ...page, items: page.items.map(updatePost) };
                }
                if (Array.isArray(page)) {
                  return page.map(updatePost);
                }
                return page;
              }),
            };
          }
          if (old.items && Array.isArray(old.items)) {
            return { ...old, items: old.items.map(updatePost) };
          }
          if (Array.isArray(old)) {
            return old.map(updatePost);
          }
          return old;
        });
      });

      return { snapshots };
    },
    onError: (err, postId, context) => {
      if (context?.snapshots) {
        context.snapshots.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
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
      await queryClient.cancelQueries({ queryKey: ['savedPosts'] });
      await queryClient.cancelQueries({ queryKey: ['userPosts'] });

      const postQueries = queryClient.getQueryCache().findAll({
        predicate: (query) => ['feed', 'savedPosts', 'userPosts'].includes(query.queryKey[0] as string),
      });

      const snapshots = postQueries.map((query) => ({
        queryKey: query.queryKey,
        data: queryClient.getQueryData(query.queryKey),
      }));

      snapshots.forEach(({ queryKey, data }) => {
        if (!data) return;
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          const updatePost = (post: Post) => {
            if (post.id !== postId) return post;
            return {
              ...post,
              hasLiked: false,
              _count: {
                ...post._count,
                likes: Math.max(0, (post._count?.likes || 0) - 1),
              },
            };
          };

          if (old.pages && Array.isArray(old.pages)) {
            return {
              ...old,
              pages: old.pages.map((page: any) => {
                if (page.items && Array.isArray(page.items)) {
                  return { ...page, items: page.items.map(updatePost) };
                }
                if (Array.isArray(page)) {
                  return page.map(updatePost);
                }
                return page;
              }),
            };
          }
          if (old.items && Array.isArray(old.items)) {
            return { ...old, items: old.items.map(updatePost) };
          }
          if (Array.isArray(old)) {
            return old.map(updatePost);
          }
          return old;
        });
      });

      return { snapshots };
    },
    onError: (err, postId, context) => {
      if (context?.snapshots) {
        context.snapshots.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
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
      await queryClient.cancelQueries({ queryKey: ['savedPosts'] });
      await queryClient.cancelQueries({ queryKey: ['userPosts'] });

      const postQueries = queryClient.getQueryCache().findAll({
        predicate: (query) => ['feed', 'savedPosts', 'userPosts'].includes(query.queryKey[0] as string),
      });

      const snapshots = postQueries.map((query) => ({
        queryKey: query.queryKey,
        data: queryClient.getQueryData(query.queryKey),
      }));

      snapshots.forEach(({ queryKey, data }) => {
        if (!data) return;
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          const updatePost = (post: Post) => {
            if (post.id !== postId) return post;
            return {
              ...post,
              hasSaved: true,
            };
          };

          if (old.pages && Array.isArray(old.pages)) {
            return {
              ...old,
              pages: old.pages.map((page: any) => {
                if (page.items && Array.isArray(page.items)) {
                  return { ...page, items: page.items.map(updatePost) };
                }
                if (Array.isArray(page)) {
                  return page.map(updatePost);
                }
                return page;
              }),
            };
          }
          if (old.items && Array.isArray(old.items)) {
            return { ...old, items: old.items.map(updatePost) };
          }
          if (Array.isArray(old)) {
            return old.map(updatePost);
          }
          return old;
        });
      });

      return { snapshots };
    },
    onSuccess: () => {
      toast.success('Post bookmarked!');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
    onError: (err, postId, context) => {
      if (context?.snapshots) {
        context.snapshots.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to save bookmark');
    },
  });

  // Unsave Bookmark Mutation
  const unsaveMutation = useMutation({
    mutationFn: feedService.unsavePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ['feed'] });
      await queryClient.cancelQueries({ queryKey: ['savedPosts'] });
      await queryClient.cancelQueries({ queryKey: ['userPosts'] });

      const postQueries = queryClient.getQueryCache().findAll({
        predicate: (query) => ['feed', 'savedPosts', 'userPosts'].includes(query.queryKey[0] as string),
      });

      const snapshots = postQueries.map((query) => ({
        queryKey: query.queryKey,
        data: queryClient.getQueryData(query.queryKey),
      }));

      snapshots.forEach(({ queryKey, data }) => {
        if (!data) return;
        queryClient.setQueryData(queryKey, (old: any) => {
          if (!old) return old;
          const updatePost = (post: Post) => {
            if (post.id !== postId) return post;
            return {
              ...post,
              hasSaved: false,
            };
          };

          if (old.pages && Array.isArray(old.pages)) {
            return {
              ...old,
              pages: old.pages.map((page: any) => {
                if (page.items && Array.isArray(page.items)) {
                  return { ...page, items: page.items.map(updatePost) };
                }
                if (Array.isArray(page)) {
                  return page.map(updatePost);
                }
                return page;
              }),
            };
          }
          if (old.items && Array.isArray(old.items)) {
            return { ...old, items: old.items.map(updatePost) };
          }
          if (Array.isArray(old)) {
            return old.map(updatePost);
          }
          return old;
        });
      });

      return { snapshots };
    },
    onSuccess: () => {
      toast.success('Bookmark removed');
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      queryClient.invalidateQueries({ queryKey: ['userPosts'] });
      queryClient.invalidateQueries({ queryKey: ['savedPosts'] });
    },
    onError: (err, postId, context) => {
      if (context?.snapshots) {
        context.snapshots.forEach(({ queryKey, data }) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      toast.error('Failed to remove bookmark');
    },
  });

  // Update Post Mutation
  const updatePostMutation = useMutation({
    mutationFn: (variables: { postId: string; data: { content?: string; mediaUrls?: string[]; visibility?: string } }) =>
      feedService.updatePost(variables.postId, variables.data),
    onSuccess: (updatedPost) => {
      toast.success('Post updated successfully!');
      const postQueries = queryClient.getQueryCache().findAll({
        predicate: (query) => ['feed', 'savedPosts', 'userPosts'].includes(query.queryKey[0] as string),
      });

      postQueries.forEach((query) => {
        queryClient.setQueryData(query.queryKey, (old: any) => {
          if (!old) return old;
          const updatePostItem = (post: Post) => {
            if (post.id !== updatedPost.id) return post;
            return {
              ...post,
              content: updatedPost.content,
              mediaUrls: updatedPost.mediaUrls,
              visibility: updatedPost.visibility,
              updatedAt: updatedPost.updatedAt,
            };
          };

          if (old.pages && Array.isArray(old.pages)) {
            return {
              ...old,
              pages: old.pages.map((page: any) => {
                if (page.items && Array.isArray(page.items)) {
                  return { ...page, items: page.items.map(updatePostItem) };
                }
                if (Array.isArray(page)) {
                  return page.map(updatePostItem);
                }
                return page;
              }),
            };
          }
          if (old.items && Array.isArray(old.items)) {
            return { ...old, items: old.items.map(updatePostItem) };
          }
          if (Array.isArray(old)) {
            return old.map(updatePostItem);
          }
          return old;
        });
      });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || 'Failed to update post');
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
    
    updatePost: updatePostMutation.mutateAsync,
    isUpdatingPost: updatePostMutation.isPending,
    
    likePost: likeMutation.mutate,
    unlikePost: unlikeMutation.mutate,
    savePost: saveMutation.mutate,
    unsavePost: unsaveMutation.mutate,
  };
};
export default useFeed;
