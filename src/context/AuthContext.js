import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Swap this for your real backend. Two options are stubbed below:
//  1) Custom REST API — see loginWithApi()
//  2) Firebase Auth — see loginWithFirebase() (commented, needs firebase config)
const AuthContext = createContext(null);

const STORAGE_KEY = '@tap_fitness_user';
const HISTORY_KEY = '@tap_fitness_history';

// Guards against the classic "Welcome, NaN" bug: any falsy/NaN-ish display
// name coming back from auth is resolved to a safe fallback before it ever
// reaches a screen.
function resolveDisplayName(rawName, email) {
  const isBad =
    rawName === undefined ||
    rawName === null ||
    rawName === 'NaN' ||
    (typeof rawName === 'number' && Number.isNaN(rawName)) ||
    (typeof rawName === 'string' && rawName.trim().length === 0);

  if (!isBad) return rawName;
  if (email) return email.split('@')[0];
  return 'Athlete';
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const bootstrap = useCallback(async () => {
    setLoading(true);
    try {
      const [rawUser, rawHistory] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(HISTORY_KEY),
      ]);
      if (rawUser) setUser(JSON.parse(rawUser));
      if (rawHistory) setHistory(JSON.parse(rawHistory));
    } catch (e) {
      console.warn('TAP auth bootstrap failed', e);
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // --- Custom REST API login ---
  const loginWithApi = useCallback(async ({ email, password, apiBaseUrl }) => {
    const res = await fetch(`${apiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();

    const nextUser = {
      id: data.id,
      email: data.email ?? email,
      displayName: resolveDisplayName(data.displayName ?? data.name, data.email ?? email),
      avatarUrl: data.avatarUrl ?? null,
      weeklyGoal: data.weeklyGoal ?? 5,
      completedThisWeek: data.completedThisWeek ?? 0,
      streak: data.streak ?? 0,
    };
    setUser(nextUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    return nextUser;
  }, []);

  // --- Firebase login (uncomment + configure firebase app to use) ---
  // const loginWithFirebase = useCallback(async ({ email, password }) => {
  //   const { getAuth, signInWithEmailAndPassword } = await import('firebase/auth');
  //   const auth = getAuth();
  //   const cred = await signInWithEmailAndPassword(auth, email, password);
  //   const nextUser = {
  //     id: cred.user.uid,
  //     email: cred.user.email,
  //     displayName: resolveDisplayName(cred.user.displayName, cred.user.email),
  //     avatarUrl: cred.user.photoURL,
  //     weeklyGoal: 5,
  //     completedThisWeek: 0,
  //     streak: 0,
  //   };
  //   setUser(nextUser);
  //   await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
  //   return nextUser;
  // }, []);

  const loginAsGuest = useCallback(async () => {
    const nextUser = {
      id: 'guest',
      email: null,
      displayName: resolveDisplayName(undefined, null),
      avatarUrl: null,
      weeklyGoal: 5,
      completedThisWeek: 2,
      streak: 3,
    };
    setUser(nextUser);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    return nextUser;
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    await AsyncStorage.removeItem(STORAGE_KEY);
  }, []);

  const logCompletedExercise = useCallback(
    async ({ exerciseName, reps, sets, goodFormPct }) => {
      const entry = {
        exerciseName,
        reps,
        sets,
        goodFormPct,
        completedAt: new Date().toISOString(),
      };
      const nextHistory = [entry, ...history].slice(0, 200);
      setHistory(nextHistory);
      await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));

      if (user) {
        const nextUser = { ...user, completedThisWeek: (user.completedThisWeek ?? 0) + 1 };
        setUser(nextUser);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
      }
    },
    [history, user]
  );

  const value = useMemo(
    () => ({ user, history, loading, loginWithApi, loginAsGuest, logout, logCompletedExercise }),
    [user, history, loading, loginWithApi, loginAsGuest, logout, logCompletedExercise]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
