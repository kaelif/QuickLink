import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { fetchClimbersFromDb } from "../lib/climbersApi";
import { CIRCULATE_CARDS, TESTING, USE_DUMMY_DATA } from "../lib/featureFlags";
import { isSupabaseConfigured } from "../lib/supabase";
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
  const [climbersFromDb, setClimbersFromDb] = useState<ClimberProfile[]>([]);
  const [climbersLoading, setClimbersLoading] = useState(!USE_DUMMY_DATA);
  const [stackKey, setStackKey] = useState(0);
  const { filter } = useFilter();
  const { matches, removedMatchIds, blockedUserIds, addMatch, resetAllSwipesAndMatches } = useMatches();
  const isDark = colorScheme === "dark";
  const loadingTextColor = isDark ? "#ffffff" : "#000000";
  const loadingBgColor = BACKGROUND_COLOR;
  const loadingSpinnerColor = isDark ? "#ffffff" : "#1a5f7a";

  const allClimbers = USE_DUMMY_DATA ? DUMMY_CLIMBERS : climbersFromDb;

  // Card order: filtered list, then sorted by distance (nearest first) when location is available.
  // To use list order only, remove the .sort() below. To change order, reorder data/dummyClimbers.ts (when useDummyData) or DB (when not).
  const filteredClimbers = useMemo(() => {
    const list = applyFilter(allClimbers, filter);
    if (userLocation == null) return list;
    return [...list].sort(
      (a, b) =>
        getDistanceKm(userLocation, a.location) - getDistanceKm(userLocation, b.location)
    );
  }, [
    allClimbers,
    filter.ageMin,
    filter.ageMax,
    filter.genderPreferences,
    filter.climbingTypes,
    userLocation?.latitude,
    userLocation?.longitude,
  ]);

  // Exclude current matches and blocked users. Exclude left-swiped (removed) users unless TESTING && CIRCULATE_CARDS.
  const stackClimbers = useMemo(() => {
    const matchIds = new Set(matches.map((m) => m.id));
    const blockedSet = new Set(blockedUserIds);
    const excludeRemoved = !(TESTING && CIRCULATE_CARDS);
    const excludedIds = excludeRemoved
      ? new Set([...matchIds, ...removedMatchIds, ...blockedSet])
      : new Set([...matchIds, ...blockedSet]);
    return filteredClimbers.filter((c) => !excludedIds.has(c.id));
  }, [filteredClimbers, matches, removedMatchIds, blockedUserIds]);

  useEffect(() => {
    getCurrentLocation().then((coords) => {
      setUserLocation(coords);
      setLocationLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!USE_DUMMY_DATA) {
      setClimbersLoading(true);
      fetchClimbersFromDb()
        .then(setClimbersFromDb)
        .finally(() => setClimbersLoading(false));
    }
  }, []);

  const isLoading = locationLoading || (!USE_DUMMY_DATA && climbersLoading);

  if (isLoading) {
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

  // When using DB and we have no climbers after loading, show a clear empty state.
  const dbModeNoData =
    !USE_DUMMY_DATA && !climbersLoading && climbersFromDb.length === 0;

  const handleResetSwipes = () => {
    Alert.alert(
      "Reset all swipes & matches",
      "Clear all matches, messages, and swipe history? Every climber will appear in the stack again.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetAllSwipesAndMatches();
            setStackKey((k) => k + 1);
          },
        },
      ]
    );
  };

  if (dbModeNoData) {
    const configured = isSupabaseConfigured();
    const message = configured
      ? "No climbers in the database. Run supabase/01_schema.sql and 02_seed_climbers.sql in your Supabase project’s SQL Editor."
      : "Supabase not configured. Add EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY to a .env file (see .env.example).";
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: loadingBgColor }]} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.title}>QuickLink</Text>
            <Text style={styles.subtitle}>Find climbing partners</Text>
          </View>
        </View>
        <View style={[styles.loading, { flex: 1 }]}>
          <Text style={[styles.loadingText, { color: loadingTextColor, textAlign: "center", paddingHorizontal: 24 }]}>
            {message}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          {TESTING && (
            <Pressable
              onPress={handleResetSwipes}
              style={({ pressed }) => [styles.headerBtn, styles.headerIconBtn, pressed && styles.headerBtnPressed]}
              accessibilityLabel="Reset app (testing): remove all matches and messages"
            >
              <MaterialCommunityIcons name="refresh" size={22} color="#1a5f7a" />
            </Pressable>
          )}
        </View>
      </View>
      <SwipeStack
        key={stackKey}
        climbers={stackClimbers}
        userLocation={userLocation}
        onLike={addMatch}
        circulatePassedCards={TESTING && CIRCULATE_CARDS}
      />
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
    color: "#000000",
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
