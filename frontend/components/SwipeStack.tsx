import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { ClimberProfile } from "../types/climber";
import type { UserCoords } from "../lib/location";
import { getDistanceKm } from "../lib/geo";
import { ClimberCard } from "./ClimberCard";

const SWIPE_THRESHOLD = 70;
const returnSpring = { damping: 28, stiffness: 120 };
const EXIT_DURATION = 180;

interface SwipeStackProps {
  climbers: ClimberProfile[];
  userLocation: UserCoords | null;
}

export function SwipeStack({ climbers: initialClimbers, userLocation }: SwipeStackProps) {
  const [climbers, setClimbers] = useState(initialClimbers);
  const { width: screenWidth } = useWindowDimensions();
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  const triggerPass = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setClimbers((prev) => prev.slice(1));
    translateX.value = 0;
    translateY.value = 0;
  }, [translateX, translateY]);

  const triggerLike = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setClimbers((prev) => prev.slice(1));
    translateX.value = 0;
    translateY.value = 0;
  }, [translateX, translateY]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      translateY.value = e.translationY * 0.3;
    })
    .onEnd((e) => {
      const goLeft = translateX.value < -SWIPE_THRESHOLD;
      const goRight = translateX.value > SWIPE_THRESHOLD;
      const targetX = goLeft ? -screenWidth * 1.2 : goRight ? screenWidth * 1.2 : 0;
      const targetY = goLeft || goRight ? translateY.value : 0;

      if (goLeft) {
        translateX.value = withTiming(targetX, { duration: EXIT_DURATION }, () => {
          runOnJS(triggerPass)();
        });
        translateY.value = withTiming(targetY, { duration: EXIT_DURATION });
      } else if (goRight) {
        translateX.value = withTiming(targetX, { duration: EXIT_DURATION }, () => {
          runOnJS(triggerLike)();
        });
        translateY.value = withTiming(targetY, { duration: EXIT_DURATION });
      } else {
        translateX.value = withSpring(0, returnSpring);
        translateY.value = withSpring(0, returnSpring);
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotate = (translateX.value / screenWidth) * 0.15;
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value },
        { rotate: `${rotate}rad` },
      ],
    };
  });

  if (climbers.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyTitle}>No more climbers right now</Text>
        <Text style={styles.emptySub}>
          Check back later for new potential partners.
        </Text>
      </View>
    );
  }

  const top = climbers[0];
  const nextCards = climbers.slice(1, 3);
  const distanceKm =
    userLocation != null
      ? getDistanceKm(userLocation, top.location)
      : null;

  const cardsToRender = [...nextCards].reverse();

  return (
    <View style={styles.container}>
      {cardsToRender.map((climber, i) => {
        const nextDistance =
          userLocation != null
            ? getDistanceKm(userLocation, climber.location)
            : null;
        const scale = 1 - (cardsToRender.length - i) * 0.05;
        const offset = (cardsToRender.length - i) * 8;
        return (
          <View
            key={climber.id}
            style={[
              styles.stackCard,
              {
                transform: [{ scale }, { translateY: offset }],
                zIndex: 1 + i,
              },
            ]}
            pointerEvents="none"
          >
            <ClimberCard climber={climber} distanceKm={nextDistance} />
          </View>
        );
      })}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.stackCard, styles.topCard, animatedCardStyle]}
          pointerEvents="box-none"
        >
          <ClimberCard climber={top} distanceKm={distanceKm} />
        </Animated.View>
      </GestureDetector>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  stackCard: {
    position: "absolute",
    width: "100%",
    maxWidth: 360,
  },
  topCard: {
    zIndex: 10,
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySub: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
  },
});
