import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, X, Play, ChevronLeft, ChevronRight, Sparkles,
  ExternalLink, Code, FileText, ArrowLeft, CheckCircle,
  Clock, Target, Lightbulb, HelpCircle
} from 'lucide-react'
import LessonCard from '../components/LessonCard'
import ProgressTracker from '../components/ProgressTracker'
import InteractiveTheory from '../components/InteractiveTheory'
import Quiz from '../components/Quiz'
import InteractiveCode from '../components/InteractiveCode'

// Helper to load/save progress from localStorage
const loadProgress = () => {
  try {
    const saved = localStorage.getItem('ai-curriculum-progress')
    return saved ? JSON.parse(saved) : { xp: 0, streak: 1, lessons: {} }
  } catch {
    return { xp: 0, streak: 1, lessons: {} }
  }
}

const saveProgress = (progress) => {
  localStorage.setItem('ai-curriculum-progress', JSON.stringify(progress))
}

export default function CoursePage() {
  const navigate = useNavigate()
  const [lessons, setLessons] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [currentTab, setCurrentTab] = useState('learn') // 'learn', 'practice', 'quiz'
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

  const handleQuizComplete = (score, xpEarned) => {
    if (!selectedLesson) return
    const lessonProgress = Math.round((score / selectedLesson.quiz.questions.length) * 100)
    setProgress(prev => {
      const newProgress = {
        ...prev,
        xp: prev.xp + xpEarned,
        lessons: {
          ...prev.lessons,
          [selectedLesson.id]: {
            progress: Math.max(prev.lessons[selectedLesson.id]?.progress || 0, lessonProgress),
            xpEarned: (prev.lessons[selectedLesson.id]?.xpEarned || 0) + xpEarned
          }
        }
      }
      saveProgress(newProgress)
      return newProgress
    })
  }

  const navigateLesson = (direction) => {
    const currentIndex = lessons.findIndex(l => l.id === selectedLesson?.id)
    const newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1
    if (newIndex >= 0 && newIndex < lessons.length) {
      setSelectedLesson(lessons[newIndex])
      setCurrentTab('learn')
    }
  }

  // Tab configuration for simpler navigation
  const tabs = [
    { id: 'learn', label: 'Learn', icon: BookOpen, color: 'indigo' },
    { id: 'practice', label: 'Practice', icon: Code, color: 'cyan' },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'purple' }
  ]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/courses')}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">All Courses</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-white">AI Class XII</h1>
                <p className="text-xs text-slate-500">CBSE • 14 Lessons</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center gap-1.5 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              {progress.xp} XP
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Simple Progress Overview */}
        <div className="bg-slate-900/50 rounded-2xl p-6 border border-slate-800 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-1">Your Progress</h2>
              <p className="text-slate-400 text-sm">
                {completedCount} of {lessons.length} lessons completed
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-400">{Math.round((completedCount / lessons.length) * 100) || 0}%</div>
                <div className="text-xs text-slate-500">Complete</div>
              </div>
              <div className="h-12 w-px bg-slate-800" />
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{progress.xp}</div>
                <div className="text-xs text-slate-500">Total XP</div>
              </div>
            </div>
          </div>
          {/* Simple progress bar */}
          <div className="mt-4 h-2 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedCount / lessons.length) * 100}%` }}
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
            />
          </div>
        </div>

        {/* Unit Pills - Simplified */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedUnit(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
              ${!selectedUnit ? 'bg-indigo-500 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
          >
            All Lessons
          </button>
          {units.map(unit => (
            <button
              key={unit.number}
              onClick={() => setSelectedUnit(unit.number)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${selectedUnit === unit.number ? 'bg-indigo-500 text-white' : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800'}`}
            >
              Unit {unit.number}
            </button>
          ))}
        </div>

        {/* Lessons Grid - Cleaner cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <button
                onClick={() => { setSelectedLesson(lesson); setCurrentTab('learn'); }}
                className="w-full text-left p-5 bg-slate-900/50 rounded-xl border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full">
                    Lesson {lesson.lessonNumber}
                  </span>
                  {progress.lessons[lesson.id]?.progress >= 100 && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                </div>
                <h3 className="font-semibold text-white mb-2 group-hover:text-indigo-300 transition-colors">
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
                {/* Mini progress bar */}
                {progress.lessons[lesson.id]?.progress > 0 && progress.lessons[lesson.id]?.progress < 100 && (
                  <div className="mt-3 h-1 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 rounded-full"
                      style={{ width: `${progress.lessons[lesson.id]?.progress}%` }}
                    />
                  </div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Lesson Modal - Simplified with tabs */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
            >
              {/* Modal Header - Cleaner */}
              <div className="p-5 border-b border-white/10 bg-slate-900/80">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-full">
                        Lesson {selectedLesson.lessonNumber}
                      </span>
                      <span className="text-xs text-slate-500">
                        Unit {selectedLesson.unit?.number}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white">{selectedLesson.title}</h2>
                  </div>
                  <button
                    onClick={() => setSelectedLesson(null)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>

                {/* Simple Tab Navigation */}
                <div className="flex gap-2 mt-4">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setCurrentTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${currentTab === tab.id
                          ? `bg-${tab.color}-500/20 text-${tab.color}-400 border border-${tab.color}-500/30`
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modal Content - One thing at a time */}
              <div className="p-6 overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  {/* LEARN TAB */}
                  {currentTab === 'learn' && (
                    <motion.div
                      key="learn"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* Learning Objectives - Friendly format */}
                      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-5 border border-indigo-500/20">
                        <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <Target className="w-5 h-5 text-indigo-400" />
                          What you'll learn
                        </h3>
                        <ul className="space-y-2">
                          {selectedLesson.objectives?.map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Handbook Reference */}
                      <a
                        href={`/handbook.pdf#page=${selectedLesson.unit?.pageStart}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 rounded-xl text-blue-400 transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        <div className="flex-1">
                          <div className="font-medium">Open PDF Handbook</div>
                          <div className="text-xs text-blue-400/70">Pages {selectedLesson.unit?.pageStart}-{selectedLesson.unit?.pageEnd}</div>
                        </div>
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Theory Content */}
                      {selectedLesson.theory?.length > 0 && (
                        <InteractiveTheory
                          sections={selectedLesson.theory}
                          keyConcepts={selectedLesson.keyConcepts}
                          unit={selectedLesson.unit}
                        />
                      )}

                      {/* Next Step CTA */}
                      <div className="flex justify-center pt-4">
                        <button
                          onClick={() => setCurrentTab('practice')}
                          className="px-6 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 rounded-xl font-medium flex items-center gap-2 transition-colors"
                        >
                          <Code className="w-5 h-5" />
                          Try the Code Examples
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* PRACTICE TAB */}
                  {currentTab === 'practice' && (
                    <motion.div
                      key="practice"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                          <Code className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Code Examples</h3>
                          <p className="text-sm text-slate-400">Run and modify code directly in your browser</p>
                        </div>
                      </div>

                      {selectedLesson.codeExamples?.length > 0 ? (
                        selectedLesson.codeExamples.map((example, idx) => (
                          <InteractiveCode
                            key={idx}
                            title={example.title}
                            initialCode={example.code}
                            explanation={example.explanation}
                          />
                        ))
                      ) : (
                        <div className="text-center py-12 text-slate-400">
                          <Code className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No code examples for this lesson yet.</p>
                        </div>
                      )}

                      {/* Next Step CTA */}
                      {selectedLesson.quiz?.questions?.length > 0 && (
                        <div className="flex justify-center pt-4">
                          <button
                            onClick={() => setCurrentTab('quiz')}
                            className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-xl font-medium flex items-center gap-2 transition-colors"
                          >
                            <HelpCircle className="w-5 h-5" />
                            Take the Quiz
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* QUIZ TAB */}
                  {currentTab === 'quiz' && (
                    <motion.div
                      key="quiz"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                    >
                      {selectedLesson.quiz?.questions?.length > 0 ? (
                        <Quiz
                          questions={selectedLesson.quiz.questions}
                          lessonTitle={selectedLesson.title}
                          onComplete={handleQuizComplete}
                        />
                      ) : (
                        <div className="text-center py-12 text-slate-400">
                          <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                          <p>No quiz available for this lesson yet.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal Footer - Simple navigation */}
              <div className="p-4 border-t border-white/10 flex justify-between items-center bg-slate-900/80">
                <button
                  onClick={() => navigateLesson('prev')}
                  disabled={lessons.findIndex(l => l.id === selectedLesson.id) === 0}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>
                <span className="text-xs text-slate-500">
                  {selectedLesson.lessonNumber} of {lessons.length}
                </span>
                <button
                  onClick={() => navigateLesson('next')}
                  disabled={lessons.findIndex(l => l.id === selectedLesson.id) === lessons.length - 1}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1 transition-colors"
                >
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
