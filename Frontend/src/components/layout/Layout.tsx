// frontend/src/components/layout/Layout.tsx (استبدله كامل)
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import BottomNav from './BottomNav'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 p-6 pb-20 sm:pb-6"><Outlet /></main>
      <Footer />
      <BottomNav />
    </div>
  )
}