// frontend/src/lib/guestId.ts (استبدله كامل)
const STORAGE_KEY = "guestId";

export function reserveGuestId(): string {
  let id = localStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
  }
  return id;
}
export function getStoredGuestId(): string | null {
  return localStorage.getItem(STORAGE_KEY);
}
