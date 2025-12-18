import { motion } from 'framer-motion'
import { BookOpen, ExternalLink } from 'lucide-react'

/**
 * ConceptBlock - Displays a concept/theory section with optional PDF reference
 */
export default function ConceptBlock({
    title,
    content,
    pdfRef,
    didYouKnow,
    keyTakeaway
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-800/30 rounded-xl p-5 border border-slate-700/50"
        >
            {/* Title */}
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400" />
                {title}
            </h4>

            {/* Main content */}
            <div className="text-slate-300 text-sm leading-relaxed space-y-3">
                {content.split('\n\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                ))}
            </div>

            {/* Did You Know callout */}
            {didYouKnow && (
                <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                        <span className="text-lg">💡</span>
                        <div>
                            <p className="text-amber-400 font-medium text-sm">Did you know?</p>
                            <p className="text-slate-300 text-sm mt-1">{didYouKnow}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Key Takeaway */}
            {keyTakeaway && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
                    <div className="flex items-start gap-2">
                        <span className="text-lg">📝</span>
                        <div>
                            <p className="text-emerald-400 font-medium text-sm">Key Takeaway</p>
                            <p className="text-slate-300 text-sm mt-1">{keyTakeaway}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* PDF Reference */}
            {pdfRef && (
                <a
                    href={`/handbook.pdf#page=${pdfRef.page}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Handbook: Page {pdfRef.page}
                    {pdfRef.section && `, Section ${pdfRef.section}`}
                    {pdfRef.paragraph && `, Para ${pdfRef.paragraph}`}
                </a>
            )}
        </motion.div>
    )
}
