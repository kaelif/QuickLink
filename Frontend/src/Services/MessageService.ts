import { Message, Conversation, ConversationResponse, MessagesResponse } from '../Models/Message';

const BASE_URL = 'http://localhost:4000';

export class MessageError extends Error {
  constructor(message: string, public code?: string) {
    super(message);
    this.name = 'MessageError';
  }
}

export interface MessageProviding {
  sendMessage(senderDeviceId: string, recipientDeviceId: string, content: string): Promise<Message>;
  getConversation(deviceId1: string, deviceId2: string): Promise<{ messages: Message[]; currentUserId: number; otherUserId: number }>;
  getConversations(deviceId: string): Promise<Conversation[]>;
  markMessagesAsRead(deviceId: string, otherDeviceId: string): Promise<number>;
  getDeviceId(from profileId: string): Promise<string | null>;
}

export class MessageService implements MessageProviding {
  private baseURL: string;

  constructor(baseURL: string = BASE_URL) {
    this.baseURL = baseURL;
  }

  async sendMessage(senderDeviceId: string, recipientDeviceId: string, content: string): Promise<Message> {
    try {
      const response = await fetch(`${this.baseURL}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          senderDeviceId,
          recipientDeviceId,
          content,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MessageError(
          errorData.message || `Server error (${response.status})`,
          'SERVER_ERROR'
        );
      }

      const data = await response.json();
      return data as Message;
    } catch (error) {
      if (error instanceof MessageError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new MessageError('Request timed out. Check your connection.', 'TIMEOUT');
      }
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new MessageError('Cannot connect to server. Make sure the backend is running.', 'CONNECTION_FAILED');
      }
      throw new MessageError(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        'UNKNOWN'
      );
    }
  }

  async getConversation(deviceId1: string, deviceId2: string): Promise<{ messages: Message[]; currentUserId: number; otherUserId: number }> {
    try {
      const url = `${this.baseURL}/messages/conversation?deviceId1=${encodeURIComponent(deviceId1)}&deviceId2=${encodeURIComponent(deviceId2)}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MessageError(
          errorData.message || `Server error (${response.status})`,
          'SERVER_ERROR'
        );
      }

      const data = await response.json() as MessagesResponse;
      return {
        messages: data.messages,
        currentUserId: data.currentUserId,
        otherUserId: data.otherUserId,
      };
    } catch (error) {
      if (error instanceof MessageError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new MessageError('Request timed out. Check your connection.', 'TIMEOUT');
      }
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new MessageError('Cannot connect to server. Make sure the backend is running.', 'CONNECTION_FAILED');
      }
      throw new MessageError(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        'UNKNOWN'
      );
    }
  }

  async getConversations(deviceId: string): Promise<Conversation[]> {
    try {
      const response = await fetch(`${this.baseURL}/messages/conversations/${deviceId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MessageError(
          errorData.message || `Server error (${response.status})`,
          'SERVER_ERROR'
        );
      }

      const data = await response.json() as ConversationResponse;
      return data.conversations;
    } catch (error) {
      if (error instanceof MessageError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new MessageError('Request timed out. Check your connection.', 'TIMEOUT');
      }
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new MessageError('Cannot connect to server. Make sure the backend is running.', 'CONNECTION_FAILED');
      }
      throw new MessageError(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        'UNKNOWN'
      );
    }
  }

  async markMessagesAsRead(deviceId: string, otherDeviceId: string): Promise<number> {
    try {
      const response = await fetch(`${this.baseURL}/messages/read`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          deviceId,
          otherDeviceId,
        }),
        signal: AbortSignal.timeout(10000),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MessageError(
          errorData.message || `Server error (${response.status})`,
          'SERVER_ERROR'
        );
      }

      const data = await response.json() as { count: number };
      return data.count;
    } catch (error) {
      if (error instanceof MessageError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new MessageError('Request timed out. Check your connection.', 'TIMEOUT');
      }
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new MessageError('Cannot connect to server. Make sure the backend is running.', 'CONNECTION_FAILED');
      }
      throw new MessageError(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        'UNKNOWN'
      );
    }
  }

  async getDeviceId(from profileId: string): Promise<string | null> {
    try {
      const response = await fetch(`${this.baseURL}/profile/${profileId}/deviceId`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: AbortSignal.timeout(10000),
      });

      if (response.status === 404) {
        return null;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new MessageError(
          errorData.message || `Server error (${response.status})`,
          'SERVER_ERROR'
        );
      }

      const data = await response.json() as { deviceId: string | null };
      return data.deviceId ?? null;
    } catch (error) {
      if (error instanceof MessageError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new MessageError('Request timed out. Check your connection.', 'TIMEOUT');
      }
      if (error instanceof Error && error.message.includes('fetch')) {
        throw new MessageError('Cannot connect to server. Make sure the backend is running.', 'CONNECTION_FAILED');
      }
      throw new MessageError(
        `Error: ${error instanceof Error ? error.message : String(error)}`,
        'UNKNOWN'
      );
    }
  }
}

