import { motion } from 'framer-motion'
import { Flame, Trophy, Star, Zap } from 'lucide-react'

export default function ProgressTracker({ totalLessons, completedLessons, totalXp, streak }) {
    const progressPercent = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    return (
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-4">
            <div className="grid grid-cols-4 gap-4">
                {/* Lessons Progress */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <Star className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Lessons</p>
                        <p className="text-lg font-bold text-white">{completedLessons}/{totalLessons}</p>
                    </div>
                </div>

                {/* XP */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                        <Zap className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Total XP</p>
                        <p className="text-lg font-bold text-yellow-400">{totalXp}</p>
                    </div>
                </div>

                {/* Streak */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <Flame className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Streak</p>
                        <p className="text-lg font-bold text-orange-400">{streak} days</p>
                    </div>
                </div>

                {/* Mastery */}
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <p className="text-xs text-slate-400">Mastery</p>
                        <p className="text-lg font-bold text-emerald-400">{Math.round(progressPercent)}%</p>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                </div>
            </div>
        </div>
    )
}
