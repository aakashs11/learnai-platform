import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
    BookOpen, Code, Brain, Play, CheckCircle, ArrowRight,
    Sparkles, Users, Award, Zap, Target, Rocket
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signInWithGoogle } from '../lib/supabase'

export default function LandingPage() {
    const navigate = useNavigate()
    const { isAuthenticated, loading } = useAuth()
    const heroRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: heroRef,
        offset: ["start start", "end start"]
    })

    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

    const handleGetStarted = async () => {
        if (isAuthenticated) {
            navigate('/courses')
        } else {
            const { error } = await signInWithGoogle()
            if (error) {
                navigate('/courses')
            }
        }
    }

    const features = [
        {
            icon: Code,
            title: 'Run Python in Browser',
            description: 'Execute real Python code with NumPy, Pandas & Matplotlib - no setup required',
            gradient: 'from-cyan-500 to-blue-600',
            image: '/images/dashboard.png'
        },
        {
            icon: Brain,
            title: 'AI-Powered Learning',
            description: 'Content adapts to your pace with comprehension checks at every step',
            gradient: 'from-purple-500 to-pink-600',
            image: null
        },
        {
            icon: Target,
            title: 'Exam-Focused',
            description: 'Aligned with CBSE syllabus with precise textbook references',
            gradient: 'from-emerald-500 to-teal-600',
            image: null
        },
        {
            icon: Rocket,
            title: 'Track Progress',
            description: 'Earn XP, unlock achievements, and see your learning journey visualized',
            gradient: 'from-amber-500 to-orange-600',
            image: null
        }
    ]

    const curriculumTopics = [
        { unit: 1, title: 'Data Handling with Python', topics: ['NumPy arrays', 'Pandas DataFrames', 'CSV operations', 'Data visualization'] },
        { unit: 2, title: 'Data Science Methodology', topics: ['10-step methodology', 'CRISP-DM framework', 'Data analytics types', 'Model evaluation'] },
        { unit: 3, title: 'Machine Learning & AI', topics: ['Computer Vision basics', 'NLP fundamentals', 'Neural Networks', 'CNN architecture'] }
    ]

    const stats = [
        { value: '14+', label: 'Interactive Lessons', icon: BookOpen },
        { value: '100+', label: 'Code Examples', icon: Code },
        { value: '50+', label: 'Practice Questions', icon: Target },
        { value: '8hrs', label: 'of Content', icon: Zap }
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-40 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 -right-40 w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[80px]" />
                {/* Grid pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            {/* Header */}
            <header className="relative z-20 container mx-auto px-6 py-6">
                <nav className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl blur-md opacity-50" />
                            <div className="relative p-2.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <span className="text-2xl font-bold bg-gradient-to-r from-white via-white to-slate-400 bg-clip-text text-transparent">
                            LearnAI
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <button
                            onClick={() => navigate('/courses')}
                            className="text-slate-300 hover:text-white transition-colors font-medium"
                        >
                            Courses
                        </button>
                        {!loading && (
                            <button
                                onClick={handleGetStarted}
                                className="px-5 py-2.5 bg-white/10 hover:bg-white/15 rounded-full border border-white/20 font-medium transition-all hover:scale-105"
                            >
                                {isAuthenticated ? 'My Dashboard' : 'Sign In'}
                            </button>
                        )}
                    </motion.div>
                </nav>
            </header>

            {/* Hero Section */}
            <motion.section
                ref={heroRef}
                style={{ opacity: heroOpacity, scale: heroScale }}
                className="relative z-10 container mx-auto px-6 pt-12 pb-32"
            >
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left: Text */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full border border-indigo-500/30 mb-6">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-indigo-300 text-sm font-medium">CBSE Class XII AI Curriculum</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6">
                            Your Journey to
                            <span className="block mt-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Mastering AI
                            </span>
                            <span className="block text-3xl lg:text-4xl mt-4 text-slate-400 font-normal">
                                Starts Here
                            </span>
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-400 max-w-xl mb-8 leading-relaxed">
                            Experience AI learning like never before. Interactive Python coding,
                            visual explanations, and personalized quizzes - all designed to help
                            you truly understand and ace your exams.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            <motion.button
                                onClick={handleGetStarted}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group px-8 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl font-semibold text-lg shadow-2xl shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center gap-3 transition-all"
                            >
                                <Play className="w-5 h-5 fill-current" />
                                Start Learning Free
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <button
                                onClick={() => navigate('/courses')}
                                className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-semibold text-lg border border-white/10 hover:border-white/20 transition-all"
                            >
                                Browse Courses
                            </button>
                        </div>

                        {/* Quick stats */}
                        <div className="flex gap-8">
                            {stats.slice(0, 3).map((stat, idx) => (
                                <div key={idx} className="text-center">
                                    <div className="text-2xl lg:text-3xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-slate-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right: Hero Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="relative"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
                        <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            <img
                                src="/images/hero-learning.png"
                                alt="Student learning AI"
                                className="w-full h-auto"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                            {/* Floating badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="absolute bottom-6 left-6 right-6 flex gap-3"
                            >
                                <div className="px-4 py-2 bg-emerald-500/90 backdrop-blur rounded-xl flex items-center gap-2 text-sm font-medium">
                                    <CheckCircle className="w-4 h-4" />
                                    Python Ready
                                </div>
                                <div className="px-4 py-2 bg-amber-500/90 backdrop-blur rounded-xl flex items-center gap-2 text-sm font-medium">
                                    <Award className="w-4 h-4" />
                                    CBSE Aligned
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Course Preview Section */}
            <section className="relative z-10 py-24 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                            One Course.
                            <span className="text-indigo-400"> Complete Mastery.</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            Everything you need to ace AI in Class XII, beautifully organized and truly interactive.
                        </p>
                    </motion.div>

                    {/* Featured Course Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="max-w-4xl mx-auto"
                    >
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                            <div className="relative bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">
                                {/* Course Header Image */}
                                <div className="relative h-64">
                                    <img
                                        src="/images/course-ai.png"
                                        alt="AI Course"
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                                    <div className="absolute bottom-6 left-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 bg-indigo-500/90 rounded-full text-sm font-medium">Class XII</span>
                                            <span className="px-3 py-1 bg-emerald-500/90 rounded-full text-sm font-medium">Available Now</span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white">Artificial Intelligence</h3>
                                        <p className="text-slate-300">CBSE Subject Code: 843</p>
                                    </div>
                                </div>

                                {/* Course Content */}
                                <div className="p-8">
                                    <div className="grid grid-cols-4 gap-6 mb-8">
                                        {stats.map((stat, idx) => (
                                            <div key={idx} className="text-center py-4 bg-white/5 rounded-xl">
                                                <stat.icon className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                                                <div className="text-xl font-bold">{stat.value}</div>
                                                <div className="text-xs text-slate-500">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <p className="text-slate-300 mb-8 text-lg">
                                        A complete journey from Python basics to Neural Networks. Every concept explained
                                        with interactive code, visual diagrams, and comprehension checks to ensure you
                                        truly understand before moving on.
                                    </p>

                                    <button
                                        onClick={() => navigate('/courses/class-12-ai')}
                                        className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        Start Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 container mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        Learning That Actually
                        <span className="text-purple-400"> Works</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        We've combined the best of educational research with modern technology
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative"
                        >
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity`} />
                            <div className="relative p-8 bg-slate-900/50 backdrop-blur border border-white/10 rounded-2xl hover:border-white/20 transition-all">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                                <p className="text-slate-400">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* What You'll Learn - Curriculum Overview */}
            <section className="relative z-10 container mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="text-4xl lg:text-5xl font-bold mb-4">
                        What You'll
                        <span className="text-emerald-400"> Master</span>
                    </h2>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                        Complete CBSE Class XII AI syllabus coverage
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {curriculumTopics.map((unit, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-6 bg-slate-900/50 backdrop-blur border border-white/10 rounded-2xl hover:border-indigo-500/30 transition-colors"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                                    <span className="text-indigo-400 font-bold">U{unit.unit}</span>
                                </div>
                                <h3 className="font-semibold text-lg">{unit.title}</h3>
                            </div>
                            <ul className="space-y-2">
                                {unit.topics.map((topic, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-300 text-sm">
                                        <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                                        {topic}
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Final CTA */}
            <section className="relative z-10 container mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />

                    <div className="relative p-12 lg:p-16 text-center">
                        <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                            Ready to Start Your AI Journey?
                        </h2>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-10">
                            Join hundreds of students who are already learning with our
                            interactive platform. It's free to get started!
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="px-10 py-5 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-semibold text-lg shadow-2xl flex items-center gap-3 mx-auto transition-all hover:scale-105"
                        >
                            <Users className="w-5 h-5" />
                            Begin Your Journey
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-slate-800 py-12">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold text-lg">LearnAI</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            © {new Date().getFullYear()} LearnAI. Made with ❤️ for students in India.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
