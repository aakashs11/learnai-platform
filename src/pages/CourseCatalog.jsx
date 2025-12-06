import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { BookOpen, Clock, ChevronRight, Sparkles, ArrowLeft, Search, Filter } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function CourseCatalog() {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedClass, setSelectedClass] = useState('all')

    useEffect(() => {
        // For now, load static courses. Later this will come from Supabase
        setCourses([
            {
                id: 'class-12-ai',
                title: 'AI Class XII',
                subtitle: 'Artificial Intelligence - CBSE Subject Code 843',
                description: 'Complete AI curriculum covering Python, NumPy, Pandas, Machine Learning, Neural Networks, and more.',
                classLevel: '12',
                subject: 'AI',
                thumbnail: null,
                lessonCount: 14,
                duration: '8 hours',
                isPublished: true,
                hasPython: true,
                progress: 0
            },
            {
                id: 'class-11-ai',
                title: 'AI Class XI',
                subtitle: 'Artificial Intelligence Foundation',
                description: 'Introduction to AI concepts, Python programming basics, and data handling.',
                classLevel: '11',
                subject: 'AI',
                thumbnail: null,
                lessonCount: 12,
                duration: '6 hours',
                isPublished: false,
                hasPython: true,
                progress: 0
            },
            {
                id: 'python-basics',
                title: 'Python Programming',
                subtitle: 'Learn Python from scratch',
                description: 'Master Python programming with hands-on exercises and projects.',
                classLevel: 'all',
                subject: 'Python',
                thumbnail: null,
                lessonCount: 10,
                duration: '5 hours',
                isPublished: false,
                hasPython: true,
                progress: 0
            }
        ])
        setLoading(false)
    }, [])

    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.description.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesClass = selectedClass === 'all' || course.classLevel === selectedClass
        return matchesSearch && matchesClass
    })

    const handleCourseClick = (course) => {
        if (course.isPublished) {
            navigate(`/courses/${course.id}`)
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
            </div>

            {/* Header */}
            <header className="relative z-10 border-b border-slate-800 bg-slate-950/80 backdrop-blur-lg sticky top-0">
                <div className="container mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                <span className="hidden sm:inline">Home</span>
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                                    <Sparkles className="w-5 h-5 text-white" />
                                </div>
                                <span className="text-lg font-bold">LearnAI</span>
                            </div>
                        </div>

                        {user ? (
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-500">{user.email}</span>
                                <button
                                    onClick={signOut}
                                    className="text-sm text-slate-500 hover:text-white transition-colors"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg text-sm font-medium transition-colors"
                            >
                                Sign In
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="relative z-10 container mx-auto px-6 py-12">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold mb-4">Course Catalog</h1>
                    <p className="text-slate-500">Choose a course to start your learning journey</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Search courses..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div className="flex gap-2">
                        {['all', '10', '11', '12'].map((level) => (
                            <button
                                key={level}
                                onClick={() => setSelectedClass(level)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedClass === level
                                        ? 'bg-indigo-500 text-white'
                                        : 'bg-slate-900/50 text-slate-500 hover:text-white border border-slate-800'
                                    }`}
                            >
                                {level === 'all' ? 'All' : `Class ${level}`}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Course Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourses.map((course, idx) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: idx * 0.1 }}
                                onClick={() => handleCourseClick(course)}
                                className={`group relative overflow-hidden rounded-2xl border transition-all ${course.isPublished
                                        ? 'bg-slate-900/50 border-slate-800 hover:border-indigo-500/50 cursor-pointer hover:-translate-y-1'
                                        : 'bg-slate-900/30 border-slate-800/50 opacity-60'
                                    }`}
                            >
                                {/* Thumbnail placeholder */}
                                <div className={`h-40 bg-gradient-to-br ${course.subject === 'AI'
                                        ? 'from-indigo-500/20 to-purple-500/20'
                                        : 'from-emerald-500/20 to-teal-500/20'
                                    } flex items-center justify-center`}>
                                    <BookOpen className="w-16 h-16 text-white/20" />
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Badges */}
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className={`text-xs font-medium px-2 py-1 rounded ${course.isPublished
                                                ? 'bg-emerald-500/20 text-emerald-400'
                                                : 'bg-slate-800 text-slate-600'
                                            }`}>
                                            {course.isPublished ? `Class ${course.classLevel}` : 'Coming Soon'}
                                        </span>
                                        {course.hasPython && (
                                            <span className="text-xs font-medium px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                                Python
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-xl font-semibold mb-1">{course.title}</h3>
                                    <p className="text-sm text-slate-600 mb-3">{course.subtitle}</p>
                                    <p className="text-sm text-slate-500 line-clamp-2 mb-4">{course.description}</p>

                                    {/* Meta */}
                                    <div className="flex items-center justify-between text-sm text-slate-600">
                                        <div className="flex items-center gap-4">
                                            <span className="flex items-center gap-1">
                                                <BookOpen className="w-4 h-4" />
                                                {course.lessonCount} lessons
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                {course.duration}
                                            </span>
                                        </div>
                                        {course.isPublished && (
                                            <ChevronRight className="w-5 h-5 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </div>

                                    {/* Progress bar (if enrolled) */}
                                    {course.progress > 0 && (
                                        <div className="mt-4">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span className="text-slate-500">Progress</span>
                                                <span className="text-indigo-400">{course.progress}%</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                                    style={{ width: `${course.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {filteredCourses.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <p className="text-slate-500">No courses found matching your criteria.</p>
                    </div>
                )}
            </main>
        </div>
    )
}
