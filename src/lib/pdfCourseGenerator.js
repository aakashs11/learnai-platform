/**
 * PDF Course Generator
 * 
 * Extracts text from CBSE AI textbook PDF and generates structured course content.
 * Features:
 * - Page-by-page text extraction
 * - Unit/lesson boundary detection
 * - Question extraction (for quizzes)
 * - Key concept filtering
 * - Mermaid diagram suggestions
 */

// PDF.js worker setup (for browser environment)
const setupPdfWorker = async () => {
    if (typeof window !== 'undefined') {
        const pdfjsLib = await import('pdfjs-dist')
        // Use exact version matching package.json or a fixed reliable version
        pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.js`
        return pdfjsLib
    }
    return null
}

/**
 * Extract text content from PDF file
 * @param {File|ArrayBuffer} pdfSource - PDF file or buffer
 * @returns {Promise<Array<{page: number, text: string}>>}
 */
export async function extractPdfText(pdfSource) {
    const pdfjsLib = await setupPdfWorker()
    if (!pdfjsLib) throw new Error('PDF.js not available')

    const pdf = await pdfjsLib.getDocument(pdfSource).promise
    const pages = []

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum)
        const textContent = await page.getTextContent()
        const text = textContent.items.map(item => item.str).join(' ')

        pages.push({
            page: pageNum,
            text: cleanText(text)
        })
    }

    return pages
}

/**
 * Clean extracted text - remove extra whitespace and artifacts
 */
function cleanText(text) {
    return text
        .replace(/\s+/g, ' ')
        .replace(/\u0000/g, '')  // Remove null bytes
        .trim()
}

/**
 * Detect unit and lesson boundaries in extracted text
 * @param {Array} pages - Extracted page data
 * @returns {Array<{unit: number, title: string, startPage: number, endPage: number, lessons: Array}>}
 */
export function detectUnits(pages) {
    const units = []
    const unitPattern = /Unit\s*(\d+)\s*[:\-–]?\s*(.+?)(?=\s*(?:Page|$|\d{1,3}\.?))/gi
    const lessonPattern = /(?:Lesson|Chapter|Section)\s*(\d+(?:\.\d+)?)\s*[:\-–]?\s*(.+?)(?=\s*(?:Page|$|\d{1,3}\.?))/gi

    pages.forEach(({ page, text }) => {
        // Check for unit headers
        let unitMatch
        while ((unitMatch = unitPattern.exec(text)) !== null) {
            const unitNum = parseInt(unitMatch[1])
            const existingUnit = units.find(u => u.number === unitNum)

            if (!existingUnit) {
                units.push({
                    number: unitNum,
                    title: unitMatch[2].trim(),
                    startPage: page,
                    endPage: page,
                    lessons: []
                })
            } else {
                existingUnit.endPage = page
            }
        }
    })

    return units
}

/**
 * Extract questions from text for quiz generation
 * @param {string} text - Text to analyze
 * @returns {Array<{type: string, question: string, context: string}>}
 */
export function extractQuestions(text) {
    const questions = []

    // Pattern 1: Numbered questions (Q1., Q.1, 1., etc.)
    const numberedPattern = /(?:Q\.?\s*(\d+)|(\d+)\.\s*)\s*(.+?\?)/gi
    let match
    while ((match = numberedPattern.exec(text)) !== null) {
        questions.push({
            type: 'numbered',
            number: match[1] || match[2],
            question: match[3].trim(),
            context: text.substring(Math.max(0, match.index - 100), match.index).trim()
        })
    }

    // Pattern 2: Questions ending with ?
    const questionPattern = /([A-Z][^.!?]*\?)/g
    while ((match = questionPattern.exec(text)) !== null) {
        // Avoid duplicating numbered questions
        if (!questions.some(q => q.question === match[1].trim())) {
            questions.push({
                type: 'inline',
                question: match[1].trim(),
                context: text.substring(Math.max(0, match.index - 100), match.index).trim()
            })
        }
    }

    // Pattern 3: "Fill in the blanks" / "True or False" / "Match the following"
    const exercisePatterns = [
        /fill\s+in\s+the\s+blank[s]?\s*[:\-]?\s*(.+?)(?=\n|$)/gi,
        /true\s+or\s+false\s*[:\-]?\s*(.+?)(?=\n|$)/gi,
        /match\s+the\s+following/gi
    ]

    exercisePatterns.forEach((pattern, idx) => {
        while ((match = pattern.exec(text)) !== null) {
            questions.push({
                type: ['fill-blank', 'true-false', 'matching'][idx],
                question: match[0].trim(),
                context: ''
            })
        }
    })

    return questions
}

/**
 * Filter text to extract essential content (not everything from textbook)
 * @param {string} text - Raw extracted text
 * @returns {Object} - Filtered content with key points
 */
export function filterEssentialContent(text) {
    const result = {
        definitions: [],
        keyPoints: [],
        examples: [],
        formulas: []
    }

    // Extract definitions (patterns like "X is defined as", "X refers to")
    const defPattern = /([A-Z][a-z]+(?:\s+[A-Z]?[a-z]+)*)\s+(?:is|are|refers? to|means?|can be defined as)\s+([^.]+\.)/gi
    let match
    while ((match = defPattern.exec(text)) !== null) {
        result.definitions.push({
            term: match[1].trim(),
            definition: match[2].trim()
        })
    }

    // Extract bullet points / key facts
    const bulletPattern = /[•●○]\s*(.+?)(?=\n|[•●○]|$)/g
    while ((match = bulletPattern.exec(text)) !== null) {
        result.keyPoints.push(match[1].trim())
    }

    // Extract "Example:" sections
    const examplePattern = /Example[s]?\s*[:\-]?\s*(.+?)(?=\n\n|Example|$)/gi
    while ((match = examplePattern.exec(text)) !== null) {
        result.examples.push(match[1].trim())
    }

    return result
}

/**
 * Generate lesson structure from extracted content
 * @param {Object} params - Generation parameters
 * @returns {Object} - Structured lesson data
 */
export function generateLessonStructure(params) {
    const { title, pageStart, pageEnd, extractedText, unitInfo } = params

    const questions = extractQuestions(extractedText)
    const essential = filterEssentialContent(extractedText)

    return {
        id: `lesson_${title.toLowerCase().replace(/\s+/g, '_').substring(0, 30)}`,
        title,
        lessonNumber: params.lessonNumber || 1,
        unit: unitInfo,
        objectives: essential.keyPoints.slice(0, 4),
        mastery: 'beginner',
        theory: essential.definitions.map((def, idx) => ({
            title: def.term,
            type: 'concept',
            duration: 3,
            content: def.definition,
            pageRef: pageStart + Math.floor(idx / 2)
        })),
        quiz: {
            questions: questions.slice(0, 5).map((q, idx) => ({
                id: idx + 1,
                text: q.question,
                options: generatePlaceholderOptions(),
                explanation: `This question relates to ${q.context || 'the topic'}.`
            }))
        },
        codeExamples: essential.examples.slice(0, 3).map((ex, idx) => ({
            title: `Example ${idx + 1}`,
            code: `# ${ex}\n# Code example placeholder`,
            explanation: ex
        }))
    }
}

