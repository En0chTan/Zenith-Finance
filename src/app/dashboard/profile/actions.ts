'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getProfile() {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return profile
}

export async function updateProfile(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const updates = {
        id: user.id,
        full_name: formData.get('full_name') as string,
        dob: formData.get('dob') as string || null,
        gender: formData.get('gender') as string || null,
        nationality: formData.get('nationality') as string,
        occupation: formData.get('occupation') as string,
    }

    const { error } = await supabase
        .from('profiles')
        .upsert(updates)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard')
    return { success: true }
}

export async function uploadAvatar(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Not authenticated' }

    const file = formData.get('file') as File
    if (!file) return { error: 'No file provided' }

    const fileExt = file.name.split('.').pop()
    const filePath = `${user.id}-${Date.now()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file)

    if (uploadError) {
        return { error: uploadError.message }
    }

    const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    const { error: updateError } = await supabase
        .from('profiles')
        .upsert({ id: user.id, avatar_url: publicUrl })

    if (updateError) {
        return { error: updateError.message }
    }

    revalidatePath('/dashboard/profile')
    revalidatePath('/dashboard')
    return { success: true, avatarUrl: publicUrl }
}
