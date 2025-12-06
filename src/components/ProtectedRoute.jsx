import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

/**
 * ProtectedRoute - Wraps routes that require authentication
 * Optionally requires admin role
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
        const isAdmin = user?.user_metadata?.role === 'admin' ||
            user?.email?.endsWith('@admin.com') ||
            // Add your admin email here
            user?.email === 'aakash@example.com'

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
