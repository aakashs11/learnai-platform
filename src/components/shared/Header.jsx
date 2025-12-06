import { Sparkles, ArrowLeft } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Header({
    showBack = false,
    backTo = '/courses',
    backLabel = 'All Courses',
    title,
    subtitle,
    xp
}) {
    const navigate = useNavigate()
    const { user, signOut } = useAuth()

    return (
        <header className="sticky top-0 z-10 backdrop-blur-md bg-slate-950/80 border-b border-white/10">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {showBack && (
                        <button
                            onClick={() => navigate(backTo)}
                            className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors text-sm"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">{backLabel}</span>
                        </button>
                    )}

                    <Link to="/" className="flex items-center gap-3">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        {title ? (
                            <div>
                                <h1 className="text-lg font-bold text-white">{title}</h1>
                                {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
                            </div>
                        ) : (
                            <span className="text-lg font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                                LearnAI
                            </span>
                        )}
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    {xp !== undefined && (
                        <span className="px-3 py-1.5 bg-yellow-500/10 text-yellow-400 rounded-full flex items-center gap-1.5 text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            {xp} XP
                        </span>
                    )}

                    {user ? (
                        <div className="flex items-center gap-3">
                            {user.user_metadata?.avatar_url && (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="Profile"
                                    className="w-8 h-8 rounded-full border border-white/20"
                                />
                            )}
                            <button
                                onClick={signOut}
                                className="text-sm text-slate-400 hover:text-white transition-colors"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : null}
                </div>
            </div>
        </header>
    )
}
