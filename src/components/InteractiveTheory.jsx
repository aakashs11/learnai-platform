import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Lightbulb, BookOpen, CheckCircle, XCircle, ExternalLink, Brain, Zap, Target, HelpCircle } from 'lucide-react'

/**
 * InteractiveTheory Component
 * 
 * Based on educational methodologies:
 * - Microlearning: Bite-sized chunks (3-5 min each)
 * - Scaffolding: Progressive complexity with support
 * - Active Learning: Inline comprehension checks
 * - Multimodal: Text + visuals + interactive elements
 */

export default function InteractiveTheory({ sections, keyConcepts, unit }) {
    const [expandedSection, setExpandedSection] = useState(0)
    const [completedSections, setCompletedSections] = useState(new Set())
    const [checkStates, setCheckStates] = useState({}) // Track comprehension check answers

    const handleSectionComplete = (index) => {
        setCompletedSections(prev => new Set([...prev, index]))
        // Auto-advance to next section
        if (index < sections.length - 1) {
            setTimeout(() => setExpandedSection(index + 1), 300)
        }
    }

    const handleCheckAnswer = (sectionIndex, isCorrect) => {
        setCheckStates(prev => ({
            ...prev,
            [sectionIndex]: isCorrect ? 'correct' : 'incorrect'
        }))
        if (isCorrect) {
            handleSectionComplete(sectionIndex)
        }
    }

    const progress = (completedSections.size / sections.length) * 100

    return (
        <div className="space-y-4">
            {/* Progress Header */}
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                        <h3 className="font-semibold text-white">Theory Content</h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-400">{completedSections.size}/{sections.length} sections</span>
                        <span className="text-emerald-400">{Math.round(progress)}%</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>

                {/* Section Dots */}
                <div className="flex justify-between mt-2">
                    {sections.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setExpandedSection(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${completedSections.has(idx)
                                    ? 'bg-emerald-400'
                                    : expandedSection === idx
                                        ? 'bg-indigo-400'
                                        : 'bg-slate-600'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Key Concepts Pills (Always Visible) */}
            {keyConcepts?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {keyConcepts.map((concept, idx) => (
                        <span
                            key={idx}
                            className="group relative px-3 py-1.5 bg-indigo-500/20 text-indigo-300 text-sm font-medium rounded-lg border border-indigo-500/20 cursor-help"
                        >
                            {concept}
                            {/* Tooltip placeholder - would need concept definitions */}
                        </span>
                    ))}
                </div>
            )}

            {/* Theory Sections - Accordion Style */}
            <div className="space-y-3">
                {sections.map((section, idx) => (
                    <TheorySection
                        key={idx}
                        section={section}
                        index={idx}
                        isExpanded={expandedSection === idx}
                        isCompleted={completedSections.has(idx)}
                        checkState={checkStates[idx]}
                        onToggle={() => setExpandedSection(expandedSection === idx ? -1 : idx)}
                        onComplete={() => handleSectionComplete(idx)}
                        onCheckAnswer={(isCorrect) => handleCheckAnswer(idx, isCorrect)}
                        totalSections={sections.length}
                    />
                ))}
            </div>

            {/* Completion Message */}
            <AnimatePresence>
                {completedSections.size === sections.length && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500/20 rounded-xl p-4 border border-emerald-500/30 text-center"
                    >
                        <div className="flex items-center justify-center gap-2 text-emerald-400">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">Theory Complete!</span>
                        </div>
                        <p className="text-slate-300 text-sm mt-1">
                            Great job! Now try the code examples and quiz to reinforce your learning.
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Individual Theory Section Component
function TheorySection({ section, index, isExpanded, isCompleted, checkState, onToggle, onComplete, onCheckAnswer, totalSections }) {
    const getIcon = () => {
        switch (section.type) {
            case 'concept': return <Brain className="w-4 h-4" />
            case 'example': return <Zap className="w-4 h-4" />
            case 'application': return <Target className="w-4 h-4" />
            default: return <Lightbulb className="w-4 h-4" />
        }
    }

    return (
        <div
            className={`rounded-xl border overflow-hidden transition-all ${isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : isExpanded
                        ? 'bg-slate-800/50 border-indigo-500/30'
                        : 'bg-slate-800/30 border-slate-700/50'
                }`}
        >
            {/* Section Header */}
            <button
                onClick={onToggle}
                className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-white/5 transition-colors"
            >
                <div className={`p-1.5 rounded-lg ${isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                    }`}>
                    {isCompleted ? <CheckCircle className="w-4 h-4" /> : getIcon()}
                </div>

                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">
                            {index + 1}/{totalSections}
                        </span>
                        <h4 className="font-medium text-white">{section.title}</h4>
                    </div>
                    {section.duration && (
                        <span className="text-xs text-slate-500">~{section.duration} min read</span>
                    )}
                </div>

                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''
                    }`} />
            </button>

            {/* Section Content */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="px-4 pb-4 space-y-4">
                            {/* Main Content */}
                            <div className="prose prose-sm prose-invert max-w-none">
                                {section.content.split('\n\n').map((paragraph, pIdx) => (
                                    <p key={pIdx} className="text-slate-300 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>

                            {/* Did You Know Box */}
                            {section.didYouKnow && (
                                <div className="bg-amber-500/10 rounded-lg p-3 border border-amber-500/20">
                                    <div className="flex items-start gap-2">
                                        <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5" />
                                        <div>
                                            <span className="text-xs text-amber-400 font-semibold uppercase">Did you know?</span>
                                            <p className="text-slate-300 text-sm mt-1">{section.didYouKnow}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Key Takeaway */}
                            {section.keyTakeaway && (
                                <div className="bg-indigo-500/10 rounded-lg p-3 border border-indigo-500/20">
                                    <div className="flex items-start gap-2">
                                        <Target className="w-4 h-4 text-indigo-400 mt-0.5" />
                                        <div>
                                            <span className="text-xs text-indigo-400 font-semibold uppercase">Key Takeaway</span>
                                            <p className="text-slate-300 text-sm mt-1">{section.keyTakeaway}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Comprehension Check */}
                            {section.check && (
                                <ComprehensionCheck
                                    check={section.check}
                                    state={checkState}
                                    onAnswer={onCheckAnswer}
                                />
                            )}

                            {/* Page Reference */}
                            {section.pageRef && (
                                <div className="flex items-center justify-between pt-2 border-t border-slate-700/50">
                                    <a
                                        href={`/handbook.pdf#page=${section.pageRef}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                                    >
                                        📖 Read more in handbook (p.{section.pageRef})
                                        <ExternalLink className="w-3 h-3" />
                                    </a>

                                    {!isCompleted && !section.check && (
                                        <button
                                            onClick={onComplete}
                                            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
                                        >
                                            <CheckCircle className="w-3 h-3" />
                                            Mark as read
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// Inline Comprehension Check Component
function ComprehensionCheck({ check, state, onAnswer }) {
    const [selected, setSelected] = useState(null)

    const handleSelect = (optionIdx) => {
        if (state) return // Already answered
        setSelected(optionIdx)
    }

    const handleSubmit = () => {
        if (selected === null) return
        onAnswer(selected === check.correctAnswer)
    }

    return (
        <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span className="text-sm font-medium text-purple-400">Quick Check</span>
            </div>

            <p className="text-white text-sm mb-3">{check.question}</p>

            <div className="space-y-2">
                {check.options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleSelect(idx)}
                        disabled={!!state}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${state
                                ? idx === check.correctAnswer
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                    : idx === selected && selected !== check.correctAnswer
                                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                                        : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                                : selected === idx
                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                                    : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-700/50'
                            } border`}
                    >
                        <span className="mr-2 font-mono">{String.fromCharCode(65 + idx)}.</span>
                        {option}
                    </button>
                ))}
            </div>

            {!state && selected !== null && (
                <button
                    onClick={handleSubmit}
                    className="mt-3 px-4 py-1.5 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                >
                    Check Answer
                </button>
            )}

            {state && (
                <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-3 p-3 rounded-lg ${state === 'correct'
                            ? 'bg-emerald-500/10 border border-emerald-500/30'
                            : 'bg-red-500/10 border border-red-500/30'
                        }`}
                >
                    <div className="flex items-start gap-2">
                        {state === 'correct' ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5" />
                        ) : (
                            <XCircle className="w-4 h-4 text-red-400 mt-0.5" />
                        )}
                        <p className={`text-sm ${state === 'correct' ? 'text-emerald-300' : 'text-red-300'}`}>
                            {state === 'correct' ? '✓ Correct!' : `The correct answer is ${String.fromCharCode(65 + check.correctAnswer)}.`}
                            {check.explanation && ` ${check.explanation}`}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}
