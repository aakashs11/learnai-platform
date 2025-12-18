import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Sparkles } from 'lucide-react'

/**
 * AuthCallback - Handles OAuth redirect callback
 * Processes the access_token from URL fragment and redirects to courses
 */
export default function AuthCallback() {
    const navigate = useNavigate()
    const [error, setError] = useState(null)

    useEffect(() => {
        const handleCallback = async () => {
            try {
                // Supabase automatically handles the hash fragment
                // We just need to wait for the session to be established
                const { data: { session }, error } = await supabase.auth.getSession()

                if (error) {
                    console.error('Auth callback error:', error)
                    setError(error.message)
                    return
                }

                if (session) {
                    // Successfully authenticated, redirect to courses
                    navigate('/courses', { replace: true })
                } else {
                    // No session, might still be processing
                    // Listen for auth state change
                    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                        if (event === 'SIGNED_IN' && session) {
                            navigate('/courses', { replace: true })
                        }
                    })

                    // Cleanup subscription after 10 seconds timeout
                    setTimeout(() => {
                        subscription?.unsubscribe()
                        if (!session) {
                            setError('Authentication timed out. Please try again.')
                        }
                    }, 10000)
                }
            } catch (err) {
                console.error('Callback processing error:', err)
                setError('Failed to process authentication')
            }
        }

        handleCallback()
    }, [navigate])

    if (error) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
                <div className="text-center">
                    <div className="p-3 bg-red-500/20 rounded-full w-fit mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-red-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">Authentication Error</h1>
                    <p className="text-slate-400 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent mx-auto mb-4" />
                <p className="text-slate-400">Completing sign in...</p>
            </div>
        </div>
    )
}
