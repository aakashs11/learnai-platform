import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MoreVertical, Edit, Trash, BookOpen } from 'lucide-react'
import { dataProvider } from '../../lib/dataProvider'

// ... imports kept same ...
import { Plus, Search, MoreVertical, Edit, Trash, BookOpen, BarChart3 } from 'lucide-react'

// Skeleton Component
const CourseSkeleton = () => (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="h-40 bg-slate-200 dark:bg-slate-700 animate-pulse" />
        <div className="p-5 space-y-3">
            <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 animate-pulse" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-full animate-pulse" />
            <div className="h-4 bg-slate-100 dark:bg-slate-700/50 rounded w-1/2 animate-pulse" />
            <div className="pt-4 flex justify-between items-center">
                <div className="h-6 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            </div>
        </div>
    </div>
)

export default function CourseManager() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)

    // ... useEffect and loadCourses kept same ...
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

    // Loading State
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                    <div className="h-10 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map(i => <CourseSkeleton key={i} />)}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Courses</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage your curriculum and content</p>
                </div>
                <Link to="/creator" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-lg shadow-indigo-500/30">
                    <Plus className="w-5 h-5" />
                    New Course
                </Link>
            </div>

            {/* Search - Keeping existing implementation */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search courses..."
                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                />
            </div>

            {/* Empty State */}
            {!loading && courses.length === 0 && (
                <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                    <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No courses yet</h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
                        Get started by creating your first course from a PDF or scratch.
                    </p>
                    <Link to="/creator" className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-all shadow-xl shadow-indigo-500/20">
                        <Plus className="w-5 h-5" />
                        Create Course
                    </Link>
                </div>
            )}

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map(course => (
                    <div key={course.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                        <div className="h-48 bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                            {course.thumbnail ? (
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-800/50">
                                    <BookOpen className="w-12 h-12 opacity-30" />
                                </div>
                            )}

                            {/* Badges */}
                            <div className="absolute top-3 left-3 flex gap-2">
                                {course.is_published ? (
                                    <span className="px-2 py-1 text-xs font-bold bg-green-500/90 text-white backdrop-blur-sm rounded-md shadow-sm">
                                        Published
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 text-xs font-bold bg-slate-500/90 text-white backdrop-blur-sm rounded-md shadow-sm">
                                        Draft
                                    </span>
                                )}
                            </div>

                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button className="p-2 bg-white/90 dark:bg-slate-900/90 rounded-lg text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 shadow-sm backdrop-blur-sm">
                                    <MoreVertical className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="p-5">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">{course.title}</h3>
                            <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                                {course.description || "No description provided."}
                            </p>

                            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700/50">
                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                    <BarChart3 className="w-4 h-4" />
                                    <span>{course.lesson_count || 0} Lessons</span>
                                </div>
                                <Link
                                    to={`/admin/courses/${course.id}`}
                                    className="flex items-center gap-1.5 text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                >
                                    <Edit className="w-4 h-4" />
                                    Edit
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
