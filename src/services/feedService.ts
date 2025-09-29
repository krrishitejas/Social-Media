import { Post, Story, FeedItem } from '@types';

export interface FeedResponse {
  items: FeedItem[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface FeedOptions {
  mode: 'algorithmic' | 'following';
  cursor?: string;
  limit?: number;
}

class FeedService {
  private baseUrl = 'http://localhost:3000/api';

  async getFeed(options: FeedOptions): Promise<FeedResponse> {
    try {
      const params = new URLSearchParams({
        mode: options.mode,
        limit: (options.limit || 20).toString(),
        ...(options.cursor && { cursor: options.cursor }),
      });

      const response = await fetch(`${this.baseUrl}/feed?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching feed:', error);
      throw error;
    }
  }

  async getStories(): Promise<Story[]> {
    try {
      const response = await fetch(`${this.baseUrl}/stories/feed`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }

      const data = await response.json();
      return data.stories || [];
    } catch (error) {
      console.error('Error fetching stories:', error);
      throw error;
    }
  }

  async likePost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      throw error;
    }
  }

  async unlikePost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${postId}/like`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unlike post');
      }
    } catch (error) {
      console.error('Error unliking post:', error);
      throw error;
    }
  }

  async bookmarkPost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${postId}/bookmark`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to bookmark post');
      }
    } catch (error) {
      console.error('Error bookmarking post:', error);
      throw error;
    }
  }

  async unbookmarkPost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${postId}/bookmark`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unbookmark post');
      }
    } catch (error) {
      console.error('Error unbookmarking post:', error);
      throw error;
    }
  }

  async sharePost(postId: string, platform: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/posts/${postId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ platform }),
      });

      if (!response.ok) {
        throw new Error('Failed to share post');
      }
    } catch (error) {
      console.error('Error sharing post:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    // This would typically come from your auth store
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export const feedService = new FeedService();
