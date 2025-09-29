import { Report, ModerationAction, ContentFilter, UserBlock } from '@types';

export interface CreateReportRequest {
  targetType: 'post' | 'user' | 'comment' | 'message' | 'live';
  targetId: string;
  reason: string;
  description?: string;
  evidence?: string[];
}

export interface ModerationResponse {
  action: ModerationAction;
  confidence: number;
  reason: string;
  details?: any;
}

export interface ContentFilterResponse {
  isApproved: boolean;
  confidence: number;
  violations: string[];
  suggestions: string[];
}

export interface ReportResponse {
  reports: Report[];
  nextCursor?: string;
  hasMore: boolean;
}

class ModerationService {
  private baseUrl = 'http://localhost:3000/api';

  // Reporting
  async createReport(reportData: CreateReportRequest): Promise<Report> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        throw new Error('Failed to create report');
      }

      return await response.json();
    } catch (error) {
      console.error('Create report error:', error);
      throw error;
    }
  }

  async getReports(cursor?: string): Promise<ReportResponse> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/moderation/reports?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reports');
      }

      return await response.json();
    } catch (error) {
      console.error('Get reports error:', error);
      throw error;
    }
  }

  async getReport(reportId: string): Promise<Report> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/reports/${reportId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch report');
      }

      return await response.json();
    } catch (error) {
      console.error('Get report error:', error);
      throw error;
    }
  }

  async updateReportStatus(reportId: string, status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/reports/${reportId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update report status');
      }
    } catch (error) {
      console.error('Update report status error:', error);
      throw error;
    }
  }

  // Content Moderation
  async moderateContent(content: string, type: 'text' | 'image' | 'video'): Promise<ContentFilterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ content, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to moderate content');
      }

      return await response.json();
    } catch (error) {
      console.error('Moderate content error:', error);
      throw error;
    }
  }

  async moderateImage(imageUrl: string): Promise<ContentFilterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/image`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to moderate image');
      }

      return await response.json();
    } catch (error) {
      console.error('Moderate image error:', error);
      throw error;
    }
  }

  async moderateVideo(videoUrl: string): Promise<ContentFilterResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ videoUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to moderate video');
      }

      return await response.json();
    } catch (error) {
      console.error('Moderate video error:', error);
      throw error;
    }
  }

  // User Actions
  async blockUser(userId: string, reason?: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/users/${userId}/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ reason }),
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
      const response = await fetch(`${this.baseUrl}/moderation/users/${userId}/unblock`, {
        method: 'POST',
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

  async muteUser(userId: string, duration?: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/users/${userId}/mute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ duration }),
      });

      if (!response.ok) {
        throw new Error('Failed to mute user');
      }
    } catch (error) {
      console.error('Mute user error:', error);
      throw error;
    }
  }

  async unmuteUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/users/${userId}/unmute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unmute user');
      }
    } catch (error) {
      console.error('Unmute user error:', error);
      throw error;
    }
  }

  async suspendUser(userId: string, duration: number, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/users/${userId}/suspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ duration, reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to suspend user');
      }
    } catch (error) {
      console.error('Suspend user error:', error);
      throw error;
    }
  }

  async unsuspendUser(userId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/users/${userId}/unsuspend`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unsuspend user');
      }
    } catch (error) {
      console.error('Unsuspend user error:', error);
      throw error;
    }
  }

  // Content Actions
  async hidePost(postId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/posts/${postId}/hide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to hide post');
      }
    } catch (error) {
      console.error('Hide post error:', error);
      throw error;
    }
  }

  async unhidePost(postId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/posts/${postId}/unhide`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unhide post');
      }
    } catch (error) {
      console.error('Unhide post error:', error);
      throw error;
    }
  }

  async deletePost(postId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/posts/${postId}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
    } catch (error) {
      console.error('Delete post error:', error);
      throw error;
    }
  }

  async deleteComment(commentId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/comments/${commentId}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }
    } catch (error) {
      console.error('Delete comment error:', error);
      throw error;
    }
  }

  // Content Filters
  async getContentFilters(): Promise<ContentFilter[]> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/filters`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content filters');
      }

      return await response.json();
    } catch (error) {
      console.error('Get content filters error:', error);
      throw error;
    }
  }

  async updateContentFilter(filterId: string, enabled: boolean): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/filters/${filterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ enabled }),
      });

      if (!response.ok) {
        throw new Error('Failed to update content filter');
      }
    } catch (error) {
      console.error('Update content filter error:', error);
      throw error;
    }
  }

  // Safety Settings
  async getSafetySettings(): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/safety-settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch safety settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Get safety settings error:', error);
      throw error;
    }
  }

  async updateSafetySettings(settings: any): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/moderation/safety-settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update safety settings');
      }
    } catch (error) {
      console.error('Update safety settings error:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export const moderationService = new ModerationService();
