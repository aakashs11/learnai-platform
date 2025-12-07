import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Running in demo/mock mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Mock user for demo mode
const MOCK_ADMIN = {
    id: 'mock-admin-id',
    email: 'aakash.mufc@gmail.com',
    user_metadata: { role: 'admin', full_name: 'Demo Admin' }
}

const MOCK_SESSION = {
    user: MOCK_ADMIN,
    access_token: 'mock-token',
    expires_at: Date.now() + 3600 * 1000
}

// Auth helper functions
export const signInWithGoogle = async () => {
    if (!supabase) {
        // Mock successful login for demo
        localStorage.setItem('demo_session', JSON.stringify(MOCK_SESSION))
        return { data: { session: MOCK_SESSION }, error: null }
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: `${window.location.origin}/auth/callback`
        }
    })
    return { data, error }
}

export const signInWithEmail = async (email, password) => {
    if (!supabase) {
        // Mock login
        if (email === 'aakash.mufc@gmail.com') {
            localStorage.setItem('demo_session', JSON.stringify(MOCK_SESSION))
            return { data: { session: MOCK_SESSION }, error: null }
        }
        return { error: { message: 'Auth not configured. Use aakash.mufc@gmail.com for admin demo.' } }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { data, error }
}

export const signUp = async (email, password) => {
    if (!supabase) return { error: { message: 'Auth not configured' } }

    const { data, error } = await supabase.auth.signUp({
        email,
        password
    })
    return { data, error }
}

export const signOut = async () => {
    if (!supabase) {
        localStorage.removeItem('demo_session')
        return { error: null }
    }

    const { error } = await supabase.auth.signOut()
    return { error }
}

export const getSession = async () => {
    if (!supabase) {
        const stored = localStorage.getItem('demo_session')
        return { data: { session: stored ? JSON.parse(stored) : null }, error: null }
    }

    const { data, error } = await supabase.auth.getSession()
    return { data, error }
}

export const getUser = async () => {
    if (!supabase) {
        const stored = localStorage.getItem('demo_session')
        const session = stored ? JSON.parse(stored) : null
        return { data: { user: session?.user || null }, error: null }
    }

    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
}
