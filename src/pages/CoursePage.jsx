import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  BookOpen, ArrowLeft, CheckCircle, Clock, Target,
  Sparkles, FileText, ExternalLink, Play
} from 'lucide-react'

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
    <div className="min-h-screen bg-space-900 text-white font-sans selection:bg-neon-cyan/30">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] opacity-30" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[100px] opacity-20" />
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[80px] opacity-20" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-space-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              to="/courses"
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Courses</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-space-800 rounded-lg border border-white/10">
                <BookOpen className="w-5 h-5 text-neon-cyan" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white font-heading tracking-wide">AI Class XII</h1>
                <p className="text-xs text-slate-400">CBSE • {lessons.length} Lessons</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-starlight-yellow/10 text-starlight-yellow rounded-full flex items-center gap-1.5 text-sm font-medium border border-starlight-yellow/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
              <Sparkles className="w-4 h-4" />
              {progress.xp} XP
            </span>
          </div>
        </div>
      </header>

      <main className="relative z-0 max-w-7xl mx-auto px-6 py-6">
        {/* Progress Overview */}
        <div className="glass-panel p-6 mb-8 bg-space-800/50">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold mb-1 text-white font-heading">Your Progress</h2>
              <p className="text-slate-400 text-sm">
                {completedCount} of {lessons.length} missions completed
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-neon-cyan drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">
                  {Math.round((completedCount / lessons.length) * 100) || 0}%
                </div>
                <div className="text-xs text-slate-400">Complete</div>
              </div>
              <div className="h-12 w-px bg-white/10" />
              <div className="text-center">
                <div className="text-2xl font-bold text-starlight-yellow drop-shadow-[0_0_8px_rgba(255,215,0,0.5)]">{progress.xp}</div>
                <div className="text-xs text-slate-400">Total XP</div>
              </div>
            </div>
          </div>
          <div className="mt-4 h-2 bg-space-950 rounded-full overflow-hidden border border-white/5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / lessons.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple rounded-full shadow-[0_0_10px_rgba(0,240,255,0.5)]"
            />
          </div>
        </div>

        {/* PDF Reference Card */}
        <a
          href="/handbook.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-4 p-4 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-400/40 rounded-xl mb-8 transition-all group"
        >
          <div className="p-3 bg-blue-500/20 rounded-lg group-hover:scale-110 transition-transform">
            <FileText className="w-6 h-6 text-blue-400" />
          </div>
          <div className="flex-1">
            <div className="font-bold text-blue-300 group-hover:text-blue-200 transition-colors">CBSE AI Handbook (PDF)</div>
            <div className="text-sm text-blue-400/70">Complete Class XII reference • 100+ pages</div>
          </div>
          <ExternalLink className="w-5 h-5 text-blue-400 group-hover:text-white transition-colors" />
        </a>

        {/* Unit Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-space-700 scrollbar-track-transparent">
          <button
            onClick={() => setSelectedUnit(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
              ${!selectedUnit
                ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                : 'bg-space-800/50 border-white/10 text-slate-400 hover:bg-space-700 hover:text-white'}`}
          >
            All Lessons
          </button>
          {units.map(unit => (
            <button
              key={unit.number}
              onClick={() => setSelectedUnit(unit.number)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                ${selectedUnit === unit.number
                  ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan shadow-[0_0_10px_rgba(0,240,255,0.2)]'
                  : 'bg-space-800/50 border-white/10 text-slate-400 hover:bg-space-700 hover:text-white'}`}
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
                  className="block w-full text-left p-5 glass-panel bg-space-800/40 hover:bg-space-800/60 transition-all group relative overflow-hidden"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-neon-purple/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl filter drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]">{getLessonIcon(lesson.title)}</span>
                        <span className="text-xs font-bold px-2 py-1 bg-space-950/50 border border-white/10 text-slate-300 rounded-full tracking-wide">
                          LESSON {lesson.lessonNumber}
                        </span>
                      </div>
                      {isCompleted && (
                        <CheckCircle className="w-5 h-5 text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]" />
                      )}
                    </div>

                    <h3 className="font-bold text-white mb-2 group-hover:text-neon-cyan transition-colors line-clamp-2">
                      {lesson.title}
                    </h3>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mb-4">
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
                    <div className="mt-auto">
                      {lessonProgress > 0 && lessonProgress < 100 ? (
                        <div className="h-1.5 bg-space-950 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-neon-cyan to-blue-500 rounded-full"
                            style={{ width: `${lessonProgress}%` }}
                          />
                        </div>
                      ) : null}

                      {/* Start/Continue button */}
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`text-xs font-medium ${isCompleted
                          ? 'text-emerald-400'
                          : lessonProgress > 0
                            ? 'text-neon-cyan'
                            : 'text-slate-500 group-hover:text-slate-300'
                          }`}>
                          {isCompleted ? 'Mission Complete' : lessonProgress > 0 ? `${lessonProgress}% complete` : 'Not started'}
                        </span>
                        <span className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-all
                                ${lessonProgress > 0 ? 'text-neon-cyan' : 'text-slate-400 group-hover:text-white'}
                            `}>
                          {lessonProgress > 0 ? 'Resume' : 'Start'}
                          <Play className="w-3 h-3 fill-current" />
                        </span>
                      </div>
                    </div>
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
