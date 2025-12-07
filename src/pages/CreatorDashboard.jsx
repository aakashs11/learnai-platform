import React, { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    Upload, FileText, Loader2, CheckCircle, AlertCircle,
    ArrowRight, Sparkles, BookOpen, X, Settings
} from 'lucide-react'
import { Header } from '../components/shared'
import { processPdfToCourse } from '../lib/pdfCourseGenerator'

const COURSE_TEMPLATES = [
    { id: 'ai-cbse', name: 'AI (CBSE)', icon: '🤖', subjects: ['AI', 'ML', 'Python'] },
    { id: 'python', name: 'Python Programming', icon: '🐍', subjects: ['Python'] },
    { id: 'custom', name: 'Custom Course', icon: '📚', subjects: [] }
]

const CLASS_LEVELS = ['10', '11', '12', 'College', 'Professional']

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false, error: null }
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error }
    }
    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h2 className="text-red-500 font-bold text-xl">Something went wrong</h2>
                    <pre className="text-left mt-4 text-sm bg-slate-900 text-slate-300 p-4 rounded overflow-auto">
                        {this.state.error.toString()}
                    </pre>
                </div>
            )
        }
        return this.props.children
    }
}

export default function CreatorDashboardWrapper() {
    return (
        <ErrorBoundary>
            <CreatorDashboard />
        </ErrorBoundary>
    )
}

