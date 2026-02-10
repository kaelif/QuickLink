import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { formatDistance } from "../lib/geo";
import { BACKGROUND_COLOR } from "../lib/theme";
import type { ClimberProfile, ClimbingType } from "../types/climber";

const CLIMBING_LABELS: Record<ClimbingType, string> = {
  sport: "Sport",
  bouldering: "Bouldering",
  trad: "Trad",
};

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = SCREEN_WIDTH - 32;

interface ProfileDetailModalProps {
  climber: ClimberProfile;
  distanceKm: number | null;
  onClose: () => void;
}

export function ProfileDetailModal({
  climber,
  distanceKm,
  onClose,
}: ProfileDetailModalProps) {
  const [failedPhotoIndices, setFailedPhotoIndices] = useState<Set<number>>(new Set());
  const [loadedPhotoIndices, setLoadedPhotoIndices] = useState<Set<number>>(new Set());

  useEffect(() => {
    setFailedPhotoIndices(new Set());
    setLoadedPhotoIndices(new Set());
  }, [climber.id]);

  const handlePhotoError = (index: number) => {
    setFailedPhotoIndices((prev) => new Set(prev).add(index));
  };
  const handlePhotoLoad = (index: number) => {
    setLoadedPhotoIndices((prev) => new Set(prev).add(index));
  };

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [styles.closeButton, pressed && styles.closePressed]}
          >
            <MaterialIcons name="close" size={28} color="#333" />
          </Pressable>
        </View>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.photoScroll}
            contentContainerStyle={styles.photoScrollContent}
          >
            {climber.photoUrls.map((uri, i) =>
              failedPhotoIndices.has(i) || !uri ? (
                <View
                  key={i}
                  style={[
                    styles.photo,
                    styles.photoPlaceholder,
                    { width: IMAGE_SIZE },
                    i < climber.photoUrls.length - 1 && styles.photoGap,
                  ]}
                >
                  <MaterialCommunityIcons name="image-off-outline" size={48} color="#999" />
                </View>
              ) : (
                <View
                  key={i}
                  style={[
                    styles.photo,
                    { width: IMAGE_SIZE, overflow: "hidden" },
                    i < climber.photoUrls.length - 1 && styles.photoGap,
                  ]}
                >
                  <View style={[StyleSheet.absoluteFill, styles.photoPlaceholder]} />
                  <Image
                    source={{ uri }}
                    style={[StyleSheet.absoluteFill, { opacity: loadedPhotoIndices.has(i) ? 1 : 0 }]}
                    resizeMode="cover"
                    onLoad={() => handlePhotoLoad(i)}
                    onError={() => handlePhotoError(i)}
                  />
                </View>
              )
            )}
          </ScrollView>
          <View style={styles.info}>
            <Text style={styles.name}>
              {climber.firstName}, {climber.age}
            </Text>
            {distanceKm !== null && (
              <Text style={styles.distance}>
                {formatDistance(distanceKm)}
              </Text>
            )}
            <View style={styles.chips}>
              {climber.climbingTypes.map((t) => (
                <View key={t} style={styles.chip}>
                  <Text style={styles.chipText}>{CLIMBING_LABELS[t]}</Text>
                </View>
              ))}
            </View>
            <Text style={styles.bioLabel}>About</Text>
            <Text style={styles.bio}>{climber.bio}</Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  closeButton: {
    padding: 8,
  },
  closePressed: {
    opacity: 0.7,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  photoScroll: {
    marginBottom: 16,
  },
  photoScrollContent: {
    paddingHorizontal: 16,
  },
  photo: {
    height: IMAGE_SIZE * (4 / 3),
    borderRadius: 12,
  },
  photoPlaceholder: {
    backgroundColor: BACKGROUND_COLOR,
    justifyContent: "center",
    alignItems: "center",
  },
  photoGap: {
    marginRight: 16,
  },
  info: {
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  distance: {
    fontSize: 15,
    color: "#666",
    marginBottom: 12,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: BACKGROUND_COLOR,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1a5f7a",
  },
  bioLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  bio: {
    fontSize: 15,
    color: "#444",
    lineHeight: 22,
  },
});
