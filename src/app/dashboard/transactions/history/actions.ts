'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteTransaction(id: string) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) return { error: 'Unauthorized' }

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id)

        if (error) {
            console.error('Delete error:', error)
            return { error: error.message }
        }

        revalidatePath('/dashboard', 'layout')
        return { success: true }
    } catch (e: any) {
        return { error: 'Server error' }
    }
}
