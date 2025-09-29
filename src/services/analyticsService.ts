import { AnalyticsEvent, UserAnalytics, PostAnalytics, AdminStats } from '@types';

export interface AnalyticsQuery {
  startDate: string;
  endDate: string;
  metric: string;
  groupBy?: 'day' | 'week' | 'month';
  filters?: Record<string, any>;
}

export interface AnalyticsResponse {
  data: any[];
  total: number;
  period: string;
}

export interface UserEngagement {
  userId: string;
  username: string;
  postsCount: number;
  likesReceived: number;
  commentsReceived: number;
  sharesReceived: number;
  followersCount: number;
  followingCount: number;
  engagementRate: number;
}

export interface ContentPerformance {
  postId: string;
  caption: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount: number;
  engagementRate: number;
  reach: number;
  impressions: number;
}

class AnalyticsService {
  private baseUrl = 'http://localhost:3000/api';

  // User Analytics
  async getUserAnalytics(userId: string, query: AnalyticsQuery): Promise<UserAnalytics> {
    try {
      const params = new URLSearchParams({
        userId,
        startDate: query.startDate,
        endDate: query.endDate,
        metric: query.metric,
        ...(query.groupBy && { groupBy: query.groupBy }),
        ...(query.filters && { filters: JSON.stringify(query.filters) }),
      });

      const response = await fetch(`${this.baseUrl}/analytics/users/${userId}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user analytics error:', error);
      throw error;
    }
  }

  async getPostAnalytics(postId: string, query: AnalyticsQuery): Promise<PostAnalytics> {
    try {
      const params = new URLSearchParams({
        postId,
        startDate: query.startDate,
        endDate: query.endDate,
        metric: query.metric,
        ...(query.groupBy && { groupBy: query.groupBy }),
        ...(query.filters && { filters: JSON.stringify(query.filters) }),
      });

      const response = await fetch(`${this.baseUrl}/analytics/posts/${postId}?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch post analytics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get post analytics error:', error);
      throw error;
    }
  }

  // Admin Analytics
  async getAdminStats(query: AnalyticsQuery): Promise<AdminStats> {
    try {
      const params = new URLSearchParams({
        startDate: query.startDate,
        endDate: query.endDate,
        metric: query.metric,
        ...(query.groupBy && { groupBy: query.groupBy }),
        ...(query.filters && { filters: JSON.stringify(query.filters) }),
      });

      const response = await fetch(`${this.baseUrl}/analytics/admin?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch admin stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Get admin stats error:', error);
      throw error;
    }
  }

  async getTopUsers(limit: number = 10): Promise<UserEngagement[]> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/top-users?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch top users');
      }

      return await response.json();
    } catch (error) {
      console.error('Get top users error:', error);
      throw error;
    }
  }

  async getTopPosts(limit: number = 10): Promise<ContentPerformance[]> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/top-posts?limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch top posts');
      }

      return await response.json();
    } catch (error) {
      console.error('Get top posts error:', error);
      throw error;
    }
  }

  async getEngagementMetrics(query: AnalyticsQuery): Promise<AnalyticsResponse> {
    try {
      const params = new URLSearchParams({
        startDate: query.startDate,
        endDate: query.endDate,
        metric: query.metric,
        ...(query.groupBy && { groupBy: query.groupBy }),
        ...(query.filters && { filters: JSON.stringify(query.filters) }),
      });

      const response = await fetch(`${this.baseUrl}/analytics/engagement?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch engagement metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get engagement metrics error:', error);
      throw error;
    }
  }

  async getContentMetrics(query: AnalyticsQuery): Promise<AnalyticsResponse> {
    try {
      const params = new URLSearchParams({
        startDate: query.startDate,
        endDate: query.endDate,
        metric: query.metric,
        ...(query.groupBy && { groupBy: query.groupBy }),
        ...(query.filters && { filters: JSON.stringify(query.filters) }),
      });

      const response = await fetch(`${this.baseUrl}/analytics/content?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get content metrics error:', error);
      throw error;
    }
  }

  async getUserGrowth(query: AnalyticsQuery): Promise<AnalyticsResponse> {
    try {
      const params = new URLSearchParams({
        startDate: query.startDate,
        endDate: query.endDate,
        metric: query.metric,
        ...(query.groupBy && { groupBy: query.groupBy }),
        ...(query.filters && { filters: JSON.stringify(query.filters) }),
      });

      const response = await fetch(`${this.baseUrl}/analytics/user-growth?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user growth');
      }

      return await response.json();
    } catch (error) {
      console.error('Get user growth error:', error);
      throw error;
    }
  }

  async getRevenueMetrics(query: AnalyticsQuery): Promise<AnalyticsResponse> {
    try {
      const params = new URLSearchParams({
        startDate: query.startDate,
        endDate: query.endDate,
        metric: query.metric,
        ...(query.groupBy && { groupBy: query.groupBy }),
        ...(query.filters && { filters: JSON.stringify(query.filters) }),
      });

      const response = await fetch(`${this.baseUrl}/analytics/revenue?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch revenue metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get revenue metrics error:', error);
      throw error;
    }
  }

  // Event Tracking
  async trackEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(event),
      });

      if (!response.ok) {
        throw new Error('Failed to track event');
      }
    } catch (error) {
      console.error('Track event error:', error);
      throw error;
    }
  }

  async getEventMetrics(eventType: string, query: AnalyticsQuery): Promise<AnalyticsResponse> {
    try {
      const params = new URLSearchParams({
        eventType,
        startDate: query.startDate,
        endDate: query.endDate,
        metric: query.metric,
        ...(query.groupBy && { groupBy: query.groupBy }),
        ...(query.filters && { filters: JSON.stringify(query.filters) }),
      });

      const response = await fetch(`${this.baseUrl}/analytics/events?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch event metrics');
      }

      return await response.json();
    } catch (error) {
      console.error('Get event metrics error:', error);
      throw error;
    }
  }

  // Real-time Analytics
  async getRealTimeStats(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/real-time`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch real-time stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Get real-time stats error:', error);
      throw error;
    }
  }

  // Export Analytics
  async exportAnalytics(query: AnalyticsQuery, format: 'csv' | 'json' | 'xlsx'): Promise<Blob> {
    try {
      const params = new URLSearchParams({
        startDate: query.startDate,
        endDate: query.endDate,
        metric: query.metric,
        format,
        ...(query.groupBy && { groupBy: query.groupBy }),
        ...(query.filters && { filters: JSON.stringify(query.filters) }),
      });

      const response = await fetch(`${this.baseUrl}/analytics/export?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to export analytics');
      }

      return await response.blob();
    } catch (error) {
      console.error('Export analytics error:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export const analyticsService = new AnalyticsService();
