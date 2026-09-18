// frontend/src/lib/apiClient.ts (ملف جديد)
// Every backend call goes through here. Attaches a Firebase token once signed in, otherwise
// the guest id — matching the backend's identifyUser middleware, which accepts either.
import axios from 'axios'
import { auth } from '../config/firebase'
import { getOrCreateGuestId } from './guestId'

export const apiClient = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })

apiClient.interceptors.request.use(async (config) => {
  const user = auth.currentUser
  if (user) config.headers.Authorization = `Bearer ${await user.getIdToken()}`
  else config.headers['X-Guest-Id'] = getOrCreateGuestId()
  return config
})

apiClient.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(new Error(err.response?.data?.error ?? err.message ?? 'Something went wrong')),
)