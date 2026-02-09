import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CIRCULATE_CARDS, TESTING } from "../lib/featureFlags";
import type { ClimberProfile } from "../types/climber";

const MATCHES_KEY = "@QuickLink/matches";
const MESSAGES_KEY = "@QuickLink/messages";
const REMOVED_MATCH_IDS_KEY = "@QuickLink/removedMatchIds";
const BLOCKED_USER_IDS_KEY = "@QuickLink/blockedUserIds";

export interface Message {
  id: string;
  matchId: string;
  text: string;
  isFromMe: boolean;
  createdAt: number;
}

interface MatchesContextValue {
  matches: ClimberProfile[];
  /** IDs of users the current user has removed as matches. When TESTING && CIRCULATE_CARDS is false, these stay out of the stack. */
  removedMatchIds: string[];
  /** IDs of users the current user has blocked. Blocked users never appear in the stack. */
  blockedUserIds: string[];
  addMatch: (climber: ClimberProfile) => void;
  removeMatch: (matchId: string) => void;
  blockUser: (matchId: string) => void;
  /** Clears all matches, messages, removed IDs, and blocked IDs so every climber appears in the stack again. */
  resetAllSwipesAndMatches: () => void;
  getMessages: (matchId: string) => Message[];
  sendMessage: (matchId: string, text: string) => void;
  isLoading: boolean;
}

const MatchesContext = createContext<MatchesContextValue | null>(null);



export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<ClimberProfile[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [removedMatchIds, setRemovedMatchIds] = useState<string[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(MATCHES_KEY),
      AsyncStorage.getItem(MESSAGES_KEY),
      AsyncStorage.getItem(REMOVED_MATCH_IDS_KEY),
      AsyncStorage.getItem(BLOCKED_USER_IDS_KEY),
    ])
      .then(([matchesRaw, messagesRaw, removedRaw, blockedRaw]) => {
        let loadedMatches: ClimberProfile[] = [];
        if (matchesRaw) {
          try {
            loadedMatches = JSON.parse(matchesRaw) as ClimberProfile[];
            setMatches(loadedMatches);
          } catch {
            // keep default
          }
        }
        if (messagesRaw) {
          try {
            const parsed = JSON.parse(messagesRaw) as Record<string, Message[]>;
            const matchIds = new Set(loadedMatches.map((m) => m.id));
            const messagesForMatchesOnly: Record<string, Message[]> = {};
            for (const [matchId, list] of Object.entries(parsed)) {
              if (matchIds.has(matchId)) messagesForMatchesOnly[matchId] = list;
            }
            setMessages(messagesForMatchesOnly);
          } catch {
            // keep default
          }
        }
        if (removedRaw) {
          try {
            const parsed = JSON.parse(removedRaw) as string[];
            setRemovedMatchIds(Array.isArray(parsed) ? parsed : []);
          } catch {
            // keep default
          }
        }
        if (blockedRaw) {
          try {
            const parsed = JSON.parse(blockedRaw) as string[];
            setBlockedUserIds(Array.isArray(parsed) ? parsed : []);
          } catch {
            // keep default
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const addMatch = useCallback((climber: ClimberProfile) => {
    setMatches((prev) => {
      if (prev.some((m) => m.id === climber.id)) return prev;
      const next = [...prev, climber];
      AsyncStorage.setItem(MATCHES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
  }, []);

  const removeMatch = useCallback((matchId: string) => {
    setMatches((prev) => {
      const next = prev.filter((m) => m.id !== matchId);
      AsyncStorage.setItem(MATCHES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    setMessages((prev) => {
      const next = { ...prev };
      delete next[matchId];
      AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    if (!(TESTING && CIRCULATE_CARDS)) {
      setRemovedMatchIds((prev) => {
        if (prev.includes(matchId)) return prev;
        const next = [...prev, matchId];
        AsyncStorage.setItem(REMOVED_MATCH_IDS_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    }
  }, []);

  const blockUser = useCallback((matchId: string) => {
    setBlockedUserIds((prev) => {
      if (prev.includes(matchId)) return prev;
      const next = [...prev, matchId];
      AsyncStorage.setItem(BLOCKED_USER_IDS_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    setMatches((prev) => {
      const next = prev.filter((m) => m.id !== matchId);
      AsyncStorage.setItem(MATCHES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    setMessages((prev) => {
      const next = { ...prev };
      delete next[matchId];
      AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(next)).catch(() => {});
      return next;
    });
    if (!(TESTING && CIRCULATE_CARDS)) {
      setRemovedMatchIds((prev) => {
        if (prev.includes(matchId)) return prev;
        const next = [...prev, matchId];
        AsyncStorage.setItem(REMOVED_MATCH_IDS_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    }
  }, []);

  const resetAllSwipesAndMatches = useCallback(() => {
    setMatches([]);
    setMessages({});
    setRemovedMatchIds([]);
    setBlockedUserIds([]);
    Promise.all([
      AsyncStorage.removeItem(MATCHES_KEY),
      AsyncStorage.removeItem(MESSAGES_KEY),
      AsyncStorage.removeItem(REMOVED_MATCH_IDS_KEY),
      AsyncStorage.removeItem(BLOCKED_USER_IDS_KEY),
    ]).catch(() => {});
  }, []);

  const getMessages = useCallback(
    (matchId: string) => {
      if (!matches.some((m) => m.id === matchId)) return [];
      return messages[matchId] ?? [];
    },
    [messages, matches]
  );

  const sendMessage = useCallback(
    (matchId: string, text: string) => {
      if (!matches.some((m) => m.id === matchId)) return;
      const msg: Message = {
        id: `${matchId}-${Date.now()}`,
        matchId,
        text: text.trim(),
        isFromMe: true,
        createdAt: Date.now(),
      };
      setMessages((prev) => {
        const list = prev[matchId] ?? [];
        const next = { ...prev, [matchId]: [...list, msg] };
        AsyncStorage.setItem(MESSAGES_KEY, JSON.stringify(next)).catch(() => {});
        return next;
      });
    },
    [matches]
  );

  return (
    <MatchesContext.Provider
      value={{ matches, removedMatchIds, blockedUserIds, addMatch, removeMatch, blockUser, resetAllSwipesAndMatches, getMessages, sendMessage, isLoading }}
    >
      {children}
    </MatchesContext.Provider>
  );
}

export function useMatches() {
  const ctx = useContext(MatchesContext);
  if (!ctx) throw new Error("useMatches must be used within MatchesProvider");
  return ctx;
}
