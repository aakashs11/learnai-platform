import { useState } from 'react'
import { X, Plus, Trash } from 'lucide-react'

export default function AddQuestionModal({ isOpen, onClose, onSave }) {
    const [formData, setFormData] = useState({
        text: '',
        type: 'multiple_choice',
        difficulty: 'Medium',
        tags: '',
        options: ['', '', '', ''],
        correct_answer: ''
    })

    if (!isOpen) return null

    const handleSubmit = (e) => {
        e.preventDefault()
        const question = {
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
            // Clean up options if not multiple choice
            options: formData.type === 'multiple_choice' ? formData.options : null
        }
        onSave(question)
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add New Question</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Question Text
                        </label>
                        <textarea
                            required
                            value={formData.text}
                            onChange={e => setFormData({ ...formData, text: e.target.value })}
                            className="w-full h-24 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white"
                            placeholder="Enter the question here..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {/* Type */}
                        <div>
                            <label htmlFor="q-type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Type
                            </label>
                            <select
                                id="q-type"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                            >
                                <option value="multiple_choice">Multiple Choice</option>
                                <option value="short_answer">Short Answer</option>
                            </select>
                        </div>

                        {/* Difficulty */}
                        <div>
                            <label htmlFor="q-difficulty" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Difficulty
                            </label>
                            <select
                                id="q-difficulty"
                                value={formData.difficulty}
                                onChange={e => setFormData({ ...formData, difficulty: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Options (MCQ Only) */}
                    {formData.type === 'multiple_choice' && (
                        <div className="space-y-3">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                                Options
                            </label>
                            {formData.options.map((option, idx) => (
                                <div key={idx} className="flex gap-3">
                                    <div className="w-8 h-10 flex items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-700 font-bold text-slate-500">
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={option}
                                        onChange={e => {
                                            const newOptions = [...formData.options]
                                            newOptions[idx] = e.target.value
                                            setFormData({ ...formData, options: newOptions })
                                        }}
                                        className="flex-1 px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                        placeholder={`Option ${idx + 1}`}
                                    />
                                    <input
                                        type="radio"
                                        name="correct"
                                        checked={formData.correct_answer === option && option !== ''}
                                        onChange={() => setFormData({ ...formData, correct_answer: option })}
                                        className="mt-3 w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                                        title="Mark as correct"
                                    />
                                </div>
                            ))}
                            <p className="text-xs text-slate-500 italic">* Select the radio button to mark the correct answer.</p>
                        </div>
                    )}

                    {/* Short Answer Correct Answer */}
                    {formData.type === 'short_answer' && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                Correct Answer (Keywords/Reference)
                            </label>
                            <input
                                type="text"
                                value={formData.correct_answer}
                                onChange={e => setFormData({ ...formData, correct_answer: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                                placeholder="Expected answer..."
                            />
                        </div>
                    )}

                    {/* Tags */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                            Tags (comma separated)
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full px-4 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white"
                            placeholder="e.g. NumPy, Array, Basics"
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors"
                        >
                            Save Question
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
