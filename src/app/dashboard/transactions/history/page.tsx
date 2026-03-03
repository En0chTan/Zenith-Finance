import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Trash2 } from 'lucide-react'
import { format } from 'date-fns'
import { deleteTransaction } from './actions'
import { DeleteButton } from './delete-button'

export const dynamic = 'force-dynamic'

export default async function TransactionsHistoryPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: transactions, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })

    if (error) {
        return <div className="p-8 text-red-500">Failed to load transactions</div>
    }

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
                <p className="text-muted-foreground mt-1">View and manage all your imported and manually entered records.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>All Transactions ({transactions.length})</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border h-[600px] overflow-auto relative">
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10 shadow-sm">
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead className="text-right">Amount</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                            No transactions found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    transactions.map((t) => (
                                        <TableRow key={t.id}>
                                            <TableCell className="whitespace-nowrap font-medium">
                                                {format(new Date(t.date), 'dd MMM yyyy')}
                                            </TableCell>
                                            <TableCell>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${t.transaction_type === 'Income' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                                                    {t.transaction_type}
                                                </span>
                                            </TableCell>
                                            <TableCell>{t.category}</TableCell>
                                            <TableCell className="max-w-[200px] truncate" title={t.description || t.entity}>
                                                {t.description || t.entity || '-'}
                                            </TableCell>
                                            <TableCell className={`text-right font-medium ${t.transaction_type === 'Income' ? 'text-green-600 dark:text-green-400' : 'text-foreground'}`}>
                                                {t.transaction_type === 'Income' ? '+' : '-'}RM{Number(t.amount).toFixed(2)}
                                            </TableCell>
                                            <TableCell>
                                                <DeleteButton id={t.id} />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
