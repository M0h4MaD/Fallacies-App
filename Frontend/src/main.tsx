import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import i18n from './i18n/config'
import './index.css'
import { initAuthListener, bootstrapUser } from './store/authStore'

initAuthListener()
bootstrapUser(i18n.language === 'en' ? 'en' : 'ar')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
