import { useState } from 'react'
import { Save, Globe, Layout, Shield } from 'lucide-react'

export default function Settings() {
    return (
        <div className="max-w-4xl space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Platform Settings</h1>
                <p className="text-slate-500 dark:text-slate-400">Configure global options and home page content</p>
            </div>

            <div className="grid gap-6">
                {/* General Settings */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400">
                            <Globe className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">General Information</h2>
                    </div>

                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Platform Name</label>
                            <input type="text" defaultValue="LearnAI" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Support Email</label>
                            <input type="email" defaultValue="support@learnai.in" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                        </div>
                    </div>
                </div>

                {/* Home Page Config */}
                <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg text-purple-600 dark:text-purple-400">
                            <Layout className="w-5 h-5" />
                        </div>
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Home Page Configuration</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero Title</label>
                            <input type="text" defaultValue="Master Artificial Intelligence" className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Hero Subtitle</label>
                            <textarea rows={3} defaultValue="Comprehensive curriculum for CBSE Class 12 AI. Learn Python, Data Science, and Computer Vision." className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white" />
                        </div>
                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="show-testimonials" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                            <label htmlFor="show-testimonials" className="text-sm text-slate-700 dark:text-slate-300">Show Testimonials Section</label>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                        <Save className="w-4 h-4" />
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    )
}
