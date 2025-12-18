import { useState, useEffect } from 'react'
import { Users, BookOpen, Clock, TrendingUp, UserCheck, Shield } from 'lucide-react'
import { dataProvider } from '../../lib/dataProvider'
import { supabase } from '../../lib/supabase'

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        users: 0,
        courses: 0,
        lessons: 0,
        admins: 0
    })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        loadStats()
    }, [])

    const loadStats = async () => {
        try {
            // Fetch real counts from Supabase
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
            const { count: adminCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'admin')

            const courses = await dataProvider.getCourses()
            const lessonCount = courses.reduce((acc, curr) => acc + (curr.lesson_count || 0), 0)

            setStats({
                users: userCount || 0,
                courses: courses.length,
                lessons: lessonCount,
                admins: adminCount || 0
            })
        } catch (error) {
            console.error('Failed to load stats', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-32 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 animate-pulse" />
                ))}
            </div>
        )
    }

    const StatCard = ({ icon: Icon, label, value, color, delay }) => (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
                    <h3 className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    )

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard Overview</h1>
                    <p className="text-slate-500 dark:text-slate-400">Welcome back to your command center</p>
                </div>
                <span className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-slate-500">
                    v2.0.0
                </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Users}
                    label="Total Students"
                    value={stats.users}
                    color="bg-blue-500"
                />
                <StatCard
                    icon={BookOpen}
                    label="Active Courses"
                    value={stats.courses}
                    color="bg-indigo-500"
                />
                <StatCard
                    icon={Clock}
                    label="Total Lessons"
                    value={stats.lessons}
                    color="bg-purple-500"
                />
                <StatCard
                    icon={Shield}
                    label="Admins"
                    value={stats.admins}
                    color="bg-emerald-500"
                />
            </div>

            {/* Recent Activity Section (Placeholder for now) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-indigo-500" />
                        Platform Growth
                    </h3>
                    <div className="h-48 flex items-center justify-center text-slate-400 text-sm bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-dashed border-slate-200 dark:border-slate-700">
                        Chart coming soon
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <UserCheck className="w-5 h-5 text-green-500" />
                        Recent Signups
                    </h3>
                    <div className="space-y-4">
                        {/* We could fetch real recent users here later */}
                        <div className="text-center py-8 text-slate-500 text-sm">
                            Real-time feed coming in v2.1
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
