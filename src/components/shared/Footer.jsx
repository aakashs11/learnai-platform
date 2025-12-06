import { Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-slate-800 py-8 mt-auto">
            <div className="container mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-semibold text-white">LearnAI</span>
                    </Link>
                    <p className="text-slate-600 text-sm">
                        © {new Date().getFullYear()} LearnAI. Made with ❤️ for students.
                    </p>
                </div>
            </div>
        </footer>
    )
}
