// frontend/src/components/layout/Layout.tsx 
import { Outlet } from 'react-router-dom'
import Header from './Header'

export default function Layout() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <main className="mx-auto max-w-3xl p-6"><Outlet /></main>
    </div>
  )
}