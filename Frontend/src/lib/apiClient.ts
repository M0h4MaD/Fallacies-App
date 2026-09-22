// frontend/src/lib/apiClient.ts (استبدله كامل)
import axios from "axios";
import { supabase } from "../config/supabase";
import { getStoredGuestId } from "./guestId";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

apiClient.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  if (data.session)
    config.headers.Authorization = `Bearer ${data.session.access_token}`;
  else {
    const guestId = getStoredGuestId();
    if (guestId) config.headers["X-Guest-Id"] = guestId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) =>
    Promise.reject(
      new Error(
        err.response?.data?.error ?? err.message ?? "Something went wrong",
      ),
    ),
);
