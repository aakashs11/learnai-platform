import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Plus, GripVertical, Video, FileText, HelpCircle, ArrowLeft } from 'lucide-react'
import { dataProvider } from '../../lib/dataProvider'
import AddLessonModal from './AddLessonModal'

export default function CourseDetail() {
    const { courseId } = useParams()
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        loadLessons()
    }, [courseId])

    const loadLessons = async () => {
        try {
            const data = await dataProvider.getLessons(courseId)
            setLessons(data)
        } catch (error) {
            console.error('Failed to load lessons', error)
        } finally {
            setLoading(false)
        }
    }

    const handleCreateLesson = async (lessonData) => {
        const newLesson = await dataProvider.createLesson(lessonData)
        setLessons(prev => [...prev, newLesson].sort((a, b) => a.lesson_number - b.lesson_number))
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading lessons...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Link to="/admin/courses" className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Course Content</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage lessons and structure</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="ml-auto flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add Lesson
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {lessons.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 dark:text-slate-400">
                            No lessons yet. Click "Add Lesson" to create one.
                        </div>
                    ) : lessons.map((lesson, index) => (
                        <div key={lesson.id} className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                            <button className="cursor-grab text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                                <GripVertical className="w-5 h-5" />
                            </button>

                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                                {lesson.lesson_number || index + 1}
                            </div>

                            <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-slate-900 dark:text-white truncate">{lesson.title}</h3>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                        <Video className="w-3 h-3" />
                                        {lesson.video_id ? 'Video' : 'No Video'}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                        <FileText className="w-3 h-3" />
                                        {lesson.unit_title || 'General'}
                                    </span>
                                </div>
                            </div>

                            <Link
                                to={`/admin/lesson/${lesson.id}`}
                                className="px-3 py-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-lg transition-colors"
                            >
                                Edit
                            </Link>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Lesson Modal */}
            {showAddModal && (
                <AddLessonModal
                    courseId={courseId}
                    onClose={() => setShowAddModal(false)}
                    onSave={handleCreateLesson}
                />
            )}
        </div>
    )
}

