import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, Copy, Check, RotateCcw, Loader2, Terminal, Image } from 'lucide-react'

// Load Pyodide dynamically
let pyodideInstance = null
let pyodideLoading = false
let loadCallbacks = []

const loadPyodide = async () => {
    if (pyodideInstance) return pyodideInstance

    if (pyodideLoading) {
        return new Promise((resolve) => {
            loadCallbacks.push(resolve)
        })
    }

    pyodideLoading = true

    // Load Pyodide script if not already loaded
    if (!window.loadPyodide) {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
        await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = reject
            document.head.appendChild(script)
        })
    }

    pyodideInstance = await window.loadPyodide({
        indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/'
    })

    // Preload common packages including matplotlib
    await pyodideInstance.loadPackage(['numpy', 'pandas', 'matplotlib'])

    // Setup matplotlib for inline display
    pyodideInstance.runPython(`
import matplotlib
matplotlib.use('AGG')
import matplotlib.pyplot as plt
import io
import base64

def get_plot_as_base64():
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight', 
                facecolor='#1e293b', edgecolor='none')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    plt.close()
    return img_base64
  `)

    pyodideLoading = false
    loadCallbacks.forEach(cb => cb(pyodideInstance))
    loadCallbacks = []

    return pyodideInstance
}

export default function InteractiveCode({ initialCode, title, explanation, expectedOutput }) {
    const [code, setCode] = useState(initialCode)
    const [output, setOutput] = useState('')
    const [plotImage, setPlotImage] = useState(null)
    const [isRunning, setIsRunning] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [copied, setCopied] = useState(false)
    const [pyodideReady, setPyodideReady] = useState(false)
    const textareaRef = useRef(null)

    useEffect(() => {
        // Preload Pyodide in background
        loadPyodide().then(() => setPyodideReady(true)).catch(console.error)
    }, [])

    const handleCopy = () => {
        navigator.clipboard.writeText(code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleReset = () => {
        setCode(initialCode)
        setOutput('')
        setPlotImage(null)
    }

    const runCode = async () => {
        setIsRunning(true)
        setOutput('')
        setPlotImage(null)

        try {
            if (!pyodideReady) {
                setIsLoading(true)
                await loadPyodide()
                setPyodideReady(true)
                setIsLoading(false)
            }

            const pyodide = pyodideInstance

            // Capture stdout
            pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `)

            // Check if code uses matplotlib
            const usesPlot = code.includes('plt.') || code.includes('matplotlib')

            // Run user code
            try {
                await pyodide.runPythonAsync(code)
                const stdout = pyodide.runPython('sys.stdout.getvalue()')

                // Check for matplotlib figure
                if (usesPlot) {
                    try {
                        // Check if there's a figure to save
                        const hasFigure = pyodide.runPython(`
import matplotlib.pyplot as plt
len(plt.get_fignums()) > 0
            `)

                        if (hasFigure) {
                            const imgBase64 = pyodide.runPython('get_plot_as_base64()')
                            setPlotImage(`data:image/png;base64,${imgBase64}`)
                        }
                    } catch (plotErr) {
                        console.log('No plot to display')
                    }
                }

                setOutput(stdout || '✓ Code executed successfully')
            } catch (err) {
                setOutput(`Error: ${err.message}`)
            }

        } catch (err) {
            setOutput(`Failed to run code: ${err.message}`)
        }

        setIsRunning(false)
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
                    <span className="text-xs text-slate-400 ml-2">{title || 'Python'}</span>
                    {!pyodideReady && (
                        <span className="text-xs text-amber-400 flex items-center gap-1">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Loading Python...
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={handleReset}
                        className="p-1.5 hover:bg-slate-700 rounded-md transition-colors"
                        title="Reset code"
                    >
                        <RotateCcw className="w-4 h-4 text-slate-400" />
                    </button>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-slate-700 rounded-md transition-colors"
                        title="Copy code"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-emerald-400" />
                        ) : (
                            <Copy className="w-4 h-4 text-slate-400" />
                        )}
                    </button>
                </div>
            </div>

            {/* Code Editor */}
            <div className="relative">
                <textarea
                    ref={textareaRef}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full bg-transparent text-slate-300 font-mono text-sm p-4 resize-none focus:outline-none min-h-[200px]"
                    spellCheck={false}
                    style={{
                        lineHeight: '1.5',
                        tabSize: 4
                    }}
                />
            </div>

            {/* Run Button */}
            <div className="px-4 py-3 bg-slate-800/30 border-t border-slate-700 flex items-center justify-between">
                <button
                    onClick={runCode}
                    disabled={isRunning || isLoading}
                    className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
                >
                    {isRunning || isLoading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {isLoading ? 'Loading Python...' : 'Running...'}
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4" />
                            Run Code
                        </>
                    )}
                </button>

                {pyodideReady && (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                        ✓ Python + NumPy + Pandas + Matplotlib ready
                    </span>
                )}
            </div>

            {/* Plot Output */}
            {plotImage && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-slate-700"
                >
                    <div className="px-4 py-2 bg-slate-950 flex items-center gap-2">
                        <Image className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Plot Output</span>
                    </div>
                    <div className="p-4 bg-slate-950 flex justify-center">
                        <img
                            src={plotImage}
                            alt="Matplotlib plot"
                            className="max-w-full rounded-lg border border-slate-700"
                        />
                    </div>
                </motion.div>
            )}

            {/* Text Output */}
            {output && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="border-t border-slate-700"
                >
                    <div className="px-4 py-2 bg-slate-950 flex items-center gap-2">
                        <Terminal className="w-4 h-4 text-slate-500" />
                        <span className="text-xs text-slate-500 uppercase tracking-wider">Output</span>
                    </div>
                    <pre className="p-4 text-sm font-mono text-slate-300 bg-slate-950 overflow-x-auto whitespace-pre-wrap">
                        {output}
                    </pre>
                </motion.div>
            )}

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
