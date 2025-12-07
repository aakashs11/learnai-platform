import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Config & Setup
const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.join(__dirname, '../.env.local') })

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
// SOLID Principle: Use Service Role for Admin/Backend tasks to bypass RLS
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing Env Vars: VITE_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    console.error('   -> Please add SUPABASE_SERVICE_ROLE_KEY to ui/.env.local for admin access.')
    process.exit(1)
}

// --- 1. EXTRACT: Data Source Abstraction ---
class JsonExtractor {
    constructor(filePath) {
        this.filePath = filePath
    }

    extract() {
        if (!fs.existsSync(this.filePath)) {
            throw new Error(`Source file not found: ${this.filePath}`)
        }
        const rawData = fs.readFileSync(this.filePath, 'utf8')
        return JSON.parse(rawData)
    }
}

// --- 2. TRANSFORM: Domain Logic & Structuring ---
class SchemaMapper {
    constructor() {
        // Constant for the default course since input is flat
        this.COURSE_ID = 'ai_ds_mastery'
    }

    /**
     * Transforms raw JSON into a structured Transfer Object
     * containing course, lessons, and blocks ready for DB insertion.
     */
    transform(rawLessons) {
        // Validate Input
        if (!Array.isArray(rawLessons)) {
            throw new Error('Invalid Input: Expected array of lessons')
        }

        const course = this._buildCourse()

        // Transform all lessons
        const lessons = rawLessons.map(rawLesson => this._mapLesson(rawLesson))

        // Transform blocks for all lessons
        // Returns a flat list of all blocks for easier batch insertion if needed
        // but here we organize them by lesson for clarity in loading
        const blocksByLesson = {}
        rawLessons.forEach(rawLesson => {
            blocksByLesson[rawLesson.id] = this._mapBlocks(rawLesson)
        })

        return { course, lessons, blocksByLesson }
    }

    _buildCourse() {
        return {
            id: this.COURSE_ID,
            title: 'AI & Data Science Mastery',
            description: 'Comprehensive curriculum covering Python, Pandas, NumPy, and Computer Vision.',
            thumbnail_url: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?auto=format&fit=crop&q=80&w=1000'
        }
    }

    _mapLesson(raw) {
        return {
            id: raw.id,
            course_id: this.COURSE_ID,
            lesson_number: raw.lessonNumber || this._extractNumberFromId(raw.id),
            title: raw.title,
            unit_title: raw.unit?.title || 'General',
            video_id: raw.videoId || null,
            is_published: true
        }
    }

    _mapBlocks(rawLesson) {
        let blocks = []
        let orderIndex = 0

        // 1. Process Theory
        if (rawLesson.theory) {
            rawLesson.theory.forEach(block => {
                const mapped = this._mapTheoryBlock(block, rawLesson.id, orderIndex++)
                blocks.push(mapped)

                // If the block has an embedded diagram, creates a secondary block
                if (block.diagram) {
                    blocks.push({
                        lesson_id: rawLesson.id,
                        order_index: orderIndex++,
                        type: 'code',
                        content: block.diagram.code || '',
                        meta_data: {
                            language: 'mermaid',
                            title: block.diagram.title || 'Diagram'
                        }
                    })
                }
            })
        }

        // 2. Process Code Examples
        if (rawLesson.codeExamples) {
            rawLesson.codeExamples.forEach(ex => {
                blocks.push({
                    lesson_id: rawLesson.id,
                    order_index: orderIndex++,
                    type: 'code',
                    content: ex.code,
                    meta_data: {
                        language: 'python',
                        title: ex.title,
                        explanation: ex.explanation
                    }
                })
            })
        }

        return blocks
    }

    _mapTheoryBlock(block, lessonId, orderIndex) {
        // Detect Type
        let type = 'text'
        let content = block.content
        let metadata = { title: block.title, duration: block.duration }

        if (block.type === 'image') {
            type = 'image'
            content = block.caption || 'Image'
            metadata.image_url = block.url
            metadata.caption = block.caption
        } else if (block.code) { // Legacy direct code block in theory
            type = 'code'
            content = block.code
            metadata.language = block.language || 'python'
        } else if (block.type === 'list') {
            type = 'text'
            content = block.items ? block.items.map(i => `- ${i}`).join('\n') : ''
        }

        return {
            lesson_id: lessonId,
            order_index: orderIndex,
            type: type,
            content: content || '',
            meta_data: metadata
        }
    }

    _extractNumberFromId(id) {
        const match = id.match(/\d+/)
        return match ? parseInt(match[0]) : 0
    }
}

// --- 3. LOAD: Database Interaction ---
class SupabaseLoader {
    constructor(url, key) {
        this.supabase = createClient(url, key)
    }

    async load(data) {
        console.log('📦 Loading Data into Supabase...')

        // 1. Upsert Course
        console.log(`   Processed Course: ${data.course.title}`)
        const { error: cErr } = await this.supabase
            .from('courses')
            .upsert(data.course)
        if (cErr) this._handleError('Course Upsert', cErr)

        // 2. Upsert Lessons
        for (const lesson of data.lessons) {
            console.log(`   Importing Lesson: ${lesson.title}`)
            const { error: lErr } = await this.supabase
                .from('lessons')
                .upsert(lesson)
            if (lErr) this._handleError('Lesson Upsert', lErr)

            // 3. Upsert Blocks (Delete old first)
            await this._replaceBlocks(lesson.id, data.blocksByLesson[lesson.id])
        }

        console.log('✅ Load Complete')
    }

    async _replaceBlocks(lessonId, blocks) {
        if (!blocks || blocks.length === 0) return

        // Cleanup existing
        const { error: dErr } = await this.supabase
            .from('content_blocks')
            .delete()
            .eq('lesson_id', lessonId)
        if (dErr) this._handleError('Block Cleanup', dErr)

        // Insert new
        const { error: iErr } = await this.supabase
            .from('content_blocks')
            .insert(blocks)
        if (iErr) this._handleError('Block Insertion', iErr)
    }

    _handleError(context, error) {
        console.error(`❌ Error in ${context}:`, error.message)
        // Check for common connection errors
        if (error.message && error.message.includes('ENOTFOUND')) {
            console.error('   -> HINT: Check your Internet Connection and VITE_SUPABASE_URL.')
        }
    }
}

// --- 4. ORCHESTRATOR: Main Pipeline ---
async function runPipeline() {
    try {
        console.log('🚀 Starting SOLID Data Pipeline...')

        // Dependencies
        const sourcePath = path.join(__dirname, '../public/lessons.json')
        const extractor = new JsonExtractor(sourcePath)
        const mapper = new SchemaMapper()
        const loader = new SupabaseLoader(SUPABASE_URL, SUPABASE_KEY)

        // Execution Flow
        const rawData = extractor.extract()
        const transformedData = mapper.transform(rawData)
        await loader.load(transformedData)

        console.log('✨ Pipeline Finished Successfully!')

    } catch (error) {
        console.error('💥 Pipeline Failed:', error.message)
    }
}

runPipeline()
