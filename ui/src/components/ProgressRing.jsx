import { motion } from 'framer-motion'

export default function ProgressRing({ progress, size = 60, strokeWidth = 6 }) {
    const radius = (size - strokeWidth) / 2
    const circumference = radius * 2 * Math.PI
    const offset = circumference - (progress / 100) * circumference

    const getColor = () => {
        if (progress >= 80) return '#10B981' // emerald
        if (progress >= 50) return '#F59E0B' // amber
        if (progress > 0) return '#6366F1'   // indigo
        return '#475569' // slate
    }

    return (
        <div className="relative" style={{ width: size, height: size }}>
            {/* Background circle */}
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    className="text-slate-700"
                />
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke={getColor()}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-white">{Math.round(progress)}%</span>
            </div>
        </div>
    )
}
