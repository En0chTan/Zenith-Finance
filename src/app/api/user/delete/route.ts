import { createClient } from '@/lib/supabase/server'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST() {
    try {
        const supabase = await createClient()
        const { data: { user }, error: authError } = await supabase.auth.getUser()

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!adminKey) {
            console.error('SUPABASE_SERVICE_ROLE_KEY is not defined in environment variables.')
            return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
        }

        const supabaseAdmin = createSupabaseAdminClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            adminKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        // Delete the user from the auth system. 
        // This relies on ON DELETE CASCADE on the profiles and transactions tables.
        const { error } = await supabaseAdmin.auth.admin.deleteUser(user.id)

        if (error) {
            console.error('Error deleting user:', error)
            return NextResponse.json({ error: 'Failed to delete user account' }, { status: 500 })
        }

        // Attempt to clear the session cookie
        await supabase.auth.signOut()

        return NextResponse.json({ success: true })

    } catch (e) {
        console.error('Unexpected error in delete user API:', e)
        return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
    }
}
