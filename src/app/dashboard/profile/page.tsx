import { getProfile } from './actions'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
    const profile = await getProfile() || {}

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
                <p className="text-muted-foreground mt-1">Manage your personal information and profile picture.</p>
            </div>

            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Update your personal details and how we identify you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm profile={profile} />
                </CardContent>
            </Card>
        </div>
    )
}
