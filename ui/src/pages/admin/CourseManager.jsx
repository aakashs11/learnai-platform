import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MoreVertical, Edit, Trash, BookOpen } from 'lucide-react'
import { dataProvider } from '../../lib/dataProvider'

export default function CourseManager() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadCourses()
    }, [])

    const loadCourses = async () => {
        try {
            const data = await dataProvider.getCourses()
            setCourses(data)
        } catch (error) {
            console.error('Failed to load courses', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading courses...</div>

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Courses</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your curriculum and content</p>
                </div>
                <Link to="/creator" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                    <Plus className="w-5 h-5" />
                    New Course
                </Link>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="h-40 bg-slate-100 dark:bg-slate-700 relative">
                            {course.thumbnail ? (
                                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400">
                                    <BookOpen className="w-12 h-12 opacity-50" />
                                </div>
                            )}
                            <div className="absolute top-2 right-2">
                                <button className="p-1.5 bg-white/90 dark:bg-slate-900/90 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">{course.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4">
                                {course.description}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                <span className="text-xs font-medium px-2.5 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-full">
                                    Published
                                </span>
                                <Link
                                    to={`/admin/courses/${course.id}`}
                                    className="flex items-center gap-1 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit Content
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
