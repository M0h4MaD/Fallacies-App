// frontend/src/main.tsx (استبدله كامل)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './i18n/config'
import './index.css'
import { initAuthListener, hydrateGuestUser } from './store/authStore'

initAuthListener()
hydrateGuestUser()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)