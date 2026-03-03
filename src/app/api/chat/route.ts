import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
    try {
        const { message, history } = await req.json()

        // 1. Authenticate user
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        // 2. Fetch context (Transactions)
        let allTransactions: any[] = []
        let page = 0
        const pageSize = 1000

        while (true) {
            const { data: pageData, error } = await supabase
                .from('transactions')
                .select('*')
                .eq('user_id', user.id)
                .order('date', { ascending: false })
                .range(page * pageSize, (page + 1) * pageSize - 1)

            if (error || !pageData || pageData.length === 0) break

            allTransactions.push(...pageData)
            if (pageData.length < pageSize) break
            page++
        }

        const transactions = allTransactions

        // 3. Initialize Gemini
        const apiKey = process.env.GEMINI_API_KEY
        if (!apiKey) {
            return NextResponse.json({ error: 'Gemini API Key missing' }, { status: 500 })
        }
        const genAI = new GoogleGenerativeAI(apiKey)
        // Standard model available via Gemini API
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        const systemPrompt = `You are Zenith, a proactive AI Financial Advisor. 
You are helping the user manage their personal wealth. 
Here are their latest transactions (JSON format):
${JSON.stringify(transactions || [])}

Provide helpful, concise, and proactive insights based on this data. Use Markdown for formatting. 
Answer the user's latest message.`

        // Format chat history for Gemini
        const formattedHistory = history.map((msg: any) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
        }))

        const chat = model.startChat({
            history: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: 'model',
                    parts: [{ text: 'Understood. I am Zenith, ready to advise.' }],
                },
                ...formattedHistory
            ],
        })

        const result = await chat.sendMessage(message)
        const response = await result.response

        return NextResponse.json({ text: response.text() })
    } catch (error: any) {
        console.error('AI API Error:', error)
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 })
    }
}
