import { create } from 'zustand'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '../config/supabase'
import { apiClient } from '../lib/apiClient'
import { getStoredGuestId, reserveGuestId } from '../lib/guestId'

import type { AppUser } from '../types'

interface AuthState {
  session: Session | null
  appUser: AppUser | null
  isLoading: boolean
  signInWithGoogle: () => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  appUser: null,
  isLoading: true,
  signInWithGoogle: async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }) },
  signOut: async () => { await supabase.auth.signOut(); set({ session: null, appUser: null }) },
}))

interface ApiUserResponse {
  id: string; guestId: string | null; displayName: string; isGuest: boolean
  xp: number; level: number; streakCurrent: number; badgeIds: string[]; role: 'user' | 'admin'
}
function mapUser(d: ApiUserResponse): AppUser {
  return { id: d.id, displayName: d.displayName, isGuest: d.isGuest, xp: d.xp, level: d.level, streak: d.streakCurrent, badgeIds: d.badgeIds, role: d.role }
}

export function initAuthListener() {
  supabase.auth.onAuthStateChange(async (_event, session) => {
    if (!session) return useAuthStore.setState({ session: null, appUser: null, isLoading: false })
    try {
      const { data } = await apiClient.post<ApiUserResponse>('/api/auth/register', { guestId: getStoredGuestId() ?? undefined })
      useAuthStore.setState({ session, appUser: mapUser(data), isLoading: false })
    } catch {
      useAuthStore.setState({ session, appUser: null, isLoading: false })
    }
  })
}

export async function bootstrapUser(lang: 'ar' | 'en') {
  const guestId = reserveGuestId()
  try {
    const { data } = await apiClient.post<ApiUserResponse>('/api/auth/guest', { guestId, lang })
    useAuthStore.setState((s) => (s.session ? s : { ...s, appUser: mapUser(data), isLoading: false }))
  } catch {
    useAuthStore.setState((s) => (s.session ? s : { ...s, isLoading: false }))
  }
}

export function applyQuizResult(result: { xpAwarded: number; newLevel: number; streakCurrent: number; badgeIds: string[] }) {
  useAuthStore.setState((s) => (s.appUser ? { appUser: { ...s.appUser, xp: s.appUser.xp + result.xpAwarded, level: result.newLevel, streak: result.streakCurrent, badgeIds: result.badgeIds } } : s))
}

export async function updateDisplayName(name: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { data } = await apiClient.patch<ApiUserResponse>('/api/auth/me', { displayName: name })
    useAuthStore.setState((s) => (s.appUser ? { appUser: { ...s.appUser, displayName: data.displayName } } : s))
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Error' }
  }
}
