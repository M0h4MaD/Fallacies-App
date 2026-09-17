// backend/src/config/firebaseAdmin.ts (ملف جديد)
import { initializeApp, cert, getApps } from 'firebase-admin/app'

export function initFirebaseAdmin() {
  if (getApps().length) return
  const { FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY } = process.env
  if (!FIREBASE_PROJECT_ID || !FIREBASE_CLIENT_EMAIL || !FIREBASE_PRIVATE_KEY) {
    throw new Error('Firebase Admin env vars are not set')
  }
  initializeApp({
    credential: cert({
      projectId: FIREBASE_PROJECT_ID,
      clientEmail: FIREBASE_CLIENT_EMAIL,
      privateKey: FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // .env stores literal \n, not real newlines
    }),
  })
}