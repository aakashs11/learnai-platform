import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not found. Running in demo mode.')
}

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null

// Auth helper functions
export const signInWithGoogle = async () => {
    if (!supabase) {
        console.warn('Supabase not configured')
        return { error: { message: 'Auth not configured' } }
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: window.location.origin
        }
    })
    return { data, error }
}

export const signInWithEmail = async (email, password) => {
    if (!supabase) return { error: { message: 'Auth not configured' } }

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
    if (!supabase) return { error: null }

    const { error } = await supabase.auth.signOut()
    return { error }
}

export const getSession = async () => {
    if (!supabase) return { data: { session: null } }

    const { data, error } = await supabase.auth.getSession()
    return { data, error }
}

export const getUser = async () => {
    if (!supabase) return { data: { user: null } }

    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
}
