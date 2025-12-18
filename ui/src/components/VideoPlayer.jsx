import { useState } from 'react'
import { Play, CheckCircle } from 'lucide-react'

export default function VideoPlayer({ videoId, title, onComplete }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isCompleted, setIsCompleted] = useState(false)

    const handlePlay = () => {
        setIsPlaying(true)
    }

    // In a real app with YouTube IFrame API, we would track progress here
    // For now, we'll mark as complete when the user clicks "Mark as Watched" or similar
    // or just assume if they played it, they might have watched it.

    return (
        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl mb-8 group">
            {!isPlaying ? (
                <div className="relative aspect-video cursor-pointer" onClick={handlePlay}>
                    {/* Thumbnail Placeholder - in real app use ytimg */}
                    <img
                        src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                        alt={title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 bg-indigo-600/90 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:scale-110 transition-transform">
                            <Play className="w-8 h-8 text-white fill-current ml-1" />
                        </div>
                    </div>
                    <div className="absolute bottom-4 left-4 px-3 py-1 bg-black/70 rounded-lg text-xs font-medium text-white backdrop-blur-md">
                        Video Tutorial
                    </div>
                </div>
            ) : (
                <div className="relative aspect-video">
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0"
                    />
                </div>
            )}
        </div>
    )
}
