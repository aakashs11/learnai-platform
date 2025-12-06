import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, X, Play, ChevronLeft, ChevronRight, Sparkles, ExternalLink, Code, FileText } from 'lucide-react'
import LessonCard from './components/LessonCard'
import ProgressTracker from './components/ProgressTracker'
import InteractiveTheory from './components/InteractiveTheory'
import Quiz from './components/Quiz'
import InteractiveCode from './components/InteractiveCode'

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

function App() {
  const [lessons, setLessons] = useState([])
  const [selectedLesson, setSelectedLesson] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const [progress, setProgress] = useState(loadProgress)
  const [selectedUnit, setSelectedUnit] = useState(null)

  useEffect(() => {
    fetch('/lessons.json')
      .then(res => res.json())
      .then(data => {
        // Merge with saved progress
        const enriched = data.map(lesson => ({
          ...lesson,
          progress: progress.lessons[lesson.id]?.progress || 0,
          xpEarned: progress.lessons[lesson.id]?.xpEarned || 0
        }))
        setLessons(enriched)
      })
      .catch(err => console.error("Failed to load lessons", err))
  }, [progress])

  // Get unique units
  const units = [...new Map(lessons.map(l => [l.unit?.number, l.unit])).values()].filter(Boolean)

  // Filter lessons by selected unit
  const filteredLessons = selectedUnit
    ? lessons.filter(l => l.unit?.number === selectedUnit)
    : lessons

  // Count completed lessons
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
      setShowQuiz(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-950/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <BookOpen className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                AI Class XII Curriculum
              </h1>
              <p className="text-xs text-slate-500">CBSE Subject Code: 843</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center gap-1">
              <Sparkles className="w-4 h-4" />
              {progress.xp} XP
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-6">
        {/* Progress Tracker */}
        <ProgressTracker
          totalLessons={lessons.length}
          completedLessons={completedCount}
          totalXp={progress.xp}
          streak={progress.streak}
        />

        {/* Unit Filter */}
        <div className="flex gap-2 mt-6 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedUnit(null)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
              ${!selectedUnit ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            All Units
          </button>
          {units.map(unit => (
            <button
              key={unit.number}
              onClick={() => setSelectedUnit(unit.number)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                ${selectedUnit === unit.number ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
            >
              Unit {unit.number}
            </button>
          ))}
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLessons.map((lesson, index) => (
            <motion.div
              key={lesson.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <LessonCard
                lesson={lesson}
                onClick={() => setSelectedLesson(lesson)}
              />
            </motion.div>
          ))}
        </div>
      </main>

      {/* Lesson Detail Modal */}
      <AnimatePresence>
        {selectedLesson && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => { setSelectedLesson(null); setShowQuiz(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-white/10 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl shadow-indigo-500/10 flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-slate-900/50">
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                    <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 rounded-full">
                      Unit {selectedLesson.unit?.number}
                    </span>
                    <span>•</span>
                    <span>Pages {selectedLesson.unit?.pageStart}-{selectedLesson.unit?.pageEnd}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">
                    Lesson {selectedLesson.lessonNumber}: {selectedLesson.title}
                  </h2>
                </div>
                <button
                  onClick={() => { setSelectedLesson(null); setShowQuiz(false) }}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto flex-1">
                <AnimatePresence mode="wait">
                  {showQuiz ? (
                    <motion.div
                      key="quiz"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <button
                        onClick={() => setShowQuiz(false)}
                        className="flex items-center gap-1 text-slate-400 hover:text-white mb-4 text-sm"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back to lesson
                      </button>
                      <Quiz
                        questions={selectedLesson.quiz?.questions || []}
                        lessonTitle={selectedLesson.title}
                        onComplete={handleQuizComplete}
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="space-y-6"
                    >
                      {/* PDF Link */}
                      <a
                        href={`/handbook.pdf#page=${selectedLesson.unit?.pageStart}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 rounded-xl text-blue-400 transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="flex-1">
                          Open Handbook: Unit {selectedLesson.unit?.number} (Pages {selectedLesson.unit?.pageStart}-{selectedLesson.unit?.pageEnd})
                        </span>
                        <ExternalLink className="w-4 h-4" />
                      </a>

                      {/* Learning Objectives */}
                      <div className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/50">
                        <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                          <span className="text-xl">🎯</span> Learning Objectives
                        </h4>
                        <ul className="space-y-2">
                          {selectedLesson.objectives?.map((obj, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-300 text-sm">
                              <span className="text-emerald-400 mt-1">✓</span>
                              {obj}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Interactive Theory - Using Educational Methodologies */}
                      {selectedLesson.theory?.length > 0 && (
                        <InteractiveTheory
                          sections={selectedLesson.theory}
                          keyConcepts={selectedLesson.keyConcepts}
                          unit={selectedLesson.unit}
                        />
                      )}

                      {/* Code Examples */}
                      {selectedLesson.codeExamples?.length > 0 && (
                        <div className="space-y-4">
                          <h4 className="font-semibold text-white flex items-center gap-2">
                            <Code className="w-5 h-5 text-cyan-400" />
                            Code Examples
                          </h4>
                          {selectedLesson.codeExamples.map((example, idx) => (
                            <InteractiveCode
                              key={idx}
                              title={example.title}
                              initialCode={example.code}
                              explanation={example.explanation}
                            />
                          ))}
                        </div>
                      )}

                      {/* Real World Application */}
                      {selectedLesson.realWorldApplication && (
                        <div className="bg-emerald-500/10 rounded-xl p-4 border border-emerald-500/20">
                          <h4 className="font-semibold text-emerald-400 mb-2">🌍 Real-World Application</h4>
                          <p className="text-slate-300 text-sm">{selectedLesson.realWorldApplication}</p>
                        </div>
                      )}

                      {/* Quiz CTA */}
                      {selectedLesson.quiz?.questions?.length > 0 && (
                        <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-white mb-1">Ready to test your knowledge?</h4>
                              <p className="text-slate-400 text-sm">
                                {selectedLesson.quiz.questions.length} questions • Earn up to {selectedLesson.quiz.questions.length * 10} XP
                              </p>
                            </div>
                            <button
                              onClick={() => setShowQuiz(true)}
                              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded-xl flex items-center gap-2 transition-colors"
                            >
                              <Play className="w-5 h-5" />
                              Start Quiz
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Modal Footer - Navigation */}
              {!showQuiz && (
                <div className="p-4 border-t border-white/10 flex justify-between items-center bg-slate-900/50">
                  <button
                    onClick={() => navigateLesson('prev')}
                    disabled={lessons.findIndex(l => l.id === selectedLesson.id) === 0}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous
                  </button>
                  <span className="text-xs text-slate-500">
                    Lesson {selectedLesson.lessonNumber} of {lessons.length}
                  </span>
                  <button
                    onClick={() => navigateLesson('next')}
                    disabled={lessons.findIndex(l => l.id === selectedLesson.id) === lessons.length - 1}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-1"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
