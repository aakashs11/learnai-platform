import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'learnai-progress'

const defaultProgress = {
    xp: 0,
    streak: 1,
    lastVisit: null,
    lessons: {},
    courses: {}
}

export function useProgress() {
    const [progress, setProgress] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            return saved ? { ...defaultProgress, ...JSON.parse(saved) } : defaultProgress
        } catch {
            return defaultProgress
        }
    })

    // Save to localStorage whenever progress changes
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    }, [progress])

    // Update streak based on daily visits
    useEffect(() => {
        const today = new Date().toDateString()
        if (progress.lastVisit !== today) {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)

            setProgress(prev => ({
                ...prev,
                lastVisit: today,
                streak: prev.lastVisit === yesterday.toDateString()
                    ? prev.streak + 1
                    : 1
            }))
        }
    }, [])

    const addXp = useCallback((amount) => {
        setProgress(prev => ({
            ...prev,
            xp: prev.xp + amount
        }))
    }, [])

    const updateLessonProgress = useCallback((lessonId, data) => {
        setProgress(prev => ({
            ...prev,
            lessons: {
                ...prev.lessons,
                [lessonId]: {
                    ...prev.lessons[lessonId],
                    ...data,
                    lastUpdated: new Date().toISOString()
                }
            }
        }))
    }, [])

    const getLessonProgress = useCallback((lessonId) => {
        return progress.lessons[lessonId] || { progress: 0, xpEarned: 0 }
    }, [progress.lessons])

    const getCompletedLessons = useCallback((courseId) => {
        return Object.entries(progress.lessons)
            .filter(([_, data]) => data.progress >= 100)
            .length
    }, [progress.lessons])

    const resetProgress = useCallback(() => {
        setProgress(defaultProgress)
        localStorage.removeItem(STORAGE_KEY)
    }, [])

    return {
        progress,
        xp: progress.xp,
        streak: progress.streak,
        addXp,
        updateLessonProgress,
        getLessonProgress,
        getCompletedLessons,
        resetProgress
    }
}
