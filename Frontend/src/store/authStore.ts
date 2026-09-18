// frontend/src/store/authStore.ts (ملف جديد)
import { create } from "zustand";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, googleProvider } from "../config/firebase";
import { apiClient } from "../lib/apiClient";
import { getOrCreateGuestId } from "../lib/guestId";
import type { AppUser } from "../types";

interface AuthState {
  firebaseUser: FirebaseUser | null;
  appUser: AppUser | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  firebaseUser: null,
  appUser: null,
  isLoading: true,
  signInWithGoogle: async () => {
    await signInWithPopup(auth, googleProvider);
  }, // onAuthStateChanged below picks up the result
  signOut: async () => {
    await firebaseSignOut(auth);
    set({ firebaseUser: null, appUser: null });
  },
}));

interface ApiUserResponse {
  id: string;
  displayName: string;
  isGuest: boolean;
  xp: number;
  level: number;
  streakCurrent: number;
  badgeIds: string[];
}
function mapUser(d: ApiUserResponse): AppUser {
  return {
    id: d.id,
    displayName: d.displayName,
    isGuest: d.isGuest,
    xp: d.xp,
    level: d.level,
    streak: d.streakCurrent,
    badgeIds: d.badgeIds,
  };
}

export function initAuthListener() {
  onAuthStateChanged(auth, async (firebaseUser) => {
    if (!firebaseUser)
      return useAuthStore.setState({
        firebaseUser: null,
        appUser: null,
        isLoading: false,
      });
    try {
      const { data } = await apiClient.post<ApiUserResponse>(
        "/api/auth/register",
        { guestId: getOrCreateGuestId() },
      );
      useAuthStore.setState({
        firebaseUser,
        appUser: mapUser(data),
        isLoading: false,
      });
    } catch {
      useAuthStore.setState({ firebaseUser, appUser: null, isLoading: false });
    }
  });
}
export async function hydrateGuestUser() {
  try {
    const { data } = await apiClient.get<ApiUserResponse>("/api/auth/me");
    useAuthStore.setState((s) =>
      s.firebaseUser ? s : { ...s, appUser: mapUser(data), isLoading: false },
    );
  } catch {
    useAuthStore.setState((s) =>
      s.firebaseUser ? s : { ...s, isLoading: false },
    );
  }
}

export function applyQuizResult(result: {
  xpAwarded: number;
  newLevel: number;
  streakCurrent: number;
  badgeIds: string[];
}) {
  useAuthStore.setState((s) =>
    s.appUser
      ? {
          appUser: {
            ...s.appUser,
            xp: s.appUser.xp + result.xpAwarded,
            level: result.newLevel,
            streak: result.streakCurrent,
            badgeIds: result.badgeIds,
          },
        }
      : s,
  );
}
