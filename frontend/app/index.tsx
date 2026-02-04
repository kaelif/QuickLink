import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SwipeStack } from "../components/SwipeStack";
import { DUMMY_CLIMBERS } from "../data/dummyClimbers";
import { getCurrentLocation, type UserCoords } from "../lib/location";

export default function Index() {
  const [userLocation, setUserLocation] = useState<UserCoords | null>(null);
  const [locationLoading, setLocationLoading] = useState(true);

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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>QuickLink</Text>
        <Text style={styles.subtitle}>Find climbing partners</Text>
      </View>
      <SwipeStack climbers={DUMMY_CLIMBERS} userLocation={userLocation} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
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
