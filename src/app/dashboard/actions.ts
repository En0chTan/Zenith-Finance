'use server'

import { createClient } from '@/lib/supabase/server'
import { format, parseISO } from 'date-fns'

export async function getDashboardData(year?: string, month?: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return null
    }

    let allTransactions: any[] = []
    let page = 0
    const pageSize = 1000

    while (true) {
        let query = supabase
            .from('transactions')
            .select('*')
            .eq('user_id', user.id)

        if (year && year !== 'all') {
            if (month && month !== 'all') {
                const startDate = `${year}-${month.padStart(2, '0')}-01`
                const lastDay = new Date(Number(year), Number(month), 0).getDate()
                const endDateString = `${year}-${month.padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`
                query = query.gte('date', startDate).lte('date', endDateString)
            } else {
                query = query.gte('date', `${year}-01-01`).lte('date', `${year}-12-31`)
            }
        }

        const { data: pageData, error } = await query
            .order('date', { ascending: true })
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error) {
            console.error('Error fetching transactions:', error)
            if (allTransactions.length === 0) {
                return {
                    netBalance: 0,
                    totalIncome: 0,
                    totalExpense: 0,
                    cashFlowData: [],
                    spendData: [],
                    paymentMethodsData: [],
                    expenseTrendData: []
                }
            }
            break
        }

        if (!pageData || pageData.length === 0) break

        allTransactions.push(...pageData)

        if (pageData.length < pageSize) break
        page++
    }

    const transactions = allTransactions

    let totalIncome = 0
    let totalExpense = 0

    // 1. Calculate Totals
    transactions.forEach(t => {
        if (t.transaction_type === 'Income') {
            totalIncome += Number(t.amount)
        } else {
            totalExpense += Number(t.amount)
        }
    })

    // 2. Format Cash Flow Data (Monthly grouping)
    const monthlyData: Record<string, { income: number; expense: number; dateLabel: string }> = {}

    transactions.forEach(t => {
        try {
            const dateObj = new Date(t.date)
            const sortKey = format(dateObj, 'yyyy-MM')
            const dateLabel = format(dateObj, 'MMM yy')

            if (!monthlyData[sortKey]) {
                monthlyData[sortKey] = { income: 0, expense: 0, dateLabel }
            }
            if (t.transaction_type === 'Income') {
                monthlyData[sortKey].income += Number(t.amount)
            } else {
                monthlyData[sortKey].expense += Number(t.amount)
            }
        } catch (e) {
            // Ignore invalid date strings
        }
    })

    const cashFlowData = Object.entries(monthlyData)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, data]) => ({
            month: data.dateLabel,
            income: data.income,
            expense: data.expense
        }))

    // 3. Format Spend Data (Category grouping)
    const categoryData: Record<string, number> = {}
    transactions.forEach(t => {
        if (t.transaction_type === 'Expense') {
            categoryData[t.category] = (categoryData[t.category] || 0) + Number(t.amount)
        }
    })

    const spendData = Object.entries(categoryData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value) // Sort by largest expense first
        .slice(0, 5) // Top 5 categories

    // 4. Format Payment Method Data
    const paymentMethodRecord: Record<string, number> = {}
    transactions.forEach(t => {
        if (t.transaction_type === 'Expense' && t.method) {
            paymentMethodRecord[t.method] = (paymentMethodRecord[t.method] || 0) + Number(t.amount)
        }
    })

    const paymentMethodsData = Object.entries(paymentMethodRecord)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5) // Top 5

    // 5. Expense Trend & Forecast (Simple moving average)
    const expenseDataList = Object.entries(monthlyData)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([key, data]) => ({
            month: data.dateLabel,
            expense: data.expense,
            isForecast: false
        }))

    if (expenseDataList.length > 0) {
        const last3Months = expenseDataList.slice(-3)
        const avgExpense = Math.round(last3Months.reduce((sum, d) => sum + d.expense, 0) / last3Months.length)

        // Add 3 forecast placeholder months (e.g., +1M, +2M, +3M)
        for (let i = 1; i <= 3; i++) {
            expenseDataList.push({
                month: `+${i}M`,
                expense: avgExpense,
                isForecast: true
            })
        }
    }

    return {
        netBalance: totalIncome - totalExpense,
        totalIncome,
        totalExpense,
        cashFlowData,
        spendData,
        paymentMethodsData,
        expenseTrendData: expenseDataList
    }
}

export async function getAvailableYears() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return ['2025'] // Fallback
    }

    const years = new Set<string>()
    let page = 0
    const pageSize = 1000

    while (true) {
        const { data, error } = await supabase
            .from('transactions')
            .select('date')
            .eq('user_id', user.id)
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error || !data) {
            break
        }

        data.forEach(t => {
            try {
                const year = t.date.split('-')[0]
                if (year && year.length === 4) {
                    years.add(year)
                }
            } catch (e) {
                // ignore
            }
        })

        if (data.length < pageSize) break
        page++
    }

    const uniqueYears = Array.from(years).sort((a, b) => b.localeCompare(a)) // Sort descending

    // Add current year if it's not present just in case
    const currentYear = new Date().getFullYear().toString()
    if (!uniqueYears.includes(currentYear) && uniqueYears.length === 0) {
        uniqueYears.push(currentYear)
    }

    return uniqueYears.length > 0 ? uniqueYears : ['2025']
}

export async function getAvailableMonths(year: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user || year === 'all') {
        return []
    }

    const months = new Set<string>()
    let page = 0
    const pageSize = 1000

    while (true) {
        const { data, error } = await supabase
            .from('transactions')
            .select('date')
            .eq('user_id', user.id)
            .gte('date', `${year}-01-01`)
            .lte('date', `${year}-12-31`)
            .range(page * pageSize, (page + 1) * pageSize - 1)

        if (error || !data) {
            break
        }

        data.forEach(t => {
            try {
                const parts = t.date.split('-')
                if (parts.length >= 2) {
                    // Remove leading zero for our logical format, e.g., '03' -> '3'
                    const month = parseInt(parts[1], 10).toString()
                    months.add(month)
                }
            } catch (e) {
                // ignore
            }
        })

        if (data.length < pageSize) break
        page++
    }

    // Sort logically ascending 1 -> 12
    return Array.from(months).sort((a, b) => parseInt(a) - parseInt(b))
}

export async function getMostRecentTransactionDate() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return null
    }

    // Get the single most recent transaction
    const { data, error } = await supabase
        .from('transactions')
        .select('date')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .limit(1)

    if (error || !data || data.length === 0) {
        return null
    }

    try {
        const parts = data[0].date.split('-')
        if (parts.length >= 2) {
            return {
                year: parts[0],
                month: parseInt(parts[1], 10).toString()
            }
        }
    } catch (e) {
        // ignore
    }

    return null
}
