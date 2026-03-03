import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, PlusCircle, Upload, LogOut, MessageSquare, User as UserIcon, List } from 'lucide-react'
import { ChatSidebar } from '@/components/chat-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    let profile = null
    if (user) {
        const { data } = await supabase.from('profiles').select('avatar_url, full_name').eq('id', user.id).single()
        profile = data
    }

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen bg-background">
            {/* Sidebar */}
            <aside className="w-64 bg-card border-r">
                <div className="flex flex-col h-full">
                    <div className="flex h-14 items-center justify-between border-b px-4">
                        <span className="font-bold text-lg">Zenith Finance</span>
                        <ThemeToggle />
                    </div>
                    <div className="p-4 border-b flex items-center gap-3 overflow-hidden">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src={profile?.avatar_url || ''} />
                            <AvatarFallback>{profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="text-sm font-medium truncate">{profile?.full_name || 'User'}</span>
                            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        </div>
                    </div>
                    <nav className="flex-1 px-2 space-y-1">
                        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground hover:bg-muted transition-all">
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/dashboard/transactions/new" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground hover:bg-muted transition-all">
                            <PlusCircle className="h-4 w-4" />
                            Manual Entry
                        </Link>
                        <Link href="/dashboard/import" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground hover:bg-muted transition-all">
                            <Upload className="h-4 w-4" />
                            Import CSV
                        </Link>
                        <Link href="/dashboard/transactions/history" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground hover:bg-muted transition-all">
                            <List className="h-4 w-4" />
                            History
                        </Link>
                        <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-foreground hover:bg-muted transition-all">
                            <UserIcon className="h-4 w-4" />
                            Profile
                        </Link>
                    </nav>
                    <div className="p-4 border-t">
                        <form action="/auth/signout" method="post">
                            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-foreground hover:bg-muted transition-all">
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto outline-none">
                {children}
            </main>

            {/* Advisor Sidebar */}
            <ChatSidebar />
        </div>
    )
}
