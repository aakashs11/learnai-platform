import { motion } from 'framer-motion'
import { CheckCircle, Play, Lock } from 'lucide-react'
import ProgressRing from './ProgressRing'

const UNIT_COLORS = {
    1: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' },
    2: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' },
    3: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/30', text: 'text-emerald-400' },
    4: { bg: 'bg-orange-500/20', border: 'border-orange-500/30', text: 'text-orange-400' },
    5: { bg: 'bg-pink-500/20', border: 'border-pink-500/30', text: 'text-pink-400' },
    6: { bg: 'bg-cyan-500/20', border: 'border-cyan-500/30', text: 'text-cyan-400' },
    7: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' },
    8: { bg: 'bg-red-500/20', border: 'border-red-500/30', text: 'text-red-400' },
}

export default function LessonCard({ lesson, onClick, isLocked = false }) {
    const unitColor = UNIT_COLORS[lesson.unit?.number] || UNIT_COLORS[1]
    const progress = lesson.progress || 0
    const isComplete = progress >= 100

    return (
        <motion.div
            onClick={() => !isLocked && onClick(lesson)}
            whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
            whileTap={!isLocked ? { scale: 0.98 } : {}}
            className={`relative bg-slate-800/50 backdrop-blur-xl rounded-2xl border overflow-hidden cursor-pointer transition-all
        ${isLocked ? 'opacity-50 cursor-not-allowed border-slate-700/30' : 'border-slate-700/50 hover:border-slate-600'}
        ${isComplete ? 'ring-2 ring-emerald-500/30' : ''}`}
        >
            {/* Unit Badge */}
            <div className={`px-3 py-1.5 flex items-center justify-between ${unitColor.bg} border-b ${unitColor.border}`}>
                <span className={`text-xs font-medium ${unitColor.text}`}>
                    Unit {lesson.unit?.number} • pp. {lesson.unit?.pageStart}-{lesson.unit?.pageEnd}
                </span>
                {isComplete && (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                )}
                {isLocked && (
                    <Lock className="w-4 h-4 text-slate-600" />
                )}
            </div>

            {/* Content */}
            <div className="p-4">
                <div className="flex items-start gap-4">
                    {/* Progress Ring */}
                    <ProgressRing progress={progress} size={56} strokeWidth={5} />

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                        <span className="text-xs text-slate-600 font-medium">Lesson {lesson.lessonNumber}</span>
                        <h3 className="text-lg font-semibold text-white truncate mt-0.5">
                            {lesson.title}
                        </h3>

                        {/* Key Concepts Preview */}
                        <div className="flex flex-wrap gap-1 mt-2">
                            {lesson.keyConcepts?.slice(0, 3).map((concept, idx) => (
                                <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-slate-700/50 text-slate-500 text-xs rounded-md"
                                >
                                    {concept}
                                </span>
                            ))}
                            {lesson.keyConcepts?.length > 3 && (
                                <span className="px-2 py-0.5 text-slate-600 text-xs">
                                    +{lesson.keyConcepts.length - 3}
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action Button */}
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-600">
                        {lesson.quiz?.questions?.length || 0} quiz questions
                    </span>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
            ${isComplete
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30'}`}>
                        {isComplete ? (
                            <>Review</>
                        ) : progress > 0 ? (
                            <>Continue <Play className="w-3.5 h-3.5" /></>
                        ) : (
                            <>Start <Play className="w-3.5 h-3.5" /></>
                        )}
                    </div>
                </div>
            </div>

            {/* XP Badge */}
            {lesson.xpEarned > 0 && (
                <div className="absolute top-12 right-3 px-2 py-0.5 bg-yellow-500/20 rounded-full">
                    <span className="text-xs font-bold text-yellow-400">+{lesson.xpEarned} XP</span>
                </div>
            )}
        </motion.div>
    )
}
