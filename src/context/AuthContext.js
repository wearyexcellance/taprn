import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * AuthContext
 * -----------
 * Fixes the "NaN" username bug: the UI must never read a raw, possibly-
 * undefined field straight out of an auth payload. `normalizeUser` is the
 * single choke point every login path funnels through, so a missing name
 * always resolves to a friendly fallback instead of the literal string
 * "NaN" (which happens when `Number(undefined)` or similar leaks into a
 * template before the real profile has loaded).
 */

const AuthContext = createContext(null);

const STORAGE_KEY = "@tap_fitness_user";
const HISTORY_KEY = "@tap_fitness_history";

function normalizeUser(raw) {
  if (!raw) return null;
  const displayName =
    typeof raw.displayName === "string" && raw.displayName.trim().length > 0
      ? raw.displayName.trim()
      : typeof raw.email === "string"
      ? raw.email.split("@")[0]
      : "Athlete";

  const streak = Number.isFinite(raw.streak) ? raw.streak : 0;
  const weeklyProgress = Number.isFinite(raw.weeklyProgress) ? raw.weeklyProgress : 0;

  return {
    uid: raw.uid ?? "local-user",
    displayName,
    avatarUrl: raw.avatarUrl ?? null,
    streak,
    weeklyProgress, // 0..1
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [storedUser, storedHistory] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          AsyncStorage.getItem(HISTORY_KEY),
        ]);
        if (storedUser) setUser(normalizeUser(JSON.parse(storedUser)));
        if (storedHistory) setHistory(JSON.parse(storedHistory));
      } catch (e) {
        console.warn("Failed to restore session", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ email, password, displayName }) => {
    // Swap this block for a real Firebase / REST call. The important part
    // is that whatever comes back is passed through normalizeUser before
    // it ever touches state or the UI.
    const fakeResponse = {
      uid: `uid_${email}`,
      email,
      displayName: displayName || email.split("@")[0],
      streak: 3,
      weeklyProgress: 0.4,
    };
    const normalized = normalizeUser(fakeResponse);
    setUser(normalized);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  };

  const recordCompletedExercise = async ({ exerciseId, exerciseName, reps, sets, durationSec }) => {
    const entry = {
      id: `${Date.now()}`,
      exerciseId,
      exerciseName,
      reps,
      sets,
      durationSec,
      completedAt: new Date().toISOString(),
    };
    const next = [entry, ...history].slice(0, 200);
    setHistory(next);
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next));

    if (user) {
      const updated = { ...user, weeklyProgress: Math.min(1, user.weeklyProgress + 0.05) };
      setUser(updated);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    }
    return entry;
  };

  const value = useMemo(
    () => ({ user, history, loading, login, logout, recordCompletedExercise }),
    [user, history, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
