// frontend/src/App.tsx (استبدله كامل — صار مجرد composition root، متل ما لازم يكون)
import { ThemeProvider } from './contexts/ThemeContext'
import AppRouter from './router/AppRouter'

export default function App() {
  return (
    <ThemeProvider>
      <AppRouter />
    </ThemeProvider>
  )
}