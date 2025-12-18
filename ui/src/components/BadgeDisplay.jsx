import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Lock } from 'lucide-react'
import { useBadges, TIER_STYLES, BADGE_DEFINITIONS } from '../hooks/useBadges'

// Badge Card Component
function BadgeCard({ badge, size = 'normal' }) {
    const tierStyle = TIER_STYLES[badge.tier]
    const isSmall = size === 'small'

    return (
        <motion.div
            whileHover={badge.earned ? { scale: 1.05, y: -2 } : {}}
            className={`relative rounded-xl border ${tierStyle.border} ${tierStyle.bg} 
                ${badge.earned ? `shadow-lg ${tierStyle.glow}` : 'opacity-50 grayscale'}
                ${isSmall ? 'p-3' : 'p-4'}
                transition-all duration-300`}
        >
            {/* Badge Icon */}
            <div className={`text-center ${isSmall ? 'mb-1' : 'mb-2'}`}>
                <span className={`${isSmall ? 'text-2xl' : 'text-4xl'}`}>
                    {badge.earned ? badge.icon : '🔒'}
                </span>
            </div>

            {/* Badge Info */}
            <div className="text-center">
                <h4 className={`font-bold ${tierStyle.text} ${isSmall ? 'text-xs' : 'text-sm'}`}>
                    {badge.name}
                </h4>
                {!isSmall && (
                    <p className="text-xs text-slate-400 mt-1">{badge.description}</p>
                )}
            </div>

            {/* Tier indicator */}
            <div className={`absolute -top-1 -right-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase
                ${tierStyle.bg} ${tierStyle.border} border ${tierStyle.text}`}>
                {badge.tier}
            </div>

            {/* Lock overlay for unearned */}
            {!badge.earned && (
                <div className="absolute inset-0 flex items-center justify-center bg-space-900/50 rounded-xl">
                    <Lock className="w-5 h-5 text-slate-500" />
                </div>
            )}
        </motion.div>
    )
}

// Badge Notification Toast
export function BadgeNotification({ badge, onDismiss }) {
    if (!badge) return null

    const tierStyle = TIER_STYLES[badge.tier]

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 50, scale: 0.9 }}
                className={`fixed bottom-6 right-6 z-50 p-4 rounded-2xl border ${tierStyle.border} ${tierStyle.bg}
                    backdrop-blur-xl shadow-2xl ${tierStyle.glow} max-w-sm`}
            >
                <div className="flex items-start gap-4">
                    {/* Badge icon with glow */}
                    <div className="relative">
                        <div className={`absolute inset-0 bg-${badge.tier === 'gold' ? 'yellow' : 'cyan'}-500/30 blur-xl rounded-full`} />
                        <span className="relative text-5xl">{badge.icon}</span>
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <Award className={`w-4 h-4 ${tierStyle.text}`} />
                            <span className={`text-xs font-bold uppercase ${tierStyle.text}`}>
                                Badge Unlocked!
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-white">{badge.name}</h3>
                        <p className="text-sm text-slate-400">{badge.description}</p>
                    </div>

                    <button
                        onClick={onDismiss}
                        className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-slate-400" />
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

// Badge Grid Component
export function BadgeGrid({ badges, columns = 4 }) {
    const categories = ['completion', 'xp', 'streak', 'quiz', 'special']

    return (
        <div className="space-y-6">
            {categories.map(category => {
                const categoryBadges = badges.filter(b => b.category === category)
                if (categoryBadges.length === 0) return null

                return (
                    <div key={category}>
                        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">
                            {category === 'xp' ? 'XP' : category.charAt(0).toUpperCase() + category.slice(1)} Badges
                        </h3>
                        <div className={`grid grid-cols-2 md:grid-cols-${columns} gap-3`}>
                            {categoryBadges.map(badge => (
                                <BadgeCard key={badge.id} badge={badge} />
                            ))}
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

// Mini Badge Display (for header/profile)
export function BadgePreview({ badges, max = 5 }) {
    const earned = badges.filter(b => b.earned).slice(0, max)
    const remaining = badges.filter(b => b.earned).length - max

    return (
        <div className="flex items-center gap-1">
            {earned.map(badge => (
                <div
                    key={badge.id}
                    className="w-8 h-8 rounded-lg bg-space-800/50 border border-white/10 flex items-center justify-center"
                    title={badge.name}
                >
                    <span className="text-lg">{badge.icon}</span>
                </div>
            ))}
            {remaining > 0 && (
                <div className="w-8 h-8 rounded-lg bg-space-800/50 border border-white/10 flex items-center justify-center">
                    <span className="text-xs text-slate-400">+{remaining}</span>
                </div>
            )}
        </div>
    )
}

export default BadgeCard
