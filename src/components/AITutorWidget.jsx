import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, X, Sparkles, Bot, Minimize2, Rocket } from 'lucide-react'
import { useAITutor } from '../hooks/useAITutor'

export default function AITutorWidget({ lessonContext }) {
    const { messages, isThinking, isOpen, toggleOpen, sendMessage } = useAITutor(lessonContext)
    const [inputValue, setInputValue] = useState('')
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isThinking, isOpen])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!inputValue.trim()) return
        sendMessage(inputValue)
        setInputValue('')
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto w-[350px] md:w-[400px] h-[500px] bg-space-900/90 backdrop-blur-xl border border-neon-cyan/30 rounded-2xl shadow-[0_0_40px_rgba(0,240,255,0.15)] flex flex-col overflow-hidden mb-4"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-space-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-gradient-to-br from-neon-cyan to-nebula-end rounded-lg shadow-lg shadow-neon-cyan/20">
                                    <Bot className="w-5 h-5 text-black" />
                                </div>
                                <div>
                                    <h3 className="font-heading font-bold text-white tracking-wide">AI Copilot</h3>
                                    <p className="text-xs text-neon-cyan font-mono flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        ONLINE
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleOpen}
                                className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                            >
                                <Minimize2 className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-space-700 scrollbar-track-transparent">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] rounded-2xl p-3.5 text-sm leading-relaxed shadow-md ${msg.role === 'user'
                                                ? 'bg-gradient-to-r from-neon-cyan to-nebula-end text-black font-medium rounded-tr-sm'
                                                : 'bg-space-800 border border-white/10 text-slate-200 rounded-tl-sm'
                                            }`}
                                    >
                                        <div className="whitespace-pre-wrap">{msg.content}</div>
                                    </div>
                                </div>
                            ))}

                            {isThinking && (
                                <div className="flex justify-start">
                                    <div className="bg-space-800 border border-white/10 rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                                        <div className="w-2 h-2 bg-neon-cyan rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-2 h-2 bg-neon-cyan/80 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2 h-2 bg-neon-cyan/60 rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-space-800/30">
                            <div className="relative flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask about this lesson..."
                                    className="w-full bg-space-900/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-all placeholder:text-slate-500"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim() || isThinking}
                                    className="absolute right-2 p-1.5 bg-neon-cyan/10 hover:bg-neon-cyan/20 text-neon-cyan rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Toggle Button */}
            <motion.button
                layout
                onClick={toggleOpen}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`pointer-events-auto relative group overflow-hidden w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,240,255,0.3)] transition-all ${isOpen ? 'bg-space-800 border border-white/20' : 'bg-gradient-to-br from-neon-cyan to-nebula-end border-2 border-white/20'
                    }`}
            >
                {/* Glow effect */}
                {!isOpen && (
                    <div className="absolute inset-0 bg-white/20 blur-md group-hover:blur-lg transition-all animate-pulse" />
                )}

                <div className="relative z-10">
                    {isOpen ? (
                        <X className="w-6 h-6 text-slate-300" />
                    ) : (
                        <Rocket className="w-7 h-7 text-black fill-current transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                    )}
                </div>
            </motion.button>
        </div>
    )
}
