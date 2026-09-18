// frontend/src/lib/guestId.ts (ملف جديد)
const STORAGE_KEY = 'guestId'

export function getOrCreateGuestId(): string {
  let id = localStorage.getItem(STORAGE_KEY)
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem(STORAGE_KEY, id)
  }
  return id
}