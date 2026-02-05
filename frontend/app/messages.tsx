import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMatches } from "../context/MatchesContext";
import type { ClimberProfile } from "../types/climber";

function MatchRow({
  match,
  lastMessage,
  onPress,
}: {
  match: ClimberProfile;
  lastMessage: string | null;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      <View style={styles.avatarWrap}>
        <Image
          source={{ uri: match.photoUrls[0] }}
          style={styles.avatar}
          contentFit="cover"
        />
      </View>
      <View style={styles.rowContent}>
        <Text style={styles.name}>
          {match.firstName}, {match.age}
        </Text>
        {lastMessage ? (
          <Text style={styles.preview} numberOfLines={1}>
            {lastMessage}
          </Text>
        ) : (
          <Text style={styles.previewMuted} numberOfLines={1}>
            Start a conversation
          </Text>
        )}
      </View>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const { matches, getMessages } = useMatches();

  if (matches.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.backBtn} />
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No matches yet</Text>
          <Text style={styles.emptySub}>
            Like climbers on the home screen to match and start messaging.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.backBtn} />
      </View>
      <FlatList
        data={matches}
        keyExtractor={(m) => m.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const msgs = getMessages(item.id);
          const last = msgs.length > 0 ? msgs[msgs.length - 1] : null;
          const lastText = last?.text ?? null;
          return (
            <MatchRow
              match={item}
              lastMessage={lastText}
              onPress={() => router.push(`/chat/${item.id}`)}
            />
          );
        }}
      />
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#ddd",
    backgroundColor: "#fff",
  },
  backBtn: {
    padding: 8,
    minWidth: 60,
  },
  backText: {
    fontSize: 16,
    color: "#1a5f7a",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  list: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: "#fff",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  rowPressed: {
    backgroundColor: "#f9f9f9",
  },
  avatarWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginRight: 14,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  rowContent: {
    flex: 1,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  preview: {
    fontSize: 14,
    color: "#666",
  },
  previewMuted: {
    fontSize: 14,
    color: "#999",
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
