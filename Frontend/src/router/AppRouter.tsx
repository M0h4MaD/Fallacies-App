// frontend/src/router/AppRouter.tsx (ملف جديد)
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '../components/layout/Layout'
import HomePage from '../pages/HomePage'
import LibraryPage from '../pages/LibraryPage'
import QuizPage from '../pages/QuizPage'
import ReviewQueuePage from '../pages/ReviewQueuePage'
import ExplainerChatPage from '../pages/ExplainerChatPage'
import DebaterChatPage from '../pages/DebaterChatPage'
import LeaderboardPage from '../pages/LeaderboardPage'
import ProfilePage from '../pages/ProfilePage'
import OnboardingPage from '../pages/OnboardingPage'
import PrivacyPage from '../pages/PrivacyPage'
import CorrectionPage from '../pages/CorrectionPage'

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/quiz/:fallacySlug?" element={<QuizPage />} />
          <Route path="/review" element={<ReviewQueuePage />} />
          <Route path="/chat/explainer/:fallacySlug" element={<ExplainerChatPage />} />
          <Route path="/chat/debater" element={<DebaterChatPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/correct" element={<CorrectionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}