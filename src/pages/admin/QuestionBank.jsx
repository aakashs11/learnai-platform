import { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash, CheckCircle } from 'lucide-react'

export default function QuestionBank() {
    // Mock data
    const [questions, setQuestions] = useState([
        { id: 1, text: "What is the shape of a 3x3 NumPy array?", type: "Multiple Choice", difficulty: "Easy", tags: ["NumPy", "Arrays"] },
        { id: 2, text: "Explain the difference between Supervised and Unsupervised Learning.", type: "Short Answer", difficulty: "Medium", tags: ["ML", "Concepts"] },
        { id: 3, text: "Which activation function is best for hidden layers?", type: "Multiple Choice", difficulty: "Hard", tags: ["Neural Networks"] },
    ])

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Question Bank</h1>
                    <p className="text-slate-500 dark:text-slate-400">Manage assessment questions and generate papers</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        Generate Paper
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        <Plus className="w-5 h-5" />
                        Add Question
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-4 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search questions..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Questions List */}
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    {questions.map(q => (
                        <div key={q.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400' :
                                                q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400' :
                                                    'bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-400'
                                            }`}>
                                            {q.difficulty}
                                        </span>
                                        <span className="text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded-full">
                                            {q.type}
                                        </span>
                                    </div>
                                    <p className="text-slate-900 dark:text-white font-medium">{q.text}</p>
                                    <div className="flex gap-2 mt-2">
                                        {q.tags.map(tag => (
                                            <span key={tag} className="text-xs text-slate-500 dark:text-slate-400">#{tag}</span>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
