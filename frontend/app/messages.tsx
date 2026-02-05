import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMatches } from "../context/MatchesContext";
import { BACKGROUND_COLOR } from "../lib/theme";
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

function MatchAvatar({
  match,
  onPress,
}: {
  match: ClimberProfile;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.avatarChip, pressed && styles.avatarChipPressed]}
    >
      <View style={styles.avatarChipImageWrap}>
        <Image
          source={{ uri: match.photoUrls[0] }}
          style={styles.avatarChipImage}
          contentFit="cover"
        />
      </View>
      <Text style={styles.avatarChipName} numberOfLines={1}>
        {match.firstName}
      </Text>
    </Pressable>
  );
}

export default function MessagesScreen() {
  const router = useRouter();
  const { matches, getMessages } = useMatches();

  const newMatches = useMemo(
    () => matches.filter((m) => getMessages(m.id).length === 0),
    [matches, getMessages]
  );
  const matchesWithMessages = useMemo(
    () => matches.filter((m) => getMessages(m.id).length > 0),
    [matches, getMessages]
  );

  if (matches.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={22} color="#1a5f7a" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>
          <Text style={styles.headerTitle}>Messages</Text>
          <View style={styles.backBtnSpacer} />
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
          <Ionicons name="chevron-back" size={22} color="#1a5f7a" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.backBtnSpacer} />
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.newMatchesSection}>
          <Text style={styles.sectionTitle}>New matches</Text>
          {newMatches.length === 0 ? (
            <Text style={styles.sectionEmpty}>No new matches</Text>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.newMatchesRow}
            >
              {newMatches.map((match) => (
                <MatchAvatar
                  key={match.id}
                  match={match}
                  onPress={() => router.push(`/chat/${match.id}`)}
                />
              ))}
            </ScrollView>
          )}
        </View>
        <View style={styles.conversationsSection}>
          <Text style={styles.sectionTitle}>Conversations</Text>
          {matchesWithMessages.length === 0 ? (
            <View style={styles.conversationsEmpty}>
              <Text style={styles.conversationsEmptyText}>
                No conversations yet. Tap a new match above to send a message.
              </Text>
            </View>
          ) : (
            <View style={styles.conversationsList}>
              {matchesWithMessages.map((match) => {
                const msgs = getMessages(match.id);
                const last = msgs.length > 0 ? msgs[msgs.length - 1] : null;
                const lastText = last?.text ?? null;
                return (
                  <MatchRow
                    key={match.id}
                    match={match}
                    lastMessage={lastText}
                    onPress={() => router.push(`/chat/${match.id}`)}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BACKGROUND_COLOR,
  },
  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    minWidth: 60,
    gap: 6,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1a5f7a",
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 8,
  },
  backBtnSpacer: {
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  newMatchesSection: {
    paddingTop: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#555",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  sectionEmpty: {
    fontSize: 14,
    color: "#999",
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  newMatchesRow: {
    paddingHorizontal: 16,
    paddingRight: 20,
  },
  avatarChip: {
    alignItems: "center",
    width: 72,
    marginRight: 12,
  },
  avatarChipPressed: {
    opacity: 0.8,
  },
  avatarChipImageWrap: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    marginBottom: 6,
  },
  avatarChipImage: {
    width: "100%",
    height: "100%",
  },
  avatarChipName: {
    fontSize: 12,
    fontWeight: "500",
    color: "#1a1a1a",
  },
  conversationsSection: {
    paddingTop: 8,
    flex: 1,
  },
  conversationsList: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    overflow: "hidden",
    marginHorizontal: 20,
  },
  conversationsEmpty: {
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  conversationsEmptyText: {
    fontSize: 15,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: BACKGROUND_COLOR,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#eee",
  },
  rowPressed: {
    backgroundColor: "#6a777b",
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
