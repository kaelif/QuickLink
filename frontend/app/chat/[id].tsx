import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
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
import { useMatches } from "../../context/MatchesContext";
import type { Message } from "../../context/MatchesContext";

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
  const { matches, getMessages, sendMessage } = useMatches();
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const match = matches.find((m) => m.id === id);
  const messages = id ? getMessages(id) : [];

  useEffect(() => {
    if (id && !match) {
      router.replace("/messages");
    }
  }, [id, match, router]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || !id) return;
    sendMessage(id, text);
    setInput("");
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  }, [input, id, sendMessage]);

  if (!match) {
    return null;
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.headerTitle}>
          {match.firstName}, {match.age}
        </Text>
        <View style={styles.backBtn} />
      </View>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
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
    backgroundColor: "#f5f5f5",
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
    backgroundColor: "#fff",
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
    backgroundColor: "#fff",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#ddd",
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
