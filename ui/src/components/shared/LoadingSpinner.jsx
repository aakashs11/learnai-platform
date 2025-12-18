export default function LoadingSpinner({ size = 'md', text }) {
    const sizes = {
        sm: 'h-4 w-4 border',
        md: 'h-8 w-8 border-2',
        lg: 'h-12 w-12 border-2'
    }

    return (
        <div className="flex flex-col items-center justify-center gap-3">
            <div
                className={`animate-spin rounded-full border-indigo-500 border-t-transparent ${sizes[size]}`}
            />
            {text && <p className="text-sm text-slate-500">{text}</p>}
        </div>
    )
}
