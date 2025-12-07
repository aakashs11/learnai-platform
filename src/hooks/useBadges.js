import { useState, useEffect, useCallback, useMemo } from 'react'

const STORAGE_KEY = 'ai-curriculum-badges'

// Badge definitions
const BADGE_DEFINITIONS = [
    // Completion badges
    {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first lesson',
        icon: '🚀',
        category: 'completion',
        check: (stats) => stats.lessonsCompleted >= 1,
        tier: 'bronze'
    },
    {
        id: 'getting_warmed_up',
        name: 'Getting Warmed Up',
        description: 'Complete 5 lessons',
        icon: '🔥',
        category: 'completion',
        check: (stats) => stats.lessonsCompleted >= 5,
        tier: 'silver'
    },
    {
        id: 'ai_explorer',
        name: 'AI Explorer',
        description: 'Complete 10 lessons',
        icon: '🧭',
        category: 'completion',
        check: (stats) => stats.lessonsCompleted >= 10,
        tier: 'gold'
    },
    {
        id: 'ai_master',
        name: 'AI Master',
        description: 'Complete all lessons',
        icon: '👑',
        category: 'completion',
        check: (stats) => stats.lessonsCompleted >= stats.totalLessons && stats.totalLessons > 0,
        tier: 'platinum'
    },

    // XP badges  
    {
        id: 'xp_starter',
        name: 'XP Starter',
        description: 'Earn 100 XP',
        icon: '⭐',
        category: 'xp',
        check: (stats) => stats.totalXp >= 100,
        tier: 'bronze'
    },
    {
        id: 'xp_collector',
        name: 'XP Collector',
        description: 'Earn 500 XP',
        icon: '🌟',
        category: 'xp',
        check: (stats) => stats.totalXp >= 500,
        tier: 'silver'
    },
    {
        id: 'xp_champion',
        name: 'XP Champion',
        description: 'Earn 1000 XP',
        icon: '💫',
        category: 'xp',
        check: (stats) => stats.totalXp >= 1000,
        tier: 'gold'
    },

    // Streak badges
    {
        id: 'streak_started',
        name: 'Streak Started',
        description: 'Maintain a 3-day streak',
        icon: '🔥',
        category: 'streak',
        check: (stats) => stats.currentStreak >= 3,
        tier: 'bronze'
    },
    {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '⚡',
        category: 'streak',
        check: (stats) => stats.currentStreak >= 7,
        tier: 'silver'
    },
    {
        id: 'streak_master',
        name: 'Streak Master',
        description: 'Maintain a 14-day streak',
        icon: '🏆',
        category: 'streak',
        check: (stats) => stats.currentStreak >= 14,
        tier: 'gold'
    },

    // Quiz badges
    {
        id: 'quiz_taker',
        name: 'Quiz Taker',
        description: 'Complete your first quiz',
        icon: '📝',
        category: 'quiz',
        check: (stats) => stats.quizzesCompleted >= 1,
        tier: 'bronze'
    },
    {
        id: 'perfect_score',
        name: 'Perfect Score',
        description: 'Get 100% on a quiz',
        icon: '💯',
        category: 'quiz',
        check: (stats) => stats.perfectQuizzes >= 1,
        tier: 'gold'
    },

    // Special badges
    {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Study after 10 PM',
        icon: '🦉',
        category: 'special',
        check: (stats) => stats.nightOwl,
        tier: 'silver'
    },
    {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Study before 7 AM',
        icon: '🐦',
        category: 'special',
        check: (stats) => stats.earlyBird,
        tier: 'silver'
    }
]

// Tier colors for styling
export const TIER_STYLES = {
    bronze: {
        bg: 'bg-amber-900/30',
        border: 'border-amber-700/50',
        text: 'text-amber-400',
        glow: 'shadow-amber-500/20'
    },
    silver: {
        bg: 'bg-slate-500/20',
        border: 'border-slate-400/50',
        text: 'text-slate-300',
        glow: 'shadow-slate-400/20'
    },
    gold: {
        bg: 'bg-yellow-500/20',
        border: 'border-yellow-500/50',
        text: 'text-yellow-400',
        glow: 'shadow-yellow-500/30'
    },
    platinum: {
        bg: 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20',
        border: 'border-cyan-400/50',
        text: 'text-cyan-300',
        glow: 'shadow-cyan-400/30'
    }
}

export function useBadges(progressStats) {
    const [earnedBadges, setEarnedBadges] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? new Set(JSON.parse(saved)) : new Set()
        } catch {
            return new Set()
        }
    })

    const [newBadge, setNewBadge] = useState(null)

    // Save earned badges to localStorage
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([...earnedBadges]))
    }, [earnedBadges])

    // Check for new badges whenever stats change
    useEffect(() => {
        if (!progressStats) return

        const hour = new Date().getHours()
        const statsWithTime = {
            ...progressStats,
            nightOwl: hour >= 22 || hour < 5,
            earlyBird: hour >= 5 && hour < 7
        }

        BADGE_DEFINITIONS.forEach(badge => {
            if (!earnedBadges.has(badge.id) && badge.check(statsWithTime)) {
                setEarnedBadges(prev => {
                    const updated = new Set(prev)
                    updated.add(badge.id)
                    return updated
                })
                // Show notification for newly earned badge
                setNewBadge(badge)
                // Clear notification after 5 seconds
                setTimeout(() => setNewBadge(null), 5000)
            }
        })
    }, [progressStats, earnedBadges])

    const badges = useMemo(() => {
        return BADGE_DEFINITIONS.map(badge => ({
            ...badge,
            earned: earnedBadges.has(badge.id)
        }))
    }, [earnedBadges])

    const earnedCount = useMemo(() => {
        return badges.filter(b => b.earned).length
    }, [badges])

    const dismissNewBadge = useCallback(() => {
        setNewBadge(null)
    }, [])

    return {
        badges,
        earnedBadges: [...earnedBadges],
        earnedCount,
        totalBadges: BADGE_DEFINITIONS.length,
        newBadge,
        dismissNewBadge,
        TIER_STYLES
    }
}

export { BADGE_DEFINITIONS }
