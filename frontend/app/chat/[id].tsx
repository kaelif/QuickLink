import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import type { Message } from "../../context/MatchesContext";
import { useMatches } from "../../context/MatchesContext";
import { BACKGROUND_COLOR } from "../../lib/theme";

function MessageBubble({ msg }: { msg: Message }) {
  return (
    <View
      style={[styles.bubble, msg.isFromMe ? styles.bubbleMe : styles.bubbleThem]}
    >
      <Text
        style={[
          styles.bubbleText,
          msg.isFromMe ? styles.bubbleTextMe : styles.bubbleTextThem,
        ]}
      >
        {msg.text}
      </Text>
    </View>
  );
}

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { matches, getMessages, removeMatch, blockUser, sendMessage, isLoading } = useMatches();
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const match = matches.find((m) => m.id === id);
  const messages = id ? getMessages(id) : [];

  useEffect(() => {
    if (!isLoading && id && !match) {
      router.replace("/messages");
    }
  }, [isLoading, id, match, router]);

  const handleSend = useCallback(() => {
    if (!match) return;
    const text = input.trim();
    if (!text || !id) return;
    sendMessage(id, text);
    setInput("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [match, input, id, sendMessage]);

  const handleUnmatch = useCallback(() => {
    if (!id) return;
    Alert.alert(
      "Unmatch",
      `Remove ${match?.firstName} from your matches? This will delete the conversation.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unmatch",
          style: "destructive",
          onPress: () => {
            removeMatch(id);
            router.replace("/messages");
          },
        },
      ]
    );
  }, [id, match?.firstName, removeMatch, router]);

  const handleBlock = useCallback(() => {
    if (!id) return;
    Alert.alert(
      "Block",
      `Block ${match?.firstName}? They will be removed from your matches and won't appear in your stack again.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Block",
          style: "destructive",
          onPress: () => {
            blockUser(id);
            router.replace("/messages");
          },
        },
      ]
    );
  }, [id, match?.firstName, blockUser, router]);

  const handleMenuPress = useCallback(() => {
    if (!match) return;
    Alert.alert("Conversation options", "Choose an action", [
      { text: "Cancel", style: "cancel" },
      { text: "Unmatch", onPress: handleUnmatch },
      { text: "Block", onPress: handleBlock, style: "destructive" },
    ]);
  }, [match, handleUnmatch, handleBlock]);

  if (!match) return null;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={22} color="#1a5f7a" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {match.firstName}, {match.age}
        </Text>
        <Pressable
          onPress={handleMenuPress}
          style={styles.menuBtn}
          accessibilityLabel="Conversation options"
        >
          <Ionicons name="ellipsis-horizontal" size={22} color="#1a5f7a" />
        </Pressable>
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "padding"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <MessageBubble msg={item} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>
                Send a message to {match.firstName}
              </Text>
            </View>
          }
        />
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message…"
            placeholderTextColor="#999"
            multiline
            maxLength={500}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <Pressable
            onPress={handleSend}
            style={({ pressed }) => [
              styles.sendBtn,
              (!input.trim() || pressed) && styles.sendBtnDisabled,
            ]}
            disabled={!input.trim()}
          >
            <Text
              style={[
                styles.sendText,
                (!input.trim() || undefined) && styles.sendTextDisabled,
              ]}
            >
              Send
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  flex: {
    flex: 1,
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
  menuBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    minWidth: 44,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#1a5f7a",
    backgroundColor: BACKGROUND_COLOR,
    borderRadius: 8,
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
    padding: 16,
    paddingBottom: 24,
    flexGrow: 1,
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginBottom: 8,
  },
  bubbleMe: {
    alignSelf: "flex-end",
    backgroundColor: "#1a5f7a",
  },
  bubbleThem: {
    alignSelf: "flex-start",
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  bubbleText: {
    fontSize: 16,
  },
  bubbleTextMe: {
    color: "#fff",
  },
  bubbleTextThem: {
    color: "#1a1a1a",
  },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: BACKGROUND_COLOR,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 16,
    color: "#1a1a1a",
    maxHeight: 100,
  },
  sendBtn: {
    backgroundColor: "#1a5f7a",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 22,
    justifyContent: "center",
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
  sendText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  sendTextDisabled: {
    color: "#ccc",
  },
});
