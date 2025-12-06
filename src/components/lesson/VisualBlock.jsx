import { motion } from 'framer-motion'

/**
 * VisualBlock - Displays images, diagrams, or visual content
 */
export default function VisualBlock({
    title,
    imageUrl,
    caption,
    alt
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden border border-slate-700/50"
        >
            {/* Title */}
            {title && (
                <div className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                    <h4 className="font-medium text-white text-sm">{title}</h4>
                </div>
            )}

            {/* Image */}
            <div className="relative bg-slate-900 flex items-center justify-center p-4">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt={alt || title || 'Visual'}
                        className="max-w-full h-auto rounded-lg"
                    />
                ) : (
                    <div className="w-full h-48 bg-slate-800 rounded-lg flex items-center justify-center">
                        <span className="text-slate-500 text-sm">Image coming soon</span>
                    </div>
                )}
            </div>

            {/* Caption */}
            {caption && (
                <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-700/50">
                    <p className="text-sm text-slate-400 text-center">{caption}</p>
                </div>
            )}
        </motion.div>
    )
}
