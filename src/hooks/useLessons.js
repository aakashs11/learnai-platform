import { useState, useEffect } from 'react'

export function useLessons(courseId = 'class-12-ai') {
    const [lessons, setLessons] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        setLoading(true)
        setError(null)

        // For now, load from static JSON
        // Later this will fetch from Supabase based on courseId
        fetch('/lessons.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch lessons')
                return res.json()
            })
            .then(data => {
                setLessons(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Failed to load lessons:', err)
                setError(err.message)
                setLoading(false)
            })
    }, [courseId])

    // Get unique units from lessons
    const units = [...new Map(lessons.map(l => [l.unit?.number, l.unit])).values()].filter(Boolean)

    // Get lessons by unit
    const getLessonsByUnit = (unitNumber) => {
        if (!unitNumber) return lessons
        return lessons.filter(l => l.unit?.number === unitNumber)
    }

    // Get a single lesson by ID
    const getLesson = (lessonId) => {
        return lessons.find(l => l.id === lessonId)
    }

    // Get next lesson
    const getNextLesson = (currentLessonId) => {
        const currentIndex = lessons.findIndex(l => l.id === currentLessonId)
        if (currentIndex < lessons.length - 1) {
            return lessons[currentIndex + 1]
        }
        return null
    }

    // Get previous lesson
    const getPrevLesson = (currentLessonId) => {
        const currentIndex = lessons.findIndex(l => l.id === currentLessonId)
        if (currentIndex > 0) {
            return lessons[currentIndex - 1]
        }
        return null
    }

    return {
        lessons,
        units,
        loading,
        error,
        getLessonsByUnit,
        getLesson,
        getNextLesson,
        getPrevLesson,
        totalLessons: lessons.length
    }
}
