import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Code, HelpCircle,
    CheckCircle, Clock, Target, Lightbulb, FileText, ExternalLink,
    Sparkles, Menu, X, Home
} from 'lucide-react'
import InteractiveTheory from '../components/InteractiveTheory'
import InteractiveCode from '../components/InteractiveCode'
import Quiz from '../components/Quiz'

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

export default function LessonPage() {
    const { courseId, lessonId } = useParams()
    const navigate = useNavigate()

    const [lesson, setLesson] = useState(null)
    const [allLessons, setAllLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [activeSection, setActiveSection] = useState('learn')
    const [progress, setProgress] = useState(loadProgress)
    const [sidebarOpen, setSidebarOpen] = useState(true)

    useEffect(() => {
        fetch('/lessons.json')
            .then(res => res.json())
            .then(data => {
                setAllLessons(data)
                const currentLesson = data.find(l => l.id === lessonId)
                setLesson(currentLesson || data[0])
                setLoading(false)
            })
            .catch(err => {
                console.error("Failed to load lessons", err)
                setLoading(false)
            })
    }, [lessonId])

    const currentIndex = allLessons.findIndex(l => l.id === lesson?.id)
    const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
    const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null

    const handleQuizComplete = (score, xpEarned) => {
        if (!lesson) return
        const lessonProgress = Math.round((score / lesson.quiz.questions.length) * 100)
        setProgress(prev => {
            const newProgress = {
                ...prev,
                xp: prev.xp + xpEarned,
                lessons: {
                    ...prev.lessons,
                    [lesson.id]: {
                        progress: Math.max(prev.lessons[lesson.id]?.progress || 0, lessonProgress),
                        xpEarned: (prev.lessons[lesson.id]?.xpEarned || 0) + xpEarned
                    }
                }
            }
            saveProgress(newProgress)
            return newProgress
        })
    }

    const navigateLesson = (direction) => {
        const target = direction === 'next' ? nextLesson : prevLesson
        if (target) {
            navigate(`/courses/${courseId}/lesson/${target.id}`)
            setActiveSection('learn')
            window.scrollTo(0, 0)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center">
                <div className="animate-spin w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full" />
            </div>
        )
    }

    if (!lesson) {
        return (
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-slate-500">
                <div className="text-center">
                    <p className="text-xl mb-4">Lesson not found</p>
                    <Link to={`/courses/${courseId}`} className="text-indigo-500 hover:underline">
                        ← Back to course
                    </Link>
                </div>
            </div>
        )
    }

    const sections = [
        { id: 'learn', label: 'Learn', icon: BookOpen, color: 'indigo' },
        { id: 'practice', label: 'Practice', icon: Code, color: 'cyan' },
        { id: 'quiz', label: 'Quiz', icon: HelpCircle, color: 'purple' }
    ]

    const lessonProgress = progress.lessons[lesson.id]?.progress || 0

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg lg:hidden"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <Link
                            to={`/courses/${courseId}`}
                            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Back to Course</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1.5 bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-full flex items-center gap-1.5 text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            {progress.xp} XP
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-slate-100 dark:bg-slate-800">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${lessonProgress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </header>

            <div className="flex">
                {/* Sidebar - Lesson Outline */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: -280, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -280, opacity: 0 }}
                            className="fixed lg:sticky top-[53px] left-0 z-20 w-72 h-[calc(100vh-53px)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 overflow-y-auto"
                        >
                            {/* Lesson Info */}
                            <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                    <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 rounded-full font-medium">
                                        Lesson {lesson.lessonNumber}
                                    </span>
                                    <span>Unit {lesson.unit?.number}</span>
                                </div>
                                <h2 className="font-semibold text-slate-900 dark:text-white">{lesson.title}</h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                                    {lesson.unit?.title}
                                </p>
                            </div>

                            {/* Section Navigation */}
                            <nav className="p-3">
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide px-2 mb-2">
                                    Sections
                                </p>
                                <div className="space-y-1">
                                    {sections.map(section => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${activeSection === section.id
                                                    ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 font-medium'
                                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                                }`}
                                        >
                                            <section.icon className="w-4 h-4" />
                                            {section.label}
                                            {section.id === 'quiz' && lesson.quiz?.questions?.length && (
                                                <span className="ml-auto text-xs text-slate-400">
                                                    {lesson.quiz.questions.length} Q
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </nav>

                            {/* PDF Reference */}
                            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                                <a
                                    href={`/handbook.pdf#page=${lesson.unit?.pageStart}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-3 py-2.5 bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg transition-colors"
                                >
                                    <FileText className="w-4 h-4" />
                                    <div className="flex-1 text-sm">
                                        <div className="font-medium">PDF Handbook</div>
                                        <div className="text-xs opacity-70">Pages {lesson.unit?.pageStart}-{lesson.unit?.pageEnd}</div>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                            </div>

                            {/* Lesson Navigation */}
                            <div className="p-3 border-t border-slate-200 dark:border-slate-800">
                                <p className="text-xs font-medium text-slate-400 dark:text-slate-500 uppercase tracking-wide px-2 mb-2">
                                    Navigation
                                </p>
                                <div className="space-y-1">
                                    {prevLesson && (
                                        <button
                                            onClick={() => navigateLesson('prev')}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <ChevronLeft className="w-4 h-4" />
                                            <span className="truncate">{prevLesson.title}</span>
                                        </button>
                                    )}
                                    {nextLesson && (
                                        <button
                                            onClick={() => navigateLesson('next')}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                        >
                                            <span className="truncate">{nextLesson.title}</span>
                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className={`flex-1 min-h-[calc(100vh-53px)] ${sidebarOpen ? 'lg:ml-0' : ''}`}>
                    <div className="max-w-4xl mx-auto px-6 py-8">
                        {/* Lesson Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-full">
                                    Lesson {lesson.lessonNumber}
                                </span>
                                {lessonProgress >= 100 && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-medium rounded-full">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Completed
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                                {lesson.title}
                            </h1>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    ~15 min
                                </span>
                                <span className="flex items-center gap-1">
                                    <Target className="w-4 h-4" />
                                    {lesson.objectives?.length || 0} objectives
                                </span>
                                <span className="flex items-center gap-1">
                                    <HelpCircle className="w-4 h-4" />
                                    {lesson.quiz?.questions?.length || 0} quiz questions
                                </span>
                            </div>
                        </div>

                        {/* Learning Objectives */}
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-500/10 dark:to-purple-500/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-500/20 mb-8">
                            <h3 className="font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-indigo-500" />
                                What you'll learn
                            </h3>
                            <ul className="grid sm:grid-cols-2 gap-3">
                                {lesson.objectives?.map((obj, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                        <span className="text-sm">{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Content Sections */}
                        <AnimatePresence mode="wait">
                            {activeSection === 'learn' && (
                                <motion.div
                                    key="learn"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    {lesson.theory?.length > 0 && (
                                        <InteractiveTheory
                                            sections={lesson.theory}
                                            keyConcepts={lesson.keyConcepts}
                                            unit={lesson.unit}
                                        />
                                    )}

                                    <div className="flex justify-center pt-6">
                                        <button
                                            onClick={() => setActiveSection('practice')}
                                            className="px-6 py-3 bg-cyan-100 dark:bg-cyan-500/20 hover:bg-cyan-200 dark:hover:bg-cyan-500/30 text-cyan-700 dark:text-cyan-400 rounded-xl font-medium flex items-center gap-2 transition-colors"
                                        >
                                            <Code className="w-5 h-5" />
                                            Try the Code Examples
                                            <ChevronRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {activeSection === 'practice' && (
                                <motion.div
                                    key="practice"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="p-2 bg-cyan-100 dark:bg-cyan-500/20 rounded-lg">
                                            <Code className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-900 dark:text-white">Code Examples</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">Run and modify code directly in your browser</p>
                                        </div>
                                    </div>

                                    {lesson.codeExamples?.length > 0 ? (
                                        lesson.codeExamples.map((example, idx) => (
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

                                    {lesson.quiz?.questions?.length > 0 && (
                                        <div className="flex justify-center pt-6">
                                            <button
                                                onClick={() => setActiveSection('quiz')}
                                                className="px-6 py-3 bg-purple-100 dark:bg-purple-500/20 hover:bg-purple-200 dark:hover:bg-purple-500/30 text-purple-700 dark:text-purple-400 rounded-xl font-medium flex items-center gap-2 transition-colors"
                                            >
                                                <HelpCircle className="w-5 h-5" />
                                                Take the Quiz
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {activeSection === 'quiz' && (
                                <motion.div
                                    key="quiz"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    {lesson.quiz?.questions?.length > 0 ? (
                                        <Quiz
                                            questions={lesson.quiz.questions}
                                            onComplete={handleQuizComplete}
                                        />
                                    ) : (
                                        <div className="text-center py-12 text-slate-400">
                                            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                            <p>No quiz for this lesson yet.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bottom Navigation */}
                        <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
                            {prevLesson ? (
                                <button
                                    onClick={() => navigateLesson('prev')}
                                    className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                    <div className="text-left">
                                        <div className="text-xs text-slate-400">Previous</div>
                                        <div className="text-sm font-medium">{prevLesson.title}</div>
                                    </div>
                                </button>
                            ) : (
                                <div />
                            )}

                            {nextLesson ? (
                                <button
                                    onClick={() => navigateLesson('next')}
                                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl transition-colors"
                                >
                                    <div className="text-right">
                                        <div className="text-xs text-indigo-200">Next Lesson</div>
                                        <div className="text-sm font-medium">{nextLesson.title}</div>
                                    </div>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <Link
                                    to={`/courses/${courseId}`}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-colors"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Complete Course
                                </Link>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}
