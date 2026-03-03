'use client'

import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Legend
} from 'recharts'

export function DashboardCharts({
    cashFlowData,
    spendData,
    paymentMethodsData,
    expenseTrendData,
    colors
}: {
    cashFlowData: any[],
    spendData: any[],
    paymentMethodsData: any[],
    expenseTrendData: any[],
    colors: string[]
}) {
    return (
        <div className="flex flex-col gap-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Cash Flow Trends</h3>
                        <p className="text-sm text-muted-foreground">Income vs Expense over time.</p>
                    </div>
                    <div className="p-6 pt-0 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={cashFlowData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `RM${value}`} />
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <Tooltip formatter={(value: any) => `RM${value}`} />
                                <Area type="monotone" dataKey="income" stroke="#16a34a" fillOpacity={1} fill="url(#colorIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#dc2626" fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="flex flex-col space-y-1.5 p-6 pb-2">
                        <h3 className="font-semibold leading-none tracking-tight">Spending by Category</h3>
                        <p className="text-sm text-muted-foreground">Where your money went this month.</p>
                    </div>
                    <div className="p-6 pt-0 flex flex-col items-center">
                        <div className="h-[250px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={spendData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={50}
                                        outerRadius={70}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {spendData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value: any) => `RM${value}`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2 max-h-[100px] overflow-y-auto w-full px-2">
                            {spendData.map((entry, index) => (
                                <div key={entry.name} className="flex items-center text-xs whitespace-nowrap">
                                    <span className="w-3 h-3 rounded-full mr-2 shrink-0" style={{ backgroundColor: colors[index % colors.length] }}></span>
                                    <span className="truncate max-w-[120px]" title={entry.name}>{entry.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-3 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Top Payment Methods</h3>
                        <p className="text-sm text-muted-foreground">Most frequent transaction channels.</p>
                    </div>
                    <div className="p-6 pt-0 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={paymentMethodsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                                <XAxis type="number" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `RM${value}`} />
                                <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                <Tooltip formatter={(value: any) => `RM${value}`} cursor={{ fill: 'transparent' }} />
                                <Bar dataKey="value" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20}>
                                    {paymentMethodsData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="col-span-4 rounded-xl border bg-card text-card-foreground shadow">
                    <div className="flex flex-col space-y-1.5 p-6">
                        <h3 className="font-semibold leading-none tracking-tight">Expense Trend & Forecast</h3>
                        <p className="text-sm text-muted-foreground">Historical expenses and 3-month forecast.</p>
                    </div>
                    <div className="p-6 pt-0 h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={expenseTrendData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `RM${value}`} />
                                <Tooltip formatter={(value: any) => `RM${value}`} />
                                <Legend verticalAlign="top" height={36} />
                                <Line type="monotone" name="Actual / Forecast" dataKey="expense" stroke="#f59e0b" strokeWidth={3} dot={{ strokeWidth: 2, r: 4 }} activeDot={{ r: 8 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    )
}
