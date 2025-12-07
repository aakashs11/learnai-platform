import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import {
    BookOpen, Code, Brain, Play, CheckCircle, ArrowRight,
    Sparkles, Users, Award, Zap, Target, Rocket, Activity
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
            const { data, error } = await signInWithGoogle()
            if (error) {
                navigate('/login')
            } else if (data?.session) {
                navigate('/courses')
            }
        }
    }

    const features = [
        {
            icon: Code,
            title: 'Run Python in Browser',
            description: 'Execute real Python code with NumPy, Pandas & Matplotlib - no setup required',
            gradient: 'from-neon-cyan to-nebula-end',
            image: '/images/dashboard.png'
        },
        {
            icon: Brain,
            title: 'AI-Powered Learning',
            description: 'Content adapts to your pace with comprehension checks at every step',
            gradient: 'from-neon-purple to-pink-600',
            image: null
        },
        {
            icon: Target,
            title: 'Exam-Focused',
            description: 'Aligned with CBSE syllabus with precise textbook references',
            gradient: 'from-starlight-yellow to-orange-500', // Yellow for "Gold/Top Marks"
            image: null
        },
        {
            icon: Rocket,
            title: 'Track Progress',
            description: 'Earn XP, unlock achievements, and see your learning journey visualized',
            gradient: 'from-emerald-400 to-teal-500',
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
        <div className="min-h-screen bg-space-900 text-white overflow-hidden font-sans">
            {/* Animated Space Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 -left-40 w-[800px] h-[800px] bg-nebula-start/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-neon-purple/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[80px]" />
                {/* Digital Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px]" />
            </div>

            {/* Header */}
            <header className="relative z-20 container mx-auto px-6 py-6">
                <nav className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-3"
                    >
                        {/* Logo Concept */}
                        <div className="relative group cursor-pointer" onClick={() => navigate('/')}>
                            <div className="absolute inset-0 bg-neon-cyan/30 rounded-full blur-md group-hover:blur-lg transition-all" />
                            {/* Use img logo if available or fallback icon */}
                            <img src="/images/logo-rocket.png" alt="Logo" className="w-10 h-10 relative z-10" />
                        </div>
                        <span className="text-2xl font-bold font-heading tracking-wide">
                            Learn<span className="text-neon-cyan">AI</span>
                        </span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-6"
                    >
                        <button
                            onClick={() => navigate('/courses')}
                            className="text-slate-300 hover:text-white transition-colors font-medium hover:text-neon-cyan"
                        >
                            Courses
                        </button>
                        {!loading && (
                            <button
                                onClick={handleGetStarted}
                                className="px-5 py-2.5 bg-space-800/80 hover:bg-space-700/80 rounded-full border border-neon-cyan/30 text-neon-cyan font-medium transition-all hover:scale-105 hover:shadow-[0_0_15px_rgba(0,240,255,0.3)]"
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-space-800/60 backdrop-blur-md border border-neon-cyan/20 rounded-full mb-6 shadow-lg shadow-neon-cyan/5">
                            <Rocket className="w-4 h-4 text-neon-cyan" />
                            <span className="text-neon-cyan text-sm font-medium tracking-wide">CBSE Class XII AI Curriculum</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight font-heading">
                            Decover the Universe of
                            <span className="block mt-2 bg-gradient-to-r from-neon-cyan via-nebula-start to-neon-purple bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                                Artificial Intelligence
                            </span>
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-400 max-w-xl mb-8 leading-relaxed font-light">
                            Launch your journey into Python and AI. Complex topics simplified for exam success.
                            Join the mission to master the future.
                        </p>

                        <div className="flex flex-wrap gap-4 mb-12">
                            <motion.button
                                onClick={handleGetStarted}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group px-8 py-4 bg-gradient-to-r from-neon-cyan to-nebula-end rounded-xl font-bold text-lg text-black shadow-[0_0_20px_rgba(0,240,255,0.4)] hover:shadow-[0_0_30px_rgba(0,240,255,0.6)] flex items-center gap-3 transition-all"
                            >
                                <Rocket className="w-5 h-5 fill-current" />
                                Launch Learning
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.button>

                            <button
                                onClick={() => navigate('/courses')}
                                className="px-8 py-4 bg-space-800 hover:bg-space-700 rounded-xl font-semibold text-lg border border-white/5 hover:border-white/10 transition-all text-slate-200"
                            >
                                Explore Missions
                            </button>
                        </div>

                        {/* Quick stats */}
                        <div className="flex gap-8 border-t border-white/5 pt-8">
                            {stats.slice(0, 3).map((stat, idx) => (
                                <div key={idx} className="text-center px-4 border-r border-white/5 last:border-0">
                                    <div className="text-2xl lg:text-3xl font-bold text-white tracking-tight font-heading">{stat.value}</div>
                                    <div className="text-sm text-slate-500 font-medium">{stat.label}</div>
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
                        <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 rounded-full blur-3xl animate-pulse" />
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.15)] group">
                            <img
                                src="/images/hero-space.png" // Deep Space Nebula
                                alt="Space AI Exploration"
                                className="w-full h-auto object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[2s]"
                            />
                            {/* Overlay gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-space-900/90 via-transparent to-transparent" />

                            {/* Floating badges */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5, duration: 0.5 }}
                                className="absolute bottom-8 left-8 right-8 flex justify-between items-end"
                            >
                                <div className="px-4 py-2 bg-space-800/80 backdrop-blur border border-neon-cyan/30 rounded-lg flex items-center gap-2 text-sm font-bold text-neon-cyan shadow-lg">
                                    <Activity className="w-4 h-4" />
                                    System Online
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>

            {/* Course Preview Section */}
            <section className="relative z-10 py-24 bg-space-800/30 border-y border-white/5">
                <div className="container mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl lg:text-5xl font-bold mb-4 font-heading">
                            Mission Objective:
                            <span className="text-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.5)]"> Mastery.</span>
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto font-light">
                            Everything you need to conquer AI in Class XII, organized for rapid learning.
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
                            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 rounded-3xl blur-xl group-hover:blur-2xl transition-all" />
                            <div className="relative bg-space-800/80 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden hover:border-neon-cyan/30 transition-colors">
                                {/* Course Header Image */}
                                <div className="relative h-72 overflow-hidden">
                                    <img
                                        src="/images/course-ai-space.png"
                                        alt="AI Course"
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-space-900 via-space-900/50 to-transparent" />
                                    <div className="absolute bottom-6 left-6">
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 bg-neon-cyan/20 border border-neon-cyan/30 text-neon-cyan rounded-md text-sm font-bold tracking-wider">CLASS XII</span>
                                            <span className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-md text-sm font-bold flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> LIVE
                                            </span>
                                        </div>
                                        <h3 className="text-3xl font-bold text-white font-heading">Artificial Intelligence</h3>
                                        <p className="text-slate-300 font-mono text-sm opacity-80">SUBJECT CODE: 843 // SYSTEM READY</p>
                                    </div>
                                </div>

                                {/* Course Content */}
                                <div className="p-8">
                                    <div className="grid grid-cols-4 gap-6 mb-8">
                                        {stats.map((stat, idx) => (
                                            <div key={idx} className="text-center py-4 bg-space-900/50 rounded-xl border border-white/5">
                                                <stat.icon className="w-6 h-6 mx-auto mb-2 text-neon-cyan" />
                                                <div className="text-xl font-bold font-heading">{stat.value}</div>
                                                <div className="text-xs text-slate-500">{stat.label}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        onClick={() => navigate('/courses/class-12-ai')}
                                        className="w-full py-4 bg-gradient-to-r from-neon-cyan to-nebula-end hover:brightness-110 rounded-xl font-bold text-lg text-black flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.2)]"
                                    >
                                        <Play className="w-5 h-5 fill-current" />
                                        Initialize Course
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="relative z-10 container mx-auto px-6 py-24">
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
                            <div className="relative p-8 bg-space-800/40 backdrop-blur border border-white/10 rounded-2xl hover:border-neon-cyan/30 transition-all hover:-translate-y-1">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 font-heading">{feature.title}</h3>
                                <p className="text-slate-400 font-light leading-relaxed">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 border-t border-white/10 py-12 bg-space-900">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <img src="/images/logo-rocket.png" alt="Logo" className="w-8 h-8 opacity-80" />
                            <span className="font-bold text-lg tracking-wide font-heading">Learn<span className="text-neon-cyan">AI</span></span>
                        </div>
                        <p className="text-slate-600 text-sm">
                            © {new Date().getFullYear()} LearnAI. Aakash Singh.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
