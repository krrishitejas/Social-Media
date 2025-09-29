import { LiveStream, LiveComment, LiveViewer } from '@types';

export interface CreateLiveStreamRequest {
  title: string;
  description?: string;
  isPublic: boolean;
  category?: string;
  tags?: string[];
}

export interface LiveStreamResponse {
  stream: LiveStream;
  streamKey: string;
  rtmpUrl: string;
  hlsUrl: string;
}

export interface LiveCommentsResponse {
  comments: LiveComment[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface LiveViewersResponse {
  viewers: LiveViewer[];
  totalCount: number;
}

class LiveService {
  private baseUrl = 'http://localhost:3000/api';

  async createLiveStream(streamData: CreateLiveStreamRequest): Promise<LiveStreamResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/live/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify(streamData),
      });

      if (!response.ok) {
        throw new Error('Failed to create live stream');
      }

      return await response.json();
    } catch (error) {
      console.error('Create live stream error:', error);
      throw error;
    }
  }

  async getLiveStream(streamId: string): Promise<LiveStream> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch live stream');
      }

      return await response.json();
    } catch (error) {
      console.error('Get live stream error:', error);
      throw error;
    }
  }

  async getLiveStreams(cursor?: string): Promise<{ streams: LiveStream[]; nextCursor?: string; hasMore: boolean }> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/live/streams?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch live streams');
      }

      return await response.json();
    } catch (error) {
      console.error('Get live streams error:', error);
      throw error;
    }
  }

  async startLiveStream(streamId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to start live stream');
      }
    } catch (error) {
      console.error('Start live stream error:', error);
      throw error;
    }
  }

  async endLiveStream(streamId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}/end`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to end live stream');
      }
    } catch (error) {
      console.error('End live stream error:', error);
      throw error;
    }
  }

  async joinLiveStream(streamId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to join live stream');
      }
    } catch (error) {
      console.error('Join live stream error:', error);
      throw error;
    }
  }

  async leaveLiveStream(streamId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}/leave`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to leave live stream');
      }
    } catch (error) {
      console.error('Leave live stream error:', error);
      throw error;
    }
  }

  async sendLiveComment(streamId: string, content: string): Promise<LiveComment> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to send live comment');
      }

      return await response.json();
    } catch (error) {
      console.error('Send live comment error:', error);
      throw error;
    }
  }

  async getLiveComments(streamId: string, cursor?: string): Promise<LiveCommentsResponse> {
    try {
      const params = new URLSearchParams();
      if (cursor) params.append('cursor', cursor);

      const response = await fetch(`${this.baseUrl}/live/${streamId}/comments?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch live comments');
      }

      return await response.json();
    } catch (error) {
      console.error('Get live comments error:', error);
      throw error;
    }
  }

  async getLiveViewers(streamId: string): Promise<LiveViewersResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}/viewers`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch live viewers');
      }

      return await response.json();
    } catch (error) {
      console.error('Get live viewers error:', error);
      throw error;
    }
  }

  async likeLiveStream(streamId: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to like live stream');
      }
    } catch (error) {
      console.error('Like live stream error:', error);
      throw error;
    }
  }

  async shareLiveStream(streamId: string, platform: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ platform }),
      });

      if (!response.ok) {
        throw new Error('Failed to share live stream');
      }
    } catch (error) {
      console.error('Share live stream error:', error);
      throw error;
    }
  }

  async reportLiveStream(streamId: string, reason: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/live/${streamId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({ reason }),
      });

      if (!response.ok) {
        throw new Error('Failed to report live stream');
      }
    } catch (error) {
      console.error('Report live stream error:', error);
      throw error;
    }
  }

  // WebSocket connection for real-time live streaming
  connectLiveSocket(streamId: string) {
    // Mock socket connection - in real app, use Socket.IO or WebSocket
    const socket = {
      on: (event: string, callback: Function) => {
        console.log(`Live socket event: ${event}`);
      },
      emit: (event: string, data: any) => {
        console.log(`Live socket emit: ${event}`, data);
      },
      disconnect: () => {
        console.log('Live socket disconnected');
      },
    };

    return socket;
  }

  private async getAuthToken(): Promise<string> {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return await AsyncStorage.getItem('authToken') || '';
  }
}

export const liveService = new LiveService();
