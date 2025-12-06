import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft, ChevronRight, BookOpen, CheckCircle,
    FileText, ExternalLink, Play
} from 'lucide-react'
import { ConceptBlock, CheckBlock, VisualBlock, SummaryBlock } from './lesson'
import InteractiveCode from './InteractiveCode'

/**
 * LessonViewer - Displays lesson content using rich content blocks
 * Shows one block at a time for focused learning
 */
export default function LessonViewer({
    lesson,
    onComplete,
    onClose
}) {
    const [currentBlockIndex, setCurrentBlockIndex] = useState(0)
    const [completedBlocks, setCompletedBlocks] = useState(new Set())
    const [showQuiz, setShowQuiz] = useState(false)

    const contentBlocks = lesson?.contentBlocks || lesson?.theory || []
    const totalBlocks = contentBlocks.length
    const currentBlock = contentBlocks[currentBlockIndex]

    const progress = Math.round((completedBlocks.size / totalBlocks) * 100)

    const handleNext = () => {
        if (currentBlockIndex < totalBlocks - 1) {
            setCompletedBlocks(prev => new Set([...prev, currentBlockIndex]))
            setCurrentBlockIndex(prev => prev + 1)
        } else if (lesson?.quiz?.questions?.length > 0) {
            setCompletedBlocks(prev => new Set([...prev, currentBlockIndex]))
            setShowQuiz(true)
        }
    }

    const handlePrev = () => {
        if (currentBlockIndex > 0) {
            setCurrentBlockIndex(prev => prev - 1)
        }
    }

    const handleBlockComplete = () => {
        setCompletedBlocks(prev => new Set([...prev, currentBlockIndex]))
    }

    const renderBlock = (block, index) => {
        if (!block) return null

        const blockType = block.type || 'concept'

        switch (blockType) {
            case 'concept':
                return (
                    <ConceptBlock
                        title={block.title}
                        content={block.content}
                        pdfRef={block.pdfRef || block.pageRef}
                        didYouKnow={block.didYouKnow}
                        keyTakeaway={block.keyTakeaway}
                    />
                )

            case 'check':
                return (
                    <CheckBlock
                        question={block.question}
                        options={block.options}
                        correctAnswer={block.correctAnswer || block.answer}
                        explanation={block.explanation}
                        onComplete={handleBlockComplete}
                    />
                )

            case 'code':
                return (
                    <InteractiveCode
                        title={block.title}
                        initialCode={block.code}
                        explanation={block.explanation}
                    />
                )

            case 'visual':
                return (
                    <VisualBlock
                        title={block.title}
                        imageUrl={block.imageUrl}
                        caption={block.caption}
                        mermaidCode={block.mermaidCode}
                    />
                )

            case 'summary':
                return (
                    <SummaryBlock
                        keyPoints={block.keyPoints}
                        nextSection={currentBlockIndex < totalBlocks - 1 ? 'next concept' : null}
                        onContinue={handleNext}
                    />
                )

            default:
                // Fallback for old-style theory blocks
                return (
                    <ConceptBlock
                        title={block.title || `Section ${index + 1}`}
                        content={typeof block === 'string' ? block : (block.content || block.concept || '')}
                        pdfRef={block.pageRef}
                        didYouKnow={block.didYouKnow}
                        keyTakeaway={block.keyTakeaway}
                    />
                )
        }
    }

    return (
        <div className="flex flex-col h-full">
            {/* Header with progress */}
            <div className="p-4 border-b border-white/10 bg-slate-900/50">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs font-medium rounded-full">
                            Lesson {lesson?.lessonNumber}
                        </span>
                        <span className="text-xs text-slate-600">
                            Block {currentBlockIndex + 1} of {totalBlocks}
                        </span>
                    </div>
                    <span className="text-xs text-slate-500">{progress}% complete</span>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                    />
                </div>

                {/* Block indicators */}
                <div className="flex gap-1 mt-3">
                    {contentBlocks.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentBlockIndex(idx)}
                            className={`flex-1 h-1 rounded-full transition-all ${completedBlocks.has(idx)
                                    ? 'bg-emerald-500'
                                    : idx === currentBlockIndex
                                        ? 'bg-indigo-500'
                                        : 'bg-slate-700'
                                }`}
                        />
                    ))}
                </div>
            </div>

            {/* Content area */}
            <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="wait">
                    {showQuiz ? (
                        <motion.div
                            key="quiz"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="text-center py-8">
                                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                                    <Play className="w-8 h-8 text-purple-400" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Ready for the Quiz!</h3>
                                <p className="text-slate-500 mb-6">
                                    You've completed all content blocks. Test your knowledge!
                                </p>
                                <button
                                    onClick={() => onComplete?.()}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl font-medium"
                                >
                                    Start Quiz ({lesson?.quiz?.questions?.length} questions)
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentBlockIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderBlock(currentBlock, currentBlockIndex)}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Navigation footer */}
            {!showQuiz && (
                <div className="p-4 border-t border-white/10 flex items-center justify-between bg-slate-900/50">
                    <button
                        onClick={handlePrev}
                        disabled={currentBlockIndex === 0}
                        className="flex items-center gap-1 px-4 py-2 text-sm text-slate-500 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>

                    {/* PDF Reference */}
                    {lesson?.unit?.pageStart && (
                        <a
                            href={`/handbook.pdf#page=${lesson.unit.pageStart}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                        >
                            <FileText className="w-3.5 h-3.5" />
                            PDF: Pages {lesson.unit.pageStart}-{lesson.unit.pageEnd}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    )}

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-1 px-4 py-2 text-sm bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                    >
                        {currentBlockIndex < totalBlocks - 1 ? 'Next' : 'Finish'}
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}
