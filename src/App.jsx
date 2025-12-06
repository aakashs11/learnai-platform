import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import LandingPage from './pages/LandingPage'
import CourseCatalog from './pages/CourseCatalog'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import CreatorDashboard from './pages/CreatorDashboard'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonPage />} />

        {/* Admin-only routes */}
        <Route
          path="/creator"
          element={
            <ProtectedRoute requireAdmin>
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/creator/new"
          element={
            <ProtectedRoute requireAdmin>
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </ThemeProvider>
  )
}

export default App

