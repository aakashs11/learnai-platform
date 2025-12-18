import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ADMIN_EMAIL } from '../config/routes'

/**
 * ProtectedRoute - Wraps routes that require authentication
 * 
 * Usage:
 * - Basic: <Route element={<ProtectedRoute />}> for login-required routes
 * - Admin: <Route element={<ProtectedRoute requireAdmin />}> for admin-only routes
 */
export default function ProtectedRoute({
    children,
    requireAdmin = false
}) {
    const { user, loading, isAuthenticated } = useAuth()

    // Show loading while checking auth
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-500 border-t-transparent" />
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    // Check admin role if required
    if (requireAdmin) {
        const isAdmin = user?.email === ADMIN_EMAIL

        if (!isAdmin) {
            return (
                <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                        <p className="text-slate-500">You don't have permission to access this page.</p>
                    </div>
                </div>
            )
        }
    }

    return children
}
