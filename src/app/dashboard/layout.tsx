import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Home, PlusCircle, Upload, LogOut, MessageSquare, User as UserIcon, List } from 'lucide-react'
import { ChatSidebar } from '@/components/chat-sidebar'
import { ThemeToggle } from '@/components/theme-toggle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MobileNav } from '@/components/mobile-nav'
import { Landmark } from 'lucide-react'

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
        <div className="flex flex-col md:flex-row min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border hidden md:block shrink-0">
                <div className="flex flex-col h-full">
                    <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
                        <div className="flex items-center gap-2">
                            <Landmark className="h-5 w-5 text-blue-500" />
                            <span className="font-bold tracking-tight">MyDOIT</span>
                        </div>
                        <ThemeToggle />
                    </div>
                    <div className="p-4 border-b border-sidebar-border flex items-center gap-3 overflow-hidden">
                        <Avatar className="h-10 w-10 border border-sidebar-border">
                            <AvatarImage src={profile?.avatar_url || ''} />
                            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">{profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="text-sm font-medium truncate">{profile?.full_name || 'User'}</span>
                            <span className="text-xs text-muted-foreground truncate">{user.email}</span>
                        </div>
                    </div>
                    <nav className="flex-1 px-2 space-y-1">
                        <Link href="/dashboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all">
                            <Home className="h-4 w-4" />
                            Dashboard
                        </Link>
                        <Link href="/dashboard/transactions/new" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all">
                            <PlusCircle className="h-4 w-4" />
                            Manual Entry
                        </Link>
                        <Link href="/dashboard/import" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all">
                            <Upload className="h-4 w-4" />
                            Import CSV
                        </Link>
                        <Link href="/dashboard/transactions/history" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all">
                            <List className="h-4 w-4" />
                            History
                        </Link>
                        <Link href="/dashboard/profile" className="flex items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all">
                            <UserIcon className="h-4 w-4" />
                            Profile
                        </Link>
                    </nav>
                    <div className="p-4 border-t border-sidebar-border">
                        <form action="/auth/signout" method="post">
                            <button type="submit" className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all">
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main content wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile Header */}
                <header className="md:hidden flex h-14 items-center justify-between border-b px-4 bg-background shrink-0">
                    <div className="flex items-center gap-2">
                        <MobileNav profile={profile} email={user.email} />
                        <div className="flex items-center gap-2 ml-2">
                            <Landmark className="h-5 w-5 text-blue-600 dark:text-blue-500" />
                            <span className="font-bold tracking-tight">MyDOIT</span>
                        </div>
                    </div>
                    <ThemeToggle />
                </header>

                {/* Main scrollable area */}
                <main className="flex-1 overflow-y-auto outline-none">
                    {children}
                </main>
            </div>

            {/* Advisor Sidebar */}
            <ChatSidebar />
        </div>
    )
}
