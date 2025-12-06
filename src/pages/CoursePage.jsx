import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, ArrowLeft, CheckCircle, Clock, Target,
  Sparkles, FileText, ExternalLink, Play
} from 'lucide-react'
import ThemeToggle from '../components/ThemeToggle'

// Lesson type icons
const lessonIcons = {
  'numpy': '📊',
  'pandas': '📋',
  'csv': '📄',
  'methodology': '🔬',
  'validation': '✅',
  'vision': '👁️',
  'cnn': '🧠',
  'nlp': '🔤',
  'neural': '🕸️',
  'default': '📚'
}

const getLessonIcon = (title) => {
  const lower = title.toLowerCase()
  if (lower.includes('numpy') || lower.includes('pandas')) return lessonIcons.numpy
  if (lower.includes('csv') || lower.includes('missing')) return lessonIcons.csv
  if (lower.includes('methodology') || lower.includes('data science')) return lessonIcons.methodology
  if (lower.includes('validation') || lower.includes('metric')) return lessonIcons.validation
  if (lower.includes('vision') || lower.includes('image')) return lessonIcons.vision
  if (lower.includes('cnn') || lower.includes('convolution')) return lessonIcons.cnn
  if (lower.includes('nlp') || lower.includes('language')) return lessonIcons.nlp
  if (lower.includes('neural') || lower.includes('network')) return lessonIcons.neural
  return lessonIcons.default
}

// Helper to load progress from localStorage
const loadProgress = () => {
  try {
    const saved = localStorage.getItem('ai-curriculum-progress')
    return saved ? JSON.parse(saved) : { xp: 0, streak: 1, lessons: {} }
  } catch {
    return { xp: 0, streak: 1, lessons: {} }
  }
}

export default function CoursePage() {
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [lessons, setLessons] = useState([])
  const [progress, setProgress] = useState(loadProgress)
  const [selectedUnit, setSelectedUnit] = useState(null)

  useEffect(() => {
    fetch('/lessons.json')
      .then(res => res.json())
      .then(data => {
        const enriched = data.map(lesson => ({
          ...lesson,
          progress: progress.lessons[lesson.id]?.progress || 0,
          xpEarned: progress.lessons[lesson.id]?.xpEarned || 0
        }))
        setLessons(enriched)
      })
      .catch(err => console.error("Failed to load lessons", err))
  }, [progress])

  const units = [...new Map(lessons.map(l => [l.unit?.number, l.unit])).values()].filter(Boolean)
  const filteredLessons = selectedUnit
    ? lessons.filter(l => l.unit?.number === selectedUnit)
    : lessons
  const completedCount = lessons.filter(l => (progress.lessons[l.id]?.progress || 0) >= 100).length

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/courses"
              className="flex items-center gap-1 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Courses</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold">AI Class XII</h1>
                <p className="text-xs text-slate-500">CBSE • {lessons.length} Lessons</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full flex items-center gap-1.5 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {progress.xp} XP
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Progress Overview */}
        <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Your Progress</h2>
              <p className="text-slate-500 text-sm">
                {completedCount} of {lessons.length} lessons completed
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {Math.round((completedCount / lessons.length) * 100) || 0}%
                </div>
                <div className="text-xs text-slate-500">Complete</div>
              </div>
              <div className="h-12 w-px bg-slate-200 dark:bg-slate-800" />
              <div className="text-center">
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{progress.xp}</div>
                <div className="text-xs text-slate-500">Total XP</div>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / lessons.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* PDF Reference Card */}
        <a
          href="/handbook.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-blue-200 dark:border-blue-500/20 rounded-xl mb-8 transition-colors"
        >
          <div className="p-3 bg-blue-100 dark:bg-blue-500/20 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-blue-700 dark:text-blue-400">CBSE AI Handbook (PDF)</div>
            <div className="text-sm text-blue-600/70 dark:text-blue-400/70">Complete Class XII reference • 100+ pages</div>
          </div>
          <ExternalLink className="w-5 h-5 text-blue-500" />
        </a>

        {/* Unit Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedUnit(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${!selectedUnit
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            All Lessons
          </button>
          {units.map(unit => (
            <button
              key={unit.number}
              onClick={() => setSelectedUnit(unit.number)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${selectedUnit === unit.number
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
            >
              Unit {unit.number}: {unit.title}
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson, index) => {
            const lessonProgress = progress.lessons[lesson.id]?.progress || 0
            const isCompleted = lessonProgress >= 100

            return (
              <motion.div
                key={lesson.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <Link
                  to={`/courses/${courseId}/lesson/${lesson.id}`}
                  className="block w-full text-left p-5 bg-white dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500/50 hover:shadow-lg dark:hover:bg-slate-900 transition-all group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getLessonIcon(lesson.title)}</span>
                      <span className="text-xs font-medium px-2 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full">
                        Lesson {lesson.lessonNumber}
                      </span>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    )}
                  </div>

                  <h3 className="font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {lesson.title}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      ~15 min
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3.5 h-3.5" />
                      {lesson.quiz?.questions?.length || 0} questions
                    </span>
                  </div>

                  {/* Progress bar */}
                  {lessonProgress > 0 && lessonProgress < 100 && (
                    <div className="mt-3 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full"
                        style={{ width: `${lessonProgress}%` }}
                      />
                    </div>
                  )}

                  {/* Start/Continue button */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`text-xs font-medium ${isCompleted
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : lessonProgress > 0
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-400'
                      }`}>
                      {isCompleted ? 'Completed' : lessonProgress > 0 ? `${lessonProgress}% complete` : 'Not started'}
                    </span>
                    <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      {lessonProgress > 0 ? 'Continue' : 'Start'}
                      <Play className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
