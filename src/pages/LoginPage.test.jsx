import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from './LoginPage'
import * as supabase from '../lib/supabase'

// Mock supabase lib
vi.mock('../lib/supabase', () => ({
    signInWithGoogle: vi.fn().mockResolvedValue({ error: null }),
    signInWithEmail: vi.fn()
}))

// Mock AuthContext
vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        loading: false
    })
}))

describe('LoginPage', () => {
    it('renders login options', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        expect(screen.getByText(/Welcome Back/i)).toBeInTheDocument()
        expect(screen.getByText(/Continue with Google/i)).toBeInTheDocument()
        expect(screen.getByText(/Browse Courses as Guest/i)).toBeInTheDocument()
    })

    it('calls signInWithGoogle when button is clicked', () => {
        render(
            <MemoryRouter>
                <LoginPage />
            </MemoryRouter>
        )

        const googleBtn = screen.getByText(/Continue with Google/i)
        fireEvent.click(googleBtn)

        expect(supabase.signInWithGoogle).toHaveBeenCalled()
    })
})
