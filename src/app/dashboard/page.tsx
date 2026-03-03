import { getDashboardData } from './actions'
import { getProfile } from './profile/actions'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardCharts } from './charts'
import { DashboardFilter } from './dashboard-filter'

export const dynamic = 'force-dynamic'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8']

export default async function DashboardPage(props: {
    searchParams?: Promise<{ [key: string]: string | undefined }>
}) {
    const sp = await props.searchParams
    const year = sp?.year
    const month = sp?.month

    const data = await getDashboardData(year, month)
    const profile = await getProfile()

    if (!data) return <div>Please login.</div>

    const { netBalance, totalIncome, totalExpense, cashFlowData, spendData, paymentMethodsData, expenseTrendData } = data
    const userName = profile?.full_name || 'there'

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-slate-500 mt-1">Hello {userName}, here's a summary of your finances.</p>
                </div>
                <DashboardFilter />
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Net Balance</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden">
                        <div className="text-2xl xl:text-3xl font-bold truncate" title={`RM${netBalance.toFixed(2)}`}>RM{netBalance.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Income</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden">
                        <div className="text-2xl xl:text-3xl font-bold text-green-600 truncate" title={`RM${totalIncome.toFixed(2)}`}>RM{totalIncome.toFixed(2)}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Expense</CardTitle>
                    </CardHeader>
                    <CardContent className="overflow-hidden">
                        <div className="text-2xl xl:text-3xl font-bold text-red-600 truncate" title={`RM${totalExpense.toFixed(2)}`}>RM{totalExpense.toFixed(2)}</div>
                    </CardContent>
                </Card>
            </div>

            <DashboardCharts
                cashFlowData={cashFlowData}
                spendData={spendData}
                paymentMethodsData={paymentMethodsData}
                expenseTrendData={expenseTrendData}
                colors={COLORS}
            />
        </div>
    )
}
