// frontend/src/components/layout/Layout.tsx (استبدله كامل)
// كل صفحة هلق عندها انتقال دخول خفيف — هاد لحاله بيكسر إحساس "الموقع الساكن".
import { Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Header from './Header'
import Footer from './Footer'
import BottomNav from './BottomNav'
import { pageVariants } from '../../lib/motion'

export default function Layout() {
  const location = useLocation()
  return (
    <div className="flex min-h-screen flex-col bg-bg text-text">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 p-6 pb-20 sm:pb-6">
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname} variants={pageVariants} initial="initial" animate="animate" exit="exit">
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <BottomNav />
    </div>
  )
}