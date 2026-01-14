export interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  isRead: boolean;
  createdAt: string; // ISO8601 date string
}

export interface Conversation {
  otherUserId: number;
  otherUserDeviceId: string | null;
  otherUserName: string;
  otherUserImage: string;
  lastMessage: Message;
  unreadCount: number;
  lastMessageAt: string; // ISO8601 date string
}

export interface ConversationResponse {
  conversations: Conversation[];
}

export interface MessagesResponse {
  messages: Message[];
  currentUserId: number;
  otherUserId: number;
}

