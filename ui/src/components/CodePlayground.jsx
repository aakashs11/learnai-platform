import { useState } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, Check, RotateCcw } from 'lucide-react'

export default function CodePlayground({ code, language = 'python', title, explanation }) {
    const [copied, setCopied] = useState(false)
    const [showOutput, setShowOutput] = useState(false)

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-slate-800/50 border-b border-slate-700">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <span className="w-3 h-3 rounded-full bg-red-500/80" />
                        <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                        <span className="w-3 h-3 rounded-full bg-green-500/80" />
                    </div>
                    <span className="text-xs text-slate-500 ml-2">{title || `${language} code`}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-slate-700 rounded-md transition-colors"
                        title="Copy code"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <Copy className="w-4 h-4 text-slate-500" />
                        )}
                    </button>
                </div>
            </div>

            {/* Code */}
            <div className="p-4 overflow-x-auto">
                <pre className="text-sm font-mono">
                    <code className="text-slate-300">
                        {code.split('\n').map((line, i) => (
                            <div key={i} className="flex">
                                <span className="text-slate-600 select-none w-8 text-right pr-4">{i + 1}</span>
                                <span className="flex-1">
                                    {highlightSyntax(line, language)}
                                </span>
                            </div>
                        ))}
                    </code>
                </pre>
            </div>

            {/* Explanation */}
            {explanation && (
                <div className="px-4 py-3 bg-indigo-500/10 border-t border-slate-700">
                    <p className="text-sm text-slate-300">
                        <span className="text-indigo-400 font-medium">💡 </span>
                        {explanation}
                    </p>
                </div>
            )}
        </div>
    )
}

// Simple syntax highlighting
function highlightSyntax(line, language) {
    if (language !== 'python') return line

    // Keywords
    const keywords = ['import', 'from', 'def', 'class', 'return', 'if', 'else', 'elif', 'for', 'while', 'in', 'as', 'with', 'try', 'except', 'True', 'False', 'None', 'and', 'or', 'not', 'print']
    const builtins = ['pd', 'np', 'DataFrame', 'Series', 'array', 'read_csv', 'to_csv', 'head', 'tail', 'shape', 'isnull', 'fillna', 'dropna', 'len', 'range', 'str', 'int', 'float', 'list', 'dict']

    let result = []
    let remaining = line

    // Process the line character by character
    while (remaining.length > 0) {
        // Check for comments
        if (remaining.startsWith('#')) {
            result.push(<span key={result.length} className="text-slate-600">{remaining}</span>)
            break
        }

        // Check for strings
        const stringMatch = remaining.match(/^(["'])(.*?)\1/)
        if (stringMatch) {
            result.push(<span key={result.length} className="text-emerald-400">{stringMatch[0]}</span>)
            remaining = remaining.slice(stringMatch[0].length)
            continue
        }

        // Check for keywords
        let foundKeyword = false
        for (const kw of keywords) {
            const regex = new RegExp(`^\\b${kw}\\b`)
            if (regex.test(remaining)) {
                result.push(<span key={result.length} className="text-purple-400">{kw}</span>)
                remaining = remaining.slice(kw.length)
                foundKeyword = true
                break
            }
        }
        if (foundKeyword) continue

        // Check for builtins
        let foundBuiltin = false
        for (const bi of builtins) {
            const regex = new RegExp(`^\\b${bi}\\b`)
            if (regex.test(remaining)) {
                result.push(<span key={result.length} className="text-cyan-400">{bi}</span>)
                remaining = remaining.slice(bi.length)
                foundBuiltin = true
                break
            }
        }
        if (foundBuiltin) continue

        // Check for numbers
        const numMatch = remaining.match(/^\d+\.?\d*/)
        if (numMatch) {
            result.push(<span key={result.length} className="text-amber-400">{numMatch[0]}</span>)
            remaining = remaining.slice(numMatch[0].length)
            continue
        }

        // Default: add single character
        result.push(remaining[0])
        remaining = remaining.slice(1)
    }

    return result
}
