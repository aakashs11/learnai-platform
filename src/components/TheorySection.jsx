import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, FileText } from 'lucide-react'

export default function TheorySection({ unit, keyConcepts, objectives }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="bg-slate-800/30 rounded-xl border border-slate-700/50 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-800/50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-white">Theory & Concepts</h4>
                        <p className="text-xs text-slate-500">
                            Unit {unit.number}: {unit.title} • Pages {unit.pageStart}-{unit.pageEnd}
                        </p>
                    </div>
                </div>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="p-4 pt-0 space-y-4">
                            {/* Learning Objectives */}
                            <div>
                                <h5 className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    Learning Objectives
                                </h5>
                                <ul className="space-y-1">
                                    {objectives.map((obj, idx) => (
                                        <li key={idx} className="text-sm text-slate-500 pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-indigo-400">
                                            {obj}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Key Concepts */}
                            <div>
                                <h5 className="text-sm font-medium text-slate-300 mb-2">Key Concepts</h5>
                                <div className="flex flex-wrap gap-2">
                                    {keyConcepts.map((concept, idx) => (
                                        <span
                                            key={idx}
                                            className="px-3 py-1 bg-slate-700/50 text-slate-300 text-xs rounded-full"
                                        >
                                            {concept}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Handbook Reference */}
                            <div className="pt-2 border-t border-slate-700/50">
                                <p className="text-xs text-slate-600 flex items-center gap-1">
                                    📖 Reference: AI Student Handbook XII, Pages {unit.pageStart}-{unit.pageEnd}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
