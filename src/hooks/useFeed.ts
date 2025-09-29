import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { feedService, FeedOptions, FeedResponse } from '@services/feedService';
import { Post, Story } from '@types';

export const useFeed = (mode: 'algorithmic' | 'following' = 'algorithmic') => {
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: feedData,
    isLoading,
    error,
    refetch,
  } = useQuery<FeedResponse>(
    ['feed', mode, cursor],
    () => feedService.getFeed({ mode, cursor, limit: 20 }),
    {
      enabled: hasMore,
      keepPreviousData: true,
    }
  );

  const {
    data: storiesData,
    isLoading: storiesLoading,
    error: storiesError,
    refetch: refetchStories,
  } = useQuery<Story[]>(
    ['stories'],
    () => feedService.getStories(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const likePostMutation = useMutation(
    (postId: string) => feedService.likePost(postId),
    {
      onSuccess: (_, postId) => {
        // Optimistically update the cache
        queryClient.setQueryData(['feed', mode, cursor], (oldData: FeedResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.map(item => {
              if (item.type === 'post' && item.data.id === postId) {
                return {
                  ...item,
                  data: {
                    ...item.data,
                    isLiked: true,
                    likesCount: item.data.likesCount + 1,
                  },
                };
              }
              return item;
            }),
          };
        });
      },
    }
  );

  const unlikePostMutation = useMutation(
    (postId: string) => feedService.unlikePost(postId),
    {
      onSuccess: (_, postId) => {
        // Optimistically update the cache
        queryClient.setQueryData(['feed', mode, cursor], (oldData: FeedResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.map(item => {
              if (item.type === 'post' && item.data.id === postId) {
                return {
                  ...item,
                  data: {
                    ...item.data,
                    isLiked: false,
                    likesCount: item.data.likesCount - 1,
                  },
                };
              }
              return item;
            }),
          };
        });
      },
    }
  );

  const bookmarkPostMutation = useMutation(
    (postId: string) => feedService.bookmarkPost(postId),
    {
      onSuccess: (_, postId) => {
        // Optimistically update the cache
        queryClient.setQueryData(['feed', mode, cursor], (oldData: FeedResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.map(item => {
              if (item.type === 'post' && item.data.id === postId) {
                return {
                  ...item,
                  data: {
                    ...item.data,
                    isBookmarked: true,
                  },
                };
              }
              return item;
            }),
          };
        });
      },
    }
  );

  const unbookmarkPostMutation = useMutation(
    (postId: string) => feedService.unbookmarkPost(postId),
    {
      onSuccess: (_, postId) => {
        // Optimistically update the cache
        queryClient.setQueryData(['feed', mode, cursor], (oldData: FeedResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            items: oldData.items.map(item => {
              if (item.type === 'post' && item.data.id === postId) {
                return {
                  ...item,
                  data: {
                    ...item.data,
                    isBookmarked: false,
                  },
                };
              }
              return item;
            }),
          };
        });
      },
    }
  );

  const sharePostMutation = useMutation(
    ({ postId, platform }: { postId: string; platform: string }) => 
      feedService.sharePost(postId, platform),
  );

  const loadMore = useCallback(() => {
    if (feedData?.nextCursor && hasMore && !isLoading) {
      setCursor(feedData.nextCursor);
    }
  }, [feedData?.nextCursor, hasMore, isLoading]);

  const refresh = useCallback(() => {
    setCursor(undefined);
    setHasMore(true);
    refetch();
    refetchStories();
  }, [refetch, refetchStories]);

  const handleLike = useCallback((postId: string, isLiked: boolean) => {
    if (isLiked) {
      unlikePostMutation.mutate(postId);
    } else {
      likePostMutation.mutate(postId);
    }
  }, [likePostMutation, unlikePostMutation]);

  const handleBookmark = useCallback((postId: string, isBookmarked: boolean) => {
    if (isBookmarked) {
      unbookmarkPostMutation.mutate(postId);
    } else {
      bookmarkPostMutation.mutate(postId);
    }
  }, [bookmarkPostMutation, unbookmarkPostMutation]);

  const handleShare = useCallback((postId: string, platform: string) => {
    sharePostMutation.mutate({ postId, platform });
  }, [sharePostMutation]);

  useEffect(() => {
    if (feedData) {
      setHasMore(feedData.hasMore);
    }
  }, [feedData]);

  return {
    // Feed data
    posts: feedData?.items.filter(item => item.type === 'post').map(item => item.data as Post) || [],
    stories: storiesData || [],
    
    // Loading states
    isLoading,
    storiesLoading,
    
    // Error states
    error,
    storiesError,
    
    // Actions
    loadMore,
    refresh,
    handleLike,
    handleBookmark,
    handleShare,
    
    // Pagination
    hasMore,
    nextCursor: feedData?.nextCursor,
    
    // Mutations
    likePostMutation,
    unlikePostMutation,
    bookmarkPostMutation,
    unbookmarkPostMutation,
    sharePostMutation,
  };
};
