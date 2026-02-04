import { Image } from "expo-image";
import { StyleSheet, Text, View } from "react-native";
import type { ClimberProfile, ClimbingType } from "../types/climber";
import { formatDistance } from "../lib/geo";

const CLIMBING_LABELS: Record<ClimbingType, string> = {
  sport: "Sport",
  bouldering: "Bouldering",
  trad: "Trad",
};

interface ClimberCardProps {
  climber: ClimberProfile;
  distanceKm: number | null;
}

export function ClimberCard({ climber, distanceKm }: ClimberCardProps) {
  const bioSnippet =
    climber.bio.length > 120 ? climber.bio.slice(0, 120) + "…" : climber.bio;

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        <Image
          source={{ uri: climber.photoUrls[0] }}
          style={styles.image}
          contentFit="cover"
        />
        <View style={[styles.gradient, styles.headerOverlay]} />
        <View style={styles.header}>
          <Text style={styles.name}>
            {climber.firstName}, {climber.age}
          </Text>
          {distanceKm !== null && (
            <Text style={styles.distance}>{formatDistance(distanceKm)}</Text>
          )}
        </View>
      </View>
      <View style={styles.footer}>
        <View style={styles.chips}>
          {climber.climbingTypes.map((t) => (
            <View key={t} style={styles.chip}>
              <Text style={styles.chipText}>{CLIMBING_LABELS[t]}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.bio} numberOfLines={3}>
          {bioSnippet}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 3 / 4,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "transparent",
  },
  headerOverlay: {
    top: "50%",
    height: "50%",
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  header: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
  },
  distance: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 2,
  },
  footer: {
    padding: 16,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: "#e8f4f8",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1a5f7a",
  },
  bio: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
  },
});
