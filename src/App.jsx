import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'

// Page imports
import LandingPage from './pages/LandingPage'
import CourseCatalog from './pages/CourseCatalog'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import CreatorDashboard from './pages/CreatorDashboard'
import LoginPage from './pages/LoginPage'
import AuthCallback from './pages/AuthCallback'

// Auth components
import ProtectedRoute from './components/ProtectedRoute'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import CourseManager from './pages/admin/CourseManager'
import CourseDetail from './pages/admin/CourseDetail'
import LessonEditor from './pages/admin/LessonEditor'
import QuestionBank from './pages/admin/QuestionBank'
import Settings from './pages/admin/Settings'

/**
 * App - Main Application Router
 * 
 * Route Organization:
 * 1. PUBLIC ROUTES - No authentication required
 *    - Auth pages (/login, /auth/callback)
 *    - Content pages (/, /courses, /courses/:id, /courses/:id/lesson/:id)
 * 
 * 2. AUTHENTICATED ROUTES - User must be logged in
 *    - Creator dashboard (/creator)
 * 
 * 3. ADMIN ROUTES - Must be admin (aakash.mufc@gmail.com)
 *    - All /admin/* routes
 */
function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* ============================================ */}
        {/* PUBLIC ROUTES - No authentication required  */}
        {/* ============================================ */}

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Main content - accessible to everyone */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/courses" element={<CourseCatalog />} />
        <Route path="/courses/:courseId" element={<CoursePage />} />
        <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonPage />} />

        {/* ============================================ */}
        {/* AUTHENTICATED ROUTES - Login required       */}
        {/* ============================================ */}

        <Route path="/creator" element={<CreatorDashboard />} />

        <Route element={<ProtectedRoute />}>
          {/* Authenticated routes */}
        </Route>

        {/* ============================================ */}
        {/* ADMIN ROUTES - Admin access required        */}
        {/* Admin email: aakash.mufc@gmail.com          */}
        {/* ============================================ */}

        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
          <Route index element={<CourseManager />} />
          <Route path="courses" element={<CourseManager />} />
          <Route path="courses/:courseId" element={<CourseDetail />} />
          <Route path="lesson/:lessonId" element={<LessonEditor />} />
          <Route path="questions" element={<QuestionBank />} />
          <Route path="settings" element={<Settings />} />
        </Route>

      </Routes>
    </ThemeProvider>
  )
}

export default App

