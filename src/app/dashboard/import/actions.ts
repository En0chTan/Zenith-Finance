'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function importTransactions(transactions: any[], replaceExisting: boolean, type: 'Income' | 'Expense') {
    try {
        const supabase = await createClient()

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
            return { error: 'Unauthorized' }
        }

        if (replaceExisting) {
            const { error: deleteError } = await supabase
                .from('transactions')
                .delete()
                .eq('user_id', user.id)
                .eq('transaction_type', type)

            if (deleteError) {
                console.error('Delete existing error:', deleteError)
                return { error: 'Failed to clear previous data' }
            }
        }

        const recordsToInsert = transactions.map(t => ({
            ...t,
            user_id: user.id,
            date: t.date || new Date().toISOString().split('T')[0] // Fallback to today if missing
        }))

        const { error } = await supabase
            .from('transactions')
            .insert(recordsToInsert)

        if (error) {
            console.error('Supabase Insert Error:', error)
            return { error: error.message }
        }

        revalidatePath('/dashboard', 'layout')
        return { success: true }
    } catch (error: any) {
        console.error('Action Error:', error)
        return { error: error.message || 'Internal error' }
    }
}
