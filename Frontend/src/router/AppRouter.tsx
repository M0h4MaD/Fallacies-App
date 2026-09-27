// frontend/src/router/AppRouter.tsx (ملف جديد)
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../components/layout/Layout";
import HomePage from "../pages/HomePage";
import LibraryPage from "../pages/LibraryPage";
import QuizPage from "../pages/QuizPage";
import ReviewQueuePage from "../pages/ReviewQueuePage";
import DebaterChatPage from "../pages/DebaterChatPage";
import LeaderboardPage from "../pages/LeaderboardPage";
import ProfilePage from "../pages/ProfilePage";
import OnboardingPage from "../pages/OnboardingPage";
import CorrectionPage from "../pages/CorrectionPage";
import AdminPage from "../pages/AdminPage";
import SignInPage from "../pages/SignInPage";
import AboutPage from "../pages/AboutPage";
import AiChatPage from "../pages/AiChatPage";
import SupportPage from "../pages/SupportPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/library" element={<LibraryPage />} />
          <Route path="/quiz/:fallacySlug?" element={<QuizPage />} />
          <Route path="/review" element={<ReviewQueuePage />} />
          <Route path="/support" element={<SupportPage />} />
          <Route path="/chat/debater" element={<DebaterChatPage />} />
          <Route path="/chat/ai/:fallacySlug?" element={<AiChatPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/correct" element={<CorrectionPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