function CreatorDashboard() {
    const navigate = useNavigate()
    const [step, setStep] = useState(1) // 1: Upload, 2: Configure, 3: Processing, 4: Review

    const [pdfFile, setPdfFile] = useState(null)
    const [pdfPreview, setPdfPreview] = useState(null)
    const [config, setConfig] = useState({
        title: '',
        template: 'ai-cbse',
        classLevel: '12',
        generateQuestions: true,
        generateDiagrams: true,
        extractCode: true
    })
    const [processing, setProcessing] = useState({
        status: 'idle', // idle, uploading, parsing, generating, complete, error
        progress: 0,
        currentStep: '',
        results: null
    })
    const [dragActive, setDragActive] = useState(false)

    // Handle file drop
    const handleDrop = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        const file = e.dataTransfer?.files?.[0] || e.target?.files?.[0]
        if (file && file.type === 'application/pdf') {
            setPdfFile(file)
            setPdfPreview(URL.createObjectURL(file))
            // Auto-fill title from filename
            const title = file.name.replace('.pdf', '').replace(/[-_]/g, ' ')
            setConfig(prev => ({ ...prev, title }))
            setStep(2)
        }
    }, [])

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
    }, [])

    // Process PDF and generate content
    const handleGenerate = async () => {
        setStep(3)
        setProcessing({ status: 'uploading', progress: 10, currentStep: 'Reading PDF file...', results: null })

        try {
            // Step 1: Read PDF
            const arrayBuffer = await pdfFile.arrayBuffer()
            setProcessing(p => ({ ...p, progress: 30, currentStep: 'Extracting text and structure...' }))

            // Step 2: Process PDF with generator
            const result = await processPdfToCourse(arrayBuffer)

            if (!result.success) {
                throw new Error(result.error || 'Failed to process PDF')
            }

            setProcessing(p => ({ ...p, status: 'generating', progress: 70, currentStep: 'Generating interactive elements...' }))

            // Step 3: Simulate AI enhancement (since we don't have real AI API yet)
            await new Promise(r => setTimeout(r, 1500))

            // Step 4: Finalize
            const finalResults = {
                courseId: `course-${Date.now()}`,
                title: config.title,
                unitsCount: result.unitsDetected,
                lessonsCount: result.lessons.length,
                questionsCount: result.lessons.reduce((acc, l) => acc + (l.quiz?.questions?.length || 0), 0),
                diagramsCount: result.lessons.reduce((acc, l) => acc + (l.suggestedDiagrams?.length || 0), 0),
                units: result.lessons.reduce((acc, lesson) => {
                    const unit = acc.find(u => u.number === lesson.unit.number)
                    if (unit) {
                        unit.lessons++
                    } else {
                        acc.push({
                            number: lesson.unit.number,
                            title: lesson.unit.title,
                            lessons: 1
                        })
                    }
                    return acc
                }, []),
                rawData: result // Store full data for saving
            }

            setProcessing({
                status: 'complete',
                progress: 100,
                currentStep: 'Complete!',
                results: finalResults
            })
            setStep(4)

        } catch (error) {
            console.error(error)
            setProcessing({
                status: 'error',
                progress: 0,
                currentStep: `Error: ${error.message}`,
                results: null
            })
        }
    }

    return (
        <div className="min-h-screen bg-slate-950 text-white">
            <Header title="Create New Course" showBack backTo="/courses" backLabel="Courses" />

            <main className="max-w-4xl mx-auto px-6 py-12">
                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    {[
                        { num: 1, label: 'Upload PDF' },
                        { num: 2, label: 'Configure' },
                        { num: 3, label: 'Generate' },
                        { num: 4, label: 'Review' }
                    ].map((s, idx) => (
                        <div key={s.num} className="flex items-center">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium text-sm transition-all ${step >= s.num
                                ? 'bg-indigo-500 text-white'
                                : 'bg-slate-800 text-slate-600'
                                }`}>
                                {step > s.num ? <CheckCircle className="w-5 h-5" /> : s.num}
                            </div>
                            <span className={`ml-2 text-sm ${step >= s.num ? 'text-white' : 'text-slate-600'}`}>
                                {s.label}
                            </span>
                            {idx < 3 && <div className={`w-12 h-0.5 mx-4 ${step > s.num ? 'bg-indigo-500' : 'bg-slate-800'}`} />}
                        </div>
                    ))}
                </div>

                {/* Step 1: Upload PDF */}
                {step === 1 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">Upload Your PDF Handbook</h2>
                            <p className="text-slate-500">We'll automatically extract content and create interactive lessons</p>
                        </div>

                        <div
                            onDrop={handleDrop}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragActive
                                ? 'border-indigo-500 bg-indigo-500/10'
                                : 'border-slate-700 hover:border-slate-600'
                                }`}
                        >
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleDrop}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <Upload className={`w-12 h-12 mx-auto mb-4 ${dragActive ? 'text-indigo-400' : 'text-slate-600'}`} />
                            <p className="text-lg font-medium mb-1">
                                {dragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here'}
                            </p>
                            <p className="text-slate-600 text-sm">or click to browse</p>
                        </div>

                        <div className="mt-8 grid grid-cols-3 gap-4">
                            {['Class 10 AI', 'Class 11 Python', 'Custom PDF'].map((example, idx) => (
                                <div key={idx} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
                                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                    <span className="text-sm text-slate-500">{example}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step 2: Configure */}
                {step === 2 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold mb-2">Configure Your Course</h2>
                            <p className="text-slate-500">Customize how content is generated</p>
                        </div>

                        {/* PDF Preview */}
                        <div className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800">
                            <div className="w-16 h-20 bg-slate-800 rounded-lg flex items-center justify-center">
                                <FileText className="w-8 h-8 text-slate-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-white">{pdfFile?.name}</p>
                                <p className="text-sm text-slate-600">{(pdfFile?.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button
                                onClick={() => { setPdfFile(null); setStep(1); }}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-slate-500" />
                            </button>
                        </div>

                        {/* Course Title */}
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Course Title</label>
                            <input
                                type="text"
                                value={config.title}
                                onChange={(e) => setConfig(p => ({ ...p, title: e.target.value }))}
                                placeholder="e.g., AI Class XII"
                                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                            />
                        </div>

                        {/* Template Selection */}
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Course Template</label>
                            <div className="grid grid-cols-3 gap-4">
                                {COURSE_TEMPLATES.map(template => (
                                    <button
                                        key={template.id}
                                        onClick={() => setConfig(p => ({ ...p, template: template.id }))}
                                        className={`p-4 rounded-xl border text-left transition-all ${config.template === template.id
                                            ? 'bg-indigo-500/20 border-indigo-500/50'
                                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                                            }`}
                                    >
                                        <span className="text-2xl">{template.icon}</span>
                                        <p className="font-medium mt-2">{template.name}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Class Level */}
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Class Level</label>
                            <div className="flex gap-2">
                                {CLASS_LEVELS.map(level => (
                                    <button
                                        key={level}
                                        onClick={() => setConfig(p => ({ ...p, classLevel: level }))}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${config.classLevel === level
                                            ? 'bg-indigo-500 text-white'
                                            : 'bg-slate-800 text-slate-500 hover:text-white'
                                            }`}
                                    >
                                        {level}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Generation Options */}
                        <div>
                            <label className="block text-sm font-medium text-slate-500 mb-2">Generation Options</label>
                            <div className="space-y-3">
                                {[
                                    { key: 'generateQuestions', label: 'Generate inline questions', desc: '5-7 comprehension checks per lesson' },
                                    { key: 'generateDiagrams', label: 'Generate visual diagrams', desc: 'Concept maps and flowcharts' },
                                    { key: 'extractCode', label: 'Extract code examples', desc: 'Find and format Python code' }
                                ].map(option => (
                                    <label
                                        key={option.key}
                                        className="flex items-center gap-4 p-4 bg-slate-900/50 rounded-xl border border-slate-800 cursor-pointer hover:border-slate-700"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={config[option.key]}
                                            onChange={(e) => setConfig(p => ({ ...p, [option.key]: e.target.checked }))}
                                            className="w-5 h-5 rounded border-slate-600 text-indigo-500 focus:ring-indigo-500"
                                        />
                                        <div>
                                            <p className="font-medium text-white">{option.label}</p>
                                            <p className="text-sm text-slate-600">{option.desc}</p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Generate Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={!config.title}
                            className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all"
                        >
                            <Sparkles className="w-5 h-5" />
                            Generate Course Content
                        </button>
                    </motion.div>
                )}

                {/* Step 3: Processing */}
                {step === 3 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                    >
                        <div className="w-20 h-20 mx-auto mb-6 relative">
                            <div className="absolute inset-0 rounded-full border-4 border-slate-800" />
                            <svg className="w-20 h-20 -rotate-90">
                                <circle
                                    cx="40"
                                    cy="40"
                                    r="36"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                    fill="none"
                                    className="text-indigo-500"
                                    strokeDasharray={`${processing.progress * 2.26} 226`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold mb-2">Generating Your Course</h2>
                        <p className="text-slate-500 mb-8">{processing.currentStep}</p>

                        {/* Progress Steps */}
                        <div className="max-w-md mx-auto space-y-3">
                            {[
                                { label: 'Upload PDF', done: processing.progress >= 20 },
                                { label: 'Extract text', done: processing.progress >= 40 },
                                { label: 'Identify sections', done: processing.progress >= 60 },
                                { label: 'Generate content', done: processing.progress >= 80 },
                                { label: 'Create questions & diagrams', done: processing.progress >= 100 }
                            ].map((s, idx) => (
                                <div key={idx} className={`flex items-center gap-3 text-left ${s.done ? 'text-white' : 'text-slate-600'}`}>
                                    {s.done ? (
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    ) : (
                                        <div className="w-5 h-5 rounded-full border-2 border-slate-700" />
                                    )}
                                    <span>{s.label}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Step 4: Review Results */}
                {step === 4 && processing.results && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-8"
                    >
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/20 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-emerald-400" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">Course Generated!</h2>
                            <p className="text-slate-500">Review and publish your new course</p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            {[
                                { label: 'Units', value: processing.results.unitsCount, icon: BookOpen },
                                { label: 'Lessons', value: processing.results.lessonsCount, icon: FileText },
                                { label: 'Questions', value: processing.results.questionsCount, icon: Settings },
                                { label: 'Diagrams', value: processing.results.diagramsCount, icon: Sparkles }
                            ].map((stat, idx) => (
                                <div key={idx} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 text-center">
                                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-indigo-400" />
                                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                                    <div className="text-sm text-slate-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        {/* Units Preview */}
                        <div>
                            <h3 className="text-lg font-semibold mb-4">Generated Units</h3>
                            <div className="space-y-2">
                                {processing.results.units.map((unit, idx) => (
                                    <div key={idx} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 bg-indigo-500/20 rounded-lg flex items-center justify-center text-indigo-400 font-medium">
                                                {unit.number}
                                            </span>
                                            <span className="font-medium">{unit.title}</span>
                                        </div>
                                        <span className="text-sm text-slate-600">{unit.lessons} lessons</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-medium transition-colors"
                            >
                                Edit Configuration
                            </button>
                            <button
                                onClick={() => navigate(`/courses/${processing.results.courseId}`)}
                                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                            >
                                Preview Course
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </main>
        </div>
    )
}
