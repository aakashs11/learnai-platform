import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, ArrowRight, BookOpen, Trophy, Sparkles } from 'lucide-react'

export default function Quiz({ questions, onComplete, lessonTitle }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [selectedAnswer, setSelectedAnswer] = useState(null)
    const [showResult, setShowResult] = useState(false)
    const [score, setScore] = useState(0)
    const [xpEarned, setXpEarned] = useState(0)
    const [isComplete, setIsComplete] = useState(false)

    const currentQuestion = questions[currentIndex]
    const isCorrect = selectedAnswer === currentQuestion?.correctAnswer

    const handleAnswer = (answerIndex) => {
        if (showResult) return
        setSelectedAnswer(answerIndex)
        setShowResult(true)

        if (answerIndex === currentQuestion.correctAnswer) {
            setScore(s => s + 1)
            setXpEarned(xp => xp + 10)
        }
    }

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(i => i + 1)
            setSelectedAnswer(null)
            setShowResult(false)
        } else {
            setIsComplete(true)
            onComplete?.(score + (isCorrect ? 1 : 0), xpEarned + (isCorrect ? 10 : 0))
        }
    }

    if (!questions || questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                <BookOpen className="w-12 h-12 mb-4 opacity-50" />
                <p>No quiz questions available for this lesson yet.</p>
            </div>
        )
    }

    if (isComplete) {
        const percentage = Math.round((score / questions.length) * 100)
        return (
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center justify-center py-12"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring' }}
                >
                    <Trophy className="w-20 h-20 text-yellow-400 mb-4" />
                </motion.div>
                <h2 className="text-3xl font-bold text-white mb-2">Quiz Complete!</h2>
                <p className="text-slate-400 mb-6">{lessonTitle}</p>

                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-6 text-center">
                        <p className="text-4xl font-bold text-emerald-400">{score}/{questions.length}</p>
                        <p className="text-emerald-300 text-sm">Correct Answers</p>
                    </div>
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center">
                        <div className="flex items-center justify-center gap-1">
                            <Sparkles className="w-5 h-5 text-yellow-400" />
                            <p className="text-4xl font-bold text-yellow-400">{xpEarned}</p>
                        </div>
                        <p className="text-yellow-300 text-sm">XP Earned</p>
                    </div>
                </div>

                <div className="w-full max-w-xs bg-slate-800 rounded-full h-3 mb-4">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className={`h-3 rounded-full ${percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                    />
                </div>
                <p className="text-slate-400 text-sm">{percentage}% Accuracy</p>
            </motion.div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 bg-slate-800 rounded-full h-2">
                    <motion.div
                        className="bg-emerald-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>
                <span className="text-slate-400 text-sm font-medium">
                    {currentIndex + 1}/{questions.length}
                </span>
            </div>

            {/* Question */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                >
                    <h3 className="text-xl font-semibold text-white mb-6">
                        {currentQuestion.question}
                    </h3>

                    {/* Options */}
                    <div className="space-y-3 mb-6">
                        {currentQuestion.options.map((option, idx) => {
                            const isSelected = selectedAnswer === idx
                            const isCorrectAnswer = idx === currentQuestion.correctAnswer

                            let buttonClass = "w-full p-4 text-left rounded-xl border-2 transition-all "

                            if (showResult) {
                                if (isCorrectAnswer) {
                                    buttonClass += "bg-emerald-500/20 border-emerald-500 text-emerald-300"
                                } else if (isSelected && !isCorrect) {
                                    buttonClass += "bg-red-500/20 border-red-500 text-red-300"
                                } else {
                                    buttonClass += "bg-slate-800/50 border-slate-700 text-slate-400"
                                }
                            } else {
                                buttonClass += isSelected
                                    ? "bg-indigo-500/20 border-indigo-500 text-white"
                                    : "bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800"
                            }

                            return (
                                <motion.button
                                    key={idx}
                                    onClick={() => handleAnswer(idx)}
                                    disabled={showResult}
                                    className={buttonClass}
                                    whileHover={!showResult ? { scale: 1.02 } : {}}
                                    whileTap={!showResult ? { scale: 0.98 } : {}}
                                    animate={showResult && isSelected && !isCorrect ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                                    transition={{ duration: 0.4 }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-700 text-sm font-bold">
                                            {String.fromCharCode(65 + idx)}
                                        </span>
                                        <span className="flex-1">{option}</span>
                                        {showResult && isCorrectAnswer && (
                                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        )}
                                        {showResult && isSelected && !isCorrect && (
                                            <XCircle className="w-5 h-5 text-red-400" />
                                        )}
                                    </div>
                                </motion.button>
                            )
                        })}
                    </div>

                    {/* Explanation */}
                    <AnimatePresence>
                        {showResult && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className={`p-4 rounded-xl mb-6 ${isCorrect ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
                                    <p className={`font-medium mb-1 ${isCorrect ? 'text-emerald-400' : 'text-amber-400'}`}>
                                        {isCorrect ? '🎉 Correct!' : '💡 Explanation'}
                                    </p>
                                    <p className="text-slate-300 text-sm">
                                        {currentQuestion.explanation}
                                    </p>
                                    {currentQuestion.pageRef && (
                                        <p className="text-slate-500 text-xs mt-2">
                                            📖 Handbook Reference: Page {currentQuestion.pageRef}
                                        </p>
                                    )}
                                </div>

                                <button
                                    onClick={handleNext}
                                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
                                >
                                    {currentIndex < questions.length - 1 ? (
                                        <>Continue <ArrowRight className="w-5 h-5" /></>
                                    ) : (
                                        <>See Results <Trophy className="w-5 h-5" /></>
                                    )}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
