import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import CourseCatalog from './pages/CourseCatalog'
import CoursePage from './pages/CoursePage'
import CreatorDashboard from './pages/CreatorDashboard'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/courses" element={<CourseCatalog />} />
      <Route path="/courses/:courseId" element={<CoursePage />} />
      <Route path="/creator" element={<CreatorDashboard />} />
      <Route path="/creator/new" element={<CreatorDashboard />} />
    </Routes>
  )
}

export default App

