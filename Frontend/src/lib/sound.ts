// frontend/src/lib/sound.ts (ملف جديد)
const STORAGE_KEY = 'soundEnabled'
let ctx: AudioContext | null = null

export function isSoundEnabled(): boolean { return localStorage.getItem(STORAGE_KEY) !== 'false' }
export function setSoundEnabled(enabled: boolean): void { localStorage.setItem(STORAGE_KEY, String(enabled)) }

function getContext(): AudioContext {
  if (!ctx) ctx = new AudioContext()
  if (ctx.state === 'suspended') ctx.resume()
  return ctx
}

function playTone(frequencies: number[], duration = 0.12) {
  if (!isSoundEnabled()) return
  const audioCtx = getContext()
  frequencies.forEach((freq, i) => {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = 'sine'
    osc.frequency.value = freq
    const startTime = audioCtx.currentTime + i * duration
    gain.gain.setValueAtTime(0.08, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(startTime)
    osc.stop(startTime + duration)
  })
}

export function playCorrect() { playTone([660, 880]) }
export function playIncorrect() { playTone([220]) }
export function playLevelUp() { playTone([523, 659, 784, 1046]) }