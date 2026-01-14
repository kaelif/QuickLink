import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { ClimbingPartner } from '../Models/ClimbingPartner';
import { SkillLevel, ClimbingType } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface SwipeableCardProps {
  partner: ClimbingPartner;
  onSwipe: (liked: boolean) => void;
  index: number;
  currentIndex: number;
}

const SWIPE_THRESHOLD = 100;

export const SwipeableCard: React.FC<SwipeableCardProps> = ({
  partner,
  onSwipe,
  index,
  currentIndex,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const rotation = useSharedValue(0);
  const opacity = useSharedValue(1);

  const isActive = index === currentIndex;

  const panGesture = Gesture.Pan()
    .enabled(isActive)
    .onUpdate((event) => {
      translateX.value = event.translationX;
      translateY.value = event.translationY;
      rotation.value = event.translationX / 10;
    })
    .onEnd((event) => {
      const absX = Math.abs(event.translationX);
      
      if (absX > SWIPE_THRESHOLD) {
        const direction = event.translationX > 0 ? 1 : -1;
        translateX.value = withSpring(direction * 1000);
        translateY.value = withSpring(event.translationY);
        rotation.value = withSpring(direction * 30);
        opacity.value = withSpring(0, {}, () => {
          runOnJS(onSwipe)(direction > 0);
        });
      } else {
        translateX.value = withSpring(0);
        translateY.value = withSpring(0);
        rotation.value = withSpring(0);
      }
    });

  const animatedStyle = useAnimatedStyle(() => {
    const scale = isActive ? 1 : 0.95 - (index - currentIndex) * 0.05;
    const yOffset = (index - currentIndex) * 10;
    
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value + yOffset },
        { rotate: `${rotation.value}deg` },
        { scale },
      ],
      opacity: opacity.value,
    };
  });

  if (index < currentIndex || index > currentIndex + 2) {
    return null;
  }

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={[styles.card, animatedStyle]}>
        <View style={styles.imageContainer}>
          <View style={styles.imagePlaceholder}>
            <Ionicons name="person" size={80} color="#ccc" />
          </View>
          <View style={styles.skillBadge}>
            <Text style={styles.skillText}>{partner.skillLevel}</Text>
          </View>
        </View>
        
        <View style={styles.infoContainer}>
          <View style={styles.header}>
            <Text style={styles.name}>{partner.name}, {partner.age}</Text>
          </View>
          
          <View style={styles.locationRow}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.location}>{partner.location}</Text>
          </View>
          
          <Text style={styles.bio} numberOfLines={2}>
            {partner.bio}
          </Text>
          
          <View style={styles.typesContainer}>
            {partner.preferredTypes.map((type, idx) => (
              <View key={idx} style={styles.typeChip}>
                <Text style={styles.typeText}>{type}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.availabilityRow}>
            <Ionicons name="calendar" size={14} color="#666" />
            <Text style={styles.availability}>{partner.availability}</Text>
          </View>
        </View>
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '90%',
    height: '75%',
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
    position: 'absolute',
  },
  imageContainer: {
    width: '100%',
    height: '60%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
  },
  skillBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 122, 255, 0.8)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  skillText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    padding: 16,
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  bio: {
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    lineHeight: 20,
  },
  typesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  typeChip: {
    backgroundColor: 'rgba(255, 149, 0, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 4,
  },
  typeText: {
    fontSize: 12,
    color: '#ff9500',
    fontWeight: '500',
  },
  availabilityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  availability: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
});

