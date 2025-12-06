import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'
import LandingPage from './pages/LandingPage'
import CourseCatalog from './pages/CourseCatalog'
import CoursePage from './pages/CoursePage'
import LessonPage from './pages/LessonPage'
import CreatorDashboard from './pages/CreatorDashboard'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './pages/admin/AdminLayout'
import CourseManager from './pages/admin/CourseManager'
import CourseDetail from './pages/admin/CourseDetail'
import LessonEditor from './pages/admin/LessonEditor'
import QuestionBank from './pages/admin/QuestionBank'
import Settings from './pages/admin/Settings'

function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Student Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/courses" element={<CourseCatalog />} />
          <Route path="/courses/:courseId" element={<CoursePage />} />
          <Route path="/courses/:courseId/lesson/:lessonId" element={<LessonPage />} />
          <Route path="/creator" element={<CreatorDashboard />} />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute requireAdmin={true}><AdminLayout /></ProtectedRoute>}>
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
