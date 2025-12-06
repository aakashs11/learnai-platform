import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HelpCircle, CheckCircle, XCircle } from 'lucide-react'

/**
 * CheckBlock - Inline comprehension check question
 */
export default function CheckBlock({
    question,
    options,
    correctAnswer,
    explanation,
    onComplete
}) {
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)

    const handleSubmit = () => {
        setShowResult(true)
        if (selectedAnswer === correctAnswer && onComplete) {
            onComplete(true)
        }
    }

    const isCorrect = selectedAnswer === correctAnswer

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-500/10 to-indigo-500/10 rounded-xl p-5 border border-purple-500/20"
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-purple-500/20 rounded-lg">
                    <HelpCircle className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-purple-400 font-medium text-sm">Quick Check</span>
            </div>

            {/* Question */}
            <p className="text-white font-medium mb-4">{question}</p>

            {/* Options */}
            <div className="space-y-2 mb-4">
                {options.map((option, idx) => (
                    <button
                        key={idx}
                        onClick={() => !showResult && setSelectedAnswer(idx)}
                        disabled={showResult}
                        className={`w-full text-left p-3 rounded-lg border transition-all flex items-center gap-3 ${showResult
                                ? idx === correctAnswer
                                    ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                                    : selectedAnswer === idx
                                        ? 'bg-red-500/20 border-red-500/50 text-red-300'
                                        : 'bg-slate-800/30 border-slate-700/50 text-slate-400'
                                : selectedAnswer === idx
                                    ? 'bg-indigo-500/20 border-indigo-500/50 text-white'
                                    : 'bg-slate-800/30 border-slate-700/50 text-slate-300 hover:border-slate-600'
                            }`}
                    >
                        <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-medium ${showResult
                                ? idx === correctAnswer
                                    ? 'border-emerald-500 bg-emerald-500/20'
                                    : selectedAnswer === idx
                                        ? 'border-red-500 bg-red-500/20'
                                        : 'border-slate-600'
                                : selectedAnswer === idx
                                    ? 'border-indigo-500 bg-indigo-500/20'
                                    : 'border-slate-600'
                            }`}>
                            {String.fromCharCode(65 + idx)}
                        </span>
                        <span className="flex-1 text-sm">{option}</span>
                        {showResult && idx === correctAnswer && (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                        )}
                        {showResult && selectedAnswer === idx && idx !== correctAnswer && (
                            <XCircle className="w-5 h-5 text-red-400" />
                        )}
                    </button>
                ))}
            </div>

            {/* Submit or Result */}
            <AnimatePresence mode="wait">
                {!showResult ? (
                    <motion.button
                        key="submit"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleSubmit}
                        disabled={selectedAnswer === null}
                        className="w-full py-2.5 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 disabled:text-slate-500 text-white font-medium rounded-lg transition-colors"
                    >
                        Check Answer
                    </motion.button>
                ) : (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 rounded-lg ${isCorrect
                                ? 'bg-emerald-500/10 border border-emerald-500/20'
                                : 'bg-amber-500/10 border border-amber-500/20'
                            }`}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            {isCorrect ? (
                                <>
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                    <span className="text-emerald-400 font-medium">Correct! 🎉</span>
                                </>
                            ) : (
                                <>
                                    <XCircle className="w-5 h-5 text-amber-400" />
                                    <span className="text-amber-400 font-medium">Not quite...</span>
                                </>
                            )}
                        </div>
                        {explanation && (
                            <p className="text-slate-300 text-sm">{explanation}</p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
