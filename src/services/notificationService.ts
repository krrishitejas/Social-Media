import { Notification } from '@types';

export interface NotificationResponse {
  notifications: Notification[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface NotificationSettings {
  pushNotifications: boolean;
  emailNotifications: boolean;
  likeNotifications: boolean;
  commentNotifications: boolean;
  followNotifications: boolean;
  mentionNotifications: boolean;
  messageNotifications: boolean;
  storyNotifications: boolean;
  liveNotifications: boolean;
}

class NotificationService {
  private baseUrl = 'http://localhost:3000/api';

  async getNotifications(cursor?: string): Promise<NotificationResponse> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/notifications?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      return await response.json();
    } catch (error) {
      console.error('Notifications fetch error:', error);
      throw error;
    }
  }

  async markAsRead(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark notification as read');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  async markAllAsRead(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/read-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read');
      }
    } catch (error) {
      console.error('Mark all as read error:', error);
      throw error;
    }
  }

  async deleteNotification(notificationId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Delete notification error:', error);
      throw error;
    }
  }

  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/settings`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notification settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Notification settings fetch error:', error);
      throw error;
    }
  }

  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(settings),
      });

      if (!response.ok) {
        throw new Error('Failed to update notification settings');
      }

      return await response.json();
    } catch (error) {
      console.error('Update notification settings error:', error);
      throw error;
    }
  }

  async registerPushToken(token: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/register-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Failed to register push token');
      }
    } catch (error) {
      console.error('Register push token error:', error);
      throw error;
    }
  }

  async unregisterPushToken(): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/unregister-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to unregister push token');
      }
    } catch (error) {
      console.error('Unregister push token error:', error);
      throw error;
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const response = await fetch(`${this.baseUrl}/notifications/unread-count`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch unread count');
      }

      const data = await response.json();
      return data.count || 0;
    } catch (error) {
      console.error('Unread count fetch error:', error);
      throw error;
    }
  }

  // Local notification methods
  async requestPermissions(): Promise<boolean> {
    try {
      // This would use react-native-push-notification or @react-native-async-storage/async-storage
      // For now, return a mock response
      return true;
    } catch (error) {
      console.error('Request permissions error:', error);
      return false;
    }
  }

  async scheduleLocalNotification(title: string, message: string, data?: any): Promise<void> {
    try {
      // This would use react-native-push-notification
      console.log('Scheduling local notification:', { title, message, data });
    } catch (error) {
      console.error('Schedule local notification error:', error);
      throw error;
    }
  }

  async cancelAllLocalNotifications(): Promise<void> {
    try {
      // This would use react-native-push-notification
      console.log('Cancelling all local notifications');
    } catch (error) {
      console.error('Cancel local notifications error:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string> {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export const notificationService = new NotificationService();
