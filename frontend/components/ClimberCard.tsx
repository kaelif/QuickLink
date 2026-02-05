import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { Platform, StyleSheet, Text, View } from "react-native";
import { formatDistance } from "../lib/geo";
import { BACKGROUND_COLOR, backgroundRgba } from "../lib/theme";
import type { ClimberProfile, ClimbingType } from "../types/climber";

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
  const [imageError, setImageError] = useState(false);
  const bioSnippet =
    climber.bio.length > 120 ? climber.bio.slice(0, 120) + "…" : climber.bio;
  const photoUrl = climber.photoUrls[0];

  return (
    <View style={styles.card}>
      <View style={styles.imageWrap}>
        {imageError || !photoUrl ? (
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="image-off-outline" size={48} color="#999" />
          </View>
        ) : (
          <Image
            source={{ uri: photoUrl }}
            style={styles.image}
            contentFit="cover"
            onError={() => setImageError(true)}
          />
        )}
      </View>
      <View style={styles.footer}>
        <Text style={styles.name}>
          {climber.firstName}, {climber.age}
        </Text>
        {distanceKm !== null && (
          <Text style={styles.distance}>{formatDistance(distanceKm)}</Text>
        )}
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
        <LinearGradient
          colors={["transparent", "#fff"]}
          style={styles.footerFade}
          pointerEvents="none"
        />
      </View>
      {Platform.OS === "android" && (
        <LinearGradient
          colors={["transparent", backgroundRgba(0.7), BACKGROUND_COLOR]}
          style={styles.cardBottomFade}
          pointerEvents="none"
        />
      )}
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
  cardBottomFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 140,
    zIndex: 10,
  },
  imageWrap: {
    width: "100%",
    aspectRatio: 3 / 4,
    position: "relative",
    backgroundColor: "#e5e5e5",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e5e5e5",
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    padding: 16,
    position: "relative",
    paddingBottom: 100,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  distance: {
    fontSize: 14,
    color: "#666",
    marginBottom: 10,
  },
  footerFade: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 80,
    marginHorizontal: -16,
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
