'use client'

import { useState, useTransition } from 'react'
import { Button } from '@/components/ui/button'
import { Trash2 } from 'lucide-react'
import { deleteTransaction } from './actions'

export function DeleteButton({ id }: { id: string }) {
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
            disabled={isPending}
            onClick={() => {
                if (window.confirm('Are you sure you want to delete this transaction?')) {
                    startTransition(async () => {
                        const res = await deleteTransaction(id)
                        if (res.error) alert(res.error)
                    })
                }
            }}
        >
            <Trash2 className="h-4 w-4" />
        </Button>
    )
}
