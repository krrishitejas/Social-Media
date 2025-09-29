import { User, Post, Story, Highlight } from '@types';

export interface ProfileResponse {
  user: User;
  posts: Post[];
  highlights: Highlight[];
  stories: Story[];
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isBlocked: boolean;
}

export interface FollowResponse {
  isFollowing: boolean;
  followersCount: number;
}

class ProfileService {
  private baseUrl = 'http://localhost:3000/api';

  async getProfile(userId: string): Promise<ProfileResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile fetch error:', error);
      throw error;
    }
  }

  async getProfilePosts(userId: string, cursor?: string): Promise<{ posts: Post[]; nextCursor?: string; hasMore: boolean }> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/users/${userId}/posts?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile posts');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile posts fetch error:', error);
      throw error;
    }
  }

  async getProfileHighlights(userId: string): Promise<Highlight[]> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/highlights`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch highlights');
      }

      const data = await response.json();
      return data.highlights || [];
    } catch (error) {
      console.error('Highlights fetch error:', error);
      throw error;
    }
  }

  async followUser(userId: string): Promise<FollowResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/follow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to follow user');
      }

      return await response.json();
    } catch (error) {
      console.error('Follow user error:', error);
      throw error;
    }
  }

  async unfollowUser(userId: string): Promise<FollowResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/follow`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unfollow user');
      }

      return await response.json();
    } catch (error) {
      console.error('Unfollow user error:', error);
      throw error;
    }
  }

  async blockUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to block user');
      }
    } catch (error) {
      console.error('Block user error:', error);
      throw error;
    }
  }

  async unblockUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/users/${userId}/block`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unblock user');
      }
    } catch (error) {
      console.error('Unblock user error:', error);
      throw error;
    }
  }

  async getFollowers(userId: string, cursor?: string): Promise<{ users: User[]; nextCursor?: string; hasMore: boolean }> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/users/${userId}/followers?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch followers');
      }

      return await response.json();
    } catch (error) {
      console.error('Followers fetch error:', error);
      throw error;
    }
  }

  async getFollowing(userId: string, cursor?: string): Promise<{ users: User[]; nextCursor?: string; hasMore: boolean }> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/users/${userId}/following?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch following');
      }

      return await response.json();
    } catch (error) {
      console.error('Following fetch error:', error);
      throw error;
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<User> {
    try {
      const response = await fetch(`${this.baseUrl}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(profileData),
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export const profileService = new ProfileService();
