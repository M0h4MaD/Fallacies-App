import { MotionConfig } from 'framer-motion'
import { ThemeProvider } from './contexts/ThemeContext'
import AppRouter from './router/AppRouter'

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeProvider>
        <AppRouter />
      </ThemeProvider>
    </MotionConfig>
  )
}
