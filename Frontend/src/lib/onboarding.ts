const KEY = 'hasSeenOnboarding'
export function hasSeenOnboarding(): boolean { return localStorage.getItem(KEY) === 'true' }
export function markOnboardingSeen(): void { localStorage.setItem(KEY, 'true') }
