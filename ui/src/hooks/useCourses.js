import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

// Static courses for now - will be fetched from Supabase later
const staticCourses = [
    {
        id: 'class-12-ai',
        slug: 'class-12-ai',
        title: 'AI Class XII',
        subtitle: 'Artificial Intelligence - CBSE Subject Code 843',
        description: 'Complete AI curriculum covering Python, NumPy, Pandas, Machine Learning, Neural Networks, and more.',
        classLevel: '12',
        subject: 'AI',
        thumbnail: null,
        lessonCount: 14,
        duration: '8 hours',
        isPublished: true,
        hasPython: true
    },
    {
        id: 'class-11-ai',
        slug: 'class-11-ai',
        title: 'AI Class XI',
        subtitle: 'Artificial Intelligence Foundation',
        description: 'Introduction to AI concepts, Python programming basics, and data handling.',
        classLevel: '11',
        subject: 'AI',
        thumbnail: null,
        lessonCount: 12,
        duration: '6 hours',
        isPublished: false,
        hasPython: true
    },
    {
        id: 'python-basics',
        slug: 'python-basics',
        title: 'Python Programming',
        subtitle: 'Learn Python from scratch',
        description: 'Master Python programming with hands-on exercises and projects.',
        classLevel: 'all',
        subject: 'Python',
        thumbnail: null,
        lessonCount: 10,
        duration: '5 hours',
        isPublished: false,
        hasPython: true
    }
]

export function useCourses() {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true)
            setError(null)

            try {
                // Try to fetch from Supabase if configured
                if (supabase) {
                    const { data, error: supabaseError } = await supabase
                        .from('courses')
                        .select('*')
                        .eq('is_published', true)
                        .order('created_at', { ascending: true })

                    if (supabaseError) throw supabaseError
                    if (data && data.length > 0) {
                        setCourses(data)
                        setLoading(false)
                        return
                    }
                }

                // Fall back to static courses
                setCourses(staticCourses)
                setLoading(false)
            } catch (err) {
                console.error('Failed to fetch courses:', err)
                // Fall back to static courses on error
                setCourses(staticCourses)
                setLoading(false)
            }
        }

        fetchCourses()
    }, [])

    const getCourse = (courseId) => {
        return courses.find(c => c.id === courseId || c.slug === courseId)
    }

    const getPublishedCourses = () => {
        return courses.filter(c => c.isPublished)
    }

    const getCoursesByClass = (classLevel) => {
        if (!classLevel || classLevel === 'all') return courses
        return courses.filter(c => c.classLevel === classLevel)
    }

    return {
        courses,
        loading,
        error,
        getCourse,
        getPublishedCourses,
        getCoursesByClass
    }
}
