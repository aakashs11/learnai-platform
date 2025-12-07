import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, ChevronLeft, ChevronRight, BookOpen, Code, HelpCircle,
    CheckCircle, Clock, Target, Lightbulb, FileText, ExternalLink,
    Sparkles, Menu, X, Home, Award
} from 'lucide-react'
import InteractiveTheory from '../components/InteractiveTheory'
import InteractiveCode from '../components/InteractiveCode'
import Quiz from '../components/Quiz'
import VideoPlayer from '../components/VideoPlayer'
import AITutorWidget from '../components/AITutorWidget'
import { BadgeNotification, BadgePreview } from '../components/BadgeDisplay'
import { useBadges } from '../hooks/useBadges'


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

    // Compute badge stats from progress
    const badgeStats = useMemo(() => {
        const lessonsCompleted = Object.values(progress.lessons || {}).filter(l => l.progress >= 100).length
        const quizzesCompleted = Object.values(progress.lessons || {}).filter(l => l.xpEarned > 0).length
        const perfectQuizzes = Object.values(progress.lessons || {}).filter(l => l.progress === 100).length
        return {
            lessonsCompleted,
            totalLessons: allLessons.length || 20,
            totalXp: progress.xp || 0,
            currentStreak: progress.streak || 1,
            quizzesCompleted,
            perfectQuizzes
        }
    }, [progress, allLessons.length])

    // Badge system
    const { badges, newBadge, dismissNewBadge, earnedCount, totalBadges } = useBadges(badgeStats)


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
            <div className="min-h-screen bg-white dark:bg-slate-950 flex items-center justify-center text-slate-600">
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
        <div className="min-h-screen bg-space-900 text-slate-200 font-sans selection:bg-neon-cyan/30">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-30 bg-space-900/80 backdrop-blur-md border-b border-white/10">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-white/10 rounded-lg lg:hidden transition-colors"
                        >
                            <Menu className="w-5 h-5 text-slate-200" />
                        </button>

                        <Link
                            to={`/courses/${courseId}`}
                            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline font-medium">Back to Course</span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4">
                        <span className="px-3 py-1.5 bg-starlight-yellow/10 text-starlight-yellow rounded-full flex items-center gap-1.5 text-sm font-bold border border-starlight-yellow/20 shadow-[0_0_10px_rgba(255,215,0,0.1)]">
                            <Sparkles className="w-4 h-4" />
                            {progress.xp} XP
                        </span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="h-0.5 bg-space-800">
                    <motion.div
                        className="h-full bg-gradient-to-r from-neon-cyan to-nebula-end shadow-[0_0_10px_rgba(0,240,255,0.4)]"
                        initial={{ width: 0 }}
                        animate={{ width: `${lessonProgress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
            </header>

            <div className="flex relative">
                {/* Sidebar - Lesson Outline */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: -280, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -280, opacity: 0 }}
                            className="fixed lg:sticky top-[53px] left-0 z-20 w-72 h-[calc(100vh-53px)] bg-space-800/50 backdrop-blur-xl border-r border-white/10 overflow-y-auto scrollbar-thin scrollbar-thumb-space-600 scrollbar-track-transparent"
                        >
                            {/* Lesson Info */}
                            <div className="p-5 border-b border-white/10 bg-gradient-to-br from-space-800 to-space-900">
                                <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
                                    <span className="px-2 py-0.5 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 rounded-md font-mono font-medium">
                                        LESSON {lesson.lessonNumber}
                                    </span>
                                    <span className="font-mono text-slate-500">UNIT {lesson.unit?.number}</span>
                                </div>
                                <h2 className="font-heading font-bold text-white text-lg leading-tight">{lesson.title}</h2>
                                <p className="text-xs text-slate-400 mt-2 font-medium">
                                    {lesson.unit?.title}
                                </p>
                            </div>

                            {/* Section Navigation */}
                            <nav className="p-4">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">
                                    Mission Control
                                </p>
                                <div className="space-y-1">
                                    {sections.map(section => (
                                        <button
                                            key={section.id}
                                            onClick={() => setActiveSection(section.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all border ${activeSection === section.id
                                                ? 'bg-neon-cyan/10 border-neon-cyan/30 text-neon-cyan font-medium shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                                                : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                                                }`}
                                        >
                                            <section.icon className={`w-4 h-4 ${activeSection === section.id ? 'text-neon-cyan' : 'text-slate-500'}`} />
                                            {section.label}
                                            {section.id === 'quiz' && lesson.quiz?.questions?.length && (
                                                <span className="ml-auto text-xs font-mono bg-space-900/50 px-1.5 py-0.5 rounded text-slate-400">
                                                    {lesson.quiz.questions.length}Q
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </nav>

                            {/* PDF Reference */}
                            <div className="mx-4 mt-2 p-3 bg-nebula-end/10 border border-nebula-end/20 rounded-xl">
                                <a
                                    href={`/handbook.pdf#page=${lesson.unit?.pageStart}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 group"
                                >
                                    <div className="p-2 bg-nebula-end/20 rounded-lg group-hover:bg-nebula-end/30 transition-colors">
                                        <FileText className="w-4 h-4 text-nebula-start" />
                                    </div>
                                    <div className="flex-1 text-sm">
                                        <div className="font-medium text-slate-200 group-hover:text-white transition-colors">Course Handbook</div>
                                        <div className="text-xs text-slate-500 group-hover:text-slate-400">Pages {lesson.unit?.pageStart}-{lesson.unit?.pageEnd}</div>
                                    </div>
                                    <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                                </a>
                            </div>

                            {/* Lesson Navigation */}
                            <div className="p-4 mt-4 border-t border-white/10">
                                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 mb-3">
                                    Trajectory
                                </p>
                                <div className="space-y-2">
                                    {prevLesson && (
                                        <button
                                            onClick={() => navigateLesson('prev')}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                                        >
                                            <ChevronLeft className="w-4 h-4 text-slate-600" />
                                            <span className="truncate">{prevLesson.title}</span>
                                        </button>
                                    )}
                                    {nextLesson && (
                                        <button
                                            onClick={() => navigateLesson('next')}
                                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
                                        >
                                            <span className="truncate flex-1 text-right">{nextLesson.title}</span>
                                            <ChevronRight className="w-4 h-4 text-slate-600" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className={`flex-1 min-h-[calc(100vh-64px)] ${sidebarOpen ? 'lg:ml-0' : ''}`}>
                    <div className="max-w-4xl mx-auto px-6 py-12">
                        {/* Lesson Header */}
                        <div className="mb-10 relative">
                            {/* Decorative background glow */}
                            <div className="absolute -top-20 -left-20 w-64 h-64 bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none opacity-50" />

                            <div className="flex items-center gap-3 mb-4 relative z-10">
                                <span className="px-3 py-1 bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 text-sm font-mono font-medium rounded-full shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                                    Lesson {lesson.lessonNumber}
                                </span>
                                {lessonProgress >= 100 && (
                                    <span className="flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium rounded-full">
                                        <CheckCircle className="w-3.5 h-3.5" />
                                        Completed
                                    </span>
                                )}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 drop-shadow-sm relative z-10">
                                {lesson.title}
                            </h1>
                            <div className="glass-panel rounded-xl p-4 flex flex-wrap items-center gap-6 text-sm text-slate-300 relative z-10">
                                <span className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-neon-cyan" />
                                    ~15 min reading
                                </span>
                                <div className="w-px h-4 bg-white/10" />
                                <span className="flex items-center gap-2">
                                    <Target className="w-4 h-4 text-nebula-start" />
                                    {lesson.objectives?.length || 0} Key Objectives
                                </span>
                                <div className="w-px h-4 bg-white/10" />
                                <span className="flex items-center gap-2">
                                    <HelpCircle className="w-4 h-4 text-starlight-yellow" />
                                    {lesson.quiz?.questions?.length || 0} Challenge Questions
                                </span>
                            </div>
                        </div>

                        {/* Learning Objectives */}
                        <div className="relative mb-12 group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-neon-cyan/20 to-nebula-end/20 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                            <div className="relative bg-space-800 rounded-2xl p-6 border border-white/10">
                                <h3 className="font-heading font-semibold text-white mb-4 flex items-center gap-2 text-lg">
                                    <Target className="w-5 h-5 text-neon-cyan" />
                                    Mission Objectives
                                </h3>
                                <ul className="grid sm:grid-cols-2 gap-4">
                                    {lesson.objectives?.map((obj, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-slate-300">
                                            <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                                <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                                            </div>
                                            <span className="text-sm leading-relaxed">{obj}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Content Sections */}
                        <AnimatePresence mode="wait">
                            {activeSection === 'learn' && (
                                <motion.div
                                    key="learn"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-8"
                                >
                                    {lesson.videoId && (
                                        <div className="border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
                                            <VideoPlayer
                                                videoId={lesson.videoId}
                                                title={lesson.title}
                                            />
                                        </div>
                                    )}

                                    {lesson.theory?.length > 0 && (
                                        <div className="prose prose-invert prose-lg max-w-none">
                                            <InteractiveTheory
                                                sections={lesson.theory}
                                                keyConcepts={lesson.keyConcepts}
                                                unit={lesson.unit}
                                            />
                                        </div>
                                    )}

                                    <div className="flex justify-center pt-8">
                                        <button
                                            onClick={() => setActiveSection('practice')}
                                            className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-xl transition-all"
                                        >
                                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-neon-cyan to-nebula-end opacity-20 group-hover:opacity-30 transition-opacity" />
                                            <div className="absolute inset-0 border border-neon-cyan/50 rounded-xl" />
                                            <div className="relative flex items-center gap-3 text-neon-cyan font-bold tracking-wide">
                                                <Code className="w-5 h-5" />
                                                INITIALIZE TRAINING SIMULATION
                                                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </div>
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
                                    className="space-y-8"
                                >
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 bg-neon-cyan/10 border border-neon-cyan/20 rounded-xl shadow-[0_0_15px_rgba(0,240,255,0.15)]">
                                            <Code className="w-6 h-6 text-neon-cyan" />
                                        </div>
                                        <div>
                                            <h3 className="font-heading font-bold text-white text-xl">Code Laboratory</h3>
                                            <p className="text-slate-400">Execute Python scripts in the browser sandbox.</p>
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
                                        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-space-800/30">
                                            <Code className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                                            <p className="text-slate-500">No code modules detected for this sector.</p>
                                        </div>
                                    )}

                                    {lesson.quiz?.questions?.length > 0 && (
                                        <div className="flex justify-center pt-8">
                                            <button
                                                onClick={() => setActiveSection('quiz')}
                                                className="group relative px-8 py-4 bg-transparent overflow-hidden rounded-xl transition-all"
                                            >
                                                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-starlight-yellow/20 to-orange-500/20 opacity-100 group-hover:opacity-80 transition-opacity" />
                                                <div className="absolute inset-0 border border-starlight-yellow/50 rounded-xl" />
                                                <div className="relative flex items-center gap-3 text-starlight-yellow font-bold tracking-wide">
                                                    <HelpCircle className="w-5 h-5" />
                                                    START CHALLENGE MODE
                                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </div>
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
                                        <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl bg-space-800/30">
                                            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                                            <p className="text-slate-500">No challenge modules detected for this sector.</p>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Bottom Navigation */}
                        <div className="flex items-center justify-between mt-16 pt-8 border-t border-white/10">
                            {prevLesson ? (
                                <button
                                    onClick={() => navigateLesson('prev')}
                                    className="flex items-center gap-4 px-5 py-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                                >
                                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                                    <div className="text-left">
                                        <div className="text-xs text-slate-500 font-mono mb-1">PREVIOUS SECTOR</div>
                                        <div className="text-base font-medium">{prevLesson.title}</div>
                                    </div>
                                </button>
                            ) : (
                                <div />
                            )}

                            {nextLesson ? (
                                <button
                                    onClick={() => navigateLesson('next')}
                                    className="flex items-center gap-4 px-6 py-3 bg-gradient-to-r from-neon-cyan to-nebula-end text-black rounded-xl hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] transition-all group"
                                >
                                    <div className="text-right">
                                        <div className="text-xs text-slate-800 font-mono font-bold mb-1 opacity-70">NEXT SECTOR</div>
                                        <div className="text-base font-bold">{nextLesson.title}</div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <Link
                                    to={`/courses/${courseId}`}
                                    className="flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-black rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/20"
                                >
                                    <CheckCircle className="w-5 h-5" />
                                    MISSION ACCOMPLISHED
                                </Link>
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* AI Tutor Widget - Floating Overlay */}
            <AITutorWidget lessonContext={{ title: lesson.title, id: lesson.id, content: lesson.theory?.map(t => t.content).join(' ').substring(0, 1000) }} />

            {/* Badge Unlock Notification */}
            <BadgeNotification badge={newBadge} onDismiss={dismissNewBadge} />
        </div>
    )
}
