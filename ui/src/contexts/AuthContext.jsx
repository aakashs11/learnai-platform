import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, getSession, signOut as supabaseSignOut } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [session, setSession] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Get initial session
        getSession().then(({ data }) => {
            setSession(data?.session)
            setUser(data?.session?.user ?? null)
            setLoading(false)
        })

        // Listen for auth changes
        if (supabase) {
            const { data: { subscription } } = supabase.auth.onAuthStateChange(
                async (event, session) => {
                    setSession(session)
                    setUser(session?.user ?? null)
                    setLoading(false)
                }
            )

            return () => subscription.unsubscribe()
        } else {
            setLoading(false)
        }
    }, [])

    const signOut = async () => {
        await supabaseSignOut()
        setUser(null)
        setSession(null)
    }

    const value = {
        user,
        session,
        loading,
        signOut,
        isAuthenticated: !!user
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}
