import { supabase } from './supabase'

/**
 * Data Provider - Supabase Implementation
 * Decouples UI from Database Logic
 */

export const dataProvider = {
    // COURSES
    async getCourses() {
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .order('title', { ascending: true })

        if (error) throw error
        return data || []
    },

    async getCourse(courseId) {
        const { data, error } = await supabase
            .from('courses')
            .select(`
                *,
                lessons (
                    id, title, lesson_number, video_id, is_published, unit_title
                )
            `)
            .eq('id', courseId)
            .single()

        if (error) throw error

        // Sort lessons by number
        if (data && data.lessons) {
            data.lessons.sort((a, b) => a.lesson_number - b.lesson_number)
        }

        return data
    },

    // LESSONS
    async getLesson(lessonId) {
        // 1. Fetch Lesson Meta
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('*')
            .eq('id', lessonId)
            .single()

        if (lessonError) throw lessonError

        // 2. Fetch Content Blocks
        const { data: blocks, error: blocksError } = await supabase
            .from('content_blocks')
            .select('*')
            .eq('lesson_id', lessonId)
            .order('order_index', { ascending: true })

        if (blocksError) throw blocksError

        // 3. Transform Blocks back to UI format (content array)
        const theory = blocks.map(block => {
            if (block.type === 'text') return { type: 'text', content: block.content }
            if (block.type === 'image') return {
                type: 'image',
                url: block.meta_data?.image_url,
                caption: block.content
            }
            if (block.type === 'code') return {
                type: 'code',
                code: block.content,
                language: block.meta_data?.language
            }
            return { type: 'text', content: block.content }
        })

        return {
            ...lesson,
            theory: theory
        }
    },

    async getLessons(courseId) {
        const { data, error } = await supabase
            .from('lessons')
            .select('id, title, lesson_number, video_id, is_published, unit_title')
            .eq('course_id', courseId)
            .order('lesson_number', { ascending: true })

        if (error) throw error
        return data || []
    },

    async createLesson(lessonData) {
        // Generate a unique lesson ID
        const lessonId = `lesson_${Date.now()}`

        const { data, error } = await supabase
            .from('lessons')
            .insert({
                id: lessonId,
                course_id: lessonData.courseId,
                title: lessonData.title,
                lesson_number: lessonData.lessonNumber || 99,
                unit_title: lessonData.unitTitle || 'General',
                video_id: lessonData.videoId || null,
                is_published: false
            })
            .select()
            .single()

        if (error) throw error
        return data
    },

    async updateLesson(lessonId, updates) {
        // Separate meta updates from content updates
        const { theory, ...meta } = updates

        // 1. Update Meta
        const { error: metaError } = await supabase
            .from('lessons')
            .update(meta)
            .eq('id', lessonId)

        if (metaError) throw metaError

        // 2. Update Content (Full Replacement Strategy for now)
        if (theory) {
            // Delete existing blocks
            await supabase.from('content_blocks').delete().eq('lesson_id', lessonId)

            // Insert new blocks
            const blocks = theory.map((block, index) => {
                let type = 'text'
                let content = block.content
                let metadata = {}

                if (block.type === 'image') {
                    type = 'image'
                    content = block.caption
                    metadata = { image_url: block.url }
                } else if (block.type === 'code') {
                    type = 'code'
                    content = block.code
                    metadata = { language: block.language }
                }

                return {
                    lesson_id: lessonId,
                    order_index: index,
                    type: type,
                    content: content,
                    meta_data: metadata
                }
            })

            if (blocks.length > 0) {
                const { error: blocksError } = await supabase
                    .from('content_blocks')
                    .insert(blocks)

                if (blocksError) throw blocksError
            }
        }

        return true
    },

    // QUESTIONS (New Feature)
    async getQuestions() {
        const { data, error } = await supabase
            .from('questions')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) throw error
        return data || []
    },

    async createQuestion(question) {
        const { data, error } = await supabase
            .from('questions')
            .insert(question)
            .select()
            .single()

        if (error) throw error
        return data
    }
}
