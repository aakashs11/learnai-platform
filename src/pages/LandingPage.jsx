import { motion } from 'framer-motion'
import { BookOpen, Code, Brain, Play, CheckCircle, ArrowRight, Sparkles, Users, Award } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { signInWithGoogle } from '../lib/supabase'

export default function LandingPage() {
    const navigate = useNavigate()
    const { isAuthenticated, loading } = useAuth()

    const handleGetStarted = async () => {
        if (isAuthenticated) {
            navigate('/courses')
        } else {
            const { error } = await signInWithGoogle()
            if (error) {
                console.error('Login error:', error)
                // For demo mode, just go to courses
                navigate('/courses')
            }
        }
    }

    const handleExploreCourses = () => {
        navigate('/courses')
    }

    const features = [
        {
            icon: Code,
            title: 'Interactive Python',
            description: 'Run code directly in your browser with NumPy, Pandas & Matplotlib support',
            color: 'from-cyan-400 to-blue-500'
        },
        {
            icon: Brain,
            title: 'AI-Powered Learning',
            description: 'Content adapts to your pace with inline quizzes and comprehension checks',
            color: 'from-purple-400 to-pink-500'
        },
        {
            icon: BookOpen,
            title: 'CBSE Aligned',
            description: 'Complete curriculum with direct PDF handbook references',
            color: 'from-emerald-400 to-teal-500'
        },
        {
            icon: Award,
            title: 'Track Progress',
            description: 'Earn XP, maintain streaks, and track your learning journey',
            color: 'from-amber-400 to-orange-500'
        }
    ]

    const courses = [
        { title: 'AI Class XII', lessons: 14, duration: '8 hrs', badge: 'CBSE 843' },
        { title: 'AI Class XI', lessons: 12, duration: '6 hrs', badge: 'Coming Soon' },
        { title: 'Python Basics', lessons: 10, duration: '5 hrs', badge: 'Coming Soon' }
    ]

    const stats = [
        { value: '14+', label: 'Interactive Lessons' },
        { value: '100+', label: 'Code Examples' },
        { value: '50+', label: 'Practice Questions' }
    ]

    return (
        <div className="min-h-screen bg-slate-950 text-white overflow-hidden">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-indigo-500/5 to-transparent rounded-full" />
            </div>

            {/* Header */}
            <header className="relative z-10 container mx-auto px-6 py-6">
                <nav className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                            LearnAI
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleExploreCourses}
                            className="text-slate-300 hover:text-white transition-colors"
                        >
                            Courses
                        </button>
                        {!loading && (
                            <button
                                onClick={handleGetStarted}
                                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/20 transition-all"
                            >
                                {isAuthenticated ? 'Dashboard' : 'Sign In'}
                            </button>
                        )}
                    </div>
                </nav>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 container mx-auto px-6 pt-16 pb-24">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/20 rounded-full border border-indigo-500/30 mb-6">
                            <span className="text-indigo-400 text-sm font-medium">🎓 CBSE Class XII AI Curriculum</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                            Learn AI with
                            <span className="block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                Interactive Lessons
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10">
                            Master Artificial Intelligence with hands-on Python coding, interactive quizzes,
                            and visual explanations. Everything you need to ace your exams.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <button
                            onClick={handleGetStarted}
                            className="group px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-semibold text-lg transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 flex items-center gap-2"
                        >
                            Start Learning Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <button
                            onClick={handleExploreCourses}
                            className="px-8 py-4 bg-white/5 hover:bg-white/10 rounded-xl font-semibold text-lg border border-white/10 transition-all flex items-center gap-2"
                        >
                            <Play className="w-5 h-5" />
                            Explore Courses
                        </button>
                    </motion.div>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="flex justify-center gap-12 mt-16"
                    >
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-3xl font-bold text-white">{stat.value}</div>
                                <div className="text-sm text-slate-500">{stat.label}</div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="relative z-10 container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Everything you need to
                        <span className="text-indigo-400"> master AI</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Our platform combines the best of interactive learning with CBSE curriculum standards
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="group p-6 bg-slate-900/50 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all hover:-translate-y-1"
                        >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                                <feature.icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-slate-400 text-sm">{feature.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Course Preview */}
            <section className="relative z-10 container mx-auto px-6 py-24">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Available Courses
                    </h2>
                    <p className="text-slate-400">Start with AI Class XII, more coming soon!</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {courses.map((course, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`p-6 rounded-2xl border transition-all ${idx === 0
                                    ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-indigo-500/30 hover:border-indigo-500/50'
                                    : 'bg-slate-900/50 border-slate-800 opacity-60'
                                }`}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-xs font-medium px-2 py-1 rounded ${idx === 0 ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-800 text-slate-500'
                                    }`}>
                                    {course.badge}
                                </span>
                                {idx === 0 && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                                <span>{course.lessons} lessons</span>
                                <span>•</span>
                                <span>{course.duration}</span>
                            </div>
                            {idx === 0 && (
                                <button
                                    onClick={handleExploreCourses}
                                    className="mt-4 w-full py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition-colors"
                                >
                                    Start Course
                                </button>
                            )}
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="relative z-10 container mx-auto px-6 py-24">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 to-purple-700 p-12 text-center"
                >
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiIHN0cm9rZS13aWR0aD0iMiIvPjwvZz48L3N2Zz4=')] opacity-30" />

                    <div className="relative">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            Ready to start your AI journey?
                        </h2>
                        <p className="text-indigo-100 mb-8 max-w-xl mx-auto">
                            Join thousands of students learning AI with our interactive platform.
                            It's free to get started!
                        </p>
                        <button
                            onClick={handleGetStarted}
                            className="px-8 py-4 bg-white text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold text-lg transition-all shadow-lg flex items-center gap-2 mx-auto"
                        >
                            <Users className="w-5 h-5" />
                            Get Started Free
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
                            <span className="font-semibold">LearnAI</span>
                        </div>
                        <p className="text-slate-500 text-sm">
                            © 2024 LearnAI. Made with ❤️ for students.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
