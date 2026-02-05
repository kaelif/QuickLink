import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { SwipeStack } from "../components/SwipeStack";
import { useFilter } from "../context/FilterContext";
import { useMatches } from "../context/MatchesContext";
import { DUMMY_CLIMBERS } from "../data/dummyClimbers";
import { getDistanceKm } from "../lib/geo";
import { getCurrentLocation, type UserCoords } from "../lib/location";
import { BACKGROUND_COLOR } from "../lib/theme";
import type { ClimberProfile } from "../types/climber";

function applyFilter(climbers: ClimberProfile[], filter: ReturnType<typeof useFilter>["filter"]) {
  return climbers.filter((c) => {
    if (c.age < filter.ageMin || c.age > filter.ageMax) return false;
    if (filter.genderPreferences.length > 0 && !filter.genderPreferences.includes("all")) {
      if (c.gender == null) return true;
      if (c.gender === "other") return false;
      if (!filter.genderPreferences.includes(c.gender)) return false;
    }
    if (filter.climbingTypes.length > 0) {
      const hasMatch = filter.climbingTypes.some((t) => c.climbingTypes.includes(t));
      if (!hasMatch) return false;
    }
    return true;
  });
}

export default function Index() {
  const colorScheme = useColorScheme();
  const [userLocation, setUserLocation] = useState<UserCoords | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const { filter } = useFilter();
  const { addMatch } = useMatches();
  const isDark = colorScheme === "dark";
  const loadingTextColor = isDark ? "#ffffff" : "#000000";
  const loadingBgColor = BACKGROUND_COLOR;
  const loadingSpinnerColor = isDark ? "#ffffff" : "#1a5f7a";

  // Card order: filtered list, then sorted by distance (nearest first) when location is available.
  // To use list order only, remove the .sort() below. To change order, reorder data/dummyClimbers.ts.
  const filteredClimbers = useMemo(() => {
    const list = applyFilter(DUMMY_CLIMBERS, filter);
    if (userLocation == null) return list;
    return [...list].sort(
      (a, b) =>
        getDistanceKm(userLocation, a.location) - getDistanceKm(userLocation, b.location)
    );
  }, [
    filter.ageMin,
    filter.ageMax,
    filter.genderPreferences,
    filter.climbingTypes,
    userLocation?.latitude,
    userLocation?.longitude,
  ]);

  useEffect(() => {
    getCurrentLocation().then((coords) => {
      setUserLocation(coords);
      setLocationLoading(false);
    });
  }, []);

  if (locationLoading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: loadingBgColor }]}>
        <View style={styles.loading}>
          <Image
            source={require("../assets/images/splash-icon.png")}
            style={styles.loadingLogo}
            contentFit="contain"
          />
          <ActivityIndicator size="large" color={loadingSpinnerColor} />
          <Text style={[styles.loadingText, { color: loadingTextColor }]}>
            Getting your location…
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>QuickLink</Text>
          <Text style={styles.subtitle}>Find climbing partners</Text>
        </View>
        <View style={styles.headerButtons}>
          <Pressable
            onPress={() => router.push("/messages")}
            style={({ pressed }) => [styles.headerBtn, styles.headerIconBtn, pressed && styles.headerBtnPressed]}
            accessibilityLabel="Messages"
          >
            <MaterialCommunityIcons name="message-text-outline" size={22} color="#1a5f7a" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/filter")}
            style={({ pressed }) => [styles.headerBtn, styles.headerIconBtn, pressed && styles.headerBtnPressed]}
            accessibilityLabel="Filter"
          >
            <MaterialCommunityIcons name="tune" size={22} color="#1a5f7a" />
          </Pressable>
          <Pressable
            onPress={() => router.push("/edit-profile")}
            style={({ pressed }) => [styles.headerBtn, styles.headerIconBtn, pressed && styles.headerBtnPressed]}
            accessibilityLabel="Edit profile"
          >
            <MaterialCommunityIcons name="pencil" size={22} color="#1a5f7a" />
          </Pressable>
        </View>
      </View>
      <SwipeStack climbers={filteredClimbers} userLocation={userLocation} onLike={addMatch} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerLeft: {},
  headerButtons: {
    flexDirection: "row",
    gap: 10,
  },
  headerBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: BACKGROUND_COLOR,
  },
  headerIconBtn: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  headerBtnPressed: {
    opacity: 0.8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1a5f7a",
  },
  subtitle: {
    fontSize: 15,
    color: "#FFFFFF",
    marginTop: 2,
    marginLeft: 2
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingLogo: {
    width: 240,
    height: 160,
    marginBottom: 8,
  },
  loadingText: {
    fontSize: 15,
    color: "#666",
  },
});
