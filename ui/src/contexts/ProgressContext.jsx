import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { supabase } from '../lib/supabase'

const ProgressContext = createContext()

export function useProgress() {
    return useContext(ProgressContext)
}

// Initial/Empty State
const INITIAL_PROGRESS = { xp: 0, streak: 1, lessons: {} }

// Helper: Load from Local Storage
const loadLocalProgress = () => {
    try {
        const saved = localStorage.getItem('ai-curriculum-progress')
        return saved ? JSON.parse(saved) : INITIAL_PROGRESS
    } catch (e) {
        console.warn('Failed to load local progress', e)
        return INITIAL_PROGRESS
    }
}

export function ProgressProvider({ children }) {
    const { user } = useAuth()
    const [progress, setProgress] = useState(loadLocalProgress)
    const [isSyncing, setIsSyncing] = useState(false)

    // 1. Local Persistence: Save to localStorage whenever progress changes
    useEffect(() => {
        try {
            localStorage.setItem('ai-curriculum-progress', JSON.stringify(progress))
        } catch (e) {
            console.error('Failed to save progress locally', e)
        }
    }, [progress])

    // 2. Cloud Persistence: Debounced Sync to Supabase
    useEffect(() => {
        if (!user) return

        // Wait 2 seconds of inactivity before pushing to cloud
        const timer = setTimeout(async () => {
            setIsSyncing(true)
            try {
                // We store the entire JSON blob in a 'progress' column in 'profiles' table
                const { error } = await supabase
                    .from('profiles')
                    .upsert({
                        id: user.id,
                        progress,
                        updated_at: new Date().toISOString()
                    }, { onConflict: 'id' })

                if (error) console.error('Cloud Sync Error:', error)
            } catch (err) {
                console.error('Cloud Sync Failed:', err)
            } finally {
                setIsSyncing(false)
            }
        }, 2000)

        return () => clearTimeout(timer)
    }, [progress, user])

    // 3. Cloud Hydration: Load from Cloud on Login
    useEffect(() => {
        async function hydrateFromCloud() {
            if (!user) return

            const { data, error } = await supabase
                .from('profiles')
                .select('progress')
                .eq('id', user.id)
                .single()

            if (!error && data?.progress) {
                // Conflict Resolution:
                // If Cloud has significantly more XP, trust Cloud.
                // Otherwise trust Local (to prevent overwriting recent offline work).
                // Simplification for now: Cloud wins if it exists.
                // TODO: Implement smarter merge.
                console.log('Hydrating progress from cloud:', data.progress)
                setProgress(prev => {
                    // Simple check: If cloud has more XP, use cloud.
                    if ((data.progress.xp || 0) > (prev.xp || 0)) {
                        return data.progress
                    }
                    return prev
                })
            }
        }
        hydrateFromCloud()
    }, [user])

    // Action: Update a specific lesson
    const updateLessonProgress = useCallback((lessonId, scorePercent, xpEarned) => {
        setProgress(prev => {
            const currentLesson = prev.lessons[lessonId] || { progress: 0, xpEarned: 0 }

            // Only update if improvement
            const newProgressPercent = Math.max(currentLesson.progress, scorePercent)

            // Add NEW XP (only if not already earned for this specific milestone? 
            // Simplified: We accumulate XP passed in. Caller handles logic.)
            // Actually, safer to recalculate. 
            // Let's trust the caller to pass 'delta' XP or total XP? 
            // The existing LessonPage passed 'xpEarned' as a delta.

            return {
                ...prev,
                xp: prev.xp + xpEarned,
                lessons: {
                    ...prev.lessons,
                    [lessonId]: {
                        progress: newProgressPercent,
                        xpEarned: currentLesson.xpEarned + xpEarned,
                        lastPlayed: new Date().toISOString()
                    }
                }
            }
        })
    }, [])

    const value = {
        progress,
        updateLessonProgress,
        isSyncing
    }

    return (
        <ProgressContext.Provider value={value}>
            {children}
        </ProgressContext.Provider>
    )
}
