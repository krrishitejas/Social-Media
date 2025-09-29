import { Message, Conversation, User } from '@types';

export interface SendMessageRequest {
  conversationId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file';
  mediaUrl?: string;
  replyToMessageId?: string;
}

export interface CreateConversationRequest {
  participants: string[];
  name?: string;
  type: 'direct' | 'group';
}

export interface ConversationResponse {
  conversations: Conversation[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface MessagesResponse {
  messages: Message[];
  nextCursor?: string;
  hasMore: boolean;
}

class MessageService {
  private baseUrl = 'http://localhost:3000/api';
  private socket: any = null;

  async getConversations(cursor?: string): Promise<ConversationResponse> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/messages/conversations?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch conversations');
      }

      return await response.json();
    } catch (error) {
      console.error('Conversations fetch error:', error);
      throw error;
    }
  }

  async getMessages(conversationId: string, cursor?: string): Promise<MessagesResponse> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/messages/conversations/${conversationId}/messages?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }

      return await response.json();
    } catch (error) {
      console.error('Messages fetch error:', error);
      throw error;
    }
  }

  async sendMessage(messageData: SendMessageRequest): Promise<Message> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/send`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(messageData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      return await response.json();
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  async createConversation(conversationData: CreateConversationRequest): Promise<Conversation> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/conversations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(conversationData),
      });

      if (!response.ok) {
        throw new Error('Failed to create conversation');
      }

      return await response.json();
    } catch (error) {
      console.error('Create conversation error:', error);
      throw error;
    }
  }

  async markAsRead(conversationId: string, messageId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/conversations/${conversationId}/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ messageId }),
      });

      if (!response.ok) {
        throw new Error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Mark as read error:', error);
      throw error;
    }
  }

  async deleteMessage(messageId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/messages/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete message');
      }
    } catch (error) {
      console.error('Delete message error:', error);
      throw error;
    }
  }

  async uploadMedia(file: any, type: 'image' | 'video' | 'audio' | 'file'): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', type);

      const response = await fetch(`${this.baseUrl}/messages/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload media');
      }

      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload media error:', error);
      throw error;
    }
  }

  async searchMessages(query: string, conversationId?: string): Promise<Message[]> {
    try {
      const params = new URLSearchParams({ q: query });
      if (conversationId) params.append('conversationId', conversationId);

      const response = await fetch(`${this.baseUrl}/messages/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to search messages');
      }

      const data = await response.json();
      return data.messages || [];
    } catch (error) {
      console.error('Search messages error:', error);
      throw error;
    }
  }

  // WebSocket connection for real-time messaging
  connectSocket() {
    if (this.socket) return this.socket;

    // Mock socket connection - in real app, use Socket.IO or WebSocket
    this.socket = {
      on: (event: string, callback: Function) => {
        console.log(`Socket event: ${event}`);
      },
      emit: (event: string, data: any) => {
        console.log(`Socket emit: ${event}`, data);
      },
      disconnect: () => {
        this.socket = null;
      },
    };

    return this.socket;
  }

  disconnectSocket() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  private async getAuthToken(): Promise<string> {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export const messageService = new MessageService();
