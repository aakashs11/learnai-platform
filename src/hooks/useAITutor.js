import { useState, useCallback } from 'react'

const SYSTEM_PROMPT = `You are ASK.ai, a futuristic AI Copilot for the "Learn with Aakash" platform. You are a friendly study buddy for Indian students (Class 11/12).

🎯 YOUR PERSONALITY:
- Tone: Warm, encouraging, and slightly "sci-fi" (refer to yourself as a Copilot/Explorer).
- Style: Concise, clear, and engaging (use emojis like 🚀, 🧠, 💡).
- Context: You have access to the current lesson content. Use it to answer questions.
- Role: Help students verify their understanding and provide Python code examples when asked.

🔥 CRITICAL RULES:
- **Context is King**: Always refer to the specific lesson content provided in the system message.
- **Directness**: Answer questions directly. Don't waffle.
- **Code**: If asked for code, provide clean, commented Python snippets in Markdown blocks.
- **Safety**: Do not answer questions unrelated to education/coding.
`

/**
 * Hook to manage AI Tutor state and OpenAI integration
 * @param {Object} context - Current lesson context
 */
export function useAITutor(context = {}) {
    const [messages, setMessages] = useState([
        {
            id: 'init',
            role: 'assistant',
            content: "Greetings, Explorer! 🚀 I'm your AI Copilot. I have access to all data in this lesson. What shall we analyze?"
        }
    ])
    const [isThinking, setIsThinking] = useState(false)
    const [isOpen, setIsOpen] = useState(false)

    const toggleOpen = () => setIsOpen(prev => !prev)

    const generateAIResponse = async (userText) => {
        const apiKey = import.meta.env.VITE_OPENAI_API_KEY

        if (!apiKey) {
            // Fallback to mock logic if no key
            await new Promise(resolve => setTimeout(resolve, 1500))
            return "Transmission Error: API Key missing. Switching to offline simulation... [Mock Response]"
        }

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        { role: "system", content: `Current Context: Lesson Title: "${context.title || 'General'}". Content Summary: ${context.content || 'No specific content loaded.'}` },
                        ...messages.map(m => ({ role: m.role, content: m.content })).filter(m => m.role !== 'system'), // Basic history
                        { role: "user", content: userText }
                    ],
                    temperature: 0.7,
                    max_tokens: 300
                })
            })

            const data = await response.json()

            if (data.error) {
                console.error("OpenAI Error:", data.error)
                throw new Error(data.error.message)
            }

            return data.choices[0].message.content
        } catch (error) {
            console.error("AI Request Failed:", error)
            return "⚠️ Connection interfered by solar flare (Network Error). Please try again."
        }
    }

    const sendMessage = useCallback(async (text) => {
        if (!text.trim()) return

        // Add user message
        const userMsg = { id: Date.now(), role: 'user', content: text }
        setMessages(prev => [...prev, userMsg])
        setIsThinking(true)

        // Get AI Response
        const responseText = await generateAIResponse(text)

        const aiMsg = { id: Date.now() + 1, role: 'assistant', content: responseText }
        setMessages(prev => [...prev, aiMsg])
        setIsThinking(false)
    }, [context, messages]) // Depend on messages to send history

    return {
        messages,
        isThinking,
        isOpen,
        toggleOpen,
        sendMessage
    }
}
