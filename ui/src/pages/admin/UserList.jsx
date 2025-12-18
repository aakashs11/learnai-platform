import { useState, useEffect } from 'react'
import { Search, Shield, User, Mail, Calendar, MoreVertical, AlertTriangle } from 'lucide-react'
import { supabase } from '../../lib/supabase'

export default function UserList() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        loadUsers()
    }, [])

    const loadUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .order('created_at', { ascending: false })

            if (error) throw error
            setUsers(data || [])
        } catch (err) {
            console.error('Failed to load users', err)
            setError('Could not load users. You might need to check RLS policies.')
        } finally {
            setLoading(false)
        }
    }

    const toggleRole = async (userId, currentRole) => {
        setUpdating(userId)
        const newRole = currentRole === 'admin' ? 'student' : 'admin'

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)

            if (error) throw error

            // Optimistic update
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
        } catch (err) {
            console.error('Failed to update role', err)
            alert('Failed to update role. Ensure you have RLS permissions.')
        } finally {
            setUpdating(null)
        }
    }

    if (loading) return (
        <div className="space-y-4">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-16 bg-white dark:bg-slate-800 rounded-lg animate-pulse" />
            ))}
        </div>
    )

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">User Management</h1>
                    <p className="text-slate-500 dark:text-slate-400">View and manage enrolled students</p>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    {error}
                </div>
            )}

            <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500 font-semibold tracking-wider">
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">Joined</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.display_name} className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-5 h-5 text-slate-400" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-medium text-slate-900 dark:text-white">
                                                {user.display_name || 'Anonymous User'}
                                            </div>
                                            <div className="text-sm text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                                {user.email || 'No email hidden'}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium border ${user.role === 'admin'
                                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                                            : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800'
                                        }`}>
                                        {user.role === 'admin' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-slate-500">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-right">
                                    <button
                                        onClick={() => toggleRole(user.id, user.role)}
                                        disabled={updating === user.id}
                                        className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 disabled:opacity-50 transition-colors"
                                    >
                                        {updating === user.id ? 'Updating...' : (
                                            user.role === 'admin' ? 'Demote to Student' : 'Promote to Admin'
                                        )}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {users.length === 0 && !loading && (
                    <div className="p-8 text-center text-slate-500">No users found</div>
                )}
            </div>
        </div>
    )
}
