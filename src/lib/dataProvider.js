import { supabase } from './supabase'

// Mock data for development/fallback
let mockLessons = []

// Initialize mock data from public/lessons.json if needed
const initMockData = async () => {
    if (mockLessons.length === 0) {
        try {
            const res = await fetch('/lessons.json')
            mockLessons = await res.json()
        } catch (e) {
            console.error("Failed to load mock data", e)
        }
    }
}

export const dataProvider = {
    // Courses
    getCourses: async () => {
        if (supabase) {
            const { data, error } = await supabase.from('courses').select('*')
            if (!error) return data
        }
        // Fallback/Mock
        return [
            {
                id: 'class-12-ai',
                title: 'Class 12 AI (CBSE)',
                description: 'Complete curriculum for Class 12 Artificial Intelligence',
                thumbnail: '/course-thumb.jpg'
            }
        ]
    },

    // Lessons
    getLessons: async (courseId) => {
        if (supabase) {
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('courseId', courseId)
                .order('lessonNumber')
            if (!error) return data
        }

        await initMockData()
        return mockLessons
    },

    getLesson: async (lessonId) => {
        if (supabase) {
            const { data, error } = await supabase
                .from('lessons')
                .select('*')
                .eq('id', lessonId)
                .single()
            if (!error) return data
        }

        await initMockData()
        return mockLessons.find(l => l.id === lessonId)
    },

    // Admin Operations
    updateLesson: async (lessonId, updates) => {
        if (supabase) {
            const { data, error } = await supabase
                .from('lessons')
                .update(updates)
                .eq('id', lessonId)
                .select()
            if (error) throw error
            return data[0]
        }

        // Mock Update
        await initMockData()
        const index = mockLessons.findIndex(l => l.id === lessonId)
        if (index !== -1) {
            mockLessons[index] = { ...mockLessons[index], ...updates }
            console.log('Mock updated lesson:', mockLessons[index])
            return mockLessons[index]
        }
        throw new Error('Lesson not found')
    },

    createLesson: async (lesson) => {
        if (supabase) {
            const { data, error } = await supabase
                .from('lessons')
                .insert(lesson)
                .select()
            if (error) throw error
            return data[0]
        }

        await initMockData()
        const newLesson = { ...lesson, id: `lesson-${Date.now()}` }
        mockLessons.push(newLesson)
        return newLesson
    }
}
