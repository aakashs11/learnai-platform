import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import * as AuthContext from '../contexts/AuthContext'

// Mock useAuth hook
vi.mock('../contexts/AuthContext', () => ({
    useAuth: vi.fn()
}))

describe('ProtectedRoute', () => {
    it('redirects unauthenticated users to login', () => {
        AuthContext.useAuth.mockReturnValue({
            user: null,
            loading: false,
            isAuthenticated: false
        })

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <Routes>
                    <Route path="/login" element={<div>Login Page</div>} />
                    <Route path="/protected" element={
                        <ProtectedRoute>
                            <div>Protected Content</div>
                        </ProtectedRoute>
                    } />
                </Routes>
            </MemoryRouter>
        )

        expect(screen.getByText('Login Page')).toBeInTheDocument()
        expect(screen.queryByText('Protected Content')).not.toBeInTheDocument()
    })

    it('renders content for authenticated users', () => {
        AuthContext.useAuth.mockReturnValue({
            user: { email: 'user@example.com' },
            loading: false,
            isAuthenticated: true
        })

        render(
            <MemoryRouter initialEntries={['/protected']}>
                <ProtectedRoute>
                    <div>Protected Content</div>
                </ProtectedRoute>
            </MemoryRouter>
        )

        expect(screen.getByText('Protected Content')).toBeInTheDocument()
    })

    it('allows admin access for correct email', () => {
        AuthContext.useAuth.mockReturnValue({
            user: {
                email: 'aakash.mufc@gmail.com',
                user_metadata: { role: 'admin' }
            },
            loading: false,
            isAuthenticated: true
        })

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <ProtectedRoute requireAdmin={true}>
                    <div>Admin Dashboard</div>
                </ProtectedRoute>
            </MemoryRouter>
        )

        expect(screen.getByText('Admin Dashboard')).toBeInTheDocument()
    })

    it('denies admin access for incorrect email', () => {
        AuthContext.useAuth.mockReturnValue({
            user: {
                email: 'other@example.com',
                user_metadata: { role: 'admin' }
            },
            loading: false,
            isAuthenticated: true
        })

        render(
            <MemoryRouter initialEntries={['/admin']}>
                <ProtectedRoute requireAdmin={true}>
                    <div>Admin Dashboard</div>
                </ProtectedRoute>
            </MemoryRouter>
        )

        expect(screen.getByText('Access Denied')).toBeInTheDocument()
        expect(screen.queryByText('Admin Dashboard')).not.toBeInTheDocument()
    })
})
