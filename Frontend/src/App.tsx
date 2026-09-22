// frontend/src/App.tsx (استبدله كامل)
// MotionConfig reducedMotion="user" بيلغي كل الحركة تلقائياً لأي حدا مفعّل "تقليل الحركة" بجهازه — سطر واحد، تغطية كاملة.
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