/**
 * Generate placeholder MCQ options (to be refined by admin)
 */
function generatePlaceholderOptions() {
    return [
        { text: 'Option A', isCorrect: true },
        { text: 'Option B', isCorrect: false },
        { text: 'Option C', isCorrect: false },
        { text: 'Option D', isCorrect: false }
    ]
}

/**
 * Suggest Mermaid diagrams based on content
 * @param {string} text - Content to analyze
 * @returns {Array<{type: string, suggestion: string, code: string}>}
 */
export function suggestDiagrams(text) {
    const suggestions = []
    const lower = text.toLowerCase()

    // Methodology / Process diagrams
    if (lower.includes('step') || lower.includes('process') || lower.includes('methodology')) {
        suggestions.push({
            type: 'flowchart',
            suggestion: 'Process flow diagram',
            code: 'graph TD\n    A[Step 1] --> B[Step 2]\n    B --> C[Step 3]'
        })
    }

    // Types / Categories
    if (lower.includes('types of') || lower.includes('classification') || lower.includes('categories')) {
        suggestions.push({
            type: 'mindmap',
            suggestion: 'Classification diagram',
            code: 'mindmap\n  root((Topic))\n    Type A\n    Type B\n    Type C'
        })
    }

    // Neural network / layers
    if (lower.includes('neural') || lower.includes('layer') || lower.includes('network')) {
        suggestions.push({
            type: 'flowchart',
            suggestion: 'Neural network architecture',
            code: 'graph LR\n    I[Input] --> H1[Hidden 1]\n    H1 --> H2[Hidden 2]\n    H2 --> O[Output]'
        })
    }

    return suggestions
}

/**
 * Main function to process PDF and generate course content
 * @param {File} pdfFile - PDF file to process
 * @returns {Promise<Object>} - Generated course structure
 */
export async function processPdfToCourse(pdfFile) {
    try {
        // Step 1: Extract text from all pages
        const pages = await extractPdfText(pdfFile)

        // Step 2: Detect unit boundaries
        const units = detectUnits(pages)

        // Step 3: Process each unit
        const lessons = []
        let lessonCount = 1

        units.forEach(unit => {
            const unitPages = pages.filter(p => p.page >= unit.startPage && p.page <= unit.endPage)
            const unitText = unitPages.map(p => p.text).join('\n')

            // Generate lesson from unit content
            const lesson = generateLessonStructure({
                title: unit.title,
                pageStart: unit.startPage,
                pageEnd: unit.endPage,
                extractedText: unitText,
                unitInfo: {
                    number: unit.number,
                    title: unit.title,
                    pageStart: unit.startPage,
                    pageEnd: unit.endPage
                },
                lessonNumber: lessonCount++
            })

            // Add diagram suggestions
            lesson.suggestedDiagrams = suggestDiagrams(unitText)

            lessons.push(lesson)
        })

        return {
            success: true,
            totalPages: pages.length,
            unitsDetected: units.length,
            lessons,
            rawText: pages // Keep for admin review
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }
}

export default {
    extractPdfText,
    detectUnits,
    extractQuestions,
    filterEssentialContent,
    generateLessonStructure,
    suggestDiagrams,
    processPdfToCourse
}
