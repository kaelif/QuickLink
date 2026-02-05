import { useRouter } from "expo-router";
import { useMemo, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SwipeStack } from "../components/SwipeStack";
import { useFilter } from "../context/FilterContext";
import { DUMMY_CLIMBERS } from "../data/dummyClimbers";
import { getCurrentLocation, type UserCoords } from "../lib/location";
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
  const [userLocation, setUserLocation] = useState<UserCoords | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);
  const { filter } = useFilter();

  const filteredClimbers = useMemo(
    () => applyFilter(DUMMY_CLIMBERS, filter),
    [filter.ageMin, filter.ageMax, filter.genderPreferences, filter.climbingTypes]
  );

  useEffect(() => {
    getCurrentLocation().then((coords) => {
      setUserLocation(coords);
      setLocationLoading(false);
    });
  }, []);

  if (locationLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#1a5f7a" />
          <Text style={styles.loadingText}>Getting your location…</Text>
        </View>
      </SafeAreaView>
    );
  }

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.title}>QuickLink</Text>
          <Text style={styles.subtitle}>Find climbing partners</Text>
        </View>
        <View style={styles.headerButtons}>
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
      <SwipeStack climbers={filteredClimbers} userLocation={userLocation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#e8f4f8",
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
    color: "#666",
    marginTop: 2,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 15,
    color: "#666",
  },
});
