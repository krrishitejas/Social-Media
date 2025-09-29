import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { profileService, ProfileResponse } from '@services/profileService';
import { User, Post, Highlight } from '@types';

export const useProfile = (userId: string) => {
  const [cursor, setCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const queryClient = useQueryClient();

  const {
    data: profileData,
    isLoading,
    error,
    refetch,
  } = useQuery<ProfileResponse>(
    ['profile', userId],
    () => profileService.getProfile(userId),
    {
      enabled: !!userId,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const {
    data: postsData,
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts,
  } = useQuery<{ posts: Post[]; nextCursor?: string; hasMore: boolean }>(
    ['profile-posts', userId, cursor],
    () => profileService.getProfilePosts(userId, cursor),
    {
      enabled: !!userId,
      keepPreviousData: true,
    }
  );

  const {
    data: highlightsData,
    isLoading: highlightsLoading,
    error: highlightsError,
    refetch: refetchHighlights,
  } = useQuery<Highlight[]>(
    ['profile-highlights', userId],
    () => profileService.getProfileHighlights(userId),
    {
      enabled: !!userId,
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const followMutation = useMutation(
    (userId: string) => profileService.followUser(userId),
    {
      onSuccess: (data, userId) => {
        // Update profile data
        queryClient.setQueryData(['profile', userId], (oldData: ProfileResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            isFollowing: data.isFollowing,
            followersCount: data.followersCount,
          };
        });
      },
    }
  );

  const unfollowMutation = useMutation(
    (userId: string) => profileService.unfollowUser(userId),
    {
      onSuccess: (data, userId) => {
        // Update profile data
        queryClient.setQueryData(['profile', userId], (oldData: ProfileResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            isFollowing: data.isFollowing,
            followersCount: data.followersCount,
          };
        });
      },
    }
  );

  const blockMutation = useMutation(
    (userId: string) => profileService.blockUser(userId),
    {
      onSuccess: (_, userId) => {
        // Remove from cache
        queryClient.removeQueries(['profile', userId]);
      },
    }
  );

  const unblockMutation = useMutation(
    (userId: string) => profileService.unblockUser(userId),
    {
      onSuccess: () => {
        // Refetch profile data
        refetch();
      },
    }
  );

  const updateProfileMutation = useMutation(
    (profileData: Partial<User>) => profileService.updateProfile(profileData),
    {
      onSuccess: (updatedUser) => {
        // Update current user data
        queryClient.setQueryData(['profile', updatedUser.id], (oldData: ProfileResponse | undefined) => {
          if (!oldData) return oldData;
          
          return {
            ...oldData,
            user: updatedUser,
          };
        });
      },
    }
  );

  const loadMorePosts = useCallback(() => {
    if (postsData?.nextCursor && hasMore && !postsLoading) {
      setCursor(postsData.nextCursor);
    }
  }, [postsData?.nextCursor, hasMore, postsLoading]);

  const refresh = useCallback(() => {
    setCursor(undefined);
    setHasMore(true);
    refetch();
    refetchPosts();
    refetchHighlights();
  }, [refetch, refetchPosts, refetchHighlights]);

  const handleFollow = useCallback((userId: string, isFollowing: boolean) => {
    if (isFollowing) {
      unfollowMutation.mutate(userId);
    } else {
      followMutation.mutate(userId);
    }
  }, [followMutation, unfollowMutation]);

  const handleBlock = useCallback((userId: string, isBlocked: boolean) => {
    if (isBlocked) {
      unblockMutation.mutate(userId);
    } else {
      blockMutation.mutate(userId);
    }
  }, [blockMutation, unblockMutation]);

  useEffect(() => {
    if (postsData) {
      setHasMore(postsData.hasMore);
    }
  }, [postsData]);

  return {
    // Profile data
    user: profileData?.user,
    posts: postsData?.posts || [],
    highlights: highlightsData || [],
    followersCount: profileData?.followersCount || 0,
    followingCount: profileData?.followingCount || 0,
    postsCount: profileData?.postsCount || 0,
    isFollowing: profileData?.isFollowing || false,
    isBlocked: profileData?.isBlocked || false,
    
    // Loading states
    isLoading,
    postsLoading,
    highlightsLoading,
    
    // Error states
    error,
    postsError,
    highlightsError,
    
    // Actions
    loadMorePosts,
    refresh,
    handleFollow,
    handleBlock,
    updateProfile: updateProfileMutation.mutate,
    
    // Pagination
    hasMore,
    nextCursor: postsData?.nextCursor,
    
    // Mutations
    followMutation,
    unfollowMutation,
    blockMutation,
    unblockMutation,
    updateProfileMutation,
  };
};
