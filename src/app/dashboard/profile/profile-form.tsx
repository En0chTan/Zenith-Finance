'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfile, uploadAvatar } from './actions'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Camera, Loader2 } from 'lucide-react'

export function ProfileForm({ profile }: { profile: any }) {
    const [isPending, startTransition] = useTransition()
    const [isUploading, setIsUploading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    async function handleUpdate(formData: FormData) {
        setMessage('')
        setError('')

        startTransition(async () => {
            const result = await updateProfile(formData)
            if (result.error) {
                setError(result.error)
            } else {
                setMessage('Profile updated successfully!')
            }
        })
    }

    async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('file', file)

        setIsUploading(true)
        setMessage('')
        setError('')

        const result = await uploadAvatar(formData)

        if (result.error) {
            setError(result.error)
        } else {
            setMessage('Avatar uploaded successfully!')
        }
        setIsUploading(false)
    }

    async function handleDeleteAccount() {
        if (!window.confirm("Are you absolutely sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.")) {
            return
        }

        setIsDeleting(true)
        setError('')

        try {
            const response = await fetch('/api/user/delete', {
                method: 'POST',
            })

            const result = await response.json()

            if (!response.ok) {
                setError(result.error || 'Failed to delete account')
                setIsDeleting(false)
                return
            }

            // Successfully deleted user on the backend.
            // Clear the local session manually just in case, then redirect to login.
            const supabase = createClient()
            await supabase.auth.signOut()

            router.push('/login')
            router.refresh()

        } catch (err) {
            console.error(err)
            setError('An unexpected error occurred while deleting your account.')
            setIsDeleting(false)
        }
    }

    return (
        <div className="space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback className="text-2xl">{profile?.full_name?.charAt(0) || 'U'}</AvatarFallback>
                </Avatar>
                <div>
                    <Label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="flex items-center gap-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-md font-medium transition-colors">
                            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                            {isUploading ? 'Uploading...' : 'Change Picture'}
                        </div>
                    </Label>
                    <Input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                        disabled={isUploading}
                    />
                    <p className="text-sm text-muted-foreground mt-2">Recommended: Square image, max 2MB.</p>
                </div>
            </div>

            {/* Profile Form */}
            <form action={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="full_name">Full Name</Label>
                        <Input id="full_name" name="full_name" defaultValue={profile?.full_name || ''} placeholder="John Doe" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input id="dob" name="dob" type="date" defaultValue={profile?.dob || ''} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select name="gender" defaultValue={profile?.gender || ""}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Gender" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nationality">Nationality</Label>
                        <Input id="nationality" name="nationality" defaultValue={profile?.nationality || ''} placeholder="e.g. American" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="occupation">Occupation</Label>
                        <Input id="occupation" name="occupation" defaultValue={profile?.occupation || ''} placeholder="Software Engineer" />
                    </div>
                </div>

                {error && <div className="p-3 bg-red-100 text-red-600 rounded-md text-sm">{error}</div>}
                {message && <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">{message}</div>}

                <Button type="submit" disabled={isPending}>
                    {isPending ? 'Saving...' : 'Save Profile'}
                </Button>
            </form>

            <div className="pt-8 mt-8 border-t border-border">
                <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-medium text-destructive">Danger Zone</h3>
                    <p className="text-sm text-muted-foreground">
                        Permanently delete your MyDOIT account and all of your transaction data. This action is irreversible.
                    </p>
                    <div className="mt-4">
                        <Button
                            variant="destructive"
                            onClick={handleDeleteAccount}
                            disabled={isDeleting || isPending || isUploading}
                        >
                            {isDeleting ? 'Deleting Account...' : 'Delete Account'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
