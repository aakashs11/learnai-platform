import { motion } from 'framer-motion'
import { CheckCircle, ArrowRight } from 'lucide-react'

/**
 * SummaryBlock - Displays key takeaways at the end of a section
 */
export default function SummaryBlock({
    title = "Key Takeaways",
    keyPoints,
    nextSection,
    onContinue
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-xl p-5 border border-emerald-500/20"
        >
            {/* Header */}
            <h4 className="font-semibold text-emerald-400 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                {title}
            </h4>

            {/* Key Points */}
            <ul className="space-y-2 mb-4">
                {keyPoints?.map((point, idx) => (
                    <motion.li
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-start gap-2 text-slate-300 text-sm"
                    >
                        <span className="text-emerald-400 mt-0.5">✓</span>
                        <span>{point}</span>
                    </motion.li>
                ))}
            </ul>

            {/* Continue Button */}
            {nextSection && onContinue && (
                <button
                    onClick={onContinue}
                    className="w-full py-2.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    Continue to {nextSection}
                    <ArrowRight className="w-4 h-4" />
                </button>
            )}
        </motion.div>
    )
}
