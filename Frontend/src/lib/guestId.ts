// frontend/src/lib/guestId.ts (استبدله كامل)
const STORAGE_KEY = 'guestId'
export function getStoredGuestId(): string | null { return localStorage.getItem(STORAGE_KEY) }
export function storeGuestId(id: string): void { localStorage.setItem(STORAGE_KEY, id) }