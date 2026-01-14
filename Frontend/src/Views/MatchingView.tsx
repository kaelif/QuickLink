import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { SwipeableCard } from './SwipeableCard';
import { ClimbingPartner } from '../Models/ClimbingPartner';
import { ClimbingPartnerService } from '../Services/ClimbingPartnerService';
import { SwipeService } from '../Services/SwipeService';
import { SwipeAction } from '../types';
import { getDeviceId } from '../utils/deviceId';

interface MatchingViewProps {
  onEditProfile: () => void;
  onViewMatches: () => void;
}

export const MatchingView: React.FC<MatchingViewProps> = ({
  onEditProfile,
  onViewMatches,
}) => {
  const [partners, setPartners] = useState<ClimbingPartner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [matches, setMatches] = useState<ClimbingPartner[]>([]);
  const [deviceId, setDeviceId] = useState<string>('');

  const partnerService = new ClimbingPartnerService();
  const swipeService = new SwipeService();

  useEffect(() => {
    initializeDevice();
  }, []);

  useEffect(() => {
    if (deviceId) {
      loadStack();
      loadMatches();
    }
  }, [deviceId]);

  const initializeDevice = async () => {
    const id = await getDeviceId();
    setDeviceId(id);
  };

  const loadStack = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const stack = await partnerService.fetchStack(deviceId);
      setPartners(stack);
      setCurrentIndex(0);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load partners';
      setErrorMessage(message);
      console.error('Error loading stack:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMatches = async () => {
    try {
      const matchList = await partnerService.fetchMatches(deviceId);
      setMatches(matchList);
    } catch (error) {
      console.error('Error loading matches:', error);
    }
  };

  const handleSwipe = async (liked: boolean, partner: ClimbingPartner) => {
    try {
      const action = liked ? SwipeAction.Like : SwipeAction.Pass;
      await swipeService.recordSwipe(deviceId, partner.id, action);

      if (liked) {
        // Reload matches to check for new matches
        await loadMatches();
      }

      // Move to next card
      setCurrentIndex((prev) => prev + 1);
    } catch (error) {
      console.error('Error recording swipe:', error);
      // Continue anyway - don't block the UI
    }
  };

  const swipeCard = (liked: boolean) => {
    if (currentIndex < partners.length) {
      const partner = partners[currentIndex];
      handleSwipe(liked, partner);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Finding climbers...</Text>
        </View>
      );
    }

    if (errorMessage) {
      return (
        <View style={styles.centerContent}>
          <Ionicons name="warning" size={48} color="#ff9500" />
          <Text style={styles.errorText}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadStack}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (currentIndex >= partners.length) {
      return (
        <View style={styles.centerContent}>
          <Ionicons name="checkmark-circle" size={60} color="#34c759" />
          <Text style={styles.emptyTitle}>You've seen everyone!</Text>
          <Text style={styles.emptySubtitle}>
            Check your matches or come back later
          </Text>
          <TouchableOpacity style={styles.viewMatchesButton} onPress={onViewMatches}>
            <Text style={styles.viewMatchesButtonText}>View Matches</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cardContainer}>
        {partners.map((partner, index) => (
          <SwipeableCard
            key={partner.id}
            partner={partner}
            onSwipe={(liked) => handleSwipe(liked, partner)}
            index={index}
            currentIndex={currentIndex}
          />
        ))}
      </View>
    );
  };

  return (
    <LinearGradient
      colors={['rgba(0, 122, 255, 0.1)', 'rgba(255, 149, 0, 0.1)']}
      style={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.title}>QuickLink</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={onEditProfile} style={styles.iconButton}>
            <Ionicons name="person-circle" size={28} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={onViewMatches} style={styles.iconButton}>
            <View>
              <Ionicons name="heart" size={28} color="#ff3b30" />
              {matches.length > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{matches.length}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.content}>{renderContent()}</View>

      {currentIndex < partners.length && (
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.passButton]}
            onPress={() => swipeCard(false)}
          >
            <Ionicons name="close" size={28} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.likeButton]}
            onPress={() => swipeCard(true)}
          >
            <Ionicons name="heart" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#007AFF',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  cardContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 16,
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
  viewMatchesButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  viewMatchesButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    paddingBottom: 40,
  },
  actionButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  passButton: {
    backgroundColor: '#ff3b30',
  },
  likeButton: {
    backgroundColor: '#34c759',
  },
});

