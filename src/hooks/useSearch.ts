import { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-query';
import { searchService, SearchOptions } from '@services/searchService';
import { User, Post, SearchResult } from '@types';

export const useSearch = (query: string, type: 'all' | 'users' | 'posts' | 'hashtags' | 'locations' = 'all') => {
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const {
    data: searchResults,
    isLoading,
    error,
    refetch,
  } = useQuery<SearchResult>(
    ['search', query, type],
    () => searchService.search({ query, type }),
    {
      enabled: query.length > 0,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const {
    data: trendingHashtags,
    isLoading: trendingHashtagsLoading,
  } = useQuery<string[]>(
    ['trending-hashtags'],
    () => searchService.getTrendingHashtags(),
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  const {
    data: trendingPosts,
    isLoading: trendingPostsLoading,
  } = useQuery<Post[]>(
    ['trending-posts'],
    () => searchService.getTrendingPosts(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const {
    data: suggestedUsers,
    isLoading: suggestedUsersLoading,
  } = useQuery<User[]>(
    ['suggested-users'],
    () => searchService.getSuggestedUsers(),
    {
      staleTime: 15 * 60 * 1000, // 15 minutes
    }
  );

  const {
    data: searchSuggestions,
    isLoading: suggestionsLoading,
  } = useQuery<string[]>(
    ['search-suggestions', query],
    () => searchService.getSearchSuggestions(query),
    {
      enabled: query.length > 0,
      staleTime: 2 * 60 * 1000, // 2 minutes
    }
  );

  const addToHistory = useCallback((searchQuery: string) => {
    if (searchQuery.trim() && !searchHistory.includes(searchQuery)) {
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 9)]); // Keep last 10 searches
    }
  }, [searchHistory]);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  const removeFromHistory = useCallback((searchQuery: string) => {
    setSearchHistory(prev => prev.filter(item => item !== searchQuery));
  }, []);

  return {
    // Search results
    searchResults,
    isLoading,
    error,
    refetch,
    
    // Trending content
    trendingHashtags,
    trendingHashtagsLoading,
    trendingPosts,
    trendingPostsLoading,
    suggestedUsers,
    suggestedUsersLoading,
    
    // Search suggestions
    searchSuggestions,
    suggestionsLoading,
    
    // Search history
    searchHistory,
    addToHistory,
    clearHistory,
    removeFromHistory,
  };
};
