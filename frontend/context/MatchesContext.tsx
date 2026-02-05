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
        if (matchesRaw) {
          try {
            const parsed = JSON.parse(matchesRaw) as ClimberProfile[];
            setMatches(parsed);
          } catch {
            // keep default
          }
        }
        if (messagesRaw) {
          try {
            const parsed = JSON.parse(messagesRaw) as Record<string, Message[]>;
            setMessages(parsed);
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
      return messages[matchId] ?? [];
    },
    [messages]
  );

  const sendMessage = useCallback((matchId: string, text: string) => {
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
  }, []);

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
