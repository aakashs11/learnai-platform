import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'

// Initialize Mermaid with custom theme
mermaid.initialize({
    startOnLoad: false,
    theme: 'dark',
    themeVariables: {
        primaryColor: '#6366f1',
        primaryTextColor: '#fff',
        primaryBorderColor: '#818cf8',
        lineColor: '#94a3b8',
        secondaryColor: '#7c3aed',
        tertiaryColor: '#1e1b4b',
        background: '#0f172a',
        mainBkg: '#1e293b',
        nodeBorder: '#6366f1',
        clusterBkg: '#1e293b',
        clusterBorder: '#6366f1',
        titleColor: '#fff',
        edgeLabelBackground: '#1e293b',
        fontColor: '#e2e8f0'
    },
    flowchart: {
        curve: 'basis',
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 50
    }
})

/**
 * MermaidDiagram Component
 * Renders Mermaid diagrams for flowcharts, mindmaps, etc.
 */
export default function MermaidDiagram({
    code,
    title,
    caption,
    id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
}) {
    const containerRef = useRef(null)
    const [svg, setSvg] = useState('')
    const [error, setError] = useState(null)

    useEffect(() => {
        const renderDiagram = async () => {
            if (!code || !containerRef.current) return

            try {
                // Clear previous content
                setSvg('')
                setError(null)

                // Render the diagram
                const { svg: renderedSvg } = await mermaid.render(id, code)
                setSvg(renderedSvg)
            } catch (err) {
                console.error('Mermaid render error:', err)
                setError('Failed to render diagram')
            }
        }

        renderDiagram()
    }, [code, id])

    if (error) {
        return (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
                <p>⚠️ {error}</p>
                <pre className="mt-2 text-xs text-slate-500 overflow-x-auto">{code}</pre>
            </div>
        )
    }

    return (
        <div className="bg-slate-800/50 rounded-xl border border-slate-700/50 overflow-hidden">
            {title && (
                <div className="px-4 py-2 border-b border-slate-700/50 bg-slate-800/30">
                    <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                        <span className="text-indigo-400">📊</span>
                        {title}
                    </h4>
                </div>
            )}

            <div
                ref={containerRef}
                className="p-4 overflow-x-auto flex justify-center"
                dangerouslySetInnerHTML={{ __html: svg }}
            />

            {caption && (
                <div className="px-4 py-2 border-t border-slate-700/50 bg-slate-900/30">
                    <p className="text-xs text-slate-500 text-center italic">{caption}</p>
                </div>
            )}
        </div>
    )
}

/**
 * Pre-built diagram templates for common educational concepts
 */
export const diagramTemplates = {
    dataScienceMethodology: `graph TD
    A[📋 Business Understanding] --> B[🔍 Analytic Approach]
    B --> C[📊 Data Requirements]
    C --> D[📥 Data Collection]
    D --> E[🔎 Data Understanding]
    E --> F[🧹 Data Preparation]
    F --> G[🤖 Modeling]
    G --> H[✅ Evaluation]
    H --> I[🚀 Deployment]
    I --> J[📈 Feedback]
    J -.-> A
    
    style A fill:#6366f1,stroke:#818cf8
    style G fill:#7c3aed,stroke:#a78bfa
    style I fill:#10b981,stroke:#34d399`,

    machineLearningTypes: `graph LR
    ML[Machine Learning] --> SL[Supervised]
    ML --> UL[Unsupervised]
    ML --> RL[Reinforcement]
    
    SL --> REG[Regression]
    SL --> CLS[Classification]
    
    UL --> CLU[Clustering]
    UL --> DIM[Dimensionality Reduction]
    
    style ML fill:#6366f1
    style SL fill:#10b981
    style UL fill:#f59e0b
    style RL fill:#ef4444`,

    neuralNetworkBasic: `graph LR
    subgraph Input
        I1((x₁))
        I2((x₂))
        I3((x₃))
    end
    
    subgraph Hidden
        H1((h₁))
        H2((h₂))
    end
    
    subgraph Output
        O1((ŷ))
    end
    
    I1 --> H1
    I1 --> H2
    I2 --> H1
    I2 --> H2
    I3 --> H1
    I3 --> H2
    H1 --> O1
    H2 --> O1`,

    confusionMatrix: `graph TB
    subgraph Predicted
        PP[Positive]
        PN[Negative]
    end
    
    subgraph Actual
        AP[Positive] --> TP[✓ TP]
        AP --> FN[✗ FN]
        AN[Negative] --> FP[✗ FP]
        AN --> TN[✓ TN]
    end
    
    style TP fill:#10b981
    style TN fill:#10b981
    style FP fill:#ef4444
    style FN fill:#ef4444`,

    computerVisionPipeline: `graph LR
    A[📷 Image Acquisition] --> B[🧹 Preprocessing]
    B --> C[🔍 Feature Extraction]
    C --> D[📊 Detection/Segmentation]
    D --> E[🧠 Recognition]
    
    style A fill:#6366f1
    style C fill:#7c3aed
    style E fill:#10b981`
}
