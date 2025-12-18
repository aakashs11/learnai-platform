import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2, Check } from 'lucide-react'
import { uploadImage } from '../../lib/supabase'

export default function ImageUploader({ onUpload, className = '' }) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [preview, setPreview] = useState(null)
    const [uploadedUrl, setUploadedUrl] = useState(null)

    const handleDragOver = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback(async (e) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = e.dataTransfer.files
        if (files && files[0]) {
            await processFile(files[0])
        }
    }, [])

    const handleFileSelect = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            await processFile(file)
        }
    }

    const processFile = async (file) => {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, GIF, etc.)')
            return
        }

        // Show preview
        const reader = new FileReader()
        reader.onload = () => setPreview(reader.result)
        reader.readAsDataURL(file)

        // Upload to Supabase Storage
        setUploading(true)
        try {
            const { url, error } = await uploadImage(file)

            if (error) {
                alert(`Upload failed: ${error.message}`)
                return
            }

            setUploadedUrl(url)
            onUpload?.(url)
        } catch (err) {
            console.error('Upload error:', err)
            alert('Failed to upload image')
        } finally {
            setUploading(false)
        }
    }

    const clearUpload = () => {
        setPreview(null)
        setUploadedUrl(null)
    }

    return (
        <div className={`relative ${className}`}>
            {/* Preview State */}
            {preview ? (
                <div className="relative rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                    <img
                        src={preview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                    />

                    {/* Upload Status Overlay */}
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        {uploading ? (
                            <div className="flex items-center gap-2 text-white">
                                <Loader2 className="w-6 h-6 animate-spin" />
                                <span className="text-sm font-medium">Uploading...</span>
                            </div>
                        ) : uploadedUrl ? (
                            <div className="flex items-center gap-2 text-green-400">
                                <Check className="w-6 h-6" />
                                <span className="text-sm font-medium">Uploaded!</span>
                            </div>
                        ) : null}
                    </div>

                    {/* Clear Button */}
                    <button
                        onClick={clearUpload}
                        className="absolute top-2 right-2 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ) : (
                /* Drop Zone */
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`
                        relative h-48 rounded-xl border-2 border-dashed transition-all cursor-pointer
                        flex flex-col items-center justify-center gap-3
                        ${isDragging
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                            : 'border-slate-300 dark:border-slate-600 hover:border-indigo-400 dark:hover:border-indigo-500 bg-slate-50 dark:bg-slate-900/50'
                        }
                    `}
                >
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className={`p-3 rounded-full ${isDragging ? 'bg-indigo-100 dark:bg-indigo-800' : 'bg-slate-100 dark:bg-slate-800'}`}>
                        {isDragging ? (
                            <Upload className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                        )}
                    </div>

                    <div className="text-center">
                        <p className={`font-medium ${isDragging ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>
                            {isDragging ? 'Drop image here' : 'Drag & drop an image'}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                            or click to browse • PNG, JPG, GIF
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}
