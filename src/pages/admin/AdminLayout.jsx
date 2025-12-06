import { useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import {
    LayoutDashboard, BookOpen, FileText, Settings,
    LogOut, Menu, X, PlusCircle
} from 'lucide-react'
import ThemeToggle from '../../components/ThemeToggle'

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const location = useLocation()

    const navItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: BookOpen, label: 'Courses', path: '/admin/courses' },
        { icon: FileText, label: 'Question Bank', path: '/admin/questions' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ]

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex transition-colors duration-300">
            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header */}
                    <div className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                            LearnAI Admin
                        </span>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden ml-auto text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive
                                            ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium'
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                        <Link
                            to="/"
                            className="flex items-center gap-3 px-4 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Exit Admin
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Bar */}
                <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                    >
                        <Menu className="w-6 h-6" />
                    </button>

                    <div className="flex items-center gap-4 ml-auto">
                        <ThemeToggle />
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm">
                            A
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
