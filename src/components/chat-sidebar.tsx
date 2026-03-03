'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { MessageSquare, Send, Bot, User, X } from 'lucide-react'
import Markdown from 'markdown-to-jsx'

type Message = {
    id: string
    role: 'user' | 'assistant'
    content: string
}

export function ChatSidebar() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'assistant', content: 'Hello! I am Zenith, your AI Financial Advisor. How can I help you today?' }
    ])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isOpen, setIsOpen] = useState(false) // Default to closed on load, or open
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages])

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input }
        setMessages(prev => [...prev, userMessage])
        setInput('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage.content,
                    history: messages.slice(1).map(m => ({ role: m.role, content: m.content }))
                })
            })

            const data = await res.json()

            if (!res.ok) throw new Error(data.error || 'Failed to fetch response')

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.text
            }])
        } catch (error: any) {
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `**Error:** ${error.message || 'Something went wrong.'}`
            }])
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <Button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg transition-transform hover:scale-105 z-50"
            >
                <MessageSquare className="h-6 w-6" />
            </Button>
        )
    }

    return (
        <aside className="w-80 bg-card border-l flex flex-col hidden lg:flex h-full relative z-40">
            <div className="flex justify-between h-14 items-center border-b px-4 font-bold text-lg bg-primary text-primary-foreground flex-shrink-0">
                <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 mr-3" />
                    Zenith AI
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 text-primary-foreground hover:bg-primary/80 hover:text-primary-foreground">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={scrollRef}>
                {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-secondary text-secondary-foreground' : 'bg-primary/20 text-primary'}`}>
                            {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                        </div>
                        <div className={`text-sm py-2 px-3 rounded-xl max-w-[80%] ${msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-tr-none' : 'bg-muted text-foreground rounded-tl-none'}`}>
                            <Markdown className="prose prose-sm prose-p:leading-snug prose-p:my-1 dark:prose-invert">{msg.content}</Markdown>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-primary/20 text-primary">
                            <Bot size={16} />
                        </div>
                        <div className="text-sm py-2 px-3 rounded-xl bg-muted text-foreground rounded-tl-none">
                            <span className="animate-pulse">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t bg-card flex-shrink-0">
                <form onSubmit={sendMessage} className="flex gap-2">
                    <Input
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Ask Zenith..."
                        className="flex-1"
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                        <Send className="h-4 w-4" />
                    </Button>
                </form>
            </div>
        </aside>
    )
}
