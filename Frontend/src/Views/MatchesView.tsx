import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ClimbingPartner } from '../Models/ClimbingPartner';
import { ClimbingPartnerService } from '../Services/ClimbingPartnerService';
import { MessageService } from '../Services/MessageService';

interface MatchesViewProps {
  deviceId: string;
  onOpenChat: (otherDeviceId: string, otherUserName: string, otherUserImage: string) => void;
  onClose: () => void;
}

export const MatchesView: React.FC<MatchesViewProps> = ({
  deviceId,
  onOpenChat,
  onClose,
}) => {
  const [matches, setMatches] = useState<ClimbingPartner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const partnerService = new ClimbingPartnerService();
  const messageService = new MessageService();

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const matchList = await partnerService.fetchMatches(deviceId);
      setMatches(matchList);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load matches';
      setErrorMessage(message);
      console.error('Error loading matches:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMessage = async (partner: ClimbingPartner) => {
    try {
      const otherDeviceId = await messageService.getDeviceId(partner.id);
      if (otherDeviceId) {
        onOpenChat(otherDeviceId, partner.name, partner.profileImageName);
      } else {
        alert('Unable to start conversation. Profile may not have a device ID.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load conversation';
      alert(message);
      console.error('Error loading device ID:', error);
    }
  };

  const renderMatch = ({ item }: { item: ClimbingPartner }) => (
    <TouchableOpacity
      style={styles.matchCard}
      onPress={() => handleMessage(item)}
      activeOpacity={0.7}
    >
      <View style={styles.profileImage}>
        <Ionicons name="person" size={40} color="#ccc" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>
          {item.name}, {item.age}
        </Text>
        <Text style={styles.location}>{item.location}</Text>
        <View style={styles.badges}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.skillLevel}</Text>
          </View>
          {item.preferredTypes.length > 0 && (
            <Text style={styles.typeText}>{item.preferredTypes[0]}</Text>
          )}
        </View>
      </View>
      <View style={styles.messageButton}>
        <Ionicons name="chatbubble" size={24} color="#fff" />
        <Text style={styles.messageButtonText}>Message</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Matches</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Matches</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadMatches}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (matches.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Matches</Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.closeButton}>Done</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
          <Ionicons name="heart-outline" size={60} color="#999" />
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptySubtitle}>
            Keep swiping to find your climbing partner!
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Matches</Text>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeButton}>Done</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={matches}
        renderItem={renderMatch}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
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
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 20,
    color: '#000',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  list: {
    padding: 16,
  },
  matchCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#007AFF',
  },
  info: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(0, 122, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '500',
  },
  typeText: {
    fontSize: 12,
    color: '#ff9500',
  },
  messageButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 80,
  },
  messageButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
});

