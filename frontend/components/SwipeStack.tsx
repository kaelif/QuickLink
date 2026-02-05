import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import {
  Platform,
  Pressable,
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { getDistanceKm } from "../lib/geo";
import type { UserCoords } from "../lib/location";
import type { ClimberProfile } from "../types/climber";
import { ClimberCard } from "./ClimberCard";
import { ProfileDetailModal } from "./ProfileDetailModal";

const SWIPE_THRESHOLD = 70;
const returnSpring = { damping: 28, stiffness: 120 };
const EXIT_DURATION = 180;

interface SwipeStackProps {
  climbers: ClimberProfile[];
  userLocation: UserCoords | null;
  onLike?: (climber: ClimberProfile) => void;
}

export function SwipeStack({ climbers: initialClimbers, userLocation, onLike }: SwipeStackProps) {
  const [climbers, setClimbers] = useState(initialClimbers);
  const [selectedClimber, setSelectedClimber] = useState<ClimberProfile | null>(null);
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomInset = Platform.OS === "android" ? insets.bottom : 0;
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
    const liked = climbers[0];
    if (liked) onLike?.(liked);
    setClimbers((prev) => prev.slice(1));
    translateX.value = 0;
    translateY.value = 0;
  }, [climbers, onLike, translateX, translateY]);

  const handleNo = useCallback(() => {
    if (climbers.length === 0) return;
    translateX.value = withTiming(-screenWidth * 1.2, { duration: EXIT_DURATION }, () => {
      runOnJS(triggerPass)();
    });
    translateY.value = withTiming(0, { duration: EXIT_DURATION });
  }, [climbers.length, screenWidth, triggerPass]);

  const handleYes = useCallback(() => {
    if (climbers.length === 0) return;
    translateX.value = withTiming(screenWidth * 1.2, { duration: EXIT_DURATION }, () => {
      runOnJS(triggerLike)();
    });
    translateY.value = withTiming(0, { duration: EXIT_DURATION });
  }, [climbers.length, screenWidth, triggerLike]);

  const openProfile = useCallback((climber: ClimberProfile) => {
    setSelectedClimber(climber);
  }, []);

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

  const tapGesture = Gesture.Tap()
    .maxDistance(15)
    .onEnd(() => {
      if (climbers.length > 0) {
        runOnJS(openProfile)(climbers[0]);
      }
    });

  const composedGesture = Gesture.Race(tapGesture, panGesture);

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
      <View
        style={[
          styles.cardArea,
          Platform.OS === "ios" && styles.cardAreaIos,
        ]}
      >
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
      <GestureDetector gesture={composedGesture}>
        <Animated.View
          style={[styles.stackCard, styles.topCard, animatedCardStyle]}
          pointerEvents="box-none"
        >
          <ClimberCard climber={top} distanceKm={distanceKm} />
        </Animated.View>
      </GestureDetector>
      </View>
      <LinearGradient
        colors={["transparent", "rgba(192,204,209,0.6)", "#c0ccd1"]}
        style={[styles.buttonRowFade, { height: 160 + bottomInset }]}
        pointerEvents="none"
      />
      <View
        style={[
          styles.buttonRow,
          Platform.OS === "android" && { paddingBottom: 24 + bottomInset },
        ]}
        pointerEvents="box-none"
      >
        <Pressable
          style={({ pressed }) => [styles.button, styles.noButton, pressed && styles.buttonPressed]}
          onPress={handleNo}
        >
          <MaterialIcons name="close" size={36} color="#555" />
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.button, styles.yesButton, pressed && styles.buttonPressed]}
          onPress={handleYes}
        >
          <MaterialIcons name="check" size={36} color="#fff" />
        </Pressable>
      </View>
      {selectedClimber != null && (
        <ProfileDetailModal
          climber={selectedClimber}
          distanceKm={
            userLocation != null
              ? getDistanceKm(userLocation, selectedClimber.location)
              : null
          }
          onClose={() => setSelectedClimber(null)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  cardArea: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardAreaIos: {
    paddingTop: 408,
  },
  stackCard: {
    position: "absolute",
    width: "100%",
    maxWidth: 360,
  },
  topCard: {
    zIndex: 10,
  },
  buttonRowFade: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 15,
  },
  buttonRow: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
    paddingVertical: 24,
    paddingBottom: 32,
    zIndex: 20,
  },
  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.8,
  },
  noButton: {
    backgroundColor: "#e8e8e8",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  yesButton: {
    backgroundColor: "#1a5f7a",
    borderWidth: 2,
    borderColor: "#145266",
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
