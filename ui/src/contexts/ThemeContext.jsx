import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
    // Default to light theme for better learning experience
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('learnai-theme')
            if (saved) return saved
            // Check system preference
            if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                return 'dark'
            }
        }
        return 'light'
    })

    useEffect(() => {
        const root = document.documentElement

        if (theme === 'dark') {
            root.classList.add('dark')
            root.classList.remove('light')
        } else {
            root.classList.add('light')
            root.classList.remove('dark')
        }

        localStorage.setItem('learnai-theme', theme)
    }, [theme])

    const toggleTheme = () => {
        setTheme(prev => prev === 'dark' ? 'light' : 'dark')
    }

    return (
        <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return context
}
