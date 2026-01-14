import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../Models/Message';
import { MessageService } from '../Services/MessageService';

interface ChatViewProps {
  deviceId: string;
  otherDeviceId: string;
  otherUserName: string;
  otherUserImage: string;
  onClose: () => void;
}

export const ChatView: React.FC<ChatViewProps> = ({
  deviceId,
  otherDeviceId,
  otherUserName,
  otherUserImage,
  onClose,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const flatListRef = useRef<FlatList>(null);

  const messageService = new MessageService();

  useEffect(() => {
    loadMessages();
    markAsRead();
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const loadMessages = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await messageService.getConversation(deviceId, otherDeviceId);
      setMessages(result.messages);
      // Determine current user ID based on deviceId
      // The backend returns currentUserId and otherUserId
      // We need to figure out which one corresponds to our deviceId
      setCurrentUserId(result.currentUserId);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load messages';
      setErrorMessage(message);
      console.error('Error loading messages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async () => {
    try {
      await messageService.markMessagesAsRead(deviceId, otherDeviceId);
      // Reload messages to get updated read status
      await loadMessages();
    } catch (error) {
      console.error('Failed to mark messages as read:', error);
    }
  };

  const sendMessage = async () => {
    const text = messageText.trim();
    if (!text || isSending) return;

    setIsSending(true);
    setMessageText('');

    try {
      const newMessage = await messageService.sendMessage(deviceId, otherDeviceId, text);
      setMessages((prev) => [...prev, newMessage]);
      // Mark as read after sending
      await markAsRead();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send message';
      setErrorMessage(message);
      setMessageText(text); // Restore message text on error
      console.error('Error sending message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const isFromCurrentUser = (message: Message) => {
    // This is a simplified check - in a real app, you'd need to properly map deviceId to userId
    return currentUserId !== null && message.senderId === currentUserId;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const fromCurrentUser = isFromCurrentUser(item);

    return (
      <View
        style={[
          styles.messageContainer,
          fromCurrentUser ? styles.messageContainerRight : styles.messageContainerLeft,
        ]}
      >
        <View
          style={[
            styles.messageBubble,
            fromCurrentUser ? styles.messageBubbleRight : styles.messageBubbleLeft,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              fromCurrentUser ? styles.messageTextRight : styles.messageTextLeft,
            ]}
          >
            {item.content}
          </Text>
          <Text
            style={[
              styles.messageTime,
              fromCurrentUser ? styles.messageTimeRight : styles.messageTimeLeft,
            ]}
          >
            {formatTime(item.createdAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherUserName}</Text>
        <View style={styles.headerSpacer} />
      </View>

      {isLoading ? (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : errorMessage ? (
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMessages}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={messageText}
          onChangeText={setMessageText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, (!messageText.trim() || isSending) && styles.sendButtonDisabled]}
          onPress={sendMessage}
          disabled={!messageText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="send" size={24} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 24,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff3b30',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
  },
  messageContainerLeft: {
    alignItems: 'flex-start',
  },
  messageContainerRight: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 18,
  },
  messageBubbleLeft: {
    backgroundColor: '#e5e5ea',
  },
  messageBubbleRight: {
    backgroundColor: '#007AFF',
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageTextLeft: {
    color: '#000',
  },
  messageTextRight: {
    color: '#fff',
  },
  messageTime: {
    fontSize: 12,
  },
  messageTimeLeft: {
    color: '#666',
  },
  messageTimeRight: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    marginRight: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#ccc',
  },
});

