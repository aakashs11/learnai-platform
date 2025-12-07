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

        expect(screen.getByText(/Your Journey to/i)).toBeInTheDocument()
        expect(screen.getByText(/Mastering AI/i)).toBeInTheDocument()
        expect(screen.getByText(/Start Learning Free/i)).toBeInTheDocument()
        expect(screen.getByText(/Browse Courses/i)).toBeInTheDocument()
    })

    it('has working navigation to courses page', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        const browseButton = screen.getByText(/Browse Courses/i)
        fireEvent.click(browseButton)

        expect(mockNavigate).toHaveBeenCalledWith('/courses')
    })

    it('displays curriculum topics correctly', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        expect(screen.getByText('Data Handling with Python')).toBeInTheDocument()
        expect(screen.getByText('Machine Learning & AI')).toBeInTheDocument()
    })

    it('displays stats section', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        )

        expect(screen.getAllByText('14+').length).toBeGreaterThan(0)
        expect(screen.getAllByText('Interactive Lessons').length).toBeGreaterThan(0)
    })
})
