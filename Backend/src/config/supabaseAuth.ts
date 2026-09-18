// backend/src/config/supabaseAuth.ts (ملف جديد — يلغي firebaseAdmin.ts)
// Verifies Supabase JWTs locally against the project's public keys (JWKS) — no network
// round-trip per request, which matters once real traffic hits this on every protected route.
import { createRemoteJWKSet, jwtVerify } from 'jose'

const JWKS = createRemoteJWKSet(new URL(`${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`))

export interface SupabaseJwtClaims {
  sub: string
  email?: string
  user_metadata?: { full_name?: string; name?: string }
}

export async function verifySupabaseToken(token: string): Promise<SupabaseJwtClaims> {
  const { payload } = await jwtVerify(token, JWKS, {
    issuer: `${process.env.SUPABASE_URL}/auth/v1`,
    audience: 'authenticated',
  })
  return payload as SupabaseJwtClaims
}