import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { MatchFilter } from "../types/userProfile";
import { DEFAULT_MATCH_FILTER } from "../types/userProfile";

const STORAGE_KEY = "@QuickLink/matchFilter";

interface FilterContextValue {
  filter: MatchFilter;
  setFilter: (next: MatchFilter | ((prev: MatchFilter) => MatchFilter)) => void;
  isLoading: boolean;
}

const FilterContext = createContext<FilterContextValue | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
  const [filter, setFilterState] = useState<MatchFilter>(DEFAULT_MATCH_FILTER);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) {
          try {
            const parsed = JSON.parse(raw) as MatchFilter;
            setFilterState({ ...DEFAULT_MATCH_FILTER, ...parsed });
          } catch {
            // keep default
          }
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const setFilter = useCallback((next: MatchFilter | ((prev: MatchFilter) => MatchFilter)) => {
    setFilterState((prev) => {
      const nextFilter = typeof next === "function" ? next(prev) : next;
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextFilter)).catch(() => {});
      return nextFilter;
    });
  }, []);

  return (
    <FilterContext.Provider value={{ filter, setFilter, isLoading }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilter() {
  const ctx = useContext(FilterContext);
  if (!ctx) throw new Error("useFilter must be used within FilterProvider");
  return ctx;
}
