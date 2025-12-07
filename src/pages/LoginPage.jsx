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
        <div className="min-h-screen bg-space-900 text-white flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-500/20 rounded-full blur-[100px] opacity-30" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-cyan/10 rounded-full blur-[100px] opacity-20" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative w-full max-w-md z-10"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-3 mb-4 group">
                        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] group-hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold font-heading tracking-wide">Learn<span className="text-neon-cyan">AI</span></span>
                    </Link>
                    <h1 className="text-3xl font-bold mb-2 font-heading">
                        {mode === 'login' ? 'Welcome Back' : 'Join the Crew'}
                    </h1>
                    <p className="text-slate-400">
                        {mode === 'login'
                            ? 'Enter the cockpit to resume your mission'
                            : 'Start your journey into Artificial Intelligence'}
                    </p>
                </div>

                {/* Auth Card */}
                <div className="glass-panel p-8 bg-space-800/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
                    {/* Google Sign In */}
                    <button
                        onClick={handleGoogleSignIn}
                        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white text-space-950 hover:bg-slate-200 font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)] mb-6"
                    >
                        <Chrome className="w-5 h-5" />
                        Continue with Google
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-space-800 text-slate-500">OR</span>
                        </div>
                    </div>

                    {/* Email Form */}
                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Email Coordinates</label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="pilot@learnai.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 bg-space-950/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/10 transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1.5">Access Code (Password)</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    minLength={6}
                                    className="w-full pl-10 pr-4 py-3 bg-space-950/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-neon-cyan/50 focus:ring-2 focus:ring-neon-cyan/10 transition-all"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className={`flex items-start gap-2 p-3 rounded-lg text-sm border ${error.includes('Check')
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                : 'bg-red-500/10 border-red-500/20 text-red-400'
                                }`}>
                                <Info className="w-4 h-4 mt-0.5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-3 bg-gradient-to-r from-neon-cyan to-blue-600 hover:from-neon-cyan hover:to-blue-500 disabled:opacity-50 text-space-950 font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)]"
                        >
                            {isSubmitting ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-space-950 border-t-transparent" />
                            ) : (
                                <>
                                    {mode === 'login' ? 'Initiate Launch' : 'Register Account'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Toggle mode */}
                    <p className="text-center text-slate-400 text-sm mt-6">
                        {mode === 'login' ? "New to the platform?" : 'Already a member?'}
                        <button
                            onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                            className="text-neon-cyan hover:text-white ml-1 font-bold transition-colors"
                        >
                            {mode === 'login' ? 'Join Now' : 'Sign In'}
                        </button>
                    </p>
                </div>

                {/* Browse as Guest */}
                <div className="text-center mt-8 space-y-3">
                    <p className="text-slate-500 text-sm">
                        Just exploring?
                    </p>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-space-800/50 hover:bg-space-800 border border-white/5 hover:border-white/20 text-slate-300 hover:text-white rounded-full text-sm font-medium transition-all"
                    >
                        <BookOpen className="w-4 h-4" />
                        Browse as Guest Visualizer
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}
