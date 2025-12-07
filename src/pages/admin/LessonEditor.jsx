import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Play, Layout, Image as ImageIcon, HelpCircle, Code, Plus, Trash } from 'lucide-react'
import { dataProvider } from '../../lib/dataProvider'
import VideoPlayer from '../../components/VideoPlayer'

export default function LessonEditor() {
    const { lessonId } = useParams()
    const navigate = useNavigate()
    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('content') // content, video, code, quiz

    useEffect(() => {
        loadLesson()
    }, [lessonId])

    const loadLesson = async () => {
        try {
            const data = await dataProvider.getLesson(lessonId)
            setLesson(data)
        } catch (error) {
            console.error('Failed to load lesson', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        setSaving(true)
        try {
            await dataProvider.updateLesson(lessonId, lesson)
            console.log('--- UPDATED LESSON JSON ---')
            console.log(JSON.stringify(lesson, null, 2))
            // Show success toast (mock)
            alert('Lesson saved! (Check Console for JSON)')
        } catch (error) {
            alert('Failed to save lesson')
        } finally {
            setSaving(false)
        }
    }

    const updateTheoryBlock = (idx, updates) => {
        const newTheory = [...lesson.theory]
        newTheory[idx] = { ...newTheory[idx], ...updates }
        setLesson({ ...lesson, theory: newTheory })
    }

    const addTheoryBlock = (type) => {
        const newBlock = type === 'code'
            ? { type: 'code', code: '# Write your Python code here\nprint("Hello AI")', language: 'python' }
            : { type: 'text', content: 'New content section', title: 'New Section' }

        setLesson({ ...lesson, theory: [...(lesson.theory || []), newBlock] })
    }

    const removeTheoryBlock = (idx) => {
        const newTheory = lesson.theory.filter((_, i) => i !== idx)
        setLesson({ ...lesson, theory: newTheory })
    }

    if (loading) return <div className="p-8 text-center text-slate-500">Loading editor...</div>
    if (!lesson) return <div className="p-8 text-center text-red-500">Lesson not found</div>

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-slate-50 dark:bg-slate-900 py-4 z-10">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5 text-slate-500" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Edit Lesson</h1>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{lesson.title}</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(JSON.stringify(lesson, null, 2))
                            alert('JSON copied! Paste this into ui/public/lessons.json to save permanently.')
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-lg transition-colors font-mono text-sm"
                    >
                        <span className="hidden sm:inline">Copy JSON</span>
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700 overflow-x-auto">
                {[
                    { id: 'content', label: 'Theory Content', icon: Layout },
                    { id: 'code', label: 'Interactive Code', icon: Code },
                    { id: 'video', label: 'Video Integration', icon: Play },
                    { id: 'quiz', label: 'Quiz & Assessment', icon: HelpCircle },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                            : 'border-transparent text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 min-h-[500px]">
                {activeTab === 'video' && (
                    <div className="space-y-6 max-w-2xl">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                YouTube Video ID
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={lesson.videoId || ''}
                                    onChange={e => setLesson({ ...lesson, videoId: e.target.value })}
                                    placeholder="e.g. dQw4w9WgXcQ"
                                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                />
                            </div>
                            <p className="text-xs text-slate-500 mt-2">
                                Enter the 11-character ID from the YouTube URL (v=...)
                            </p>
                        </div>

                        {lesson.videoId && (
                            <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                                <VideoPlayer videoId={lesson.videoId} title="Preview" />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'content' && (
                    <div className="space-y-6">
                        {/* Theory Sections Editor */}
                        {lesson.theory?.map((section, idx) => {
                            if (section.type === 'code') return null // Skip code blocks here

                            return (
                                <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4">
                                    <div className="flex justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-slate-100 dark:bg-slate-700 text-xs font-bold px-2 py-1 rounded text-slate-500">
                                                BLOCK {idx + 1}
                                            </span>
                                            <h3 className="font-medium text-slate-900 dark:text-white">
                                                {section.title || 'Untitled Section'}
                                            </h3>
                                        </div>
                                        <button onClick={() => removeTheoryBlock(idx)} className="text-red-500 hover:text-red-600 text-sm">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <input
                                        type="text"
                                        value={section.title || ''}
                                        onChange={e => updateTheoryBlock(idx, { title: e.target.value })}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg dark:text-white"
                                        placeholder="Section Title"
                                    />
                                    <textarea
                                        value={section.content || ''}
                                        onChange={e => updateTheoryBlock(idx, { content: e.target.value })}
                                        rows={5}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm dark:text-white"
                                        placeholder="Content (Markdown supported)"
                                    />
                                </div>
                            )
                        })}
                        <button
                            onClick={() => addTheoryBlock('text')}
                            className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors flex items-center justify-center gap-2"
                        >
                            <Plus className="w-4 h-4" />
                            Add Theory Section
                        </button>
                    </div>
                )}

                {activeTab === 'code' && (
                    <div className="space-y-6">
                        <div className="bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800 mb-6">
                            <p className="text-sm text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
                                <Code className="w-4 h-4" />
                                Add Python code blocks here. They will appear as interactive executable cells in the lesson.
                            </p>
                        </div>

                        {lesson.theory?.map((section, idx) => {
                            if (section.type !== 'code') return null

                            return (
                                <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4 bg-slate-50 dark:bg-slate-900/50">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-indigo-100 dark:bg-indigo-900 text-xs font-bold px-2 py-1 rounded text-indigo-600 dark:text-indigo-400">
                                                PYTHON BLOCK {idx + 1}
                                            </span>
                                        </div>
                                        <button onClick={() => removeTheoryBlock(idx)} className="text-red-500 hover:text-red-600 text-sm">
                                            <Trash className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Language</label>
                                            <select
                                                value={section.language || 'python'}
                                                onChange={e => updateTheoryBlock(idx, { language: e.target.value })}
                                                className="px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm dark:text-white"
                                            >
                                                <option value="python">Python 3 (Pyodide)</option>
                                                <option value="sql">SQL (SQLite)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-medium text-slate-500 mb-1 block">Code Content</label>
                                            <textarea
                                                value={section.code || ''}
                                                onChange={e => updateTheoryBlock(idx, { code: e.target.value })}
                                                rows={8}
                                                className="w-full px-4 py-3 bg-slate-900 text-emerald-400 border border-slate-700 rounded-lg font-mono text-sm leading-relaxed"
                                                placeholder="print('Hello World')"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}

                        <button
                            onClick={() => addTheoryBlock('code')}
                            className="w-full py-3 border-2 border-dashed border-indigo-300 dark:border-indigo-800 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-colors flex items-center justify-center gap-2"
                        >
                            <Code className="w-4 h-4" />
                            Add Python Code Block
                        </button>
                    </div>
                )}

                {activeTab === 'quiz' && (
                    <div className="text-center py-12 text-slate-500">
                        <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Quiz Editor coming soon...</p>
                        <p className="text-sm mt-2">Use the Question Bank to create questions first.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
