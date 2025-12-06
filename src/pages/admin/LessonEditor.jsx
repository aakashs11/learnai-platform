import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Save, ArrowLeft, Play, Layout, Image as ImageIcon, HelpCircle } from 'lucide-react'
import { dataProvider } from '../../lib/dataProvider'
import VideoPlayer from '../../components/VideoPlayer'

export default function LessonEditor() {
    const { lessonId } = useParams()
    const navigate = useNavigate()
    const [lesson, setLesson] = useState(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('content') // content, video, quiz

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
            // Show success toast (mock)
            alert('Lesson saved successfully!')
        } catch (error) {
            alert('Failed to save lesson')
        } finally {
            setSaving(false)
        }
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
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                    <Save className="w-4 h-4" />
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 dark:border-slate-700">
                {[
                    { id: 'content', label: 'Theory Content', icon: Layout },
                    { id: 'video', label: 'Video Integration', icon: Play },
                    { id: 'quiz', label: 'Quiz & Assessment', icon: HelpCircle },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
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
                                    className="flex-1 px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
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
                        {/* Theory Sections Editor (Simplified) */}
                        {lesson.theory?.map((section, idx) => (
                            <div key={idx} className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-4">
                                <div className="flex justify-between">
                                    <h3 className="font-medium text-slate-900 dark:text-white">Section {idx + 1}</h3>
                                    <button className="text-red-500 hover:text-red-600 text-sm">Remove</button>
                                </div>
                                <input
                                    type="text"
                                    value={section.title}
                                    onChange={e => {
                                        const newTheory = [...lesson.theory]
                                        newTheory[idx].title = e.target.value
                                        setLesson({ ...lesson, theory: newTheory })
                                    }}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg"
                                    placeholder="Section Title"
                                />
                                <textarea
                                    value={section.content}
                                    onChange={e => {
                                        const newTheory = [...lesson.theory]
                                        newTheory[idx].content = e.target.value
                                        setLesson({ ...lesson, theory: newTheory })
                                    }}
                                    rows={5}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm"
                                    placeholder="Content (Markdown supported)"
                                />

                                {/* Diagram Editor */}
                                <div>
                                    <label className="text-xs font-medium text-slate-500 uppercase mb-1 block">Mermaid Diagram Code</label>
                                    <textarea
                                        value={section.diagram?.code || ''}
                                        onChange={e => {
                                            const newTheory = [...lesson.theory]
                                            if (!newTheory[idx].diagram) newTheory[idx].diagram = { title: 'Diagram', code: '' }
                                            newTheory[idx].diagram.code = e.target.value
                                            setLesson({ ...lesson, theory: newTheory })
                                        }}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-900 text-emerald-400 border border-slate-700 rounded-lg font-mono text-xs"
                                        placeholder="graph TD; A-->B;"
                                    />
                                </div>
                            </div>
                        ))}
                        <button
                            onClick={() => setLesson({ ...lesson, theory: [...(lesson.theory || []), { title: 'New Section', content: '', type: 'concept' }] })}
                            className="w-full py-3 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-slate-500 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                        >
                            + Add Theory Section
                        </button>
                    </div>
                )}

                {activeTab === 'quiz' && (
                    <div className="text-center py-12 text-slate-500">
                        <HelpCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Quiz Editor coming soon...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
