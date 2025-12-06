import { useState } from 'react'
import { useNavigate, Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Mail, Lock, ArrowRight, Chrome, BookOpen, Info } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { signInWithGoogle, signInWithEmail, signUp } from '../lib/supabase'

export default function LoginPage() {
    const navigate = useNavigate()
    const { isAuthenticated, loading } = useAuth()
    const [mode, setMode] = useState('login') // 'login' or 'signup'
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Redirect if already logged in
    if (!loading && isAuthenticated) {
        return <Navigate to="/courses" replace />
    }

    const handleGoogleSignIn = async () => {
        setError('')
        const { error } = await signInWithGoogle()
        if (error) {
            if (error.message === 'Auth not configured') {
                setError('Authentication is being set up. Please use email/password or browse as guest.')
            } else {
                setError(error.message)
            }
        }
    }

    const handleEmailAuth = async (e) => {
        e.preventDefault()
        setError('')
        setIsSubmitting(true)

        try {
            if (mode === 'login') {
                const { error } = await signInWithEmail(email, password)
                if (error) throw error
                navigate('/courses')
            } else {
                const { error } = await signUp(email, password)
                if (error) throw error
                // Show success message for signup
                setError('Check your email for the confirmation link!')
            }
        } catch (err) {
            if (err.message?.includes('not configured') || err.message?.includes('Invalid API')) {
                setError('Authentication is being set up. Please browse courses as guest for now.')
            } else {
                setError(err.message || 'Authentication failed')
            }
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white flex items-center justify-center p-6">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-4">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold">LearnAI</span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2">
                        {mode === 'login' ? 'Welcome back' : 'Create account'}
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400">
                        {mode === 'login'
                            ? 'Sign in to track your progress'
                            : 'Start your AI learning journey'}
                    </p>
                </div>

                {/* Auth Card */}
                <div className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-lg">
                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-slate-100 dark:bg-white hover:bg-slate-200 dark:hover:bg-gray-100 text-gray-900 font-medium rounded-xl transition-colors mb-4"
                    >
                        <Chrome className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white dark:bg-slate-900 text-slate-600">or</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Email</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-1.5">Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className={`flex items-start gap-2 p-3 rounded-lg text-sm ${error.includes('Check')
                                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                                }`}>
                                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 text-white rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Create Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle mode */}
                    <p className="text-center text-slate-600 dark:text-slate-400 text-sm mt-6">
                        {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 ml-1 font-medium"
                        >
                            {mode === 'login' ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>

                {/* Browse as Guest */}
                <div className="text-center mt-6 space-y-3">
                    <p className="text-slate-600 dark:text-slate-600 text-sm">
                        Don't want to sign up yet?
                    </p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-sm font-medium transition-colors"
                    >
                        <BookOpen className="w-4 h-4" />
                        Browse Courses as Guest
                    </Link>
                    <p className="text-xs text-slate-500">
                        (Progress won't be saved across devices)
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
