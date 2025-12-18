import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import QuestionBank from './QuestionBank'
import { dataProvider } from '../../lib/dataProvider'

// Mock DataProvider
vi.mock('../../lib/dataProvider', () => ({
    dataProvider: {
        getQuestions: vi.fn(),
        createQuestion: vi.fn()
    }
}))

describe('QuestionBank Component', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    it('renders questions from dataProvider', async () => {
        const mockQuestions = [
            { id: 1, text: 'What is AI?', type: 'short_answer', difficulty: 'Easy', tags: ['Intro'] },
            { id: 2, text: 'Which lib?', type: 'multiple_choice', difficulty: 'Medium', tags: ['Python'] }
        ]
        dataProvider.getQuestions.mockResolvedValue(mockQuestions)

        render(<QuestionBank />)

        // Wait for loading to finish
        expect(await screen.findByText('Question Bank')).toBeInTheDocument()

        await waitFor(() => {
            expect(screen.getByText('What is AI?')).toBeInTheDocument()
            expect(screen.getByText('Which lib?')).toBeInTheDocument()
        })
    })

    it('opens add question modal and calls createQuestion', async () => {
        dataProvider.getQuestions.mockResolvedValue([])
        dataProvider.createQuestion.mockResolvedValue({ id: 99, text: 'New Q' })

        render(<QuestionBank />)

        // Wait for page load
        const addButton = await screen.findByText('Add Question')
        fireEvent.click(addButton)

        await waitFor(() => {
            expect(screen.getByText('Add New Question')).toBeInTheDocument()
        })

        // Fill Form
        fireEvent.change(screen.getByPlaceholderText('Enter the question here...'), { target: { value: 'New Test Question' } })

        // Change type to Short Answer to avoid required options
        fireEvent.change(screen.getByRole('combobox', { name: /type/i }), { target: { value: 'short_answer' } })

        fireEvent.change(screen.getByPlaceholderText('e.g. NumPy, Array, Basics'), { target: { value: 'TestTag' } })

        // Save
        fireEvent.click(screen.getByText('Save Question'))

        await waitFor(() => {
            expect(dataProvider.createQuestion).toHaveBeenCalledWith(expect.objectContaining({
                text: 'New Test Question',
                type: 'short_answer',
                tags: ['TestTag']
            }))
        })
    })
})
