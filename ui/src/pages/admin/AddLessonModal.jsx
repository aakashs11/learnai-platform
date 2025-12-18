import { useState } from 'react'
import { X, Plus } from 'lucide-react'

export default function AddLessonModal({ courseId, onClose, onSave }) {
    const [formData, setFormData] = useState({
        title: '',
        unitTitle: '',
        lessonNumber: '',
        videoId: ''
    })
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!formData.title.trim()) {
            alert('Lesson title is required')
            return
        }

        setLoading(true)
        try {
            await onSave({
                courseId,
                title: formData.title.trim(),
                unitTitle: formData.unitTitle.trim() || 'General',
                lessonNumber: parseInt(formData.lessonNumber) || 99,
                videoId: formData.videoId.trim() || null
            })
            onClose()
        } catch (error) {
            console.error('Failed to create lesson:', error)
            alert('Failed to create lesson. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Create New Lesson</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {/* Title */}
                    <div>
                        <label htmlFor="lesson-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Lesson Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="lesson-title"
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. Introduction to Machine Learning"
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </div>

                    {/* Unit Title */}
                    <div>
                        <label htmlFor="unit-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Unit / Chapter
                        </label>
                        <input
                            id="unit-title"
                            type="text"
                            value={formData.unitTitle}
                            onChange={e => setFormData({ ...formData, unitTitle: e.target.value })}
                            placeholder="e.g. Unit 2: Data Science Methodology"
                            className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Lesson Number */}
                        <div>
                            <label htmlFor="lesson-number" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Lesson Number
                            </label>
                            <input
                                id="lesson-number"
                                type="number"
                                min="1"
                                value={formData.lessonNumber}
                                onChange={e => setFormData({ ...formData, lessonNumber: e.target.value })}
                                placeholder="e.g. 5"
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>

                        {/* Video ID */}
                        <div>
                            <label htmlFor="video-id" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                YouTube Video ID
                            </label>
                            <input
                                id="video-id"
                                type="text"
                                value={formData.videoId}
                                onChange={e => setFormData({ ...formData, videoId: e.target.value })}
                                placeholder="e.g. dQw4w9WgXcQ"
                                className="w-full px-4 py-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
                            />
                        </div>
                    </div>

                    {/* Info Tip */}
                    <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800">
                        <p className="text-xs text-indigo-700 dark:text-indigo-300">
                            After creating the lesson, you can add content blocks (text, code, quizzes) in the Lesson Editor.
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            {loading ? 'Creating...' : 'Create Lesson'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
