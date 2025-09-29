import { User, Post, SearchResult } from '@types';

export interface SearchOptions {
  query: string;
  type?: 'all' | 'users' | 'posts' | 'hashtags' | 'locations';
  limit?: number;
  offset?: number;
}

class SearchService {
  private baseUrl = 'http://localhost:3000/api';

  async search(options: SearchOptions): Promise<SearchResult> {
    try {
      const params = new URLSearchParams({
        q: options.query,
        type: options.type || 'all',
        limit: (options.limit || 20).toString(),
        offset: (options.offset || 0).toString(),
      });

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Search failed');
      }

      return await response.json();
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }

  async getTrendingHashtags(): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/trending/hashtags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trending hashtags');
      }

      const data = await response.json();
      return data.hashtags || [];
    } catch (error) {
      console.error('Trending hashtags error:', error);
      throw error;
    }
  }

  async getTrendingPosts(): Promise<Post[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/trending/posts`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch trending posts');
      }

      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error('Trending posts error:', error);
      throw error;
    }
  }

  async getSuggestedUsers(): Promise<User[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/suggested/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch suggested users');
      }

      const data = await response.json();
      return data.users || [];
    } catch (error) {
      console.error('Suggested users error:', error);
      throw error;
    }
  }

  async getSearchSuggestions(query: string): Promise<string[]> {
    try {
      const response = await fetch(`${this.baseUrl}/search/suggestions?q=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch search suggestions');
      }

      const data = await response.json();
      return data.suggestions || [];
    } catch (error) {
      console.error('Search suggestions error:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export const searchService = new SearchService();
