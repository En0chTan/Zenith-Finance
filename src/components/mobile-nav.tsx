'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Menu, Home, PlusCircle, Upload, List, User as UserIcon, LogOut, Landmark } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ThemeToggle } from '@/components/theme-toggle'

interface MobileNavProps {
    profile: { avatar_url?: string | null, full_name?: string | null } | null
    email: string | undefined
}

export function MobileNav({ profile, email }: MobileNavProps) {
    const [open, setOpen] = useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle navigation menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0 bg-sidebar text-sidebar-foreground border-r-sidebar-border">
                <div className="flex flex-col h-full overflow-y-auto">
                    <SheetHeader className="p-4 border-b border-sidebar-border text-left items-start">
                        <SheetTitle className="flex items-center gap-2 text-sidebar-foreground">
                            <Landmark className="h-6 w-6 text-blue-500" />
                            <span className="font-bold tracking-tight">MyDOIT</span>
                        </SheetTitle>
                    </SheetHeader>

                    <div className="p-4 border-b border-sidebar-border flex items-center gap-3">
                        <Avatar className="h-10 w-10 border border-sidebar-border">
                            <AvatarImage src={profile?.avatar_url || ''} />
                            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                                {profile?.full_name?.charAt(0) || email?.charAt(0).toUpperCase()}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="text-sm font-medium truncate">{profile?.full_name || 'User'}</span>
                            <span className="text-xs text-sidebar-foreground/70 truncate">{email}</span>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <Link
                            href="/dashboard"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
                        >
                            <Home className="h-5 w-5" />
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/transactions/new"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
                        >
                            <PlusCircle className="h-5 w-5" />
                            Manual Entry
                        </Link>
                        <Link
                            href="/dashboard/import"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
                        >
                            <Upload className="h-5 w-5" />
                            Import CSV
                        </Link>
                        <Link
                            href="/dashboard/transactions/history"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
                        >
                            <List className="h-5 w-5" />
                            History
                        </Link>
                        <Link
                            href="/dashboard/profile"
                            onClick={() => setOpen(false)}
                            className="flex items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
                        >
                            <UserIcon className="h-5 w-5" />
                            Profile
                        </Link>
                    </nav>

                    <div className="p-4 border-t border-sidebar-border mt-auto">
                        <form action="/auth/signout" method="post">
                            <button
                                type="submit"
                                onClick={() => setOpen(false)}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all"
                            >
                                <LogOut className="h-5 w-5" />
                                Sign out
                            </button>
                        </form>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
