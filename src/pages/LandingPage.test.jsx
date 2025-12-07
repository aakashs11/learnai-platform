import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from './LandingPage'

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        button: ({ children, onClick, ...props }) => <button onClick={onClick} {...props}>{children}</button>,
        section: ({ children, ...props }) => <section {...props}>{children}</section>,
    },
    useScroll: () => ({ scrollYProgress: { current: 0 } }),
    useTransform: () => 1,
}))

// Mock supabase
vi.mock('../lib/supabase', () => ({
    signInWithGoogle: vi.fn().mockResolvedValue({ data: null, error: null })
}))

// Mock AuthContext
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockNavigate
    }
})

vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        isAuthenticated: false,
        loading: false
    })
}))

describe('LandingPage', () => {
    beforeEach(() => {
        mockNavigate.mockClear()
    })

    it('renders hero section with correct content', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        expect(screen.getByText(/AI is not magic/i)).toBeInTheDocument()
        expect(screen.getByText(/It is Engineering/i)).toBeInTheDocument()
        expect(screen.getByText(/Run Python Lab/i)).toBeInTheDocument()
    })

    it('has working navigation to courses page', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        const labButton = screen.getByText(/Run Python Lab/i)
        fireEvent.click(labButton)

        expect(mockNavigate).toHaveBeenCalledWith('/courses/class-12-ai')
    })

    it('displays instructor section', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        expect(screen.getByText('Aakash Singh')).toBeInTheDocument()
        expect(screen.getByText('IIT Bombay Alumnus & AI Educator')).toBeInTheDocument()
    })
})
