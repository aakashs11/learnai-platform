import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import App from '../../App'
import { AuthProvider } from '../../contexts/AuthContext'


// Mock Auth
const mockAdminUser = {
    email: 'aakash.mufc@gmail.com',
    role: 'admin'
}

vi.mock('../../contexts/AuthContext', async () => {
    const actual = await vi.importActual('../../contexts/AuthContext')
    return {
        ...actual,
        useAuth: () => ({
            user: mockAdminUser,
            isAuthenticated: true,
            loading: false
        })
    }
})

// Mock Supabase
vi.mock('../../lib/supabase', () => ({
    supabase: {
        from: () => ({
            select: () => ({ data: [], error: null }),
            update: () => ({ data: [], error: null }),
            insert: () => ({ data: [], error: null })
        })
    }
}))

// Mock dataProvider
vi.mock('../../lib/dataProvider', () => ({
    dataProvider: {
        getLesson: vi.fn().mockResolvedValue({
            id: 'lesson01',
            title: 'Mock Lesson',
            content: 'Mock Content',
            theory: []
        }),
        updateLesson: vi.fn().mockResolvedValue(true)
    }
}))

describe('Admin Console Flow', () => {
    beforeAll(() => {
        // Mock Browser APIs
        vi.stubGlobal('localStorage', {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn(),
        })
        vi.stubGlobal('matchMedia', vi.fn().mockImplementation(query => ({
            matches: false,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
        })))
        vi.stubGlobal('IntersectionObserver', class {
            constructor() {
                this.observe = vi.fn()
                this.unobserve = vi.fn()
                this.disconnect = vi.fn()
            }
        })
    })

    it('shows admin link for admin users', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        )
        expect(screen.getByText('[ADMIN]')).toBeInTheDocument()
    })

    it('navigates to dashboard on click', async () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        )

        fireEvent.click(screen.getByText('[ADMIN]'))
        await waitFor(() => expect(screen.getByText('LearnAI Admin')).toBeInTheDocument())
    })

    it('loads lesson editor and saves changes', async () => {
        render(
            <MemoryRouter initialEntries={['/admin/lesson/lesson01']}>
                <App />
            </MemoryRouter>
        )

        // Wait for editor to load mock lesson
        await waitFor(() => expect(screen.getByText(/Edit Lesson/i)).toBeInTheDocument())

        // Make a change
        const saveButton = screen.getByText(/Save Changes/i)
        fireEvent.click(saveButton)

        // Wait for save to complete and button to be re-enabled
        await waitFor(() => expect(saveButton).toBeEnabled())
    })
})
