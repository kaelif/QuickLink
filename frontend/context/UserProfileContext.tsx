import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { UserProfile } from "../types/userProfile";
import { DEFAULT_USER_PROFILE } from "../types/userProfile";

const STORAGE_KEY = "@QuickLink/userProfile";

interface UserProfileContextValue {
  profile: UserProfile;
  setProfile: (next: UserProfile | ((prev: UserProfile) => UserProfile)) => void;
  isLoading: boolean;
}

const UserProfileContext = createContext<UserProfileContextValue | null>(null);

export function UserProfileProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfileState] = useState<UserProfile>(DEFAULT_USER_PROFILE);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as UserProfile;
            setProfileState({ ...DEFAULT_USER_PROFILE, ...parsed });
          } catch {
            // keep default
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setProfile = useCallback((next: UserProfile | ((prev: UserProfile) => UserProfile)) => {
    setProfileState((prev) => {
      const nextProfile = typeof next === "function" ? next(prev) : next;
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextProfile)).catch(() => {});
      return nextProfile;
    });
  }, []);

  return (
    <UserProfileContext.Provider value={{ profile, setProfile, isLoading }}>
      {children}
    </UserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const ctx = useContext(UserProfileContext);
  if (!ctx) throw new Error("useUserProfile must be used within UserProfileProvider");
  return ctx;
}
