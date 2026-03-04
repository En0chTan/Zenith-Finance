'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const MONTHS = [
    { value: 'all', label: 'All Months' },
    { value: '1', label: 'January' },
    { value: '2', label: 'February' },
    { value: '3', label: 'March' },
    { value: '4', label: 'April' },
    { value: '5', label: 'May' },
    { value: '6', label: 'June' },
    { value: '7', label: 'July' },
    { value: '8', label: 'August' },
    { value: '9', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
]

export function DashboardFilter({ years, availableMonths }: { years: string[], availableMonths: string[] }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const currentYear = searchParams.get('year') || 'all'
    const currentMonth = searchParams.get('month') || 'all'

    const updateFilters = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === 'all') {
            params.delete(key)
        } else {
            params.set(key, value)
        }

        // If year changes, reset the month so we don't end up on an invalid month for the new year
        if (key === 'year') {
            params.delete('month')
        }

        router.push(`/dashboard?${params.toString()}`)
    }

    return (
        <div className="flex gap-4 items-end bg-card text-card-foreground p-4 rounded-xl border shadow-sm">
            <div className="space-y-1.5 flex-1 max-w-[200px]">
                <Label htmlFor="year-filter" className="text-xs text-muted-foreground font-medium whitespace-nowrap">Filter by Year</Label>
                <Select value={currentYear} onValueChange={(v) => updateFilters('year', v)}>
                    <SelectTrigger id="year-filter" className="h-9">
                        <SelectValue placeholder="All Years" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {years.map(y => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-1.5 flex-1 max-w-[200px]">
                <Label htmlFor="month-filter" className="text-xs text-muted-foreground font-medium whitespace-nowrap">Filter by Month</Label>
                <Select value={currentMonth} onValueChange={(v) => updateFilters('month', v)} disabled={currentYear === 'all'}>
                    <SelectTrigger id="month-filter" className="h-9">
                        <SelectValue placeholder="All Months" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Months</SelectItem>
                        {availableMonths.map(mValue => {
                            const monthObj = MONTHS.find(m => m.value === mValue)
                            return monthObj ? (
                                <SelectItem key={mValue} value={mValue}>{monthObj.label}</SelectItem>
                            ) : null
                        })}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
