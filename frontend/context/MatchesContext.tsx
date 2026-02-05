import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { ClimberProfile } from "../types/climber";

const MATCHES_KEY = "@QuickLink/matches";
const MESSAGES_KEY = "@QuickLink/messages";

export interface Message {
  id: string;
  matchId: string;
  text: string;
  isFromMe: boolean;
  createdAt: number;
}

interface MatchesContextValue {
  matches: ClimberProfile[];
  addMatch: (climber: ClimberProfile) => void;
  getMessages: (matchId: string) => Message[];
  sendMessage: (matchId: string, text: string) => void;
  isLoading: boolean;
}

const MatchesContext = createContext<MatchesContextValue | null>(null);

export function MatchesProvider({ children }: { children: React.ReactNode }) {
  const [matches, setMatches] = useState<ClimberProfile[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(MATCHES_KEY),
      AsyncStorage.getItem(MESSAGES_KEY),
    ])
      .then(([matchesRaw, messagesRaw]) => {
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
      value={{ matches, addMatch, getMessages, sendMessage, isLoading }}
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
